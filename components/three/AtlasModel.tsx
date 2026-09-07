import { useMemo, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { systems } from '@/lib/atlas/systems';
import { useAtlas } from '@/lib/atlas/store';
import { createDisplayLayout } from '@/lib/atlas/explosion';
import { InteractivePart } from './InteractivePart';
import { CameraController } from './CameraController';

export function AtlasModel({
  preview,
  reducedMotion,
}: {
  preview: boolean;
  reducedMotion: boolean;
}) {
  const state = useAtlas();
  const system = systems[preview ? 'desktop' : state.systemId];
  const aspect = useThree((s) => s.size.width / Math.max(1, s.size.height));
  const layout = useMemo(
    () =>
      system.id === 'desktop'
        ? createDisplayLayout(system.parts, aspect)
        : undefined,
    [system, aspect],
  );
  const exploded = preview ? 0 : state.exploded;
  const progress = useRef(0);
  const invalidate = useThree((s) => s.invalidate);
  useFrame((_, dt) => {
    const difference = exploded - progress.current;
    progress.current = reducedMotion
      ? exploded
      : progress.current +
        Math.sign(difference) *
          Math.min(Math.abs(difference), Math.min(dt, 0.1) * 0.65);
    if (Math.abs(exploded - progress.current) > 0.0001) invalidate();
  }, -2);
  const selectedId = preview ? null : state.selectedId;
  return (
    <>
      <group>
        {system.parts.map((part) => (
          <InteractivePart
            key={`${system.id}-${part.id}`}
            part={part}
            selected={selectedId === part.id}
            dimmed={!!selectedId && selectedId !== part.id}
            hidden={!preview && state.isolated && selectedId !== part.id}
            exploded={exploded}
            xray={preview || state.xray}
            labels={!preview && state.labels}
            onSelect={state.select}
            reducedMotion={reducedMotion}
            preview={preview}
            displaySlot={layout?.[part.id]}
            progress={layout ? progress : undefined}
          />
        ))}
      </group>
      <CameraController
        system={system}
        selectedId={selectedId}
        exploded={exploded}
        resetKey={state.resetKey}
        reducedMotion={reducedMotion}
        preview={preview}
        layout={layout}
        progress={layout ? progress : undefined}
      />
    </>
  );
}
