export type Vec3 = [number, number, number];
export type SystemId = 'desktop' | 'motherboard' | 'arduino' | 'rectifier';
export type GeometryKind =
  | 'case'
  | 'board'
  | 'cpu'
  | 'cooler'
  | 'gpu'
  | 'ram'
  | 'psu'
  | 'ssd'
  | 'fans'
  | 'socket'
  | 'slot'
  | 'chip'
  | 'battery'
  | 'port'
  | 'capacitor'
  | 'diode'
  | 'source'
  | 'resistor'
  | 'pins'
  | 'button'
  | 'crystal'
  | 'led';
export interface AtlasPart {
  id: string;
  name: string;
  fullName: string;
  category: string;
  description: string;
  specifications: Record<string, string>;
  relatedComponents: string[];
  relatedTopics: string[];
  modelObjectName: string;
  position: Vec3;
  explodedPosition: Vec3;
  cameraTarget: Vec3;
  size: Vec3;
  /** Centered presentation envelope including attached markings and hardware. */
  visualSize?: Vec3;
  color: string;
  geometry: GeometryKind;
  lesson: string;
  rotation?: Vec3;
  detail?: SystemId;
  displayRotation?: Vec3;
  clearancePosition?: Vec3;
  dimensionsMm?: string;
  referenceModel?: 'crosshair' | 'uno' | 'custom-pc';
  assemblyRole?: 'cover' | 'base';
}
export interface AtlasSystem {
  id: SystemId;
  name: string;
  category: string;
  number: string;
  description: string;
  parts: AtlasPart[];
  camera: Vec3;
  overview: string;
  features: { xray: boolean; signal: boolean; pins: boolean };
  connections: {
    from: string;
    to: string;
    kind: 'data' | 'power' | 'signal';
  }[];
  modelAsset?: string;
}
