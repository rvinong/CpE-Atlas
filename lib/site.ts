export const siteConfig = {
  name: 'CpE Atlas',
  title: 'CpE Atlas — Interactive Computer Engineering Atlas',
  description:
    'Explore computer hardware, electronics, microcontrollers, circuits, and robotics through interactive 3D engineering systems.',
  tagline: 'Explore Computer Engineering from the inside out.',
  url: 'https://cpe-atlas.vercel.app',
  repository: 'https://github.com/rvinong/CpE-Atlas',
} as const;

export const atlasSystems = [
  {
    id: 'desktop',
    number: '01',
    name: 'Desktop Computer',
    category: 'Computer Hardware',
    description:
      'See how processing, graphics, memory, storage, cooling, and power fit together inside a complete desktop.',
    detail: 'Exploded view · component inspection · X-ray',
  },
  {
    id: 'motherboard',
    number: '02',
    name: 'Motherboard',
    category: 'Computer Architecture',
    description:
      'Map the CPU socket, DIMM slots, PCIe, storage interfaces, chipset, firmware, and power delivery.',
    detail: 'Architecture map · connections · labels',
  },
  {
    id: 'arduino',
    number: '03',
    name: 'Arduino Uno',
    category: 'Microcontrollers',
    description:
      'Inspect the controller, programming interface, power circuit, and I/O that connect code to physical systems.',
    detail: 'Board exploration · pin groups · component roles',
  },
  {
    id: 'rectifier',
    number: '04',
    name: 'Bridge Rectifier',
    category: 'Electronics',
    description:
      'Follow the components that convert alternating current into a filtered direct-current output.',
    detail: 'Circuit exploration · signal relationships',
  },
  {
    id: 'robot',
    number: '05',
    name: 'Line Follower Robot',
    category: 'Robotics / Embedded Systems',
    description:
      'Trace how sensors, processing, motor control, and movement form a complete autonomous system.',
    detail: 'Sensors → processing → control → actuation',
  },
] as const;
