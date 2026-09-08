import { create } from 'zustand';
import type { SystemId } from './types';
import { moduleInteraction } from './interaction';
interface AtlasState {
  systemId: SystemId;
  selectedId: string | null;
  exploded: number;
  xray: boolean;
  isolated: boolean;
  labels: boolean;
  resetKey: number;
  learn: boolean;
  setSystem: (id: SystemId) => void;
  select: (id: string | null) => void;
  setExploded: (value: number) => void;
  toggleXray: () => void;
  toggleIsolate: () => void;
  toggleLabels: () => void;
  toggleLearn: () => void;
  reset: () => void;
}
export const useAtlas = create<AtlasState>((set) => ({
  systemId: 'desktop',
  selectedId: null,
  exploded: 0,
  xray: false,
  isolated: false,
  labels: false,
  resetKey: 0,
  learn: false,
  setSystem: (systemId) =>
    set((s) => ({
      systemId,
      selectedId: null,
      exploded: 0,
      xray: false,
      isolated: false,
      learn: false,
      labels: false,
      resetKey: s.resetKey + 1,
    })),
  select: (selectedId) => set({ selectedId, isolated: false, learn: false }),
  setExploded: (exploded) =>
    set({
      exploded: Number.isFinite(exploded)
        ? Math.max(0, Math.min(1, exploded))
        : 0,
      xray: false,
      selectedId: null,
      isolated: false,
    }),
  toggleXray: () =>
    set((s) =>
      moduleInteraction[s.systemId].modes.includes('xray')
        ? { xray: !s.xray, exploded: 0, isolated: false }
        : {},
    ),
  toggleIsolate: () =>
    set((s) => ({ isolated: !!s.selectedId && !s.isolated })),
  toggleLabels: () => set((s) => ({ labels: !s.labels })),
  toggleLearn: () => set((s) => ({ learn: !s.learn })),
  reset: () =>
    set((s) => ({
      selectedId: null,
      exploded: 0,
      xray: false,
      isolated: false,
      learn: false,
      labels: false,
      resetKey: s.resetKey + 1,
    })),
}));
