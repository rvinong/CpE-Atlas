import test from 'node:test';
import assert from 'node:assert/strict';
import { Vector3, Euler, Matrix4 } from 'three';
import { loadSource } from './source-loader.mjs';
import { bounds } from './geometry-bounds.mjs';
const { systems } = await loadSource('../lib/atlas/systems.ts');
const { PartGeometry } = await loadSource(
  '../components/three/PartGeometry.tsx',
);
const { unoMountingHoles } = await loadSource(
  '../lib/atlas/assembly-anchors.ts',
);
const part = (system, id) => systems[system].parts.find((p) => p.id === id);
const worldBounds = (p) =>
  bounds(PartGeometry({ part: p })).applyMatrix4(
    new Matrix4()
      .makeRotationFromEuler(new Euler(...p.rotation))
      .setPosition(...p.position),
  );
const near = (a, b) =>
  assert.ok(Math.abs(a - b) < 0.001, `${a} does not mate with ${b}`);
function visit(element, fn) {
  if (!element) return;
  if (Array.isArray(element)) {
    element.forEach((e) => visit(e, fn));
    return;
  }
  if (typeof element.type === 'function') {
    visit(element.type(element.props), fn);
    return;
  }
  fn(element);
  visit(element.props?.children, fn);
}

test('Desktop cold plate contacts the CPU instead of floating above it', () => {
  const cpu = worldBounds(part('desktop', 'cpu')),
    cooler = worldBounds(part('desktop', 'cooler'));
  near(cpu.max.z, cooler.min.z);
  near(cpu.getCenter(new Vector3()).x, cooler.getCenter(new Vector3()).x);
  near(cpu.getCenter(new Vector3()).y, cooler.getCenter(new Vector3()).y);
});

test('Desktop DIMMs occupy alternating slots and GPU contacts meet the primary PCIe slot', () => {
  const board = part('desktop', 'motherboard'),
    ram = part('desktop', 'ram'),
    gpu = part('desktop', 'gpu');
  for (const [offset, slot] of [
    [-0.11, 1],
    [0.11, 3],
  ]) {
    near(ram.position[0] + offset, board.position[0] + 0.64 + slot * 0.11);
    near(ram.position[1], board.position[1] + 0.53);
  }
  near(gpu.position[0] - 0.5, board.position[0] - 0.5);
  near(gpu.position[1] + 0.15, board.position[1] - 0.6);
  near(gpu.position[2] - 0.68, board.position[2] + 0.133);
});

test('Both rendered coolant paths terminate on the pump and radiator surfaces', () => {
  const tubes = part('desktop', 'tubes'),
    pump = worldBounds(part('desktop', 'cooler')),
    radiator = worldBounds(part('desktop', 'radiator'));
  let count = 0;
  visit(PartGeometry({ part: tubes }), (e) => {
    if (e.type !== 'tubeGeometry') return;
    const path = e.props.args[0];
    const start = path.getPoint(0).add(new Vector3(...tubes.position));
    const end = path.getPoint(1).add(new Vector3(...tubes.position));
    near(start.x, pump.max.x);
    assert.ok(
      start.y > pump.min.y &&
        start.y < pump.max.y &&
        start.z > pump.min.z &&
        start.z < pump.max.z,
    );
    assert.ok(radiator.containsPoint(end));
    count++;
  });
  assert.equal(count, 2);
});

test('Crosshair backplate contacts the PCB and M.2 cover seats on its mounting height', () => {
  near(
    worldBounds(part('motherboard', 'backplate')).max.z,
    worldBounds(part('motherboard', 'pcb')).min.z - 0.0005,
  );
  near(
    worldBounds(part('motherboard', 'm2-cover')).min.z,
    worldBounds(part('motherboard', 'm2')).max.z,
  );
});

test('Uno mounting holes remain clear of component footprints', () => {
  for (const p of systems.arduino.parts.filter((p) => p.id !== 'pcb')) {
    const box = worldBounds(p);
    for (const [x, y] of unoMountingHoles) {
      const dx = Math.max(box.min.x - x, 0, x - box.max.x),
        dy = Math.max(box.min.y - y, 0, y - box.max.y);
      assert.ok(
        Math.hypot(dx, dy) >= 0.079,
        `${p.id} obstructs mounting hole ${x},${y}`,
      );
    }
  }
});

test('Rectifier diode leads land at the four bridge nodes on the PCB', () => {
  const nodes = [
    [-1.3, 0],
    [1.3, 0],
    [0, 1.3],
    [0, -1.3],
  ];
  for (const id of ['d1', 'd2', 'd3', 'd4']) {
    const p = part('rectifier', id);
    for (const side of [-1, 1]) {
      const contact = new Vector3(0, (side * p.size[1]) / 2, -p.size[2] / 2)
        .applyEuler(new Euler(...p.rotation))
        .add(new Vector3(...p.position));
      near(contact.z, 0);
      assert.ok(
        nodes.some(
          ([x, y]) => Math.hypot(contact.x - x, contact.y - y) < 0.001,
        ),
      );
    }
  }
});
