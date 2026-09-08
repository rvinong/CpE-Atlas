import type { Vec3 } from './types';

// World-space mating points. The tube mesh and its terminal fittings share these.
export const coolantMounts = {
  origin: [0.7175, 1.4, 0.65] as Vec3,
  pump: [
    [-0.475, 0.69, 0.32],
    [-0.475, 0.81, 0.32],
  ] as Vec3[],
  radiator: [
    [1.91, 2.035, 0.3],
    [1.91, 2.035, 0.5],
  ] as Vec3[],
};

export const unoMountingHoles: [number, number][] = [
  [-0.97, 1.21],
  [-1.02, -1.21],
  [1.58, 0.49],
  [1.58, -0.96],
];
