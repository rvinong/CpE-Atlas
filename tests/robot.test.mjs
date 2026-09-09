import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSource } from './source-loader.mjs';
const { robotSystem, lineBehavior, robotLinks } = await loadSource(
  '../lib/atlas/robot.ts',
);
const { useAtlas } = await loadSource('../lib/atlas/store.ts');
const { systems, isSystemId, systemList } = await loadSource(
  '../lib/atlas/systems.ts',
);

test('Robotics registers once and reuses the existing Arduino route', () => {
  assert.ok(isSystemId('robot'));
  assert.equal(systemList.at(-1).id, 'robot');
  assert.equal(
    robotSystem.parts.find((p) => p.id === 'uno').relatedSystem,
    'arduino',
  );
  for (const p of robotSystem.parts) {
    assert.ok(p.subsystem && p.lesson && p.modelObjectName);
    if (p.relatedSystem) assert.ok(systems[p.relatedSystem]);
  }
});
test('Four sensor observations select the expected differential drive action', () => {
  assert.deepEqual(
    Object.values(lineBehavior).map((b) => b.sensors),
    [
      ['White', 'White'],
      ['Black', 'White'],
      ['White', 'Black'],
      ['Black', 'Black'],
    ],
  );
  assert.deepEqual(lineBehavior.forward.motors, [1, 1]);
  assert.deepEqual(lineBehavior.left.motors, [0, 1]);
  assert.deepEqual(lineBehavior.right.motors, [1, 0]);
  assert.deepEqual(lineBehavior.stop.motors, [0, 0]);
});
test('Robot modes remain exclusive and reset clears both teaching state and selection', () => {
  const s = () => useAtlas.getState();
  s().setSystem('robot');
  s().setExploded(1);
  s().setTeachingMode('signal');
  assert.equal(s().exploded, 0);
  s().setTeachingMode('line');
  s().setLineState('left');
  s().select('left-motor');
  assert.equal(s().teachingMode, 'line');
  assert.equal(s().isolated, false);
  s().reset();
  assert.equal(s().teachingMode, null);
  assert.equal(s().lineState, 'forward');
  assert.equal(s().selectedId, null);
  s().setTeachingMode('signal');
  s().setExploded(1);
  assert.equal(s().teachingMode, null);
  for (const id of ['desktop', 'motherboard', 'arduino', 'rectifier']) {
    s().setSystem(id);
    s().setTeachingMode('line');
    assert.equal(s().teachingMode, null);
  }
});
test('Both sensors reach the controller and both motors receive power through the driver', () => {
  for (const side of ['left', 'right']) {
    assert.ok(
      robotLinks.some(
        (l) =>
          l.from === `${side}-sensor` && l.to === 'uno' && l.kind === 'signal',
      ),
    );
    assert.ok(
      robotLinks.some(
        (l) =>
          l.from === 'driver' && l.to === `${side}-motor` && l.kind === 'power',
      ),
    );
  }
  assert.ok(
    robotLinks.some(
      (l) => l.from === 'uno' && l.to === 'driver' && l.kind === 'data',
    ),
  );
  assert.ok(
    robotLinks.some(
      (l) => l.from === 'battery' && l.to === 'driver' && l.kind === 'power',
    ),
  );
  assert.ok(
    !robotLinks.some((l) => l.from === 'uno' && l.to.endsWith('motor')),
  );
});
