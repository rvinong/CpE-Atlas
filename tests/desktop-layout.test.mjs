import test from 'node:test';
import assert from 'node:assert/strict';
import {
  Box3,
  BoxGeometry,
  CylinderGeometry,
  TorusGeometry,
  Matrix4,
  Euler,
  Vector3,
} from 'three';
import { loadSource } from './source-loader.mjs';
const { systems } = await loadSource('../lib/atlas/systems.ts');
const { DesktopGeometry } = await loadSource(
  '../components/three/DesktopGeometry.tsx',
);
const { createDisplayLayout, displayDistance, partPosition } = await loadSource(
  '../lib/atlas/explosion.ts',
);
const parts = systems.desktop.parts;
// Evaluate the actual React geometry tree, including every nested transform.
function bounds(element, parent = new Matrix4(), box = new Box3()) {
  if (!element || typeof element !== 'object') return box;
  if (Array.isArray(element)) {
    element.forEach((e) => bounds(e, parent, box));
    return box;
  }
  const { type, props } = element;
  if (typeof type === 'function') return bounds(type(props), parent, box);
  if (!props) return box;
  const local = new Matrix4().makeRotationFromEuler(
    new Euler(...(props.rotation ?? [0, 0, 0])),
  );
  const scale =
    typeof props.scale === 'number'
      ? [props.scale, props.scale, props.scale]
      : (props.scale ?? [1, 1, 1]);
  local.scale(new Vector3(...scale));
  local.setPosition(...(props.position ?? [0, 0, 0]));
  const matrix = parent.clone().multiply(local);
  const constructors = {
    boxGeometry: BoxGeometry,
    cylinderGeometry: CylinderGeometry,
    torusGeometry: TorusGeometry,
  };
  if (constructors[type]) {
    const geometry = new constructors[type](...(props.args ?? []));
    geometry.computeBoundingBox();
    box.union(geometry.boundingBox.clone().applyMatrix4(matrix));
    geometry.dispose();
  }
  return bounds(props.children, matrix, box);
}
const geometryBounds = Object.fromEntries(
  parts.map((p) => [p.id, bounds(DesktopGeometry({ part: p }))]),
);
test('Desktop uses one millimetre scale and hardware fits within the chassis', () => {
  const board = parts.find((p) => p.id === 'motherboard');
  assert.equal(board.size[0] * 100, 244);
  assert.equal(board.size[1] * 100, 305);
  const interior = new Box3(
    new Vector3(-2.25, -2.3, -1.1),
    new Vector3(2.25, 2.3, 1.1),
  );
  for (const p of parts.filter((p) => p.id !== 'case')) {
    const matrix = new Matrix4()
      .makeRotationFromEuler(new Euler(...(p.rotation ?? [0, 0, 0])))
      .setPosition(...p.position);
    const actual = geometryBounds[p.id].clone().applyMatrix4(matrix);
    assert.ok(
      interior.containsBox(actual),
      `${p.id} protrudes outside the case: ${actual.min.toArray()} / ${actual.max.toArray()}`,
    );
  }
});
for (const aspect of [0.5, 0.75, 1, 1.4, 1.8, 2.4])
  test(`Exploded geometry is visible without projected overlap at aspect ${aspect}`, () => {
    const layout = createDisplayLayout(parts, aspect);
    const distance = displayDistance(layout, aspect);
    const tan = Math.tan((38 * Math.PI) / 360);
    const rectangles = parts.map((p) => {
      const slot = layout[p.id];
      const m = new Matrix4()
        .makeRotationFromEuler(new Euler(...slot.rotation))
        .setPosition(...slot.position);
      const box = geometryBounds[p.id].clone().applyMatrix4(m);
      const points = [];
      for (const x of [box.min.x, box.max.x])
        for (const y of [box.min.y, box.max.y])
          for (const z of [box.min.z, box.max.z])
            points.push([
              x / ((distance - z) * tan * aspect),
              y / ((distance - z) * tan),
            ]);
      return {
        id: p.id,
        minX: Math.min(...points.map((p) => p[0])),
        maxX: Math.max(...points.map((p) => p[0])),
        minY: Math.min(...points.map((p) => p[1])),
        maxY: Math.max(...points.map((p) => p[1])),
      };
    });
    for (const r of rectangles) {
      assert.ok(
        r.minX > -0.95 && r.maxX < 0.95 && r.minY > -0.95 && r.maxY < 0.95,
        `${r.id} clipped`,
      );
    }
    for (let i = 0; i < rectangles.length; i++)
      for (let j = i + 1; j < rectangles.length; j++) {
        const a = rectangles[i],
          b = rectangles[j];
        assert.ok(
          a.maxX < b.minX ||
            b.maxX < a.minX ||
            a.maxY < b.minY ||
            b.maxY < a.minY,
          `${a.id} overlaps ${b.id}`,
        );
      }
  });
test('Staged explosion has exact assembled/display endpoints and no discontinuity', () => {
  const layout = createDisplayLayout(parts, 1.4);
  for (const p of parts) {
    assert.deepEqual(partPosition(p, 0, layout[p.id]), p.position);
    assert.deepEqual(
      partPosition(p, 1, layout[p.id]).map((v) => Math.round(v * 1e8)),
      layout[p.id].position.map((v) => Math.round(v * 1e8)),
    );
    const a = new Vector3(...partPosition(p, 0.28 - 1e-6, layout[p.id]));
    const b = new Vector3(...partPosition(p, 0.28 + 1e-6, layout[p.id]));
    assert.ok(a.distanceTo(b) < 1e-5);
  }
});
