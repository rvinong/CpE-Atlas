import test from 'node:test';
import assert from 'node:assert/strict';
import { Matrix4, Euler, Vector3 } from 'three';
import { loadSource } from './source-loader.mjs';
import { bounds } from './geometry-bounds.mjs';
const { systems } = await loadSource('../lib/atlas/systems.ts');
const { PartGeometry } = await loadSource(
  '../components/three/PartGeometry.tsx',
);
const { createDisplayLayout, displayDistance, partPosition, assemblyDistance } =
  await loadSource('../lib/atlas/explosion.ts');

for (const system of Object.values(systems)) {
  const parts = system.parts;
  const geometry = Object.fromEntries(
    parts.map((p) => [p.id, bounds(PartGeometry({ part: p }))]),
  );
  test(`${system.id}: assembled camera fits actual hardware on narrow and wide screens`, () => {
    const eye = new Vector3(...system.camera).normalize();
    const right = new Vector3()
      .crossVectors(new Vector3(0, 1, 0), eye)
      .normalize();
    const up = new Vector3().crossVectors(eye, right);
    const tan = Math.tan((38 * Math.PI) / 360);
    for (const aspect of [0.5, 0.75, 1, 1.4, 1.8, 2.4]) {
      const distance = Math.max(
        new Vector3(...system.camera).length(),
        assemblyDistance(parts, system.camera, aspect),
      );
      for (const p of parts) {
        const box = geometry[p.id]
          .clone()
          .applyMatrix4(
            new Matrix4()
              .makeRotationFromEuler(new Euler(...(p.rotation ?? [0, 0, 0])))
              .setPosition(...p.position),
          );
        for (const x of [box.min.x, box.max.x])
          for (const y of [box.min.y, box.max.y])
            for (const z of [box.min.z, box.max.z]) {
              const corner = new Vector3(x, y, z),
                depth = distance - corner.dot(eye);
              assert.ok(
                Math.abs(corner.dot(right) / (depth * tan * aspect)) < 0.95 &&
                  Math.abs(corner.dot(up) / (depth * tan)) < 0.95,
                `${p.id} clipped at ${aspect}`,
              );
            }
      }
    }
  });
  test(`${system.id}: physical geometry stays within its measured envelope`, () => {
    for (const p of parts) {
      const box = geometry[p.id];
      assert.ok(!box.isEmpty(), `${p.id}: no rendered geometry`);
      // A 1% allowance covers surface markings and floating-point precision.
      const envelope = p.visualSize ?? p.size;
      for (let i = 0; i < 3; i++) {
        assert.ok(
          box.min.getComponent(i) >= -envelope[i] * 0.51 &&
            box.max.getComponent(i) <= envelope[i] * 0.51,
          `${p.id} exceeds axis ${i}: ${box.min.toArray()} / ${box.max.toArray()} vs ${p.size}`,
        );
      }
      assert.ok(p.dimensionsMm && p.clearancePosition && p.displayRotation);
    }
  });
  for (const aspect of [0.5, 0.75, 1, 1.4, 1.8, 2.4])
    test(`${system.id}: exploded components fit without overlap at aspect ${aspect}`, () => {
      const layout = createDisplayLayout(parts, aspect);
      const distance = displayDistance(layout, aspect);
      const tan = Math.tan((38 * Math.PI) / 360);
      const rectangles = parts.map((p) => {
        const slot = layout[p.id];
        const box = geometry[p.id]
          .clone()
          .applyMatrix4(
            new Matrix4()
              .makeRotationFromEuler(new Euler(...slot.rotation))
              .setPosition(...slot.position),
          );
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
          minX: Math.min(...points.map((v) => v[0])),
          maxX: Math.max(...points.map((v) => v[0])),
          minY: Math.min(...points.map((v) => v[1])),
          maxY: Math.max(...points.map((v) => v[1])),
        };
      });
      for (const r of rectangles)
        assert.ok(
          r.minX > -0.95 && r.maxX < 0.95 && r.minY > -0.95 && r.maxY < 0.95,
          `${r.id} clipped`,
        );
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
  test(`${system.id}: extraction and reassembly share continuous endpoints`, () => {
    const layout = createDisplayLayout(parts, 1.4);
    for (const p of parts) {
      assert.deepEqual(partPosition(p, 0, layout[p.id]), p.position);
      assert.ok(
        new Vector3(...partPosition(p, 1, layout[p.id])).distanceTo(
          new Vector3(...layout[p.id].position),
        ) < 1e-8,
      );
      assert.ok(
        new Vector3(...partPosition(p, 0.28 - 1e-6, layout[p.id])).distanceTo(
          new Vector3(...partPosition(p, 0.28 + 1e-6, layout[p.id])),
        ) < 1e-5,
      );
      assert.ok(
        new Vector3(...p.clearancePosition).distanceTo(
          new Vector3(...p.position),
        ) > 0.1,
      );
    }
  });
}

test('Board-mounted electronics sit on the PCB and do not intersect other selectable components', () => {
  for (const id of ['motherboard', 'arduino', 'rectifier']) {
    const system = systems[id],
      board = system.parts.find((p) => p.id === 'pcb');
    const hardware = system.parts
      .filter((p) => p.id !== 'pcb')
      .map((p) => ({
        id: p.id,
        box: bounds(PartGeometry({ part: p })).applyMatrix4(
          new Matrix4()
            .makeRotationFromEuler(new Euler(...p.rotation))
            .setPosition(...p.position),
        ),
      }));
    for (const { id: partId, box } of hardware) {
      assert.ok(box.min.z >= -0.001, `${id}/${partId} penetrates PCB`);
      assert.ok(
        box.min.x > -board.size[0] / 2 - 0.2 &&
          box.max.x < board.size[0] / 2 + 0.2 &&
          box.min.y > -board.size[1] / 2 &&
          box.max.y < board.size[1] / 2,
        `${id}/${partId} lies outside PCB footprint`,
      );
    }
    // Diode lead endpoints intentionally meet at the four bridge nodes.
    if (id === 'rectifier') continue;
    for (let i = 0; i < hardware.length; i++)
      for (let j = i + 1; j < hardware.length; j++)
        assert.ok(
          !hardware[i].box.intersectsBox(hardware[j].box),
          `${id}/${hardware[i].id} intersects ${hardware[j].id}`,
        );
  }
});
