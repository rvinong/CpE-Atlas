/* eslint-disable react/react-compiler -- Animation refs are owned by the Three.js render loop. */
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import { CatmullRomCurve3, Mesh, Vector3 } from 'three';
import { useAtlas } from '@/lib/atlas/store';
import { lineBehavior, robotLinks } from '../../lib/atlas/robot';
import { robotPath } from './RobotGeometry';
function Pulse({
  from,
  to,
  power,
  reducedMotion,
}: {
  from: string;
  to: string;
  power: boolean;
  reducedMotion: boolean;
}) {
  const dot = useRef<Mesh>(null),
    time = useRef(0);
  const curve = useMemo(() => {
    const physical = robotPath(from, to);
    const a = physical.getPoint(0),
      b = physical.getPoint(1);
    const side = from.startsWith('left') || to.startsWith('left') ? -1 : 1;
    // Lift the conceptual diagram outside opaque housings; the harness stays physical.
    return new CatmullRomCurve3([
      a,
      a.clone().add(new Vector3(side * 0.9, 0.7, 0)),
      b.clone().add(new Vector3(side * 0.9, 0.7, 0)),
      b,
    ]);
  }, [from, to]);
  const points = useMemo(() => curve.getPoints(24), [curve]);
  useFrame((state, dt) => {
    if (reducedMotion || !dot.current) return;
    time.current = (time.current + Math.min(dt, 0.1) * 0.35) % 1;
    dot.current.position.copy(curve.getPoint(time.current));
    state.invalidate();
  });
  return (
    <group>
      <Line
        points={points}
        color={power ? '#b7a081' : '#85add5'}
        lineWidth={power ? 3 : 1.5}
        dashed={!power}
        dashSize={0.09}
        gapSize={0.055}
      />
      <mesh ref={dot} position={curve.getPoint(0.5)}>
        <sphereGeometry args={[0.045, 10, 8]} />
        <meshBasicMaterial color={power ? '#ddc5a6' : '#b9d8f8'} />
      </mesh>
    </group>
  );
}
export function RobotTeaching({ reducedMotion }: { reducedMotion: boolean }) {
  const mode = useAtlas((s) => s.teachingMode),
    lineState = useAtlas((s) => s.lineState),
    selected = useAtlas((s) => s.selectedId),
    isolated = useAtlas((s) => s.isolated);
  const behavior = lineBehavior[lineState];
  const sensorSelected = selected?.endsWith('sensor');
  return (
    <group>
      {!isolated && (
        <group>
          <mesh
            position={[0, -1.065, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            receiveShadow
          >
            <planeGeometry args={[5.2, 6]} />
            <meshStandardMaterial color="#a7aaad" roughness={0.95} />
          </mesh>
          <mesh
            position={[
              mode === 'line'
                ? lineState === 'left'
                  ? -0.48
                  : lineState === 'right'
                    ? 0.48
                    : 0
                : 0,
              -1.059,
              -0.5,
            ]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[0.25, 5]} />
            <meshStandardMaterial color="#151a20" roughness={1} />
          </mesh>
          {mode === 'line' && lineState === 'stop' && (
            <mesh position={[0, -1.057, -1.9]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[1.6, 0.55]} />
              <meshStandardMaterial color="#151a20" />
            </mesh>
          )}
        </group>
      )}
      {!isolated &&
        mode === 'signal' &&
        robotLinks.map((link) => (
          <Pulse
            key={`${link.from}${link.to}`}
            from={link.from}
            to={link.to}
            power={link.kind === 'power'}
            reducedMotion={reducedMotion}
          />
        ))}
      {!isolated &&
        (mode === 'line' || (!mode && sensorSelected)) &&
        [-1, 1].map((side, i) => {
          const black = mode === 'line' && behavior.sensors[i] === 'Black';
          return (
            <group key={side}>
              <Line
                points={[
                  [side * 0.48 - 0.07, -0.8, -1.9],
                  [side * 0.48, -1.055, -1.9],
                ]}
                color="#8cbbeb"
                lineWidth={1.5}
              />
              <Line
                points={[
                  [side * 0.48, -1.055, -1.9],
                  [side * 0.48 + 0.07, -0.8, -1.9],
                ]}
                color="#afc4d8"
                lineWidth={black ? 1 : 2.5}
                dashed={black}
                dashSize={0.03}
                gapSize={0.03}
              />
            </group>
          );
        })}
    </group>
  );
}
