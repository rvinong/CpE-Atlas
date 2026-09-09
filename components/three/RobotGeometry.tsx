import { CatmullRomCurve3, Vector3 } from 'three';
import type { AtlasPart } from '@/lib/atlas/types';
import { systems } from '../../lib/atlas/systems';
import { robotLinks, robotSystem } from '../../lib/atlas/robot';
import { Block, Disc } from './GeometryPrimitives';
import { ElectronicsGeometry } from './ElectronicsGeometry';
import { PrintedLabel } from './PrintedLabel';
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
export function robotPath(from: string, to: string) {
  const a = new Vector3(
      ...robotSystem.parts.find((p) => p.id === from)!.position,
    ),
    b = new Vector3(...robotSystem.parts.find((p) => p.id === to)!.position);
  return new CatmullRomCurve3([
    a,
    a
      .clone()
      .lerp(b, 0.5)
      .add(new Vector3(0, 0.16, 0)),
    b,
  ]);
}
export function RobotGeometry({ part: p }: { part: AtlasPart }) {
  const [w, h, d] = p.size;
  if (p.id === 'uno')
    return (
      <group
        position={[0, -0.13, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={0.5}
      >
        {systems.arduino.parts.map((part) => (
          <group
            key={part.id}
            position={part.position}
            rotation={part.rotation}
          >
            <ElectronicsGeometry part={part} />
          </group>
        ))}
      </group>
    );
  if (p.id === 'chassis')
    return (
      <group>
        <Block size={p.size} color="#79818a" metalness={0.65} />
        {[-1, 1].map((side) => (
          <group key={side}>
            <Block
              position={[side * 0.48, -0.335, -1.45]}
              size={[0.08, 0.79, 0.1]}
              color="#707e89"
            />
            <Block
              position={[side * 1.02, -0.11, 0.35]}
              size={[0.35, 0.1, 0.65]}
              color="#707e89"
            />
            {[-0.8, 0.2].map((z) => (
              <Block
                key={z}
                position={[side * 0.6, 0.095, z]}
                size={[0.08, 0.07, 0.08]}
                color="#b8a072"
              />
            ))}
          </group>
        ))}
        <Block
          position={[0, -0.105, 1.25]}
          size={[0.3, 0.09, 0.3]}
          color="#707e89"
        />
        {[-1, 1].flatMap((x) =>
          [-1, 1].map((z) => (
            <group
              key={`${x}${z}`}
              position={[x * 1.13, 0.061, z * 1.48]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <Disc radius={0.05} depth={0.002} color="#343d45" />
            </group>
          )),
        )}
      </group>
    );
  if (p.id === 'driver')
    return (
      <group>
        <Block
          position={[0, -0.09, 0]}
          size={[w, 0.04, d]}
          color="#235d50"
          metalness={0.1}
        />
        {[-0.38, 0.38].map((x) => (
          <group key={x}>
            <Block
              position={[x, 0.015, 0]}
              size={[0.28, 0.12, 0.66]}
              color="#262b30"
              metalness={0.05}
            />
            {range(8).flatMap((i) =>
              [-1, 1].map((side) => (
                <Block
                  key={`${i}${side}`}
                  position={[x + side * 0.18, -0.03, -0.28 + i * 0.08]}
                  size={[0.09, 0.02, 0.03]}
                  color="#b0b8bf"
                />
              )),
            )}
          </group>
        ))}
        {[-1, 1].map((side) => (
          <group key={side}>
            <Block
              position={[side * 0.7, 0.025, 0]}
              size={[0.25, 0.22, 0.62]}
              color="#477a6c"
              metalness={0.1}
            />
            <Block
              position={[0, -0.12, side * 0.56]}
              size={[1.45, 0.12, 0.08]}
              color="#252d34"
            />
            {[-0.18, 0.18].map((z) => (
              <mesh key={z} position={[side * 0.7, 0.14, z]}>
                <cylinderGeometry args={[0.05, 0.05, 0.014, 12]} />
                <meshStandardMaterial color="#b7bec5" metalness={0.7} />
              </mesh>
            ))}
          </group>
        ))}
        <PrintedLabel
          text="L293D MOTOR SHIELD"
          position={[0, -0.066, 0.51]}
          rotation={[-Math.PI / 2, 0, 0]}
          width={1.18}
          height={0.1}
        />
      </group>
    );
  if (p.id.endsWith('sensor'))
    return (
      <group>
        <Block
          position={[0, 0.055, 0]}
          size={[w, 0.05, d]}
          color="#245e56"
          metalness={0.1}
        />
        <Block
          position={[0, 0.085, 0.06]}
          size={[0.2, 0.055, 0.17]}
          color="#355875"
        />
        {[-0.085, 0.085].map((x, i) => (
          <mesh key={x} position={[x, -0.03, -0.22]}>
            <cylinderGeometry args={[0.062, 0.062, 0.18, 16]} />
            <meshStandardMaterial
              color={i ? '#17212a' : '#a9beca'}
              roughness={0.3}
            />
          </mesh>
        ))}
        <Block
          position={[0, 0.025, 0.27]}
          size={[0.25, 0.1, 0.12]}
          color="#252c32"
        />
      </group>
    );
  if (p.id.endsWith('motor'))
    return (
      <group>
        <Block
          position={[0, 0, 0.19]}
          size={[0.6, 0.48, 0.7]}
          color="#aa9263"
          metalness={0.12}
        />
        <group rotation={[Math.PI / 2, 0, 0]}>
          <Disc
            position={[0, -0.3, 0]}
            radius={0.2}
            depth={0.5}
            color="#8b969f"
          />
        </group>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.055, 0.055, w, 16]} />
          <meshStandardMaterial color="#b9c2c9" />
        </mesh>
      </group>
    );
  if (p.id.endsWith('wheel'))
    return (
      <group rotation={[0, 0, Math.PI / 2]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.65, 0.65, 0.4, 48]} />
          <meshStandardMaterial color="#22282e" roughness={0.9} />
        </mesh>
        {[-1, 1].map((side) => (
          <group key={side}>
            <mesh position={[0, side * 0.205, 0]}>
              <cylinderGeometry args={[0.42, 0.42, 0.01, 32]} />
              <meshStandardMaterial color="#858f99" metalness={0.6} />
            </mesh>
            {range(6).map((i) => (
              <group key={i} rotation={[0, (i * Math.PI) / 3, 0]}>
                <Block
                  position={[0.23, side * 0.209, 0]}
                  size={[0.24, 0.002, 0.055]}
                  color="#35434f"
                />
              </group>
            ))}
          </group>
        ))}
      </group>
    );
  if (p.id === 'battery')
    return (
      <group>
        <Block size={p.size} color="#303943" metalness={0.15} />
        {[-0.55, 0, 0.55].map((x) => (
          <Block
            key={x}
            position={[x, h / 2 + 0.001, 0]}
            size={[0.025, 0.002, d * 0.8]}
            color="#71808e"
          />
        ))}
        <PrintedLabel
          text="DC POWER PACK"
          position={[0, h / 2 + 0.003, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          width={1.15}
          height={0.15}
        />
      </group>
    );
  if (p.id === 'caster')
    return (
      <group>
        <Block position={[0, 0.2, 0]} size={[0.3, 0.5, 0.3]} color="#6c7985" />
        <mesh position={[0, -0.2, 0]}>
          <sphereGeometry args={[0.25, 20, 12]} />
          <meshStandardMaterial
            color="#9da8b1"
            metalness={0.7}
            roughness={0.35}
          />
        </mesh>
      </group>
    );
  if (p.id === 'wiring')
    return (
      <group>
        {robotLinks.map((link) => (
          <mesh key={`${link.from}${link.to}`}>
            <tubeGeometry
              args={[robotPath(link.from, link.to), 16, 0.018, 6, false]}
            />
            <meshStandardMaterial
              color={link.kind === 'power' ? '#9b8061' : '#587991'}
              roughness={0.8}
            />
          </mesh>
        ))}
      </group>
    );
  return <Block size={p.size} />;
}
