import { systems } from './systems';
import type { SystemId } from './types';
export type ConnectionKind =
  | 'data'
  | 'control'
  | 'power'
  | 'mechanical'
  | 'signal'
  | 'communication'
  | 'physical';
export interface AtlasConnection {
  id: string;
  from: string;
  to: string;
  kind: ConnectionKind;
  label: string;
}
const additions: Partial<Record<SystemId, Omit<AtlasConnection, 'id'>[]>> = {
  desktop: [
    {
      from: 'cpu',
      to: 'gpu',
      kind: 'data',
      label: 'PCIe communication through board',
    },
    {
      from: 'cpu',
      to: 'motherboard',
      kind: 'physical',
      label: 'Processor socket',
    },
    {
      from: 'psu',
      to: 'motherboard',
      kind: 'power',
      label: 'ATX and CPU power',
    },
    {
      from: 'motherboard',
      to: 'ssd',
      kind: 'data',
      label: 'M.2 / NVMe interface',
    },
    {
      from: 'cpu',
      to: 'cooler',
      kind: 'mechanical',
      label: 'Cold plate contact',
    },
  ],
  motherboard: [
    {
      from: 'socket',
      to: 'pcie',
      kind: 'data',
      label: 'CPU-connected PCIe paths',
    },
    { from: 'vrm', to: 'socket', kind: 'power', label: 'Regulated CPU supply' },
  ],
};
export const connections = Object.fromEntries(
  Object.values(systems).map((system) => [
    system.id,
    [
      ...system.connections.map((link) => ({
        ...link,
        label: link.label ?? `${link.kind} relationship`,
      })),
      ...(additions[system.id] ?? []),
    ].map((link) => ({
      ...link,
      id: `${system.id}-${link.from}-${link.to}-${link.kind}`,
    })),
  ]),
) as Record<SystemId, AtlasConnection[]>;
export function connectionsFor(system: SystemId, selected: string | null) {
  return selected
    ? connections[system].filter(
        (link) => link.from === selected || link.to === selected,
      )
    : [];
}
