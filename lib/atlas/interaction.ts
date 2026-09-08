import type { AtlasPart, SystemId, Vec3 } from './types';
import { rotatedSize } from './explosion';

export type AtlasMode =
  | 'explore'
  | 'explode'
  | 'xray'
  | 'connections'
  | 'pins'
  | 'signal';
// Future teaching modes are declared here, but cannot be activated by the UI.
export const moduleInteraction: Record<
  SystemId,
  {
    modes: AtlasMode[];
    planned: AtlasMode[];
    labels: string[];
    purpose: string;
  }
> = {
  desktop: {
    modes: ['explore', 'explode', 'xray'],
    planned: [],
    labels: ['cpu', 'gpu', 'ram', 'psu'],
    purpose:
      'Inspect how the hardware fits together. Explode the assembly or reveal the interior with X-Ray.',
  },
  motherboard: {
    modes: ['explore', 'explode'],
    planned: ['connections'],
    labels: ['socket', 'dimm', 'pcie', 'atx-power'],
    purpose:
      'Map the board through its sockets, power stages, storage interfaces, and headers.',
  },
  arduino: {
    modes: ['explore', 'explode'],
    planned: ['pins'],
    labels: ['atmega', 'digital', 'analog', 'power'],
    purpose:
      'Explore the microcontroller, interfaces, and pin-header groups. Select a part to understand its role.',
  },
  rectifier: {
    modes: ['explore', 'explode'],
    planned: ['signal'],
    labels: ['ac', 'd1', 'capacitor', 'load'],
    purpose:
      'Follow the bridge layout from the AC input through the diodes to the output filter and load.',
  },
};
export const pinGroups = [
  'Digital',
  'Analog',
  'PWM',
  'Power',
  'Communication',
] as const;
export const signalPhases = [
  'positive-half-cycle',
  'negative-half-cycle',
] as const;

export function selectionDistance(
  part: AtlasPart,
  aspect: number,
  assemblyDistance: number,
  displaySize?: Vec3,
) {
  const size =
    displaySize ??
    rotatedSize(part.visualSize ?? part.size, part.rotation ?? [0, 0, 0]);
  const fit =
    Math.max(size[1], size[0] / Math.max(0.3, aspect)) /
      (2 * Math.tan((38 * Math.PI) / 360)) +
    size[2];
  return Math.max(fit * 1.35, assemblyDistance * 0.24, 1.2);
}
