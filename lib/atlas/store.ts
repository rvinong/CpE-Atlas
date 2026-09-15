import { lessons } from './learning';
import { connections, connectionsFor } from './connections';
import { create } from 'zustand';
import type { SystemId } from './types';
import { moduleInteraction } from './interaction';
import type { LineState } from './robot';
interface AtlasState {
  connectionsVisible: boolean;
  lessonId: string | null;
  lessonStep: number;
  toggleConnections: () => void;
  focus: () => void;
  resetCamera: () => void;
  startLesson: (id: string) => void;
  stepLesson: (index: number) => void;
  exitLesson: () => void;
  systemId: SystemId;
  selectedId: string | null;
  exploded: number;
  xray: boolean;
  isolated: boolean;
  labels: false | 'key' | 'all';
  wires: boolean;
  toggleWires: () => void;
  resetKey: number;
  teachingMode: 'signal' | 'line' | null;
  lineState: LineState;
  setTeachingMode: (mode: 'signal' | 'line' | null) => void;
  setLineState: (state: LineState) => void;
  setSystem: (id: SystemId) => void;
  select: (id: string | null) => void;
  setExploded: (value: number) => void;
  toggleXray: () => void;
  toggleIsolate: () => void;
  toggleLabels: () => void;
  reset: () => void;
}
export const useAtlas = create<AtlasState>((set) => ({
  connectionsVisible: false,
  lessonId: null,
  lessonStep: 0,
  focus: () =>
    set((s) => ({ connectionsVisible: false, resetKey: s.resetKey + 1 })),
  resetCamera: () =>
    set((s) => ({
      selectedId: null,
      isolated: false,
      connectionsVisible: false,
      lessonId: null,
      resetKey: s.resetKey + 1,
    })),
  toggleConnections: () =>
    set((s) => {
      if (s.connectionsVisible)
        return { connectionsVisible: false, lessonId: null };
      const selectedId =
        s.selectedId ?? connections[s.systemId][0]?.from ?? null;
      if (!connectionsFor(s.systemId, selectedId).length) return {};
      return {
        connectionsVisible: !s.connectionsVisible,
        selectedId,
        isolated: false,
        exploded: 0,
        teachingMode: null,
        wires: false,
        lessonId: null,
      };
    }),
  startLesson: (id) => {
    const lesson = lessons.find((item) => item.id === id);
    if (!lesson) return;
    const step = lesson.steps[0];
    set((s) => ({
      systemId: lesson.system,
      lessonId: id,
      lessonStep: 0,
      lineState: 'forward',
      selectedId: step.componentId,
      connectionsVisible: !!step.connections,
      teachingMode: step.action ?? null,
      exploded: 0,
      isolated: false,
      xray: false,
      wires: false,
      labels: false,
      resetKey: s.resetKey + 1,
    }));
  },
  stepLesson: (index) =>
    set((s) => {
      const lesson = lessons.find((item) => item.id === s.lessonId);
      const step = lesson?.steps[index];
      if (!step) return {};
      return {
        lessonStep: index,
        selectedId: step.componentId,
        connectionsVisible: !!step.connections,
        teachingMode: step.action ?? null,
        isolated: false,
        exploded: 0,
        xray: false,
        wires: false,
        resetKey: s.resetKey + 1,
      };
    }),
  exitLesson: () =>
    set((s) => ({
      lessonId: null,
      selectedId: null,
      connectionsVisible: false,
      teachingMode: null,
      isolated: false,
      resetKey: s.resetKey + 1,
    })),
  systemId: 'desktop',
  selectedId: null,
  exploded: 0,
  xray: false,
  isolated: false,
  wires: false,
  labels: false,
  resetKey: 0,
  teachingMode: null,
  lineState: 'forward',
  setTeachingMode: (mode) =>
    set((s) =>
      s.systemId === 'robot'
        ? {
            lessonId: null,
            connectionsVisible: false,
            teachingMode: mode,
            exploded: 0,
            xray: false,
            isolated: false,
            selectedId: null,
          }
        : {},
    ),
  setLineState: (lineState) =>
    set((s) => (s.systemId === 'robot' ? { lineState } : {})),
  setSystem: (systemId) =>
    set((s) => ({
      systemId,
      lessonId: null,
      connectionsVisible: false,
      teachingMode: null,
      lineState: 'forward',
      selectedId: null,
      exploded: 0,
      xray: false,
      isolated: false,
      wires: false,
      labels: false,
      resetKey: s.resetKey + 1,
    })),
  select: (selectedId) =>
    set((s) => ({
      selectedId,
      isolated: false,
      lessonId: null,
      connectionsVisible:
        s.connectionsVisible && !!connectionsFor(s.systemId, selectedId).length,
      teachingMode: s.lessonId ? null : s.teachingMode,
    })),
  setExploded: (exploded) =>
    set({
      exploded: Number.isFinite(exploded)
        ? Math.max(0, Math.min(1, exploded))
        : 0,
      xray: false,
      selectedId: null,
      isolated: false,
      lessonId: null,
      connectionsVisible: false,
      teachingMode: null,
    }),
  toggleXray: () =>
    set((s) =>
      moduleInteraction[s.systemId].modes.includes('xray')
        ? { xray: !s.xray, exploded: 0, isolated: false, lessonId: null }
        : {},
    ),
  toggleIsolate: () =>
    set((s) => ({
      isolated: !!s.selectedId && !s.isolated,
      connectionsVisible: false,
      lessonId: null,
    })),
  toggleLabels: () =>
    set((s) => ({
      labels: !s.labels ? 'key' : s.labels === 'key' ? 'all' : false,
    })),
  toggleWires: () =>
    set((s) =>
      s.systemId === 'desktop'
        ? {
            wires: !s.wires,
            exploded: 0,
            isolated: false,
            connectionsVisible: false,
            lessonId: null,
          }
        : {},
    ),
  reset: () =>
    set((s) => ({
      lessonId: null,
      connectionsVisible: false,
      teachingMode: null,
      lineState: 'forward',
      selectedId: null,
      exploded: 0,
      xray: false,
      isolated: false,
      wires: false,
      labels: false,
      resetKey: s.resetKey + 1,
    })),
}));
