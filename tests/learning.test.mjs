import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSource } from './source-loader.mjs';
const { systems } = await loadSource('../lib/atlas/systems.ts');
const { connections, connectionsFor } = await loadSource(
  '../lib/atlas/connections.ts',
);
const { lessons } = await loadSource('../lib/atlas/learning.ts');
const { useAtlas } = await loadSource('../lib/atlas/store.ts');
const { searchAtlas } = await loadSource('../lib/atlas/search.ts');
const { atlasCommands } = await loadSource('../lib/atlas/commands.ts');
for (const system of Object.values(systems)) {
  test(`${system.id}: relationships resolve to existing parts`, () => {
    const ids = new Set();
    for (const link of connections[system.id]) {
      assert.ok(system.parts.some((p) => p.id === link.from));
      assert.ok(system.parts.some((p) => p.id === link.to));
      assert.ok(link.label);
      assert.ok(!ids.has(link.id));
      ids.add(link.id);
    }
    assert.deepEqual(connectionsFor(system.id, null), []);
  });
  test(`${system.id}: command capabilities match workspace`, () => {
    useAtlas.getState().setSystem(system.id);
    const commands = atlasCommands();
    assert.equal(
      commands.some((c) => c.id === 'xray'),
      system.id === 'desktop',
    );
    assert.ok(!commands.some((c) => c.id === 'focus'));
    useAtlas.getState().select(system.parts[0].id);
    assert.ok(atlasCommands().some((c) => c.id === 'focus'));
  });
}
for (const lesson of lessons) {
  test(`${lesson.id}: complete sequence, navigation bounds, restart and exit`, () => {
    const state = () => useAtlas.getState();
    state().startLesson(lesson.id);
    assert.equal(state().systemId, lesson.system);
    lesson.steps.forEach((step, index) => {
      state().stepLesson(index);
      assert.equal(state().selectedId, step.componentId);
      assert.equal(state().lessonStep, index);
      if (step.componentId)
        assert.ok(
          systems[lesson.system].parts.some((p) => p.id === step.componentId),
        );
      if (step.connections)
        assert.ok(connectionsFor(lesson.system, step.componentId).length);
      assert.equal(state().connectionsVisible, !!step.connections);
    });
    state().stepLesson(999);
    assert.equal(state().lessonStep, lesson.steps.length - 1);
    state().startLesson(lesson.id);
    assert.equal(state().lessonStep, 0);
    state().exitLesson();
    assert.equal(state().lessonId, null);
    assert.equal(state().connectionsVisible, false);
    assert.equal(state().teachingMode, null);
  });
}
test('Search spans aliases, topics, systems and guided lessons', () => {
  for (const query of [
    'Processor',
    'VRM',
    'PWM',
    'Diode',
    'L293D',
    'IR Sensor',
  ])
    assert.ok(searchAtlas(query).length, query);
  assert.ok(searchAtlas('desktop').some((r) => r.kind === 'Lesson'));
  assert.ok(searchAtlas('Arduino').some((r) => r.kind === 'System'));
  assert.ok(searchAtlas('   CPU   ').some((r) => r.component === 'cpu'));
  assert.equal(searchAtlas('no-match-xyzzy').length, 0);
});
test('Leaving lessons or connection view cannot hide unrelated hardware', () => {
  const state = () => useAtlas.getState();
  state().startLesson('desktop-basics');
  state().select('gpu');
  assert.equal(state().lessonId, null);
  state().toggleConnections();
  state().toggleIsolate();
  assert.equal(state().connectionsVisible, false);
  state().reset();
  assert.equal(state().isolated, false);
  assert.equal(state().connectionsVisible, false);
  state().startLesson('robot-basics');
  state().setSystem('arduino');
  assert.equal(state().lessonId, null);
});

test('Focus restores a selected-part view and unlinked selection exits connections', () => {
  const state = () => useAtlas.getState();
  state().setSystem('desktop');
  state().select('cpu');
  state().toggleConnections();
  assert.equal(state().connectionsVisible, true);
  state().focus();
  assert.equal(state().connectionsVisible, false);
  assert.equal(state().selectedId, 'cpu');
  state().toggleConnections();
  state().select('glass');
  assert.equal(state().connectionsVisible, false);
});
