import type { Vec3 } from './types';

/** Teaching routes in assembled model coordinates, not a manufacturer wiring diagram. */
export const desktopWires: {
  id: string;
  name: string;
  from: string;
  to: string;
  description: string;
  points: Vec3[];
}[] = [
  {
    id: 'atx',
    name: '24-pin ATX / board power',
    from: 'psu',
    to: 'motherboard',
    description:
      'The PSU supplies the motherboard through its main ATX connector. Board circuitry distributes and regulates power for connected devices.',
    points: [
      [-0.1, -1.1, -1.02],
      [0.85, -1.15, -0.9],
      [0.86, 0.3, -0.75],
      [0.68, 0.5, -0.28],
    ],
  },
  {
    id: 'eps',
    name: 'EPS / CPU power',
    from: 'psu',
    to: 'motherboard',
    description:
      'A separate CPU power cable feeds the motherboard VRM, which regulates voltage for the processor. It connects to the board, not directly to the CPU.',
    points: [
      [-0.1, -1.25, -1.02],
      [0.8, -1.4, -1.1],
      [0.8, 1.95, -1.1],
      [-1.5, 1.95, -0.8],
      [-1.6, 1.65, -0.3],
    ],
  },
  {
    id: 'gpu',
    name: 'GPU / auxiliary power',
    from: 'psu',
    to: 'gpu',
    description:
      'The graphics card receives auxiliary power from the PSU as well as power through its PCIe slot. The slot carries data; this cable supplies power.',
    points: [
      [-0.1, -1.05, -1.02],
      [0.95, -1.15, -0.6],
      [1.05, -0.85, 0.75],
      [0.6, -0.35, 0.85],
      [0.35, -0.3, 0.6],
    ],
  },
];
