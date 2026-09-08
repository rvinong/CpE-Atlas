import { CatmullRomCurve3, Vector3, DoubleSide, Shape, Path } from 'three';
import type { AtlasPart, Vec3 } from '@/lib/atlas/types';
import { Block, Disc, Fan } from './GeometryPrimitives';
import { PrintedLabel } from './PrintedLabel';
import { coolantMounts } from '../../lib/atlas/assembly-anchors';
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const black = '#1d2127',
  silver = '#9ca3ab';

function RearPanel() {
  const panel = new Shape();
  panel.moveTo(-1.45, -2.23);
  panel.lineTo(1.45, -2.23);
  panel.lineTo(1.45, 2.23);
  panel.lineTo(-1.45, 2.23);
  panel.closePath();
  const exhaust = new Path();
  exhaust.absarc(-0.65, 1.02, 0.55, 0, Math.PI * 2, true);
  panel.holes.push(exhaust);
  for (const [x, y, w, h] of [
    [0.28, 0.8, 0.4, 1.8],
    [-0.325, -0.9, 1.6, 0.9],
  ]) {
    const opening = new Path();
    opening.moveTo(x - w / 2, y - h / 2);
    opening.lineTo(x - w / 2, y + h / 2);
    opening.lineTo(x + w / 2, y + h / 2);
    opening.lineTo(x + w / 2, y - h / 2);
    opening.closePath();
    panel.holes.push(opening);
  }
  return (
    <mesh
      position={[-2.35, 0, 0]}
      rotation={[0, Math.PI / 2, 0]}
      castShadow
      receiveShadow
    >
      <extrudeGeometry
        args={[panel, { depth: 0.08, bevelEnabled: false, curveSegments: 24 }]}
      />
      <meshStandardMaterial color="#39414a" metalness={0.5} roughness={0.4} />
    </mesh>
  );
}

function RingFan({
  size = 1.2,
  position = [0, 0, 0],
}: {
  size?: number;
  position?: Vec3;
}) {
  return (
    <group position={position}>
      <group scale={[1, 1, 1.35]}>
        <Fan size={size * 0.96} />
      </group>
      <mesh position={[0, 0, 0.09]}>
        <torusGeometry args={[size * 0.4, 0.016, 8, 48]} />
        <meshStandardMaterial
          color="#9acfe3"
          emissive="#386886"
          emissiveIntensity={0.8}
        />
      </mesh>
    </group>
  );
}
function MaximusBoard() {
  return (
    <group>
      <Block size={[2.77, 3.05, 0.016]} color="#22262c" metalness={0.15} />
      <Block
        position={[-0.22, 0.5, 0.045]}
        size={[0.6, 0.66, 0.075]}
        color={silver}
      />
      <Block
        position={[-0.22, 0.5, 0.085]}
        size={[0.39, 0.47, 0.007]}
        color="#3d4249"
      />
      {range(4).map((i) => (
        <group key={i} position={[0.64 + i * 0.11, 0.53, 0.04]}>
          <Block size={[0.07, 1.45, 0.08]} color={black} />
          <Block
            position={[0, 0, 0.041]}
            size={[0.023, 1.35, 0.003]}
            color="#080b0f"
          />
        </group>
      ))}
      <Block
        position={[-1.12, 0.55, 0.17]}
        size={[0.47, 1.83, 0.34]}
        color="#222930"
      />
      <PrintedLabel
        text="ROG MAXIMUS"
        position={[-1.12, 0.8, 0.343]}
        width={1.28}
        height={0.16}
        rotation={[0, 0, Math.PI / 2]}
        color="#b7d4ea"
      />
      <Block
        position={[-0.25, 1.29, 0.12]}
        size={[1.13, 0.3, 0.24]}
        color={silver}
      />
      {range(18).map((i) => (
        <Block
          key={i}
          position={[-0.76 + i * 0.06, 1.29, 0.247]}
          size={[0.019, 0.27, 0.006]}
          color="#404951"
        />
      ))}
      {[-0.6, -1.1].map((y) => (
        <group key={y}>
          <Block
            position={[-0.5, y, 0.065]}
            size={[1.23, 0.09, 0.13]}
            color={silver}
          />
          <Block
            position={[-0.5, y, 0.133]}
            size={[1.15, 0.027, 0.005]}
            color="#10141b"
          />
        </group>
      ))}
      {[-0.85, -1.36].map((y) => (
        <Block
          key={y}
          position={[0, y, 0.08]}
          size={[2.5, 0.23, 0.13]}
          color="#777f88"
        />
      ))}
      <Block
        position={[0.63, -0.31, 0.085]}
        size={[0.66, 0.37, 0.15]}
        color="#a1aab3"
      />
      <PrintedLabel
        text="EXTREME"
        position={[0.63, -0.31, 0.163]}
        width={0.52}
        height={0.07}
        color="#1c222b"
      />
      <Block
        position={[1.23, 0.54, 0.075]}
        size={[0.13, 0.52, 0.15]}
        color={black}
      />
      {range(16).map((i) => (
        <Block
          key={i}
          position={[
            -0.78 + (i % 8) * 0.12,
            -1.47 + Math.floor(i / 8) * 0.18,
            0.024,
          ]}
          size={[0.055, 0.035, 0.028]}
          color={i % 3 ? '#353c45' : '#b5a784'}
        />
      ))}
    </group>
  );
}

export function ReferenceDesktopGeometry({ part: p }: { part: AtlasPart }) {
  const [w, h, d] = p.size;
  switch (p.id) {
    case 'case':
      return (
        <group>
          {[-1, 1].map((side) => (
            <Block
              key={side}
              position={[0, side * 2.3, 0]}
              size={[4.7, 0.14, 3]}
              color="#41464d"
            />
          ))}
          <Block
            position={[0, 0, -1.475]}
            size={[4.7, 4.5, 0.05]}
            color="#30363d"
          />
          <Block
            position={[-0.7, 0, -0.51]}
            size={[3.07, 4.45, 0.035]}
            color="#414951"
          />
          <RearPanel />
          {[-1.94, 0.54].flatMap((x) =>
            [-1.14, 1.64].map((y) => (
              <Disc
                key={`${x}/${y}`}
                position={[x, y, -0.47525]}
                radius={0.032}
                depth={0.0345}
                color="#aa9060"
              />
            )),
          )}
          {[0.74, 1.96].map((x) => (
            <Block
              key={x}
              position={[x, 0.1, -0.4233]}
              size={[0.055, 3.7, 0.06]}
              color="#414951"
            />
          ))}
          {[-1.75, 1.95].map((y) => (
            <Block
              key={y}
              position={[1.35, y, -0.95]}
              size={[1.27, 0.06, 1.05]}
              color="#414951"
            />
          ))}
          <Block
            position={[-1.08, -1.9, -1.02]}
            size={[2.15, 0.06, 0.86]}
            color="#414951"
          />
          <Block
            position={[2.3, 0, -1.23]}
            size={[0.1, 4.46, 0.45]}
            color="#92989e"
          />
          {range(24).map((i) => (
            <Block
              key={i}
              position={[-2.1 + i * 0.18, 2.373, -0.65]}
              size={[0.055, 0.005, 1.4]}
              color="#10161c"
            />
          ))}
          {[-1, 1].flatMap((x) =>
            [-1, 1].map((z) => (
              <Block
                key={`${x}-${z}`}
                position={[x * 1.75, -2.32, z * 1.03]}
                size={[0.4, 0.09, 0.45]}
                color="#171d24"
              />
            )),
          )}
          <PrintedLabel
            text="MEG  MAESTRO"
            position={[0.1, -2.285, 1.505]}
            width={1.8}
            height={0.09}
          />
        </group>
      );
    case 'glass':
      return (
        <group>
          <mesh position={[-0.1, 0, 1.475]}>
            <boxGeometry args={[4.4, 4.6, 0.025]} />
            <meshStandardMaterial
              color="#b3c7d3"
              metalness={0.1}
              roughness={0.12}
              transparent
              opacity={0.13}
              depthWrite={false}
            />
          </mesh>
          <mesh position={[2.33, 0, -0.075]}>
            <boxGeometry args={[0.025, 4.6, 2.65]} />
            <meshStandardMaterial
              color="#b3c7d3"
              metalness={0.1}
              roughness={0.12}
              transparent
              opacity={0.13}
              depthWrite={false}
            />
          </mesh>
          <mesh position={[2.1, 0, 1.25]}>
            <cylinderGeometry
              args={[0.225, 0.225, 4.6, 24, 1, true, 0, Math.PI / 2]}
            />
            <meshStandardMaterial
              color="#b3c7d3"
              side={DoubleSide}
              roughness={0.12}
              transparent
              opacity={0.13}
              depthWrite={false}
            />
          </mesh>
          {[-1, 1].map((y) => (
            <Block
              key={y}
              position={[0, y * 2.27, 1.486]}
              size={[4.6, 0.045, 0.022]}
              color="#313b45"
            />
          ))}
        </group>
      );
    case 'motherboard':
      return <MaximusBoard />;
    case 'cpu':
      return (
        <group>
          <Block size={[w, h, 0.015]} color="#245144" />
          <Block
            position={[0, 0, 0.01]}
            size={[w * 0.89, h * 0.89, 0.019]}
            color="#b9c0c6"
          />
          <PrintedLabel
            text="intel CORE ULTRA 9"
            position={[0, 0.035, 0.0205]}
            width={0.3}
            height={0.047}
            color="#5a626a"
          />
          <PrintedLabel
            text="285K"
            position={[0, -0.035, 0.0205]}
            width={0.12}
            height={0.035}
            color="#5a626a"
          />
          {range(64).map((i) => (
            <Block
              key={i}
              position={[
                -0.15 + (i % 8) * 0.043,
                -0.18 + Math.floor(i / 8) * 0.051,
                -0.009,
              ]}
              size={[0.022, 0.027, 0.003]}
              color="#bba060"
            />
          ))}
        </group>
      );
    case 'cooler':
      return (
        <group>
          <Block
            position={[0, 0, -0.44]}
            size={[0.6, 0.6, 0.13]}
            color="#b39b7c"
          />
          <Block position={[0, 0, 0.02]} size={[w, h, 0.96]} color={black} />
          <Block
            position={[0, 0, 0.501]}
            size={[0.75, 0.75, 0.006]}
            color="#102939"
          />
          <PrintedLabel
            text="ROG RYUJIN III"
            position={[0, 0.19, 0.506]}
            width={0.65}
            height={0.08}
            color="#a9def5"
          />
          <PrintedLabel
            text="LIQUID COOLING"
            position={[0, -0.09, 0.506]}
            width={0.62}
            height={0.075}
            color="#dbecf4"
          />
          {range(13).map((i) => (
            <Block
              key={i}
              position={[-0.37 + i * 0.06, -0.444, -0.15]}
              size={[0.02, 0.015, 0.45]}
              color="#626c77"
            />
          ))}
        </group>
      );
    case 'radiator':
      return (
        <group>
          {[-1, 1].map((side) => (
            <group key={side}>
              <Block
                position={[side * (w / 2 - 0.06), 0.125, 0]}
                size={[0.12, 0.3, d]}
                color="#242a30"
              />
              <Block
                position={[0, 0.125, side * (d / 2 - 0.02)]}
                size={[w, 0.3, 0.04]}
                color="#242a30"
              />
            </group>
          ))}
          {range(70).map((i) => (
            <Block
              key={i}
              position={[-1.83 + (i * 3.66) / 69, 0.12, 0]}
              size={[0.016, 0.27, 1.12]}
              color="#626a71"
            />
          ))}
          {[-1.2, 0, 1.2].map((x) => (
            <group
              key={x}
              position={[x, -0.135, 0]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <RingFan />
            </group>
          ))}
        </group>
      );
    case 'tubes':
      return (
        <group>
          {[0, 1].map((i) => {
            const local = (point: Vec3) =>
              new Vector3(...point).sub(new Vector3(...coolantMounts.origin));
            const curve = new CatmullRomCurve3([
              local(coolantMounts.pump[i]),
              local([-0.26, 0.69 + i * 0.12, 0.32]),
              local([0.65, 1.15 + i * 0.15, 0.8]),
              local([1.75, 1.7, 0.3 + i * 0.2]),
              local(coolantMounts.radiator[i]),
            ]);
            return (
              <group key={i}>
                <mesh castShadow>
                  <tubeGeometry args={[curve, 40, 0.035, 8, false]} />
                  <meshStandardMaterial color="#252c34" roughness={0.88} />
                </mesh>
                {[coolantMounts.pump[i], coolantMounts.radiator[i]].map(
                  (point, j) => (
                    <mesh
                      key={j}
                      position={local(point)}
                      rotation={j === 0 ? [0, 0, Math.PI / 2] : [0, 0, 0]}
                    >
                      <cylinderGeometry args={[0.055, 0.055, 0.06, 16]} />
                      <meshStandardMaterial
                        color="#555d65"
                        metalness={0.7}
                        roughness={0.35}
                      />
                    </mesh>
                  ),
                )}
              </group>
            );
          })}
        </group>
      );
    case 'gpu':
      return (
        <group>
          <Block size={[w, h * 0.85, d]} color="#252a30" />
          {range(42).map((i) => (
            <Block
              key={i}
              position={[-1.45 + (i * 2.9) / 41, 0, 0]}
              size={[0.018, 0.32, 1.25]}
              color="#4d565d"
            />
          ))}
          {[-0.86, 0.86].map((x) => (
            <group
              key={x}
              position={[x, -0.11, 0]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <Fan size={1.08} framed={false} />
            </group>
          ))}
          {[-1, 1].map((side) => (
            <group key={side}>
              <Block
                position={[0, -0.182, side * 0.646]}
                size={[w, 0.035, 0.065]}
                color={silver}
              />
              <group
                position={[side * 0.22, -0.182, 0]}
                rotation={[0, side * 0.46, 0]}
              >
                <Block size={[0.09, 0.035, 1.28]} color={silver} />
              </group>
            </group>
          ))}
          <Block
            position={[-1.507, 0, 0]}
            size={[0.025, h, 1.35]}
            color={silver}
          />
          <PrintedLabel
            text="GEFORCE RTX 5090"
            position={[0, 0.05, 0.687]}
            width={1.5}
            height={0.1}
          />
          <Block
            position={[-0.5, 0.15, -0.68]}
            size={[0.86, 0.05, 0.008]}
            color="#c3a360"
          />
        </group>
      );
    case 'ram':
      return (
        <group>
          {[-0.11, 0.11].map((x) => (
            <group key={x} position={[x, 0, 0]}>
              <Block size={[0.077, h, d - 0.025]} color="#c3c7cc" />
              {range(16).map((i) => (
                <Block
                  key={i}
                  position={[0.039, -0.6 + i * 0.08, 0.025]}
                  size={[0.002, 0.027, 0.39]}
                  color="#6c747e"
                />
              ))}
              <Block
                position={[0, 0, d / 2 - 0.012]}
                size={[0.077, h - 0.025, 0.025]}
                color="#b6e6f2"
                metalness={0.1}
              />
              <Block
                position={[0, 0, -d / 2 + 0.015]}
                size={[0.015, h - 0.1, 0.03]}
                color="#c4a267"
              />
              <PrintedLabel
                text="DOMINATOR TITANIUM"
                position={[0.0395, 0, 0.02]}
                width={1.12}
                height={0.08}
                rotation={[0, Math.PI / 2, Math.PI / 2]}
                color="#252d36"
              />
            </group>
          ))}
        </group>
      );
    case 'ssd':
      return (
        <group>
          <Block size={[w, h, 0.008]} color="#252f2c" />
          {[-0.22, 0.04, 0.26].map((x) => (
            <Block
              key={x}
              position={[x, 0, 0.012]}
              size={[0.18, 0.16, 0.012]}
              color="#151b22"
            />
          ))}
          <PrintedLabel
            text="crucial T705 4TB"
            position={[0, 0, 0.019]}
            width={0.58}
            height={0.11}
            background="#161d26"
          />
          {range(12).map((i) => (
            <Block
              key={i}
              position={[-0.388, -0.09 + i * 0.016, 0]}
              size={[0.024, 0.008, 0.01]}
              color="#c9a766"
            />
          ))}
        </group>
      );
    case 'psu':
      return (
        <group>
          <Block size={p.size} color="#232a32" />
          <group position={[0.1, 0, -0.335]} rotation={[0, Math.PI, 0]}>
            <Fan size={1.34} framed={false} />
          </group>
          <PrintedLabel
            text="SEASONIC  PRIME TX-1600"
            position={[0, 0, 0.432]}
            width={1.85}
            height={0.19}
            color="#c8c7ba"
          />
          {range(10).map((i) => (
            <Block
              key={i}
              position={[
                1.052,
                -0.54 + (i % 5) * 0.27,
                -0.21 + Math.floor(i / 5) * 0.42,
              ]}
              size={[0.008, 0.18, 0.22]}
              color="#080e14"
            />
          ))}
        </group>
      );
    case 'fans':
      return (
        <group>
          {[-1.2, 0, 1.2].map((y) => (
            <RingFan key={y} position={[0, y, 0]} />
          ))}
        </group>
      );
    case 'rear-fan':
      return <RingFan />;
    default:
      return <Block size={p.size} color={black} />;
  }
}
