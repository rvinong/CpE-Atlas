import type { Vec3 } from '@/lib/atlas/types';

export function Block({
  position = [0, 0, 0],
  size,
  color = '#535e6c',
  metalness = 0.5,
}: {
  position?: Vec3;
  size: Vec3;
  color?: string;
  metalness?: number;
}) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        roughness={0.48}
        metalness={metalness}
      />
    </mesh>
  );
}
export function Disc({
  position = [0, 0, 0],
  radius,
  depth,
  color = '#94a2b1',
}: {
  position?: Vec3;
  radius: number;
  depth: number;
  color?: string;
}) {
  return (
    <mesh position={position} rotation={[Math.PI / 2, 0, 0]} castShadow>
      <cylinderGeometry args={[radius, radius, depth, 32]} />
      <meshStandardMaterial color={color} metalness={0.6} roughness={0.42} />
    </mesh>
  );
}
export function Fan({
  size = 1,
  position = [0, 0, 0],
}: {
  size?: number;
  position?: Vec3;
}) {
  return (
    <group position={position} scale={size}>
      {[-0.47, 0.47].map((v) => (
        <group key={v}>
          <Block position={[v, 0, 0]} size={[0.08, 1, 0.12]} color="#35414e" />
          <Block position={[0, v, 0]} size={[1, 0.08, 0.12]} color="#35414e" />
        </group>
      ))}
      <mesh rotation={[0, 0, 0]}>
        <torusGeometry args={[0.405, 0.035, 8, 40]} />
        <meshStandardMaterial color="#8b9aac" metalness={0.7} roughness={0.4} />
      </mesh>
      {Array.from({ length: 9 }, (_, i) => (
        <group key={i} rotation={[0, 0, (i * Math.PI * 2) / 9]}>
          <mesh position={[0.22, 0, 0.02]} rotation={[0, 0.25, 0.55]}>
            <boxGeometry args={[0.31, 0.12, 0.032]} />
            <meshStandardMaterial
              color="#667586"
              metalness={0.5}
              roughness={0.5}
            />
          </mesh>
        </group>
      ))}
      <Disc radius={0.12} depth={0.14} color="#a2adbd" />
      {[-0.42, 0.42].flatMap((x) =>
        [-0.42, 0.42].map((y) => (
          <Disc
            key={`${x}${y}`}
            position={[x, y, 0.075]}
            radius={0.025}
            depth={0.015}
            color="#b0bac4"
          />
        )),
      )}
    </group>
  );
}
export function Board({ size, color }: { size: Vec3; color: string }) {
  const [w, h, d] = size;
  return (
    <group>
      <Block size={size} color={color} metalness={0.18} />
      {Array.from({ length: 16 }, (_, i) => {
        const x = -w * 0.43 + (i % 8) * w * 0.115;
        const y = -h * 0.42 + Math.floor(i / 8) * h * 0.76;
        return (
          <group key={i}>
            <Block
              position={[x, y, d / 2 + 0.006]}
              size={[0.012, h * 0.29, 0.008]}
              color="#759287"
              metalness={0.3}
            />
            <Block
              position={[x + w * 0.05, y + h * 0.14, d / 2 + 0.006]}
              size={[w * 0.1, 0.012, 0.008]}
              color="#759287"
              metalness={0.3}
            />
          </group>
        );
      })}
      {Array.from({ length: 18 }, (_, i) => (
        <Block
          key={i}
          position={[
            -w * 0.39 + (i % 6) * w * 0.14,
            -h * 0.3 + Math.floor(i / 6) * h * 0.25,
            d / 2 + 0.03,
          ]}
          size={[0.08, 0.13, 0.05]}
          color={i % 3 ? '#28332f' : '#b3a783'}
        />
      ))}
      {[-1, 1].flatMap((x) =>
        [-1, 1].map((y) => (
          <Disc
            key={`${x}${y}`}
            position={[x * w * 0.45, y * h * 0.45, d / 2 + 0.015]}
            radius={0.045}
            depth={0.02}
            color="#b4aa8a"
          />
        )),
      )}
    </group>
  );
}
