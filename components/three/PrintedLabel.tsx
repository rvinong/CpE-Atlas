/* eslint-disable react/react-compiler -- Immutable canvas textures are cached by label, outside React state. */
import { CanvasTexture, SRGBColorSpace } from 'three';
import type { Vec3 } from '@/lib/atlas/types';
const textures = new Map<string, CanvasTexture>();
function textureFor(text: string, color: string, background: string) {
  if (typeof document === 'undefined') return undefined;
  const key = `${text}|${color}|${background}`;
  if (textures.has(key)) return textures.get(key);
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (!ctx) return undefined;
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, 1024, 128);
  ctx.fillStyle = color;
  ctx.font = '600 66px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 512, 68, 990);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  textures.set(key, texture);
  return texture;
}
export function PrintedLabel({
  text,
  position = [0, 0, 0],
  width,
  height = width / 8,
  rotation = [0, 0, 0],
  color = '#d2d6d6',
  background = 'transparent',
}: {
  text: string;
  position?: Vec3;
  width: number;
  height?: number;
  rotation?: Vec3;
  color?: string;
  background?: string;
}) {
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial
        map={textureFor(text, color, background)}
        transparent
        depthWrite={false}
        roughness={0.65}
        metalness={0.1}
        polygonOffset
        polygonOffsetFactor={-1}
      />
    </mesh>
  );
}
