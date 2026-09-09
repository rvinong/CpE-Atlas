import type { AtlasPart, AtlasSystem, Vec3 } from './types';
export type LineState = 'forward' | 'left' | 'right' | 'stop';
export const lineBehavior: Record<
  LineState,
  {
    label: string;
    sensors: ['White' | 'Black', 'White' | 'Black'];
    motors: [number, number];
    decision: string;
  }
> = {
  forward: {
    label: 'Forward',
    sensors: ['White', 'White'],
    motors: [1, 1],
    decision:
      'Both sensors see the bright surface beside the line. Drive both wheels forward.',
  },
  left: {
    label: 'Turn Left',
    sensors: ['Black', 'White'],
    motors: [0, 1],
    decision:
      'The left sensor detects the line. Stop the left wheel and drive the right wheel to steer left.',
  },
  right: {
    label: 'Turn Right',
    sensors: ['White', 'Black'],
    motors: [1, 0],
    decision:
      'The right sensor detects the line. Drive the left wheel and stop the right wheel to steer right.',
  },
  stop: {
    label: 'Stop',
    sensors: ['Black', 'Black'],
    motors: [0, 0],
    decision:
      'Both sensors detect black. This teaching algorithm treats it as a stop marker.',
  },
};
export const robotLinks = [
  {
    from: 'left-sensor',
    to: 'uno',
    kind: 'signal' as const,
    label: 'SENSOR DATA',
  },
  {
    from: 'right-sensor',
    to: 'uno',
    kind: 'signal' as const,
    label: 'SENSOR DATA',
  },
  { from: 'uno', to: 'driver', kind: 'data' as const, label: 'CONTROL' },
  {
    from: 'battery',
    to: 'driver',
    kind: 'power' as const,
    label: 'MOTOR SUPPLY',
  },
  {
    from: 'driver',
    to: 'left-motor',
    kind: 'power' as const,
    label: 'MOTOR DRIVE',
  },
  {
    from: 'driver',
    to: 'right-motor',
    kind: 'power' as const,
    label: 'MOTOR DRIVE',
  },
];
function component(
  id: string,
  name: string,
  subsystem: NonNullable<AtlasPart['subsystem']>,
  position: Vec3,
  size: Vec3,
  description: string,
  lesson: string,
  relatedComponents: string[],
  specifications: Record<string, string> = {},
  inputs = '',
  outputs = '',
): AtlasPart {
  return {
    id,
    name,
    fullName: name,
    category: subsystem,
    subsystem,
    description,
    lesson,
    relatedComponents,
    specifications,
    inputs,
    outputs,
    signalType:
      subsystem === 'Power'
        ? 'Power'
        : subsystem === 'Mechanical'
          ? 'Mechanical'
          : subsystem === 'Actuation'
            ? 'Motor drive'
            : 'Logic',
    relatedTopics: ['Embedded Systems', 'Control Logic', 'Electronics'],
    modelObjectName: id,
    position,
    cameraTarget: position,
    size,
    visualSize: size,
    geometry: 'chip',
    color: '#51606d',
    rotation: [0, 0, 0],
    displayRotation: [0, 0, 0],
    explodedPosition: [position[0] * 1.6, position[1] + 1, position[2]],
    clearancePosition: [position[0] * 1.25, position[1] + 0.9, position[2]],
    dimensionsMm: 'Illustrative kit geometry; 50 mm per scene unit',
    referenceModel: 'robot',
  };
}
const parts: AtlasPart[] = [
  component(
    'chassis',
    'Robot Chassis',
    'Mechanical',
    [0, 0, 0],
    [2.6, 0.12, 3.4],
    'The rigid platform holds the electronics and drive system.',
    'Mounting points keep the wheel axes aligned and the sensors close to the floor. A rear caster supplies the third support point.',
    ['left-motor', 'right-motor', 'uno', 'battery'],
    { Construction: 'Illustrative two-wheel chassis' },
  ),
  component(
    'uno',
    'Arduino Uno',
    'Processing',
    [0, 0.3, -0.35],
    [2.12, 0.42, 1.45],
    'The Uno reads the sensor states and runs the steering decision.',
    'Sensor readings become a control decision in the ATmega328P. The board sends logic commands to the shield; it does not power the motors through its I/O pins.',
    ['left-sensor', 'right-sensor', 'driver'],
    { Controller: 'ATmega328P', Logic: '5 V', Clock: '16 MHz' },
    'Left and right sensor states',
    'Direction and enable commands',
  ),
  component(
    'driver',
    'L293D Motor Driver Shield',
    'Control',
    [0, 0.65, -0.35],
    [1.7, 0.36, 1.35],
    'The shield switches motor power in response to Arduino commands.',
    'H-bridge outputs control motor direction. Motor current comes from the supply through the driver, rather than through Arduino I/O. Actual shield pin assignments and limits depend on its revision.',
    ['uno', 'battery', 'left-motor', 'right-motor'],
    { Device: 'L293D dual H-bridge ICs', Model: 'Illustrative shield layout' },
    'Logic commands and motor supply',
    'Motor drive power',
  ),
  component(
    'battery',
    'Battery Pack',
    'Power',
    [0, 0.4, 1.05],
    [1.6, 0.65, 0.8],
    'The pack supplies the robot power system.',
    'A regulated logic supply powers the Uno and sensors; the motor supply feeds the driver. Signal interfaces share a ground reference. This model does not prescribe a battery chemistry or shield jumper setting.',
    ['driver', 'uno'],
    { Supply: 'Illustrative low-voltage pack' },
    'Stored chemical energy',
    'DC power',
  ),
  ...([-1, 1] as const).flatMap((side) => {
    const prefix = side === -1 ? 'left' : 'right',
      label = side === -1 ? 'Left' : 'Right';
    return [
      component(
        `${prefix}-sensor`,
        `${label} IR Sensor`,
        'Sensing',
        [side * 0.48, -0.73, -1.68],
        [0.38, 0.24, 0.7],
        'An infrared emitter and receiver distinguish reflective floor from the dark line.',
        'A white surface usually reflects more emitted IR into the receiver. A black line reflects less. The comparator threshold converts this difference to a state; electrical HIGH/LOW polarity varies by sensor module.',
        ['uno'],
        {
          Principle: 'Reflected infrared',
          Output: 'Thresholded surface state',
        },
        'Reflected IR',
        'White / black observation',
      ),
      component(
        `${prefix}-motor`,
        `${label} DC Geared Motor`,
        'Actuation',
        [side * 1.02, -0.4, 0.35],
        [0.62, 0.5, 1.1],
        'The geared motor converts electrical power into wheel torque.',
        'A reduction gearbox trades speed for torque. Unequal left and right wheel speeds steer the robot using differential drive.',
        ['driver', `${prefix}-wheel`],
        { Type: 'DC motor with reduction gearbox' },
        'Motor drive power',
        'Shaft rotation',
      ),
      component(
        `${prefix}-wheel`,
        `${label} Wheel`,
        'Actuation',
        [side * 1.6, -0.4, 0.35],
        [0.42, 1.3, 1.3],
        'The wheel transfers motor torque to the floor.',
        'Equal forward wheel speeds move the robot straight. Stopping one wheel while driving the other turns toward the stopped side.',
        [`${prefix}-motor`],
        { Drive: 'Differential; no steering linkage' },
        'Shaft torque',
        'Ground motion',
      ),
    ];
  }),
  component(
    'caster',
    'Rear Support Caster',
    'Mechanical',
    [0, -0.6, 1.25],
    [0.5, 0.9, 0.5],
    'A free-rolling caster supports the rear of the chassis.',
    'The caster follows the two driven wheels without imposing a separate steering direction.',
    ['chassis'],
  ),
  component(
    'wiring',
    'Wiring & Connectors',
    'Control',
    [0, 0, 0],
    [2.4, 1.8, 3.8],
    'Wiring carries sensor information, control commands, and supply power.',
    'Signal Flow separates these conceptual paths. The drawn harness is illustrative rather than a pin-by-pin wiring guide.',
    ['uno', 'driver', 'battery', 'left-sensor', 'right-sensor'],
    { Detail: 'Major harness routes only' },
  ),
];
parts.find((p) => p.id === 'uno')!.relatedSystem = 'arduino';
parts.find((p) => p.id === 'chassis')!.visualSize = [2.6, 1.5, 3.4];
for (const p of parts) {
  p.displayRotation = p.id.endsWith('wheel')
    ? [0, Math.PI / 2, 0]
    : p.id.endsWith('motor') || p.id === 'caster'
      ? [0.35, 0.3, 0]
      : p.id.endsWith('sensor')
        ? [-Math.PI / 2, 0, 0]
        : [Math.PI / 2, 0, 0];
}
export const robotSystem: AtlasSystem = {
  id: 'robot',
  name: 'Line Follower Robot',
  category: 'Robotics',
  number: '05',
  description: 'Arduino Autonomous Mobile Robot',
  parts,
  camera: [6, 5.5, -8],
  overview:
    'Inspect an embedded robot from sensing and decisions to motor power and movement.',
  features: { xray: false, signal: true, pins: false },
  connections: robotLinks,
};
