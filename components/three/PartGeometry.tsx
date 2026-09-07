import type { AtlasPart } from '@/lib/atlas/types';
import { Block, Disc, Fan, Board } from './GeometryPrimitives';
import { DesktopGeometry } from './DesktopGeometry';
import { ElectronicsGeometry } from './ElectronicsGeometry';
export function PartGeometry({ part: p }: { part: AtlasPart }) {
  if (p.detail === 'desktop') return <DesktopGeometry part={p} />;
  if (p.detail) return <ElectronicsGeometry part={p} />;
  const [w, h, d] = p.size;
  switch (p.geometry) {
    case 'case':
      return (
        <group>
          <Block
            position={[0, -h / 2, 0]}
            size={[w, 0.12, d]}
            color="#596674"
          />
          <Block position={[0, h / 2, 0]} size={[w, 0.11, d]} color="#657280" />
          <Block
            position={[-w / 2, 0, 0]}
            size={[0.065, h, d]}
            color="#465360"
          />
          {[-1, 1].flatMap((x) =>
            [-1, 1].map((z) => (
              <Block
                key={`${x}${z}`}
                position={[(x * w) / 2, 0, (z * d) / 2]}
                size={[0.085, h, 0.09]}
                color="#87929d"
              />
            )),
          )}
          <Block
            position={[0, 0, -d / 2]}
            size={[w, h, 0.055]}
            color="#394653"
          />
          {Array.from({ length: 24 }, (_, i) => (
            <Block
              key={i}
              position={[-w * 0.42 + i * w * 0.036, 0, d / 2]}
              size={[0.018, h * 0.92, 0.05]}
              color="#687480"
            />
          ))}
          <Block
            position={[0, -h * 0.28, 0]}
            size={[w, 0.07, d]}
            color="#455362"
          />
          {[-1, 1].flatMap((x) =>
            [-1, 1].map((z) => (
              <Block
                key={`foot${x}${z}`}
                position={[x * w * 0.36, -h / 2 - 0.14, z * d * 0.35]}
                size={[0.3, 0.18, 0.4]}
                color="#20262e"
              />
            )),
          )}
          <Block
            position={[w * 0.2, h / 2 + 0.035, d * 0.33]}
            size={[0.34, 0.025, 0.09]}
            color="#10151b"
          />
        </group>
      );
    case 'board':
      return <Board size={p.size} color={p.color} />;
    case 'cpu':
      return (
        <group>
          <Block size={p.size} color="#b9c2ca" />
          <Block
            position={[0, 0, -d * 0.5]}
            size={[w * 1.16, h * 1.16, 0.055]}
            color="#284f45"
          />
          <Block
            position={[0, 0, d / 2 + 0.005]}
            size={[w * 0.48, 0.015, 0.005]}
            color="#647281"
          />
        </group>
      );
    case 'cooler':
      return (
        <group>
          {Array.from({ length: 15 }, (_, i) => (
            <Block
              key={i}
              position={[0, -h / 2 + (i * h) / 14, 0]}
              size={[w, 0.022, d * 0.78]}
              color={i % 2 ? '#a4afbb' : '#798897'}
            />
          ))}
          {[-0.3, 0.3].map((x) => (
            <Block
              key={x}
              position={[x, 0, 0]}
              size={[0.07, h, 0.08]}
              color="#b29770"
            />
          ))}
          <Fan size={w * 0.95} position={[0, 0, d * 0.47]} />
        </group>
      );
    case 'gpu':
      return (
        <group>
          <Block size={p.size} color={p.color} />
          <Block
            position={[0, h / 2 + 0.035, 0]}
            size={[w * 0.96, 0.035, d * 0.95]}
            color="#93a0ae"
          />
          <Block
            position={[0, 0, -d / 2 - 0.045]}
            size={[w * 0.6, 0.07, 0.08]}
            color="#c1a56c"
          />
          {[-w * 0.27, w * 0.27].map((x) => (
            <group
              position={[x, -h / 2 - 0.035, 0]}
              rotation={[Math.PI / 2, 0, 0]}
              key={x}
            >
              <Fan size={d * 0.82} />
            </group>
          ))}
          <Block
            position={[-w / 2 - 0.04, 0, 0]}
            size={[0.055, h * 1.4, d]}
            color="#919dab"
          />
        </group>
      );
    case 'ram':
      return (
        <group>
          {[-1, 1].map((k) => (
            <group key={k} position={[k * w * 0.28, 0, 0]}>
              <Block size={[w * 0.28, h, d]} color={p.color} />
              <Block
                position={[0, 0, -d * 0.52]}
                size={[w * 0.24, h * 0.9, 0.025]}
                color="#b5a070"
              />
              {Array.from({ length: 5 }, (_, i) => (
                <Block
                  key={i}
                  position={[0, -h * 0.35 + i * h * 0.17, d * 0.6]}
                  size={[w * 0.24, h * 0.11, 0.06]}
                  color="#272c33"
                />
              ))}
            </group>
          ))}
        </group>
      );
    case 'psu':
      return (
        <group>
          <Block size={p.size} color={p.color} />
          <group
            position={[0, h / 2 + 0.015, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <Fan size={Math.min(w, d) * 0.76} />
          </group>
          <Block
            position={[0, 0, d / 2 + 0.01]}
            size={[w * 0.6, h * 0.45, 0.02]}
            color="#86939f"
          />
        </group>
      );
    case 'ssd':
      return (
        <group>
          <Block size={p.size} color={p.color} />
          <Block
            position={[w / 2 + 0.01, 0, 0]}
            size={[0.025, h * 0.7, d * 0.6]}
            color="#293544"
          />
          {[0, 1, 2].map((i) => (
            <Block
              key={i}
              position={[w / 2 + 0.025, -0.2 + i * 0.1, 0]}
              size={[0.015, 0.015, d * 0.35]}
              color="#b5c0cd"
            />
          ))}
        </group>
      );
    case 'fans':
      return (
        <group>
          {(h > 2 ? [-1, 0, 1] : [0]).map((y) => (
            <Fan key={y} size={h > 2 ? 0.95 : 1.05} position={[0, y, 0]} />
          ))}
        </group>
      );
    case 'battery':
      return <Disc radius={w / 2} depth={d} color={p.color} />;
    case 'socket':
      return (
        <group>
          <Block size={p.size} color="#a6adb2" />
          <Block
            position={[0, 0, d / 2 + 0.015]}
            size={[w * 0.78, h * 0.78, 0.04]}
            color="#2b3037"
          />
          {Array.from({ length: 8 }, (_, i) => (
            <Block
              key={i}
              position={[-w * 0.3 + i * w * 0.085, 0, d / 2 + 0.04]}
              size={[0.015, h * 0.6, 0.01]}
              color="#ad9a70"
            />
          ))}
        </group>
      );
    case 'slot':
      return (
        <group>
          <Block size={p.size} color="#404b58" />
          <Block
            position={[0, 0, d / 2 + 0.01]}
            size={[w * 0.9, h * 0.3, 0.025]}
            color="#11171d"
          />
          {Array.from({ length: 16 }, (_, i) => (
            <Block
              key={i}
              position={[-w * 0.43 + i * w * 0.057, 0, d / 2 + 0.025]}
              size={[0.013, h * 0.18, 0.015]}
              color="#b0a16d"
            />
          ))}
        </group>
      );
    case 'pins':
      return (
        <group>
          <Block size={p.size} color="#242e38" />
          {Array.from({ length: Math.max(3, Math.round(w / 0.13)) }, (_, i) => (
            <Block
              key={i}
              position={[
                -w * 0.43 +
                  (i * w * 0.86) / (Math.max(3, Math.round(w / 0.13)) - 1),
                0,
                d / 2 + 0.025,
              ]}
              size={[0.045, h * 0.4, 0.04]}
              color={p.color === '#586775' ? '#c4b890' : p.color}
            />
          ))}
        </group>
      );
    case 'capacitor':
      return (
        <group>
          <Block size={[0.035, h * 1.5, 0.035]} color="#b3bec8" />
          <group rotation={[Math.PI / 2, 0, 0]}>
            <Disc radius={w / 2} depth={h} color={p.color} />
            <Disc
              position={[0, 0, h / 2 + 0.008]}
              radius={w * 0.46}
              depth={0.02}
              color="#b9c2cb"
            />
            <Block
              position={[0, 0, h / 2 + 0.022]}
              size={[w * 0.65, 0.015, 0.01]}
              color="#6b7680"
            />
          </group>
        </group>
      );
    case 'diode':
      return (
        <group>
          <Block size={[0.035, h * 2, 0.035]} color="#b3bec8" />
          <Block size={p.size} color={p.color} />
          <Block
            position={[0, h * 0.3, 0]}
            size={[w * 1.01, 0.065, d * 1.01]}
            color="#c6ccd2"
          />
        </group>
      );
    case 'resistor':
      return (
        <group>
          <Block size={[0.035, h * 1.5, 0.035]} color="#b3bec8" />
          <Block size={p.size} color={p.color} />
          {[-0.2, 0, 0.2].map((y, i) => (
            <Block
              key={y}
              position={[0, y, 0.01]}
              size={[w * 1.015, 0.065, d * 1.015]}
              color={['#795442', '#36373c', '#9d6947'][i]}
            />
          ))}
        </group>
      );
    case 'source':
      return (
        <group>
          <Disc radius={w / 2} depth={d} color={p.color} />
          <mesh position={[0, 0, d / 2 + 0.01]}>
            <torusGeometry args={[w * 0.4, 0.012, 6, 32]} />
            <meshStandardMaterial color="#d3dce5" />
          </mesh>
          <Block
            position={[-0.08, 0, d / 2 + 0.025]}
            size={[0.02, 0.25, 0.01]}
            color="#d3dce5"
          />
          <Block
            position={[0.08, 0, d / 2 + 0.025]}
            size={[0.02, 0.25, 0.01]}
            color="#d3dce5"
          />
        </group>
      );
    case 'port':
      return (
        <group>
          <Block size={p.size} color={p.color} />
          <Block
            position={[0, 0, d / 2 + 0.01]}
            size={[w * 0.72, h * 0.6, 0.02]}
            color="#16212c"
          />
        </group>
      );
    case 'crystal':
      return (
        <group>
          <Block size={p.size} color={p.color} />
          <Block
            position={[0, 0, d / 2 + 0.01]}
            size={[w * 0.65, 0.02, 0.01]}
            color="#716b60"
          />
        </group>
      );
    case 'button':
      return (
        <group>
          <Block size={p.size} color="#adb2bb" />
          <Disc
            position={[0, 0, d / 2 + 0.03]}
            radius={w * 0.32}
            depth={0.08}
            color="#4d5260"
          />
        </group>
      );
    case 'led':
      return (
        <group>
          {[-1, 0, 1].map((x) => (
            <Block
              key={x}
              position={[x * w * 0.4, 0, 0]}
              size={[w * 0.22, h, d]}
              color={x ? '#baa364' : '#749e74'}
            />
          ))}
        </group>
      );
    default:
      return (
        <group>
          <Block size={p.size} color={p.color} />
          {[-1, 1].flatMap((side) =>
            Array.from({ length: 6 }, (_, i) => (
              <Block
                key={`${side}${i}`}
                position={[-w * 0.4 + i * w * 0.16, side * (h / 2 + 0.035), 0]}
                size={[0.035, 0.08, 0.035]}
                color="#a7b0bc"
              />
            )),
          )}
        </group>
      );
  }
}
