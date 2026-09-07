import { Path, Shape } from 'three';
import type { AtlasPart, Vec3 } from '@/lib/atlas/types';
import { Block, Disc } from './GeometryPrimitives';

const plastic = '#242a30';
const metal = '#b6bdc4';
const gold = '#c4a15b';
const range = (n: number) => Array.from({ length: n }, (_, i) => i);

function Trace({
  a,
  b,
  z,
  width = 0.012,
  color = '#76938a',
}: {
  a: [number, number];
  b: [number, number];
  z: number;
  width?: number;
  color?: string;
}) {
  const dx = b[0] - a[0],
    dy = b[1] - a[1];
  return (
    <group
      position={[(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, z]}
      rotation={[0, 0, Math.atan2(dy, dx)]}
    >
      <Block
        size={[Math.hypot(dx, dy), width, 0.003]}
        color={color}
        metalness={0.35}
      />
    </group>
  );
}

function CircuitBoard({ part: p }: { part: AtlasPart }) {
  const [w, h, d] = p.size;
  const shape = new Shape();
  shape.moveTo(-w / 2, -h / 2);
  shape.lineTo(w / 2 - (p.detail === 'arduino' ? 0.12 : 0), -h / 2);
  if (p.detail === 'arduino') {
    shape.lineTo(w / 2 - 0.12, -h / 2 + 0.3);
    shape.lineTo(w / 2, -h / 2 + 0.42);
    shape.lineTo(w / 2, h / 2 - 0.42);
    shape.lineTo(w / 2 - 0.12, h / 2 - 0.3);
  } else shape.lineTo(w / 2, h / 2);
  shape.lineTo(w / 2 - (p.detail === 'arduino' ? 0.12 : 0), h / 2);
  shape.lineTo(-w / 2, h / 2);
  shape.closePath();
  const holeRadius =
    p.detail === 'motherboard' ? 0.018 : p.detail === 'arduino' ? 0.08 : 0.15;
  const holes = [-1, 1].flatMap((x) =>
    [-1, 1].map(
      (y) =>
        [x * (w / 2 - holeRadius * 2.8), y * (h / 2 - holeRadius * 2.8)] as [
          number,
          number,
        ],
    ),
  );
  for (const [x, y] of holes) {
    const hole = new Path();
    hole.absarc(x, y, holeRadius, 0, Math.PI * 2, true);
    shape.holes.push(hole);
  }
  return (
    <group>
      <mesh position={[0, 0, -d / 2]} castShadow receiveShadow>
        <extrudeGeometry
          args={[shape, { depth: d, bevelEnabled: false, curveSegments: 16 }]}
        />
        <meshStandardMaterial
          color={p.color}
          roughness={0.68}
          metalness={0.12}
        />
      </mesh>
      {holes.map(([x, y], i) => (
        <mesh key={i} position={[x, y, d / 2 + 0.002]}>
          <ringGeometry args={[holeRadius, holeRadius * 1.8, 24]} />
          <meshStandardMaterial color={gold} metalness={0.8} roughness={0.4} />
        </mesh>
      ))}
      {p.detail === 'rectifier' ? (
        <BridgeTracks z={d / 2 + 0.004} />
      ) : (
        <>
          {range(24).map((i) => {
            const x = -w * 0.4 + (i % 12) * w * 0.07;
            const y = (i < 12 ? -1 : 1) * h * 0.29;
            return (
              <group key={i}>
                <Trace
                  a={[x, y]}
                  b={[x, y * 0.25]}
                  z={d / 2 + 0.004}
                  width={0.005}
                />
                <Trace
                  a={[x, y * 0.25]}
                  b={[x + w * 0.08, y * 0.25 + h * 0.08]}
                  z={d / 2 + 0.004}
                  width={0.005}
                />
                <Trace
                  a={[x, y]}
                  b={[x + w * 0.06, y]}
                  z={-d / 2 - 0.004}
                  width={0.007}
                />
              </group>
            );
          })}
          {range(10).map((i) => (
            <group
              key={i}
              position={[-w * 0.28 + i * w * 0.05, h * 0.04, d / 2 + 0.009]}
            >
              <Block
                size={[w * 0.013, h * 0.007, 0.012]}
                color="#a09373"
                metalness={0.1}
              />
              {[-1, 1].map((side) => (
                <Block
                  key={side}
                  position={[side * w * 0.005, 0, 0]}
                  size={[w * 0.003, h * 0.007, 0.014]}
                  color={metal}
                />
              ))}
            </group>
          ))}
        </>
      )}
    </group>
  );
}

// Copper remains attached to the PCB during extraction. Front/back layers keep
// the two AC inputs separate; output capacitor and resistor are in parallel.
function BridgeTracks({ z }: { z: number }) {
  const routes: [number, number][][] = [
    [
      [0, 1.3],
      [2.9, 1.3],
    ],
    [
      [0, -1.3],
      [2.9, -1.3],
    ],
    [
      [1.9, 0.2],
      [1.9, 1.3],
    ],
    [
      [1.9, -0.2],
      [1.9, -1.3],
    ],
    [
      [-2.8, 0.254],
      [-2, 0.254],
      [-2, 0],
      [-1.3, 0],
    ],
  ];
  return (
    <group>
      {[-1, 1].map((side) => (
        <Block
          key={side}
          position={[2.5, side * 1.6, z]}
          size={[0.22, 0.025, 0.003]}
          color="#d9d9c7"
        />
      ))}
      <Block
        position={[2.5, 1.6, z]}
        size={[0.025, 0.22, 0.003]}
        color="#d9d9c7"
      />
      {routes.flatMap((route, i) =>
        route
          .slice(1)
          .map((b, j) => (
            <Trace
              key={`${i}-${j}`}
              a={route[j]}
              b={b}
              z={z}
              width={0.045}
              color="#b59d65"
            />
          )),
      )}
      {[
        [
          [-2.8, -0.254],
          [-2.8, -1.8],
        ],
        [
          [-2.8, -1.8],
          [1.3, -1.8],
        ],
        [
          [1.3, -1.8],
          [1.3, 0],
        ],
      ].map(([a, b], i) => (
        <Trace
          key={i}
          a={a as [number, number]}
          b={b as [number, number]}
          z={-z}
          width={0.045}
          color="#b59d65"
        />
      ))}
      {[
        [-1.3, 0],
        [1.3, 0],
        [0, 1.3],
        [0, -1.3],
        [2.9, 1.3],
        [2.9, -1.3],
        [1.9, 0.2],
        [1.9, -0.2],
        [-2.8, 0.254],
        [-2.8, -0.254],
      ].map(([x, y], i) => (
        <group key={i}>
          <Disc position={[x, y, z]} radius={0.075} depth={0.01} color={gold} />
          <Disc
            position={[x, y, -z]}
            radius={0.075}
            depth={0.01}
            color={gold}
          />
        </group>
      ))}
    </group>
  );
}

// The following details use a unit envelope. Their outer group supplies the
// physical dimensions, so contacts and caps cannot silently enlarge a part.
function Chip({ dip = false, pins = 8 }: { dip?: boolean; pins?: number }) {
  return (
    <group>
      {dip && (
        <Block
          position={[0, 0, -0.28]}
          size={[0.98, 0.98, 0.44]}
          color="#171c22"
          metalness={0.05}
        />
      )}
      <Block
        position={[0, 0, dip ? 0.12 : 0]}
        size={[0.94, 0.68, dip ? 0.65 : 0.82]}
        color={plastic}
        metalness={0.06}
      />
      {[-1, 1].flatMap((side) =>
        range(pins).map((i) => (
          <group key={`${side}-${i}`}>
            <Block
              position={[-0.44 + (i * 0.88) / (pins - 1), side * 0.41, -0.12]}
              size={[0.035, 0.18, 0.1]}
              color={metal}
            />
            <Block
              position={[-0.44 + (i * 0.88) / (pins - 1), side * 0.47, -0.25]}
              size={[0.035, 0.05, 0.4]}
              color={metal}
            />
          </group>
        )),
      )}
      <Disc
        position={[-0.37, 0.19, dip ? 0.453 : 0.414]}
        radius={0.028}
        depth={0.004}
        color="#a8afb4"
      />
      {[0, 1, 2].map((i) => (
        <Block
          key={i}
          position={[-0.04, 0.13 - i * 0.11, dip ? 0.453 : 0.414]}
          size={[0.46 - i * 0.06, 0.014, 0.004]}
          color="#8a9295"
        />
      ))}
    </group>
  );
}

function Qfp() {
  return (
    <group>
      <Block size={[0.73, 0.73, 0.9]} color={plastic} metalness={0.04} />
      {range(4).map((side) => (
        <group key={side} rotation={[0, 0, (side * Math.PI) / 2]}>
          {range(8).map((i) => (
            <Block
              key={i}
              position={[-0.3 + (i * 0.6) / 7, 0.43, -0.25]}
              size={[0.035, 0.14, 0.1]}
              color={metal}
            />
          ))}
        </group>
      ))}
      <Disc
        position={[-0.25, 0.25, 0.453]}
        radius={0.035}
        depth={0.008}
        color="#8d9599"
      />
      <Block
        position={[0, 0, 0.456]}
        size={[0.42, 0.016, 0.008]}
        color="#949c9c"
      />
    </group>
  );
}

function Header({
  columns,
  rows = 1,
  male = false,
  split = false,
}: {
  columns: number;
  rows?: number;
  male?: boolean;
  split?: boolean;
}) {
  return (
    <group>
      <Block
        position={[0, 0, male ? -0.28 : 0]}
        size={[1, 1, male ? 0.44 : 1]}
        color={plastic}
        metalness={0.05}
      />
      {range(columns).flatMap((i) =>
        range(rows).map((j) => {
          const x = (i + 0.5) / columns - 0.5,
            y = (j + 0.5) / rows - 0.5;
          return (
            <group key={`${i}-${j}`}>
              <Block
                position={[x, y, male ? 0.08 : 0.496]}
                size={[0.6 / columns, 0.58 / rows, male ? 0.8 : 0.008]}
                color={male ? gold : '#080e14'}
              />
              {!male && (
                <Block
                  position={[x, y + 0.2 / rows, 0.498]}
                  size={[0.45 / columns, 0.08 / rows, 0.004]}
                  color={gold}
                />
              )}
            </group>
          );
        }),
      )}
      {split && (
        <Block
          position={[0.055, 0, 0.499]}
          size={[0.025, 1, 0.002]}
          color="#777e7d"
        />
      )}
    </group>
  );
}

function MemorySockets() {
  return (
    <group>
      {range(4).map((i) => (
        <group key={i} position={[-0.375 + i * 0.25, 0, 0]}>
          <Block
            size={[0.19, 0.92, 0.85]}
            color={i % 2 ? '#383e45' : '#22282e'}
            metalness={0.08}
          />
          <Block
            position={[0, 0, 0.427]}
            size={[0.06, 0.85, 0.012]}
            color="#090f14"
          />
          {[-1, 1].map((side) => (
            <Block
              key={side}
              position={[0, side * 0.465, 0.05]}
              size={[0.2, 0.07, 0.9]}
              color="#abb1b8"
            />
          ))}
          {range(28).map((j) => (
            <Block
              key={j}
              position={[0.028, -0.4 + (j * 0.8) / 27, 0.436]}
              size={[0.015, 0.01, 0.007]}
              color={gold}
            />
          ))}
          <Block
            position={[0, -0.08, 0.44]}
            size={[0.07, 0.018, 0.02]}
            color={plastic}
          />
        </group>
      ))}
    </group>
  );
}

function ExpansionSlots() {
  return (
    <group>
      {[-0.38, 0.38].map((y) => (
        <group key={y} position={[0, y, 0]}>
          <Block size={[1, 0.15, 0.95]} color={y > 0 ? '#8a929d' : plastic} />
          <Block
            position={[0, 0, 0.48]}
            size={[0.94, 0.055, 0.01]}
            color="#0e141a"
          />
          <Block
            position={[-0.32, 0, 0.49]}
            size={[0.02, 0.06, 0.015]}
            color={plastic}
          />
          {range(32).map((i) => (
            <Block
              key={i}
              position={[-0.45 + (i * 0.9) / 31, 0.025, 0.49]}
              size={[0.01, 0.02, 0.01]}
              color={gold}
            />
          ))}
        </group>
      ))}
      <Block
        position={[-0.28, 0, -0.1]}
        size={[0.42, 0.14, 0.7]}
        color={plastic}
      />
      <Block
        position={[-0.28, 0, 0.254]}
        size={[0.38, 0.045, 0.008]}
        color="#060b0e"
      />
    </group>
  );
}

function CpuSocket() {
  return (
    <group>
      <Block position={[0, 0, -0.2]} size={[1, 1, 0.6]} color={plastic} />
      {[-1, 1].map((side) => (
        <group key={side}>
          <Block
            position={[side * 0.43, 0, 0.2]}
            size={[0.12, 0.95, 0.25]}
            color={metal}
          />
          <Block
            position={[0, side * 0.43, 0.2]}
            size={[0.75, 0.12, 0.25]}
            color={metal}
          />
        </group>
      ))}
      {range(15).flatMap((x) =>
        range(15).map((y) => (
          <Block
            key={`${x}-${y}`}
            position={[-0.32 + (x * 0.64) / 14, -0.32 + (y * 0.64) / 14, 0.12]}
            size={[0.016, 0.02, 0.035]}
            color={gold}
          />
        )),
      )}
      <Block
        position={[0.48, -0.015, 0.39]}
        size={[0.025, 0.91, 0.06]}
        color={metal}
      />
      <Block
        position={[0.39, -0.46, 0.39]}
        size={[0.2, 0.025, 0.06]}
        color={metal}
      />
    </group>
  );
}

function RegulatorBank() {
  return (
    <group>
      {range(7).map((i) => (
        <group key={i} position={[0, -0.42 + i * 0.14, 0]}>
          <Block
            position={[-0.17, 0, -0.15]}
            size={[0.4, 0.105, 0.6]}
            color="#616c76"
          />
          <Disc
            position={[0.32, 0, -0.07]}
            radius={0.07}
            depth={0.7}
            color={metal}
          />
        </group>
      ))}
      {range(9).map((i) => (
        <Block
          key={i}
          position={[-0.4 + i * 0.06, 0, 0.15]}
          size={[0.025, 0.98, 0.68]}
          color="#52606e"
        />
      ))}
    </group>
  );
}

function UsbConnector() {
  return (
    <group>
      <Block position={[0, 0, -0.42]} size={[1, 1, 0.16]} color={metal} />
      <Block position={[0, 0, 0.42]} size={[1, 1, 0.16]} color={metal} />
      {[-1, 1].map((y) => (
        <Block
          key={y}
          position={[0, y * 0.44, 0]}
          size={[1, 0.12, 0.85]}
          color={metal}
        />
      ))}
      <Block position={[0.44, 0, 0]} size={[0.12, 1, 1]} color={metal} />
      <Block
        position={[-0.38, 0, 0]}
        size={[0.04, 0.68, 0.58]}
        color="#10181f"
      />
      <Block
        position={[-0.405, 0, -0.02]}
        size={[0.04, 0.28, 0.34]}
        color="#d1cbb9"
      />
      {[-1, 1].flatMap((y) =>
        [-1, 1].map((z) => (
          <Block
            key={`${y}-${z}`}
            position={[-0.43, y * 0.085, z * 0.105]}
            size={[0.02, 0.045, 0.045]}
            color={gold}
          />
        )),
      )}
      {[-1, 1].map((y) => (
        <Block
          key={y}
          position={[0.05, y * 0.35, 0.499]}
          size={[0.3, 0.1, 0.002]}
          color="#707d87"
        />
      ))}
    </group>
  );
}

function RearIo() {
  return (
    <group>
      {[-0.23, 0.02, 0.3].map((y, i) => (
        <group key={y} position={[0, y, 0]}>
          <Block size={[0.98, i === 2 ? 0.28 : 0.2, 0.88]} color={metal} />
          {(i === 2 ? [0] : [-0.21, 0.21]).map((z) => (
            <group key={z}>
              <Block
                position={[-0.491, 0, z]}
                size={[0.003, i === 2 ? 0.18 : 0.12, i === 2 ? 0.46 : 0.15]}
                color="#101923"
              />
              <Block
                position={[-0.494, 0, z - 0.035]}
                size={[0.003, 0.085, 0.035]}
                color={i === 2 ? gold : '#4b809f'}
              />
            </group>
          ))}
        </group>
      ))}
      {[-0.42, -0.35].map((y, i) => (
        <group key={y} position={[-0.2, y, 0]}>
          <Block size={[0.6, 0.06, 0.8]} color={plastic} />
          <group
            position={[-0.301, 0, 0]}
            rotation={[0, -Math.PI / 2, 0]}
            scale={[1, 0.24, 1]}
          >
            <Disc
              radius={0.11}
              depth={0.002}
              color={i ? '#9aba93' : '#c797a1'}
            />
            <Disc
              position={[0, 0, 0.002]}
              radius={0.07}
              depth={0.002}
              color="#101820"
            />
          </group>
        </group>
      ))}
    </group>
  );
}

function BarrelJack() {
  return (
    <group>
      <Block size={[1, 1, 1]} color={plastic} metalness={0.08} />
      <group position={[-0.501, 0, 0.02]} rotation={[0, -Math.PI / 2, 0]}>
        <Disc radius={0.35} depth={0.002} color="#090d12" />
        <Disc
          position={[0, 0, 0.002]}
          radius={0.07}
          depth={0.004}
          color={metal}
        />
      </group>
    </group>
  );
}

function Electrolytic() {
  return (
    <group>
      <Disc
        position={[0, 0, 0.025]}
        radius={0.5}
        depth={0.89}
        color="#334c65"
      />
      <Disc
        position={[0, 0, 0.479]}
        radius={0.47}
        depth={0.022}
        color={metal}
      />
      <Disc
        position={[0, 0, -0.435]}
        radius={0.48}
        depth={0.03}
        color="#171f26"
      />
      {[-1, 1].map((side) => (
        <Block
          key={side}
          position={[0, side * 0.25, -0.47]}
          size={[0.04, 0.04, 0.06]}
          color={metal}
        />
      ))}
      <Block
        position={[0, -0.49, 0.02]}
        size={[0.12, 0.014, 0.76]}
        color="#b6c0c5"
      />
      {[-1, 1].map((angle) => (
        <group key={angle} rotation={[0, 0, (angle * Math.PI) / 4]}>
          <Block
            position={[0, 0, 0.494]}
            size={[0.6, 0.012, 0.006]}
            color="#58646b"
          />
        </group>
      ))}
    </group>
  );
}

function Axial({ part: p }: { part: AtlasPart }) {
  const [w, h, d] = p.size;
  const diode = p.geometry === 'diode';
  const body = diode ? 0.52 : 0.63;
  const radius = w / 2;
  return (
    <group>
      <mesh castShadow>
        <cylinderGeometry args={[radius, radius, body, 24]} />
        <meshStandardMaterial
          color={diode ? '#252a30' : '#bfa379'}
          roughness={0.6}
          metalness={0.05}
        />
      </mesh>
      {[-1, 1].map((side) => (
        <group key={side}>
          <Block
            position={[0, side * (body / 4 + h / 4 - 0.02), 0]}
            size={[0.06, (h - body) / 2 - 0.04, 0.06]}
            color={metal}
          />
          <Block
            position={[0, side * (h / 2 - 0.03), -d / 4]}
            size={[0.06, 0.06, d / 2]}
            color={metal}
          />
        </group>
      ))}
      {(diode ? [body * 0.32] : [-0.21, -0.09, 0.03, 0.21]).map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <cylinderGeometry
            args={[radius * 1.002, radius * 1.002, diode ? 0.065 : 0.04, 24]}
          />
          <meshStandardMaterial
            color={
              diode
                ? '#c2c8cd'
                : ['#805c39', '#171b1d', '#af4b39', '#bda159'][i]
            }
            roughness={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

function Terminal() {
  return (
    <group>
      <Block size={[1, 1, 1]} color="#397565" metalness={0.08} />
      {[-2.54 / 11, 2.54 / 11].map((y) => (
        <group key={y}>
          <Disc
            position={[0, y, 0.496]}
            radius={0.17}
            depth={0.008}
            color={metal}
          />
          <Block
            position={[0, y, 0.501]}
            size={[0.26, 0.028, 0.003]}
            color="#465257"
          />
          <Block
            position={[-0.501, y, -0.04]}
            size={[0.002, 0.28, 0.4]}
            color="#101e20"
          />
        </group>
      ))}
    </group>
  );
}

export function ElectronicsGeometry({ part: p }: { part: AtlasPart }) {
  if (p.id === 'pcb') return <CircuitBoard part={p} />;
  if (p.detail === 'motherboard' && p.id === 'm2')
    return (
      <group>
        <Block
          position={[-0.39, 0, 0]}
          size={[0.06, 0.22, 0.025]}
          color={plastic}
        />
        <Block
          position={[-0.389, 0, 0.0126]}
          size={[0.035, 0.18, 0.0002]}
          color={gold}
        />
        <Disc
          position={[0.395, 0, 0]}
          radius={0.025}
          depth={0.025}
          color={metal}
        />
      </group>
    );
  if (p.geometry === 'diode' || p.geometry === 'resistor')
    return <Axial part={p} />;
  let detail;
  if (p.detail === 'motherboard') {
    switch (p.id) {
      case 'socket':
        detail = <CpuSocket />;
        break;
      case 'dimm':
        detail = <MemorySockets />;
        break;
      case 'pcie':
        detail = <ExpansionSlots />;
        break;
      case 'vrm':
        detail = <RegulatorBank />;
        break;
      case 'chipset':
        detail = (
          <group>
            <Block
              position={[0, 0, -0.32]}
              size={[1, 1, 0.36]}
              color="#323a43"
            />
            {range(12).map((i) => (
              <Block
                key={i}
                position={[-0.45 + (i * 0.9) / 11, 0, 0.1]}
                size={[0.035, 1, 0.8]}
                color="#737f8a"
              />
            ))}
          </group>
        );
        break;
      case 'battery':
        detail = (
          <group>
            <Disc
              position={[0, 0, -0.25]}
              radius={0.5}
              depth={0.5}
              color={plastic}
            />
            <Disc
              position={[0, 0, 0.2]}
              radius={20 / 48}
              depth={0.55}
              color={metal}
            />
            <Block
              position={[0, 0, 0.478]}
              size={[0.23, 0.018, 0.008]}
              color="#596570"
            />
            <Block
              position={[0, 0, 0.478]}
              size={[0.018, 0.23, 0.008]}
              color="#596570"
            />
            <Block
              position={[0.42, 0, 0.25]}
              size={[0.14, 0.16, 0.45]}
              color={metal}
            />
          </group>
        );
        break;
      case 'atx-power':
        detail = (
          <group rotation={[0, 0, Math.PI / 2]} scale={[1, 1, 1]}>
            <Header columns={12} rows={2} />
          </group>
        );
        break;
      case 'cpu-power':
        detail = <Header columns={4} rows={2} />;
        break;
      case 'usb':
        detail = <Header columns={5} rows={2} male />;
        break;
      case 'fan-header':
        detail = <Header columns={4} male />;
        break;
      case 'sata':
        detail = <Header columns={2} rows={2} />;
        break;
      case 'rear-io':
        detail = <RearIo />;
        break;
      case 'audio':
      case 'ethernet':
        detail = <Qfp />;
        break;
      default:
        detail = <Chip pins={4} />;
    }
  } else if (p.detail === 'arduino') {
    switch (p.id) {
      case 'atmega':
        detail = <Chip dip pins={14} />;
        break;
      case 'usb':
        detail = <UsbConnector />;
        break;
      case 'usb-controller':
        detail = <Qfp />;
        break;
      case 'digital':
        detail = <Header columns={18} split />;
        break;
      case 'analog':
        detail = <Header columns={6} />;
        break;
      case 'power':
        detail = <Header columns={8} />;
        break;
      case 'icsp':
        detail = <Header columns={2} rows={3} male />;
        break;
      case 'dc-jack':
        detail = <BarrelJack />;
        break;
      case 'power-caps':
        detail = (
          <group>
            {[-1, 1].map((side) => (
              <group
                key={side}
                position={[side * 0.275, 0, 0]}
                scale={[0.45, 1, 1]}
              >
                <Electrolytic />
              </group>
            ))}
          </group>
        );
        break;
      case 'reset':
        detail = (
          <group>
            <Block position={[0, 0, -0.15]} size={[1, 1, 0.7]} color={metal} />
            <Disc
              position={[0, 0, 0.25]}
              radius={0.3}
              depth={0.5}
              color="#393e48"
            />
            {[-1, 1].flatMap((x) =>
              [-1, 1].map((y) => (
                <Block
                  key={`${x}-${y}`}
                  position={[x * 0.43, y * 0.4, -0.4]}
                  size={[0.14, 0.1, 0.2]}
                  color={metal}
                />
              )),
            )}
          </group>
        );
        break;
      case 'regulator':
        detail = (
          <group>
            <Block
              position={[0, 0.25, -0.32]}
              size={[0.85, 0.5, 0.25]}
              color={metal}
            />
            <Block size={[0.8, 0.55, 0.8]} color={plastic} />
            {[-1, 0, 1].map((x) => (
              <Block
                key={x}
                position={[x * 0.28, -0.36, -0.3]}
                size={[0.12, 0.28, 0.2]}
                color={metal}
              />
            ))}
          </group>
        );
        break;
      case 'crystal':
        detail = (
          <group>
            <Block size={[1, 1, 0.9]} color="#b89563" metalness={0.12} />
            {[-1, 0, 1].map((x) => (
              <Block
                key={x}
                position={[x * 0.35, 0, -0.45]}
                size={[0.17, 1, 0.1]}
                color={metal}
              />
            ))}
          </group>
        );
        break;
      case 'leds':
        detail = (
          <group>
            {[-1, 0, 1].map((x) => (
              <group key={x} position={[x * 0.35, 0, 0]}>
                <Block
                  size={[0.25, 0.75, 0.8]}
                  color={x === 1 ? '#80b685' : '#d6b675'}
                  metalness={0.1}
                />
                {[-1, 1].map((side) => (
                  <Block
                    key={side}
                    position={[0, side * 0.43, -0.25]}
                    size={[0.25, 0.14, 0.25]}
                    color={metal}
                  />
                ))}
              </group>
            ))}
          </group>
        );
        break;
      default:
        detail = <Chip />;
    }
  } else detail = p.id === 'capacitor' ? <Electrolytic /> : <Terminal />;
  return <group scale={p.size as Vec3}>{detail}</group>;
}
