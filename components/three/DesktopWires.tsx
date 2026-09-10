import { useMemo } from 'react';
import { CatmullRomCurve3, Vector3 } from 'three';
import { desktopWires } from '@/lib/atlas/desktop-wires';
import { useAtlas } from '@/lib/atlas/store';

export function DesktopWires() {
  const xray = useAtlas((s) => s.xray);
  const selected = useAtlas((s) => s.selectedId);
  const select = useAtlas((s) => s.select);
  const curves = useMemo(
    () =>
      desktopWires.map(
        (wire) =>
          new CatmullRomCurve3(wire.points.map((p) => new Vector3(...p))),
      ),
    [],
  );
  return (
    <group>
      {desktopWires.map((wire, i) => {
        const active = selected === wire.from || selected === wire.to;
        return (
          <mesh
            key={wire.id}
            renderOrder={xray ? 10 : 0}
            onClick={(event) => {
              event.stopPropagation();
              select(wire.to);
            }}
          >
            <tubeGeometry args={[curves[i], 40, 0.035, 6, false]} />
            <meshStandardMaterial
              color={active ? '#5b8cff' : '#73879e'}
              roughness={0.8}
              transparent={xray}
              depthTest={!xray}
              depthWrite={!xray}
            />
          </mesh>
        );
      })}
    </group>
  );
}
