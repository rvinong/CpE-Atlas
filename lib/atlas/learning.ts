import type { SystemId } from './types';
export interface LessonStep {
  title: string;
  description: string;
  componentId: string | null;
  connections?: boolean;
  action?: 'line' | 'signal';
}
export interface AtlasLesson {
  id: string;
  title: string;
  description: string;
  system: SystemId;
  steps: LessonStep[];
}
export const lessons: AtlasLesson[] = [
  {
    id: 'desktop-basics',
    system: 'desktop',
    title: 'How a Desktop Computer Works',
    description:
      'Follow power, processing, memory and graphics through the computer.',
    steps: [
      {
        title: 'Power Supply',
        componentId: 'psu',
        connections: true,
        description:
          'The PSU converts incoming electrical power into DC supplies for the computer. Follow its connections to the board and graphics card.',
      },
      {
        title: 'Motherboard',
        componentId: 'motherboard',
        connections: true,
        description:
          'The motherboard provides connectors, power distribution and communication paths. Physical connectors and logical data relationships are different views of the same system.',
      },
      {
        title: 'CPU',
        componentId: 'cpu',
        connections: true,
        description:
          'The processor executes instructions. It works with memory and peripherals rather than operating alone. These lines show logical relationships, not external CPU cables.',
      },
      {
        title: 'RAM',
        componentId: 'ram',
        connections: true,
        description:
          'RAM holds the instructions and data currently in use. Its contents are volatile: they do not remain when power is removed.',
      },
      {
        title: 'Storage',
        componentId: 'ssd',
        connections: true,
        description:
          'The NVMe SSD retains programs and files without power. Its M.2 connection carries data and power through the motherboard.',
      },
      {
        title: 'GPU',
        componentId: 'gpu',
        connections: true,
        description:
          'The graphics processor handles parallel graphics work. Data reaches it through PCIe; auxiliary PSU power arrives through a separate cable.',
      },
      {
        title: 'Working Together',
        componentId: null,
        description:
          'Power enables the system, storage retains information, RAM holds active data, and CPU and GPU process it. Select any component after the lesson to trace its relationships.',
      },
    ],
  },
  {
    id: 'robot-basics',
    system: 'robot',
    title: 'How a Line Follower Robot Works',
    description: 'Trace sensing, decisions and motor-driven movement.',
    steps: [
      {
        title: 'Sense the Surface',
        componentId: 'left-sensor',
        connections: true,
        description:
          'The infrared sensors detect differences in reflected light. Their observations are inputs to the controller, not direct motor commands.',
      },
      {
        title: 'Read the Inputs',
        componentId: 'uno',
        connections: true,
        description:
          'The Arduino reads the two sensors. The program interprets their observations and decides how each wheel should move.',
      },
      {
        title: 'Make a Decision',
        componentId: 'uno',
        action: 'line',
        description:
          'Try Forward, Left, Right and Stop in Line Mode. This example maps four surface observations to wheel commands; it is an illustrative control algorithm.',
      },
      {
        title: 'Drive the Motors',
        componentId: 'driver',
        connections: true,
        description:
          'The L293D driver receives control from the Arduino and supplies motor current from the power source. Arduino I/O does not directly power the motors.',
      },
      {
        title: 'Turn Electrical Power into Motion',
        componentId: 'left-motor',
        connections: true,
        description:
          'Each geared motor turns a driven wheel. The two sides can receive different commands to change the direction of travel.',
      },
      {
        title: 'Close the Loop',
        componentId: null,
        action: 'signal',
        description:
          'Sensor observations lead to controller decisions and motor action. Movement changes what the sensors observe next. The diagram explains this loop without simulating robot physics.',
      },
    ],
  },
];
