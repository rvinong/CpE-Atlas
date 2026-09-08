import test from 'node:test';
import assert from 'node:assert/strict';
import { MeshStandardMaterial } from 'three';
import { loadSource } from './source-loader.mjs';
const { captureAppearance, applyAppearance } = await loadSource(
  '../lib/atlas/material-appearance.ts',
);

test('Fan illumination survives hover, selection, and deselection', () => {
  const material = new MeshStandardMaterial({
    emissive: '#386886',
    emissiveIntensity: 0.8,
  });
  const original = material.emissive.clone();
  const base = captureAppearance(material);
  applyAppearance(base, 1, 1, true, false);
  assert.equal(material.emissiveIntensity, 0.8);
  assert.equal(captureAppearance(material), base);
  applyAppearance(base, 1, 1, false, true);
  applyAppearance(base, 1, 1, false, false);
  assert.ok(material.emissive.equals(original));
  assert.equal(material.emissiveIntensity, 0.8);
});

test('Glass and labels preserve transparency and depth settings after isolation', () => {
  for (const opacity of [0.13, 1]) {
    const material = new MeshStandardMaterial({
      opacity,
      transparent: true,
      depthWrite: false,
    });
    const base = captureAppearance(material);
    applyAppearance(base, 0.2, 1, false, false);
    assert.equal(material.opacity, opacity * 0.2);
    applyAppearance(base, 1, 1, false, false);
    assert.equal(material.opacity, opacity);
    assert.equal(material.depthWrite, false);
  }
});
