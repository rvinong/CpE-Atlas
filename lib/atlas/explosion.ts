import { Euler, Matrix4, Vector3 } from 'three';
import type { AtlasPart, Vec3 } from './types';

export interface DisplaySlot {
  position: Vec3;
  size: Vec3;
  rotation: Vec3;
}
export function rotatedSize(size: Vec3, rotation: Vec3): Vec3 {
  const m = new Matrix4().makeRotationFromEuler(
    new Euler(...rotation),
  ).elements;
  return [0, 1, 2].map(
    (i) =>
      Math.abs(m[i]) * size[0] +
      Math.abs(m[i + 4]) * size[1] +
      Math.abs(m[i + 8]) * size[2],
  ) as Vec3;
}
const ease = (t: number) => {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
};
export function displayProgress(exploded: number) {
  return ease((exploded - 0.28) / 0.72);
}
export function partPosition(
  part: AtlasPart,
  exploded: number,
  slot?: DisplaySlot,
): Vec3 {
  if (!slot)
    return part.position.map(
      (v, i) => v + (part.explodedPosition[i] - v) * exploded,
    ) as Vec3;
  const clearance = part.clearancePosition ?? part.position;
  const t = exploded < 0.28 ? ease(exploded / 0.28) : displayProgress(exploded);
  const from = exploded < 0.28 ? part.position : clearance;
  const to = exploded < 0.28 ? clearance : slot.position;
  return from.map((v, i) => v + (to[i] - v) * t) as Vec3;
}
/** Pack measured display bounds, including readable caption space, into rows. */
export function createDisplayLayout(
  parts: AtlasPart[],
  aspect: number,
): Record<string, DisplaySlot> {
  const items = parts.map((part) => ({
    part,
    size: rotatedSize(
      part.visualSize ?? part.size,
      part.displayRotation ?? [0, 0, 0],
    ),
  }));
  const area = items.reduce(
    (sum, item) =>
      sum + (Math.max(item.size[0], 1.45) + 0.65) * (item.size[1] + 0.85),
    0,
  );
  const maxWidth = Math.max(
    5.8,
    Math.sqrt(area * Math.max(0.45, Math.min(2, aspect))) * 1.4,
  );
  // Chassis first; tallest components next produce an ordered catalogue rather than radial offsets.
  items.sort((a, b) =>
    a.part.id === 'case'
      ? -1
      : b.part.id === 'case'
        ? 1
        : b.size[1] - a.size[1],
  );
  const rows: (typeof items)[] = [];
  let row: typeof items = [];
  let width = 0;
  for (const item of items) {
    const w = Math.max(item.size[0], 1.45) + 0.65;
    if (row.length && width + w > maxWidth) {
      rows.push(row);
      row = [];
      width = 0;
    }
    row.push(item);
    width += w;
  }
  if (row.length) rows.push(row);
  const heights = rows.map((r) => Math.max(...r.map((i) => i.size[1])) + 0.95);
  const totalHeight = heights.reduce((s, h) => s + h, 0);
  const result: Record<string, DisplaySlot> = {};
  let top = totalHeight / 2;
  rows.forEach((r, index) => {
    const rowWidth = r.reduce(
      (s, i) => s + Math.max(i.size[0], 1.45) + 0.65,
      0,
    );
    let left = -rowWidth / 2;
    for (const item of r) {
      const cellWidth = Math.max(item.size[0], 1.45) + 0.65;
      result[item.part.id] = {
        position: [left + cellWidth / 2, top - heights[index] / 2 + 0.22, 0],
        size: item.size,
        rotation: item.part.displayRotation ?? [0, 0, 0],
      };
      left += cellWidth;
    }
    top -= heights[index];
  });
  return result;
}
export function displayDistance(
  slots: Record<string, DisplaySlot>,
  aspect: number,
  fov = 38,
) {
  const tan = Math.tan((fov * Math.PI) / 360);
  let distance = 0;
  for (const { position: p, size: s } of Object.values(slots))
    distance = Math.max(
      distance,
      s[2] / 2 + (Math.abs(p[0]) + s[0] / 2 + 0.5) / (tan * aspect),
      s[2] / 2 + (Math.abs(p[1]) + s[1] / 2 + 0.7) / tan,
    );
  return distance * 1.12;
}

/** Fit the assembly from its authored viewing direction, including depth. */
export function assemblyDistance(
  parts: AtlasPart[],
  direction: Vec3,
  aspect: number,
  fov = 38,
) {
  const eye = new Vector3(...direction).normalize();
  const right = new Vector3()
    .crossVectors(new Vector3(0, 1, 0), eye)
    .normalize();
  const up = new Vector3().crossVectors(eye, right);
  const tan = Math.tan((fov * Math.PI) / 360);
  let distance = 0;
  for (const part of parts) {
    const size = rotatedSize(
      part.visualSize ?? part.size,
      part.rotation ?? [0, 0, 0],
    );
    for (const x of [-1, 1])
      for (const y of [-1, 1])
        for (const z of [-1, 1]) {
          const corner = new Vector3(
            part.position[0] + (x * size[0]) / 2,
            part.position[1] + (y * size[1]) / 2,
            part.position[2] + (z * size[2]) / 2,
          );
          distance = Math.max(
            distance,
            corner.dot(eye) + Math.abs(corner.dot(right)) / (tan * aspect),
            corner.dot(eye) + Math.abs(corner.dot(up)) / tan,
          );
        }
  }
  return distance * 1.15;
}
