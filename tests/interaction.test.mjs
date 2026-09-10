import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSource } from './source-loader.mjs';
const { systems } = await loadSource('../lib/atlas/systems.ts');
const { useAtlas } = await loadSource('../lib/atlas/store.ts');
const { moduleInteraction, selectionDistance } = await loadSource(
  '../lib/atlas/interaction.ts',
);

for (const system of Object.values(systems)) {
  test(`${system.id}: selection keeps context, isolation is explicit, reset clears annotations`, () => {
    const state = () => useAtlas.getState();
    state().setSystem(system.id);
    state().select(system.parts[1].id);
    assert.equal(state().isolated, false);
    assert.equal(state().labels, false);
    state().toggleIsolate();
    assert.equal(state().isolated, true);
    state().select(null);
    assert.equal(state().isolated, false);
    state().toggleLabels();
    state().reset();
    assert.equal(state().labels, false);
    assert.equal(state().selectedId, null);
  });
  test(`${system.id}: focus preserves a usable context distance for every component`, () => {
    for (const aspect of [0.5, 1, 2])
      for (const p of system.parts) {
        const distance = selectionDistance(p, aspect, 12);
        assert.ok(Number.isFinite(distance) && distance >= 2.88);
        assert.ok(distance >= p.size[1] / (2 * Math.tan((38 * Math.PI) / 360)));
      }
  });
  test(`${system.id}: annotation budget and capabilities reference supported parts and modes`, () => {
    const config = moduleInteraction[system.id];
    assert.ok(config.labels.length <= 4);
    for (const id of config.labels)
      assert.ok(system.parts.some((p) => p.id === id));
    for (const mode of config.planned) assert.ok(!config.modes.includes(mode));
    useAtlas.getState().setSystem(system.id);
    useAtlas.getState().toggleXray();
    assert.equal(useAtlas.getState().xray, system.id === 'desktop');
  });
}
test('Explode and X-Ray cannot remain active together', () => {
  useAtlas.getState().setSystem('desktop');
  useAtlas.getState().setExploded(1);
  useAtlas.getState().toggleXray();
  assert.equal(useAtlas.getState().exploded, 0);
  useAtlas.getState().setExploded(1);
  assert.equal(useAtlas.getState().xray, false);
  useAtlas.getState().setExploded(NaN);
  assert.equal(useAtlas.getState().exploded, 0);
});

test('Label cycle exposes all names and reset restores a clean view', () => {
  const state = () => useAtlas.getState();
  state().reset();
  state().toggleLabels();
  assert.equal(state().labels, 'key');
  state().toggleLabels();
  assert.equal(state().labels, 'all');
  state().select('cpu');
  assert.equal(state().labels, 'all');
  state().toggleLabels();
  assert.equal(state().labels, false);
});

test('Desktop wiring opens assembled, is desktop-only, and clears on system change', () => {
  const state = () => useAtlas.getState();
  state().setSystem('desktop');
  state().setExploded(1);
  state().toggleWires();
  assert.equal(state().wires, true);
  assert.equal(state().exploded, 0);
  state().reset();
  assert.equal(state().wires, false);
  state().toggleWires();
  state().setSystem('arduino');
  assert.equal(state().wires, false);
  state().toggleWires();
  assert.equal(state().wires, false);
});
