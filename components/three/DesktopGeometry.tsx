import type { AtlasPart, Vec3 } from '@/lib/atlas/types';
import { Block, Disc, Fan } from './GeometryPrimitives';

function Screws({
  width,
  height,
  z = 0,
}: {
  width: number;
  height: number;
  z?: number;
}) {
  return (
    <>
      {[-1, 1].flatMap((x) =>
        [-1, 1].map((y) => (
          <Disc
            key={`${x}${y}`}
            position={[x * (width / 2 - 0.05), y * (height / 2 - 0.05), z]}
            radius={0.026}
            depth={0.015}
            color="#a7adb3"
          />
        )),
      )}
    </>
  );
}
function Slot({ position, size }: { position: Vec3; size: Vec3 }) {
  return (
    <group position={position}>
      <Block size={size} color="#333b43" />
      <Block
        position={[0, 0, size[2] / 2 + 0.002]}
        size={[size[0] * 0.84, size[1] * 0.35, 0.006]}
        color="#11161c"
      />
    </group>
  );
}
function DesktopFan({ position = [0, 0, 0] }: { position?: Vec3 }) {
  return (
    <group position={position} scale={[1, 1, 1.5]}>
      <Fan size={1.2} />
    </group>
  );
}
function Motherboard() {
  return (
    <group>
      <Block size={[2.44, 3.05, 0.016]} color="#24453d" metalness={0.15} />
      <Block
        position={[-0.25, 0.6, 0.035]}
        size={[0.59, 0.59, 0.065]}
        color="#a6aeb4"
      />
      <Block
        position={[-0.25, 0.6, 0.074]}
        size={[0.43, 0.43, 0.016]}
        color="#343a3b"
      />
      <Block
        position={[-0.8, 0.73, 0.08]}
        size={[0.28, 1.18, 0.15]}
        color="#616a70"
      />
      <Block
        position={[-0.22, 1.24, 0.08]}
        size={[0.94, 0.24, 0.15]}
        color="#616a70"
      />
      {Array.from({ length: 12 }, (_, i) => (
        <Block
          key={`vrm${i}`}
          position={[-0.8, 0.2 + i * 0.095, 0.165]}
          size={[0.29, 0.018, 0.015]}
          color="#abb2b5"
        />
      ))}
      {[0.785, 0.895].map((x) => (
        <group key={x}>
          <Slot position={[x, 0.58, 0.045]} size={[0.065, 1.42, 0.07]} />
          {[-1, 1].map((y) => (
            <Block
              key={y}
              position={[x, 0.58 + y * 0.72, 0.055]}
              size={[0.07, 0.07, 0.09]}
              color="#bcc4c2"
            />
          ))}
        </group>
      ))}
      {[-0.84, -1.18].map((y) => (
        <Slot key={y} position={[-0.08, y, 0.045]} size={[1.5, 0.085, 0.07]} />
      ))}
      <Block
        position={[0.68, -0.5, 0.07]}
        size={[0.51, 0.44, 0.13]}
        color="#4a565d"
      />
      <Disc
        position={[-0.7, -0.46, 0.04]}
        radius={0.1}
        depth={0.045}
        color="#c5c7c5"
      />
      <Slot position={[1.13, 0.55, 0.075]} size={[0.13, 0.51, 0.14]} />
      {Array.from({ length: 5 }, (_, i) => (
        <Block
          key={`io${i}`}
          position={[-1.1, 0.98 - i * 0.34, 0.085]}
          size={[0.19, 0.24, 0.16]}
          color="#a2a8aa"
        />
      ))}
      {Array.from({ length: 30 }, (_, i) => (
        <Block
          key={`smd${i}`}
          position={[
            -0.94 + (i % 10) * 0.18,
            -1.41 + Math.floor(i / 10) * 0.28,
            0.022,
          ]}
          size={[0.06, 0.04, 0.027]}
          color={i % 4 ? '#3a413e' : '#b2a982'}
        />
      ))}
      {Array.from({ length: 14 }, (_, i) => (
        <group key={`trace${i}`}>
          <Block
            position={[-0.64 + i * 0.075, -0.05, 0.012]}
            size={[0.007, 0.5, 0.003]}
            color="#688377"
          />
          <Block
            position={[-0.64 + i * 0.075 + 0.08, -0.3, 0.012]}
            size={[0.16, 0.007, 0.003]}
            color="#688377"
          />
        </group>
      ))}
      <Screws width={2.44} height={3.05} z={0.022} />
    </group>
  );
}
export function DesktopGeometry({ part: p }: { part: AtlasPart }) {
  const [w, h, d] = p.size;
  switch (p.id) {
    case 'case':
      return (
        <group>
          {/* Side cutaway: the near panel is removed, exposing the correctly mounted hardware. */}
          <Block
            position={[0, 0, -d / 2]}
            size={[w, h, 0.035]}
            color="#45515c"
          />
          {[-1, 1].map((y) => (
            <Block
              key={y}
              position={[0, y * (h / 2 - 0.035), 0]}
              size={[w, 0.07, d]}
              color="#67727b"
            />
          ))}
          {[-1, 1].flatMap((x) =>
            [-1, 1].map((z) => (
              <Block
                key={`${x}${z}`}
                position={[x * (w / 2 - 0.035), 0, z * (d / 2 - 0.035)]}
                size={[0.07, h, 0.07]}
                color="#818a91"
              />
            )),
          )}
          <Block
            position={[0, -1.22, 0]}
            size={[w - 0.12, 0.035, d - 0.07]}
            color="#515c65"
          />
          <Block
            position={[-2.2, -1.76, 0]}
            size={[0.055, 0.9, d - 0.06]}
            color="#58636c"
          />
          <Block
            position={[2.22, 0, -0.98]}
            size={[0.05, h, 0.18]}
            color="#6d7881"
          />
          <Block
            position={[2.22, 0, 0.98]}
            size={[0.05, h, 0.18]}
            color="#6d7881"
          />
          {Array.from({ length: 7 }, (_, i) => (
            <Block
              key={i}
              position={[-2.2, -0.38 - i * 0.14, 0.32]}
              size={[0.04, 0.045, 1.2]}
              color="#8a9398"
            />
          ))}
          {[-1, 1].flatMap((x) =>
            [-1, 1].map((z) => (
              <Block
                key={`foot${x}${z}`}
                position={[x * 1.7, -2.37, z * 0.75]}
                size={[0.35, 0.14, 0.35]}
                color="#252c33"
              />
            )),
          )}
          <Block
            position={[1.75, 2.31, 0.1]}
            size={[0.27, 0.012, 0.065]}
            color="#141c23"
          />
          <Disc position={[1.98, 2.31, 0.4]} radius={0.045} depth={0.02} />
        </group>
      );
    case 'motherboard':
      return <Motherboard />;
    case 'cpu':
      return (
        <group>
          <Block size={[w, h, 0.018]} color="#275642" />
          <Block
            position={[0, 0, 0.016]}
            size={[w * 0.87, h * 0.87, 0.027]}
            color="#b8bec2"
          />
          {Array.from({ length: 36 }, (_, i) => (
            <Block
              key={i}
              position={[
                -0.15 + (i % 6) * 0.06,
                -0.15 + Math.floor(i / 6) * 0.06,
                -0.011,
              ]}
              size={[0.027, 0.027, 0.006]}
              color="#b5a170"
            />
          ))}
          <Block
            position={[0, 0.03, 0.031]}
            size={[0.18, 0.007, 0.002]}
            color="#717c84"
          />
          <Block
            position={[0, -0.02, 0.031]}
            size={[0.12, 0.007, 0.002]}
            color="#717c84"
          />
        </group>
      );
    case 'cooler':
      return (
        <group>
          {Array.from({ length: 32 }, (_, i) => (
            <Block
              key={i}
              position={[-0.06, 0, -0.62 + i * 0.039]}
              size={[1.07, 1.2, 0.018]}
              color={i % 2 ? '#aab2b7' : '#7b878e'}
            />
          ))}
          {[-0.32, 0, 0.32].map((x) => (
            <Block
              key={x}
              position={[x, -0.43, -0.04]}
              size={[0.055, 0.07, 1.42]}
              color="#b89c73"
            />
          ))}
          <Block
            position={[-0.05, 0, -0.735]}
            size={[0.43, 0.43, 0.08]}
            color="#b2a187"
          />
          <group position={[0.5, 0, 0.04]} rotation={[0, Math.PI / 2, 0]}>
            <DesktopFan />
          </group>
        </group>
      );
    case 'gpu':
      return (
        <group>
          <Block size={[w, 0.018, d]} position={[0, 0.15, 0]} color="#284b40" />
          <Block
            size={[w - 0.06, 0.055, d - 0.04]}
            position={[0, 0.205, 0]}
            color="#6c767e"
          />
          <Block
            size={[w - 0.08, 0.12, d - 0.06]}
            position={[0, 0.06, 0]}
            color="#a0a8ad"
          />
          {Array.from({ length: 36 }, (_, i) => (
            <Block
              key={i}
              position={[-w / 2 + 0.08 + (i * (w - 0.16)) / 35, 0.02, 0]}
              size={[0.017, 0.23, d - 0.08]}
              color="#849199"
            />
          ))}
          {[-0.8, 0, 0.8].map((x) => (
            <group
              key={x}
              position={[x, -0.175, 0]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <Fan size={0.78} />
            </group>
          ))}
          {[-1, 1].map((z) => (
            <Block
              key={z}
              position={[0, -0.15, z * 0.57]}
              size={[w - 0.06, 0.16, 0.06]}
              color="#3f4b58"
            />
          ))}
          <Block
            position={[-w / 2 - 0.02, 0, 0]}
            size={[0.03, 0.44, 1.22]}
            color="#aab1b7"
          />
          <Block
            position={[-0.55, 0.16, -0.623]}
            size={[0.84, 0.08, 0.055]}
            color="#bfa36b"
          />
          <Block
            position={[0.75, 0.18, 0.54]}
            size={[0.33, 0.13, 0.12]}
            color="#242e36"
          />
        </group>
      );
    case 'ram':
      return (
        <group>
          {[-0.055, 0.055].map((x) => (
            <group key={x} position={[x, 0, 0]}>
              <Block size={[0.016, h, 0.3]} color="#325344" />
              {Array.from({ length: 8 }, (_, i) => (
                <Block
                  key={i}
                  position={[0.024, -h * 0.4 + i * h * 0.115, 0.025]}
                  size={[0.025, 0.105, 0.15]}
                  color="#252c31"
                />
              ))}
              <Block
                position={[0, 0, -0.159]}
                size={[0.02, h - 0.09, 0.023]}
                color="#bda16c"
              />
              <Block
                position={[-0.015, 0, 0.08]}
                size={[0.026, h - 0.12, 0.17]}
                color="#62716e"
              />
            </group>
          ))}
        </group>
      );
    case 'psu':
      return (
        <group>
          <Block size={p.size} color="#3c4853" />
          <group position={[0, 0.405, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <Fan size={1.18} />
          </group>
          <Block
            position={[0.705, 0, 0]}
            size={[0.015, 0.55, 1.04]}
            color="#202a34"
          />
          {Array.from({ length: 6 }, (_, i) => (
            <Block
              key={i}
              position={[
                0.718,
                -0.18 + (i % 2) * 0.3,
                -0.34 + Math.floor(i / 2) * 0.34,
              ]}
              size={[0.022, 0.18, 0.22]}
              color="#7a858c"
            />
          ))}
          <Block
            position={[0, 0, 0.754]}
            size={[0.97, 0.48, 0.008]}
            color="#bcc3c7"
          />
          {[0, 1, 2, 3].map((i) => (
            <Block
              key={i}
              position={[-0.06, 0.13 - i * 0.08, 0.76]}
              size={[0.6, 0.013, 0.005]}
              color="#5b6874"
            />
          ))}
        </group>
      );
    case 'ssd':
      return (
        <group>
          <Block size={p.size} color="#83919c" />
          <Block
            position={[0, 0.08, d / 2 + 0.003]}
            size={[w * 0.77, h * 0.67, 0.006]}
            color="#263747"
          />
          <Block
            position={[0, 0.18, d / 2 + 0.008]}
            size={[0.34, 0.027, 0.003]}
            color="#b7c9d8"
          />
          <Block
            position={[0, -0.46, 0.01]}
            size={[0.48, 0.07, 0.055]}
            color="#2b3033"
          />
          <Screws width={w} height={h} z={d / 2 + 0.009} />
        </group>
      );
    case 'fans':
      return (
        <group>
          {[-1.25, 0, 1.25].map((y) => (
            <DesktopFan key={y} position={[0, y, 0]} />
          ))}
        </group>
      );
    case 'rear-fan':
      return <DesktopFan />;
    default:
      return <Block size={p.size} color={p.color} />;
  }
}
