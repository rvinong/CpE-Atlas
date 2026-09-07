import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSource as loadTs } from './source-loader.mjs';
const { systems, isSystemId } = await loadTs('../lib/atlas/systems.ts');
const { useAtlas } = await loadTs('../lib/atlas/store.ts');
test('Every selectable part has valid geometry, education, and resolvable relationships', () => {
  for (const system of Object.values(systems)) {
    const ids = new Set(system.parts.map((p) => p.id));
    assert.equal(
      ids.size,
      system.parts.length,
      `${system.id}: duplicate selection IDs`,
    );
    assert.ok(system.parts.length > 0);
    for (const part of system.parts) {
      assert.ok(
        part.name && part.description && part.lesson && part.modelObjectName,
      );
      for (const field of [
        'position',
        'explodedPosition',
        'cameraTarget',
        'size',
      ]) {
        assert.equal(part[field].length, 3);
        assert.ok(
          part[field].every(Number.isFinite),
          `${part.id}: invalid ${field}`,
        );
      }
      assert.ok(part.size.every((value) => value > 0));
      for (const id of part.relatedComponents)
        assert.ok(
          ids.has(id),
          `${system.id}/${part.id} links to missing ${id}`,
        );
    }
    for (const link of system.connections) {
      assert.ok(ids.has(link.from));
      assert.ok(ids.has(link.to));
    }
  }
});
test('Moving between systems clears selection and viewing modes from the previous assembly', () => {
  for (const id of Object.keys(systems)) {
    useAtlas.getState().setSystem('desktop');
    useAtlas.getState().select('gpu');
    useAtlas.getState().toggleIsolate();
    useAtlas.getState().setExploded(1);
    useAtlas.getState().toggleXray();
    useAtlas.getState().toggleLearn();
    useAtlas.getState().setSystem(id);
    const state = useAtlas.getState();
    assert.equal(state.systemId, id);
    assert.equal(state.selectedId, null);
    assert.equal(state.isolated, false);
    assert.equal(state.exploded, 0);
    assert.equal(state.xray, false);
    assert.equal(state.learn, false);
  }
});
test('Related selection exits isolation and reset restores the full assembled view', () => {
  useAtlas.getState().setSystem('desktop');
  useAtlas.getState().select('gpu');
  useAtlas.getState().toggleIsolate();
  assert.equal(useAtlas.getState().isolated, true);
  useAtlas.getState().select('motherboard');
  assert.equal(useAtlas.getState().isolated, false);
  useAtlas.getState().setExploded(0.6);
  useAtlas.getState().toggleXray();
  const cameraRevision = useAtlas.getState().resetKey;
  useAtlas.getState().reset();
  const state = useAtlas.getState();
  assert.equal(state.selectedId, null);
  assert.equal(state.exploded, 0);
  assert.equal(state.xray, false);
  assert.ok(state.resetKey > cameraRevision);
});
test('Explosion input cannot move geometry past its authored endpoints', () => {
  useAtlas.getState().setExploded(-10);
  assert.equal(useAtlas.getState().exploded, 0);
  useAtlas.getState().setExploded(100);
  assert.equal(useAtlas.getState().exploded, 1);
});
test('Unknown URL modules cannot resolve to a missing system', () => {
  assert.equal(isSystemId(null), false);
  assert.equal(isSystemId('constructor'), false);
  assert.equal(isSystemId('not-a-system'), false);
  for (const id of Object.keys(systems)) assert.equal(isSystemId(id), true);
});
