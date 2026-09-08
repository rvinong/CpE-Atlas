import { Path, Shape } from 'three';
import type { AtlasPart } from '@/lib/atlas/types';
import { Block, Disc } from './GeometryPrimitives';
import { ElectronicsGeometry } from './ElectronicsGeometry';
import { PrintedLabel } from './PrintedLabel';
const gold = '#b6a36b',
  copper = '#c18a71';
const range = (n: number) => Array.from({ length: n }, (_, i) => i);

export function CrosshairGeometry({ part: p }: { part: AtlasPart }) {
  const [w, h, d] = p.size;
  if (p.id === 'vrm-heatsink') {
    const shape = new Shape();
    shape.moveTo(-w / 2, -h / 2);
    shape.lineTo(-w / 2 + 0.27, -h / 2);
    shape.lineTo(-w / 2 + 0.27, h / 2 - 0.26);
    shape.lineTo(w / 2, h / 2 - 0.26);
    shape.lineTo(w / 2, h / 2);
    shape.lineTo(-w / 2, h / 2);
    shape.closePath();
    return (
      <group>
        <mesh position={[0, 0, -d / 2]} castShadow>
          <extrudeGeometry args={[shape, { depth: d, bevelEnabled: false }]} />
          <meshStandardMaterial
            color={copper}
            metalness={0.83}
            roughness={0.34}
          />
        </mesh>
        {range(43).map((i) => (
          <Block
            key={i}
            position={[
              -w / 2 + 0.135,
              -h / 2 + 0.06 + (i * (h - 0.12)) / 42,
              d / 2 + 0.001,
            ]}
            size={[0.2, 0.009, 0.002]}
            color="#815744"
          />
        ))}
        {range(32).map((i) => (
          <Block
            key={i}
            position={[
              -w / 2 + 0.29 + (i * (w - 0.34)) / 31,
              h / 2 - 0.13,
              d / 2 + 0.001,
            ]}
            size={[0.009, 0.19, 0.002]}
            color="#815744"
          />
        ))}
        {[-1, 1].map((y) => (
          <Disc
            key={y}
            position={[-w / 2 + 0.07, y * (h / 2 - 0.06), d / 2]}
            radius={0.021}
            depth={0.005}
            color="#524d44"
          />
        ))}
      </group>
    );
  }
  if (p.id === 'io-cover')
    return (
      <group>
        <Block size={p.size} color="#252729" />
        {[-1, 1].map((side) => (
          <Block
            key={side}
            position={[side * (w / 2 - 0.025), 0, d / 2 + 0.001]}
            size={[0.006, h - 0.04, 0.002]}
            color={gold}
          />
        ))}
        <PrintedLabel
          text="R O G"
          position={[0, 0, d / 2 + 0.004]}
          width={1.28}
          height={0.2}
          rotation={[0, 0, Math.PI / 2]}
          color="#c3b57f"
        />
        {[-1, 1].flatMap((x) =>
          [-1, 1].map((y) => (
            <Disc
              key={`${x}${y}`}
              position={[x * (w / 2 - 0.045), y * (h / 2 - 0.045), d / 2]}
              radius={0.018}
              depth={0.007}
              color={gold}
            />
          )),
        )}
      </group>
    );
  if (p.id === 'm2-cover')
    return (
      <group>
        <Block size={p.size} color="#24272a" />
        <Block
          position={[0, 0, d / 2 + 0.003]}
          size={[w * 0.85, 0.036, 0.006]}
          color={gold}
        />
        <PrintedLabel
          text="ROG M.2"
          position={[w * 0.25, -0.06, d / 2 + 0.008]}
          width={0.5}
          height={0.06}
          color="#c8bd91"
        />
      </group>
    );
  if (p.id === 'armor') {
    const shape = new Shape();
    shape.moveTo(-w / 2, h / 2);
    shape.lineTo(w / 2, h / 2);
    shape.lineTo(w / 2, -h / 2 + 0.13);
    shape.lineTo(w / 2 - 0.18, -h / 2);
    shape.lineTo(-w / 2 + 0.18, -h / 2);
    shape.lineTo(-w / 2, -h / 2 + 0.15);
    shape.closePath();
    const slot = new Path();
    slot.moveTo(-0.75, -0.125);
    slot.lineTo(0.57, -0.125);
    slot.lineTo(0.57, 0.005);
    slot.lineTo(-0.75, 0.005);
    slot.closePath();
    shape.holes.push(slot);
    return (
      <group>
        <mesh position={[0, 0, -d / 2]} castShadow>
          <extrudeGeometry args={[shape, { depth: d, bevelEnabled: false }]} />
          <meshStandardMaterial
            color="#262b2f"
            roughness={0.42}
            metalness={0.65}
          />
        </mesh>
        <PrintedLabel
          text="ROG  /  EDITION 20"
          position={[0.17, 0.19, d / 2 + 0.004]}
          width={1.6}
          height={0.16}
          color={gold}
        />
        <Block
          position={[0, -0.25, d / 2 + 0.003]}
          size={[w * 0.82, 0.01, 0.006]}
          color={gold}
        />
        <group position={[-0.91, 0.14, d / 2 + 0.003]} rotation={[0, 0, -0.6]}>
          <Block size={[0.008, 0.37, 0.006]} color={gold} />
        </group>
      </group>
    );
  }
  if (p.id === 'right-cover')
    return (
      <group>
        <Block size={p.size} color="#575541" />
        <PrintedLabel
          text="20  ROG"
          position={[0, 0, d / 2 + 0.004]}
          width={0.7}
          height={0.18}
          color="#c8b989"
        />
      </group>
    );
  if (p.id === 'backplate')
    return (
      <group>
        <Block size={p.size} color="#282e32" />
        <PrintedLabel
          text="ROG CROSSHAIR  /  EDITION 20"
          position={[0, 0, d / 2 + 0.004]}
          width={2.2}
          height={0.15}
          color="#898778"
        />
      </group>
    );
  return (
    <group>
      <ElectronicsGeometry part={{ ...p, referenceModel: undefined }} />
      {p.id === 'pcb' && (
        <>
          <PrintedLabel
            text="CROSSHAIR X870E EDITION 20"
            position={[0.04, 1.16, 0.013]}
            width={1.72}
            height={0.06}
            color="#989c93"
          />
          <PrintedLabel
            text="ROG  /  AM5"
            position={[0.17, -1.46, 0.013]}
            width={1.2}
            height={0.055}
            color="#b1b6ab"
          />
        </>
      )}
    </group>
  );
}
