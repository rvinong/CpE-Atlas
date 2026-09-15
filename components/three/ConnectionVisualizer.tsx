import { useMemo, useRef, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import { CatmullRomCurve3, Group, Vector3 } from 'three';
import { systems } from '@/lib/atlas/systems';
import { connectionsFor } from '@/lib/atlas/connections';
import { useAtlas } from '@/lib/atlas/store';

/** Logical relationships, not physical wire routing. Only incident links render. */
export function ConnectionVisualizer({
  progress,
}: {
  progress: RefObject<number>;
}) {
  const systemId = useAtlas((s) => s.systemId);
  const selected = useAtlas((s) => s.selectedId);
  const group = useRef<Group>(null);
  const paths = useMemo(
    () =>
      connectionsFor(systemId, selected).map((link) => {
        const from = systems[systemId].parts.find((p) => p.id === link.from)!;
        const to = systems[systemId].parts.find((p) => p.id === link.to)!;
        const a = new Vector3(...from.position),
          b = new Vector3(...to.position);
        const middle = a
          .clone()
          .lerp(b, 0.5)
          .add(new Vector3(0, 0.12, 0.45));
        return {
          link,
          points: new CatmullRomCurve3([a, middle, b]).getPoints(28),
        };
      }),
    [systemId, selected],
  );
  useFrame(() => {
    if (group.current) group.current.visible = progress.current < 0.001;
  });
  return (
    <group ref={group}>
      {paths.map(({ link, points }) => (
        <group key={link.id}>
          <Line
            points={points}
            color={link.kind === 'power' ? '#b8a185' : '#79a5ed'}
            lineWidth={1.6}
            dashed={link.kind !== 'power'}
            dashSize={0.09}
            gapSize={0.06}
            depthTest={false}
            transparent
            renderOrder={12}
          />
          {[points[0], points[points.length - 1]].map((point, index) => (
            <mesh key={index} position={point} renderOrder={13}>
              <sphereGeometry args={[0.018, 8, 6]} />
              <meshBasicMaterial
                color="#a8c7fb"
                depthTest={false}
                transparent
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}
