import type { AtlasPart, Vec3 } from './types';
import { coolantMounts } from './assembly-anchors';

function add(
  parts: AtlasPart[],
  id: string,
  name: string,
  geometry: AtlasPart['geometry'],
  description: string,
  related: string[],
) {
  const part: AtlasPart = {
    ...parts[0],
    id,
    name,
    fullName: name,
    modelObjectName: id,
    geometry,
    description,
    lesson: description,
    relatedComponents: related,
    specifications: {},
    relatedTopics: ['Mechanical assembly', 'Thermal design'],
  };
  parts.push(part);
  return part;
}
function configure(
  p: AtlasPart,
  position: Vec3,
  size: Vec3,
  label: string,
  displayRotation: Vec3 = [0, 0, 0],
) {
  p.position = position;
  p.size = size;
  p.visualSize = size.map((v) => v + 0.018) as Vec3;
  if (p.id === 'pcb') p.visualSize[2] = size[2] + 0.04;
  p.cameraTarget = position;
  p.rotation = [0, 0, 0];
  p.displayRotation = displayRotation;
  p.clearancePosition = [
    position[0],
    position[1],
    position[2] + (p.assemblyRole === 'cover' ? 1.5 : 0.75),
  ];
  p.dimensionsMm = label;
  p.specifications['Model dimensions'] = label;
}

export function applyReferenceHardware(
  desktop: AtlasPart[],
  motherboard: AtlasPart[],
  arduino: AtlasPart[],
) {
  // Standalone Crosshair: artwork and stack order follow the supplied exploded photo.
  for (const p of motherboard) {
    p.referenceModel = 'crosshair';
    p.color = '#24282a';
  }
  const boardLayout: Record<string, [Vec3, Vec3]> = {
    pcb: [
      [0, 0, -0.008],
      [2.77, 3.05, 0.016],
    ],
    socket: [
      [-0.12, 0.48, 0.045],
      [0.6, 0.65, 0.09],
    ],
    dimm: [
      [0.72, 0.58, 0.09],
      [0.37, 1.43, 0.18],
    ],
    pcie: [
      [-0.16, -0.68, 0.06],
      [1.22, 0.68, 0.12],
    ],
    vrm: [
      [-0.67, 0.61, 0.09],
      [0.25, 1.05, 0.18],
    ],
    chipset: [
      [0.71, -0.58, 0.035],
      [0.3, 0.3, 0.07],
    ],
    battery: [
      [0.02, -1.25, 0.0275],
      [0.24, 0.24, 0.055],
    ],
    bios: [
      [0.38, -1.33, 0.0125],
      [0.1, 0.075, 0.025],
    ],
    sata: [
      [1.18, -0.89, 0.075],
      [0.25, 0.34, 0.15],
    ],
    m2: [
      [-0.14, -0.12, 0.0125],
      [0.84, 0.22, 0.025],
    ],
    'atx-power': [
      [1.2, 0.68, 0.065],
      [0.12, 0.51, 0.13],
    ],
    'cpu-power': [
      [-0.5, 1.38, 0.065],
      [0.42, 0.12, 0.13],
    ],
    usb: [
      [0.8, -1.39, 0.045],
      [0.23, 0.09, 0.09],
    ],
    'fan-header': [
      [0.2, 1.4, 0.045],
      [0.1, 0.05, 0.09],
    ],
    audio: [
      [-1.13, -1.25, 0.009],
      [0.09, 0.09, 0.018],
    ],
    ethernet: [
      [-0.99, -0.33, 0.009],
      [0.09, 0.09, 0.018],
    ],
    'rear-io': [
      [-1.2, 0.52, 0.18],
      [0.28, 1.5, 0.36],
    ],
  };
  for (const p of motherboard) {
    const [pos, size] = boardLayout[p.id];
    configure(
      p,
      pos,
      size,
      p.id === 'pcb' ? '305 × 277 mm E-ATX' : p.dimensionsMm!,
    );
  }
  const covers: [string, string, Vec3, Vec3, string][] = [
    [
      'vrm-heatsink',
      'Copper VRM Heatsink',
      [-0.23, 0.88, 0.29],
      [1.16, 1.24, 0.22],
      'L-shaped copper thermal assembly',
    ],
    [
      'io-cover',
      'ROG I/O Cover',
      [-1.16, 0.62, 0.42],
      [0.43, 1.79, 0.12],
      'Black-and-gold rear I/O shroud',
    ],
    [
      'm2-cover',
      'Upper M.2 Heatsink',
      [-0.3, -0.13, 0.115],
      [1.86, 0.26, 0.18],
      'Raised M.2 cooling bar',
    ],
    [
      'armor',
      'Lower Thermal Deck',
      [-0.15, -0.88, 0.15],
      [2.34, 0.74, 0.16],
      'Removable M.2 thermal cover',
    ],
    [
      'right-cover',
      'Edition 20 Accent',
      [0.83, -0.13, 0.085],
      [0.88, 0.3, 0.12],
      'Anniversary gold accent panel',
    ],
    [
      'backplate',
      'Metal Backplate',
      [0, 0, -0.037],
      [2.77, 3.05, 0.03],
      '3 mm rear heat-spreading plate',
    ],
  ];
  for (const [id, name, pos, size, label] of covers) {
    const p = add(
      motherboard,
      id,
      name,
      'chip',
      `${name} follows the supplied ROG Crosshair X870E Edition 20 reference. It separates from the board to reveal the circuitry below.`,
      ['pcb', 'vrm', 'm2'],
    );
    p.referenceModel = 'crosshair';
    p.assemblyRole = id === 'backplate' ? 'base' : 'cover';
    configure(p, pos, size, label);
    if (id === 'backplate') p.clearancePosition = [-1, 0, -1.2];
  }
  motherboard[0].fullName = 'ASUS ROG Crosshair X870E Edition 20';
  motherboard[0].specifications = {
    Model: motherboard[0].fullName,
    Socket: 'AMD AM5',
    'Form factor': 'E-ATX · 305 × 277 mm',
    Reference: 'Supplied product image',
  };

  // UNO component centres follow the supplied top-view photograph.
  for (const p of arduino) p.referenceModel = 'uno';
  const unoPositions: Record<string, Vec3> = {
    atmega: [0.65, -0.51, 0.175],
    usb: [-1.665, 0.61, 0.275],
    'usb-controller': [-0.77, 0.405, 0.0375],
    regulator: [-1.32, -0.47, 0.075],
    crystal: [-0.57, -0.23, 0.05],
    reset: [-1.4, 1.16, 0.125],
    digital: [0.34, 1.235, 0.2125],
    analog: [1.04, -1.245, 0.2125],
    power: [0.15, -1.245, 0.2125],
    icsp: [1.53, 0.1, 0.2125],
    leds: [-0.325, 0.43, 0.035],
    'dc-jack': [-1.495, -0.955, 0.275],
    'power-caps': [-0.625, -0.905, 0.3],
  };
  for (const p of arduino) {
    if (unoPositions[p.id])
      configure(
        p,
        unoPositions[p.id],
        p.size,
        p.dimensionsMm!,
        p.displayRotation,
      );
    if (p.id === 'pcb') p.color = '#008d82';
    if (p.id === 'leds') p.rotation = [0, 0, Math.PI / 2];
  }
  // Add the conspicuous USB clock can and the second ICSP header visible in the photo.
  const usbClock = add(
    arduino,
    'usb-clock',
    'USB Clock Crystal',
    'crystal',
    'The metal-can 16 MHz crystal clocks the USB interface controller. The main ATmega328P uses its own ceramic resonator.',
    ['usb-controller', 'crystal'],
  );
  usbClock.referenceModel = 'uno';
  configure(
    usbClock,
    [-0.77, -0.02, 0.09],
    [0.52, 0.23, 0.18],
    '16 MHz USB crystal can',
  );
  const usbIcsp = add(
    arduino,
    'usb-icsp',
    'USB ICSP Header',
    'pins',
    'This six-pin header programs the USB interface microcontroller.',
    ['usb-controller'],
  );
  usbIcsp.referenceModel = 'uno';
  configure(
    usbIcsp,
    [-0.71, 0.8, 0.2125],
    [0.254, 0.381, 0.425],
    '2 × 3 programming pins',
  );

  const names: Record<string, string> = {
    case: 'MSI MEG Maestro 700L PZ',
    motherboard: 'ASUS ROG Maximus Z890 Extreme',
    cpu: 'Intel Core Ultra 9 285K',
    gpu: 'NVIDIA GeForce RTX 5090 Founders Edition 32GB',
    ram: 'Corsair Dominator Titanium 64GB DDR5-7200',
    ssd: 'Crucial T705 4TB PCIe Gen5 NVMe',
    psu: 'Seasonic PRIME TX-1600 Titanium ATX 3.0',
    cooler: 'ASUS ROG Ryujin III 360 ARGB Pump',
    fans: 'Side Intake Fans',
    'rear-fan': 'Rear Exhaust Fan',
  };
  const desktopLayout: Record<string, [Vec3, Vec3, string, Vec3?]> = {
    case: [[0, 0, 0], [4.7, 4.74, 3], '470 × 300 × 474 mm', [0.05, -0.25, 0]],
    motherboard: [
      [-0.7, 0.25, -0.45],
      [2.77, 3.05, 0.72],
      '305 × 277 mm · Intel LGA1851',
    ],
    cpu: [[-0.92, 0.75, -0.35], [0.375, 0.45, 0.04], '37.5 × 45 mm · LGA1851'],
    cooler: [
      [-0.92, 0.75, 0.1745],
      [0.89, 0.91, 1.01],
      '89 × 91 × 101 mm pump/display',
    ],
    gpu: [
      [-0.7, -0.5, 0.3625],
      [3.04, 0.405, 1.37],
      '304 × 137 mm · dual-slot FE',
      [-Math.PI / 2, 0, 0],
    ],
    ram: [
      [0.16, 0.78, -0.08625],
      [0.3, 1.359, 0.5675],
      '2 × 32GB · 135.9 × 56.75 mm',
      [0, -Math.PI / 2, 0],
    ],
    ssd: [[-0.8, 0.02, -0.41], [0.8, 0.22, 0.035], '80 × 22 mm · M.2 2280'],
    psu: [
      [-1.08, -1.12, -1.02],
      [2.1, 1.5, 0.86],
      '210 × 150 × 86 mm',
      [0.1, -0.35, 0],
    ],
    fans: [
      [1.35, 0.1, -0.3],
      [1.2, 3.6, 0.25],
      '3 × 120 mm · illustrative intake',
    ],
    'rear-fan': [
      [-2.18, 1.02, 0.65],
      [1.2, 1.2, 0.25],
      '120 mm · illustrative exhaust',
    ],
  };
  for (const p of desktop) {
    p.referenceModel = 'custom-pc';
    p.fullName = names[p.id];
    p.specifications = { Model: p.fullName };
    const [pos, size, label, rotation] = desktopLayout[p.id];
    configure(p, pos, size, label, rotation);
  }
  desktop.find((p) => p.id === 'rear-fan')!.rotation = [0, -Math.PI / 2, 0];
  desktop.find((p) => p.id === 'case')!.clearancePosition = [-3.6, 0, -0.6];
  const pump = desktop.find((p) => p.id === 'cooler')!;
  pump.name = 'AIO Pump & Display';
  pump.description =
    'The Ryujin III pump circulates coolant through the CPU cold plate and the separate 360 mm radiator.';
  pump.lesson =
    'Heat flows from the CPU into the cold plate, through coolant to the radiator, and then into the air moved by three fans. Flexible tubes connect the pump and radiator.';
  pump.relatedComponents = ['cpu', 'radiator', 'motherboard'];
  const radiator = add(
    desktop,
    'radiator',
    '360 mm Radiator',
    'cooler',
    'The Ryujin III radiator and three ARGB fans mount at the top of the case.',
    ['cooler', 'case'],
  );
  configure(
    radiator,
    [0, 2.06, 0.45],
    [3.995, 0.55, 1.2],
    '399.5 × 120 × 30 mm + 25 mm fans',
    [-Math.PI / 2, 0, 0],
  );
  radiator.fullName = 'ASUS ROG Ryujin III 360 ARGB Radiator';
  radiator.referenceModel = 'custom-pc';
  const tubes = add(
    desktop,
    'tubes',
    'Coolant Tubes',
    'cooler',
    'Two braided tubes carry coolant between the pump and radiator. They are displayed separately for inspection in exploded view.',
    ['cooler', 'radiator'],
  );
  configure(
    tubes,
    coolantMounts.origin,
    [2.55, 1.55, 0.9],
    'Paired braided AIO tubes',
  );
  tubes.referenceModel = 'custom-pc';
  const glass = add(
    desktop,
    'glass',
    'Panoramic Glass',
    'case',
    'A removable panoramic glass panel follows the Maestro case wraparound front and side.',
    ['case'],
  );
  configure(
    glass,
    [0, 0, 0],
    [4.7, 4.6, 3],
    '270° panoramic panel · visual approximation',
    [0, -0.35, 0],
  );
  glass.referenceModel = 'custom-pc';
  glass.assemblyRole = 'cover';
  glass.clearancePosition = [1.4, 0, 2.5];
  desktop.find((p) => p.id === 'cpu')!.specifications.Socket = 'Intel LGA1851';
  desktop.find((p) => p.id === 'ram')!.specifications.Profile =
    '7200 MT/s requested XMP target; exact 64GB kit SKU unverified';
  desktop.find((p) => p.id === 'ssd')!.description =
    'A Crucial T705 M.2 NVMe SSD connects directly to a motherboard PCIe Gen5 storage slot.';
  desktop.find((p) => p.id === 'ssd')!.lesson =
    'This 4TB M.2 2280 drive communicates over PCIe/NVMe and receives power through the motherboard connector. It is shown without its optional retail heatsink.';
}
