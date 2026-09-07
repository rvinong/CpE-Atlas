import { Html, Line } from '@react-three/drei';
import type { Vec3 } from '@/lib/atlas/types';
const paths: Vec3[][] = [
  [
    [-1.2, 0, 0],
    [0, 1.2, 0],
    [1.2, 0, 0],
    [0, -1.2, 0],
    [-1.2, 0, 0],
  ],
  [
    [-2.75, 0.4, 0],
    [-2.75, 1.95, 0],
    [-1.6, 1.95, 0],
    [-1.6, 0, 0],
    [-1.2, 0, 0],
  ],
  [
    [-2.75, -0.4, 0],
    [-2.75, -1.95, 0],
    [1.65, -1.95, 0],
    [1.65, 0, 0],
    [1.2, 0, 0],
  ],
  [
    [0, 1.2, 0],
    [0, 1.6, 0],
    [3.35, 1.6, 0],
    [3.35, 0.42, 0],
  ],
  [
    [0, -1.2, 0],
    [0, -1.6, 0],
    [3.35, -1.6, 0],
    [3.35, -0.42, 0],
  ],
  [
    [2.25, 1.6, 0],
    [2.25, 0.42, 0],
  ],
  [
    [2.25, -1.6, 0],
    [2.25, -0.42, 0],
  ],
];
export function RectifierConnections() {
  return (
    <group>
      {paths.map((points, i) => (
        <Line
          key={i}
          points={points}
          color={i > 2 ? '#779ab5' : '#657b92'}
          lineWidth={1.5}
        />
      ))}
      {[
        { position: [3.6, 1.6, 0], text: '+' },
        { position: [3.6, -1.6, 0], text: '−' },
        { position: [-2.75, 0, 0.25], text: '~' },
      ].map(({ position, text }) => (
        <Html
          key={text}
          position={position as Vec3}
          center
          style={{ pointerEvents: 'none', color: '#b7c9de', fontSize: 18 }}
        >
          {text}
        </Html>
      ))}
    </group>
  );
}
