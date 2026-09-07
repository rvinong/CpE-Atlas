import type { AtlasPart, SystemId, Vec3 } from './types';

// Physical envelopes in millimetres, including connectors, leads and holders.
// Each system uses a single scale; zoom changes the view, never individual parts.
type Envelope = [
  positionMm: Vec3,
  sizeMm: Vec3,
  label: string,
  rotation?: Vec3,
  displayRotation?: Vec3,
];
const dimensions: Record<string, Record<string, Envelope>> = {
  motherboard: {
    pcb: [[0, 0, -0.8], [244, 305, 1.6], '305 × 244 mm ATX PCB'],
    socket: [[-25, 65, 4.25], [60, 65, 8.5], '60 × 65 mm socket assembly'],
    dimm: [[65, 62, 9], [34, 143, 18], '4 × 143 mm DIMM sockets'],
    pcie: [[-25, -70, 6], [115, 68, 12], '115 mm expansion connectors'],
    vrm: [[-73, 68, 9], [26, 105, 18], '105 × 26 mm regulator bank'],
    chipset: [[62, -62, 3.5], [32, 32, 7], '32 × 32 mm heatsink'],
    battery: [
      [-40, -115, 2.75],
      [24, 24, 5.5],
      '20 mm coin cell · 24 mm holder',
    ],
    bios: [[3, -128, 1.25], [10, 7.5, 2.5], '10 × 7.5 mm flash package'],
    sata: [[102, -100, 7.5], [25, 34, 15], '4-port SATA bank'],
    m2: [[-24, -15, 1.25], [84, 22, 2.5], '80 mm module mounting span'],
    'atx-power': [[107, 61, 6.5], [12, 51, 13], '24 contacts · 4.2 mm pitch'],
    'cpu-power': [[-75, 139, 6.5], [20, 12, 13], '8 contacts · EPS connector'],
    usb: [[65, -139, 4.5], [23, 9, 9], 'USB 2.0 header bank'],
    'fan-header': [[-32, 138, 4.5], [10, 5, 9], '4 contacts · 2.54 mm pitch'],
    audio: [[-104, -116, 0.9], [9, 9, 1.8], '9 × 9 mm codec package'],
    ethernet: [[-96, 84, 0.9], [9, 9, 1.8], '9 × 9 mm controller package'],
    'rear-io': [
      [-108, -12, 18],
      [28, 150, 36],
      '150 mm rear connector bank',
      undefined,
      [0, -0.45, 0],
    ],
  },
  arduino: {
    pcb: [[0, 0, -0.8], [68.6, 53.4, 1.6], '68.6 × 53.4 mm Uno R3 PCB'],
    atmega: [[10, -7, 3.5], [35.6, 10.16, 7], '28-pin DIP · 35.6 mm package'],
    usb: [
      [-29, 9, 5.5],
      [16, 12, 11],
      '16 × 12 × 11 mm USB Type-B',
      undefined,
      [0, -0.45, 0],
    ],
    'usb-controller': [[-12, 10, 0.75], [7, 7, 1.5], '32-pin TQFP package'],
    regulator: [[-23, -4, 1.5], [7, 7, 3], 'SOT-223 regulator package'],
    crystal: [[-6, 1, 1], [3.2, 1.3, 2], '3.2 mm ceramic resonator'],
    reset: [[-25, 23, 2.5], [6, 6, 5], '6 × 6 mm tactile switch'],
    digital: [[7, 24, 4.25], [46, 2.54, 8.5], '18 sockets · 2.54 mm pitch'],
    analog: [[21, -24, 4.25], [15.24, 2.54, 8.5], '6 sockets · 2.54 mm pitch'],
    power: [[-1, -24, 4.25], [20.32, 2.54, 8.5], '8 sockets · 2.54 mm pitch'],
    icsp: [[29, 3, 4.25], [5.08, 7.62, 8.5], '2 × 3 pins · 2.54 mm pitch'],
    leds: [[1, 12, 0.7], [8, 3, 1.4], 'Three SMD indicator LEDs'],
    'dc-jack': [
      [-28, -17, 5.5],
      [14, 9, 11],
      '5.5 mm barrel power jack',
      undefined,
      [0, -0.45, 0],
    ],
    'power-caps': [
      [-13, -17, 6],
      [14, 6.3, 12],
      '2 × 6.3 mm electrolytics',
      undefined,
      [0.3, 0, 0],
    ],
  },
  rectifier: {
    pcb: [[0, 0, -0.8], [70, 45, 1.6], '70 × 45 mm example circuit PCB'],
    ac: [
      [-28, 0, 5],
      [10, 11, 10],
      '2-pole low-voltage AC terminal',
      undefined,
      [0.2, -0.25, 0],
    ],
    d1: [
      [-6.5, 6.5, 1.7],
      [2.7, Math.sqrt(338), 3.4],
      '5.2 × 2.7 mm body + formed leads',
      [0, 0, -Math.PI / 4],
    ],
    d2: [
      [6.5, 6.5, 1.7],
      [2.7, Math.sqrt(338), 3.4],
      '5.2 × 2.7 mm body + formed leads',
      [0, 0, Math.PI / 4],
    ],
    d3: [
      [-6.5, -6.5, 1.7],
      [2.7, Math.sqrt(338), 3.4],
      '5.2 × 2.7 mm body + formed leads',
      [0, 0, Math.PI / 4],
    ],
    d4: [
      [6.5, -6.5, 1.7],
      [2.7, Math.sqrt(338), 3.4],
      '5.2 × 2.7 mm body + formed leads',
      [0, 0, -Math.PI / 4],
    ],
    capacitor: [
      [19, 0, 6.25],
      [8, 8, 12.5],
      '8 × 12.5 mm electrolytic',
      undefined,
      [0.55, 0, 0],
    ],
    load: [[29, 0, 1.5], [2.5, 26, 3], '6.3 × 2.5 mm axial body + leads'],
  },
};
export function applyComponentDimensions(parts: AtlasPart[], system: SystemId) {
  const mmPerUnit =
    system === 'motherboard' ? 100 : system === 'arduino' ? 20 : 10;
  parts.forEach((part, index) => {
    const [position, size, label, rotation, displayRotation] =
      dimensions[system][part.id];
    part.position = position.map((v) => v / mmPerUnit) as Vec3;
    part.size = size.map((v) => v / mmPerUnit) as Vec3;
    if (part.id === 'pcb')
      part.visualSize = [part.size[0], part.size[1], part.size[2] + 0.04];
    part.rotation = rotation ?? [0, 0, 0];
    part.displayRotation = displayRotation ?? [0, 0, 0];
    part.clearancePosition =
      part.id === 'pcb'
        ? [part.position[0] - 1, part.position[1], part.position[2] - 0.6]
        : [
            part.position[0],
            part.position[1],
            part.position[2] + 0.7 + (index % 4) * 0.22,
          ];
    part.cameraTarget = part.position;
    part.detail = system;
    part.dimensionsMm = label;
    part.specifications['Model dimensions'] = label;
  });
}
