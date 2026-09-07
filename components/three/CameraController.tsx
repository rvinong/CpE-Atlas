import { useEffect, useMemo, useRef, type RefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { Vector3 } from 'three';
import type { AtlasSystem } from '@/lib/atlas/types';
import {
  assemblyDistance,
  displayDistance,
  displayProgress,
  partPosition,
  type DisplaySlot,
} from '@/lib/atlas/explosion';

export function CameraController({
  system,
  selectedId,
  exploded,
  resetKey,
  reducedMotion,
  preview = false,
  layout,
  progress,
}: {
  system: AtlasSystem;
  selectedId: string | null;
  exploded: number;
  resetKey: number;
  reducedMotion: boolean;
  preview?: boolean;
  layout?: Record<string, DisplaySlot>;
  progress?: RefObject<number>;
}) {
  const controls = useRef<OrbitControlsImpl>(null);
  const moving = useRef(true);
  const goal = useRef(new Vector3(...system.camera));
  const target = useRef(new Vector3());
  const aspect = useThree((s) => s.size.width / Math.max(1, s.size.height));
  const invalidate = useThree((s) => s.invalidate);
  const assembledView = useMemo(() => {
    const view = new Vector3(...system.camera);
    return view
      .normalize()
      .multiplyScalar(
        Math.max(
          new Vector3(...system.camera).length(),
          assemblyDistance(system.parts, system.camera, aspect),
        ),
      );
  }, [system, aspect]);
  useEffect(() => {
    const part = system.parts.find((p) => p.id === selectedId);
    if (part) {
      target.current.set(...partPosition(part, exploded, layout?.[part.id]));
      const distance =
        Math.max(
          0.36,
          Math.max(
            ...(layout && exploded > 0.5 ? layout[part.id].size : part.size),
          ) * 2.1,
        ) * Math.max(1, 0.8 / aspect);
      goal.current
        .copy(target.current)
        .add(
          new Vector3(
            ...((layout && exploded > 0.5 ? [0, 0, 1] : [0.8, 0.5, 1.5]) as [
              number,
              number,
              number,
            ]),
          )
            .normalize()
            .multiplyScalar(distance),
        );
    } else {
      target.current.set(0, 0, 0);
      goal.current
        .copy(assembledView)
        .multiplyScalar(
          1 + (layout ? Math.min(exploded / 0.28, 1) * 0.18 : exploded * 0.33),
        );
      if (layout)
        goal.current.lerp(
          new Vector3(0, 0, displayDistance(layout, aspect)),
          displayProgress(exploded),
        );
    }
    moving.current = true;
    invalidate();
  }, [
    system,
    selectedId,
    exploded,
    resetKey,
    aspect,
    layout,
    invalidate,
    assembledView,
  ]);
  useFrame(({ camera }, dt) => {
    if (!moving.current || !controls.current) return;
    if (layout && progress && !selectedId) {
      const amount = progress.current;
      goal.current
        .copy(assembledView)
        .multiplyScalar(1 + Math.min(amount / 0.28, 1) * 0.18);
      goal.current.lerp(
        new Vector3(0, 0, displayDistance(layout, aspect)),
        displayProgress(amount),
      );
    }
    const alpha = reducedMotion ? 1 : 1 - Math.exp(-4.2 * Math.min(dt, 0.1));
    camera.position.lerp(goal.current, alpha);
    controls.current.target.lerp(target.current, alpha);
    controls.current.update();
    invalidate();
    if (
      camera.position.distanceTo(goal.current) < 0.012 &&
      (!progress || Math.abs(progress.current - exploded) < 0.0001) &&
      controls.current.target.distanceTo(target.current) < 0.012
    )
      moving.current = false;
  });
  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableDamping
      dampingFactor={0.09}
      enablePan={false}
      minDistance={0.25}
      maxDistance={
        layout ? Math.max(35, displayDistance(layout, aspect) * 1.6) : 35
      }
      minPolarAngle={0.12}
      maxPolarAngle={Math.PI - 0.12}
      rotateSpeed={0.6}
      zoomSpeed={0.75}
      autoRotate={preview && !reducedMotion}
      autoRotateSpeed={0.3}
      onStart={() => {
        moving.current = false;
      }}
    />
  );
}
