import { Color, MathUtils, MeshStandardMaterial } from 'three';

const baselines = new WeakMap<MeshStandardMaterial, MaterialAppearance>();
export interface MaterialAppearance {
  material: MeshStandardMaterial;
  opacity: number;
  emissive: Color;
  emissiveIntensity: number;
  depthWrite: boolean;
}
export function captureAppearance(
  material: MeshStandardMaterial,
): MaterialAppearance {
  const saved = baselines.get(material);
  if (saved) return saved;
  const appearance = {
    material,
    opacity: material.opacity,
    emissive: material.emissive.clone(),
    emissiveIntensity: material.emissiveIntensity,
    depthWrite: material.depthWrite,
  };
  baselines.set(material, appearance);
  material.transparent = true;
  return appearance;
}
const selectedColor = new Color('#367ad3');
const hoverColor = new Color('#49688b');
export function applyAppearance(
  base: MaterialAppearance,
  opacity: number,
  factor: number,
  selected: boolean,
  hovered: boolean,
) {
  const material = base.material;
  const target = opacity * base.opacity;
  material.opacity = MathUtils.lerp(material.opacity, target, factor);
  material.depthWrite = base.depthWrite && material.opacity > 0.85;
  material.emissive.copy(base.emissive);
  material.emissiveIntensity = base.emissiveIntensity;
  if (selected || hovered) {
    material.emissive.lerp(
      selected ? selectedColor : hoverColor,
      selected ? 0.22 : 0.12,
    );
    material.emissiveIntensity = Math.max(base.emissiveIntensity, 0.4);
  }
  return Math.abs(material.opacity - target) > 0.001;
}
