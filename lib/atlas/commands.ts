import { moduleInteraction } from './interaction';
import { useAtlas } from './store';
import { connectionsFor, connections } from './connections';
export function atlasCommands(s = useAtlas.getState()) {
  const modes = moduleInteraction[s.systemId].modes;
  return [
    { id: 'reset-camera', name: 'Reset Camera', key: 'r', run: s.resetCamera },
    { id: 'reset', name: 'Reset Workspace', key: '', run: s.reset },
    {
      id: 'labels',
      name: 'Cycle Labels: Off / Key / All',
      key: 'l',
      run: s.toggleLabels,
    },
    ...(s.selectedId
      ? [
          {
            id: 'focus',
            name: 'Focus Selected Component',
            key: 'f',
            run: s.focus,
          },
        ]
      : []),
    ...(modes.includes('explode')
      ? [
          {
            id: 'explode',
            name: 'Toggle Explode',
            key: 'e',
            run: () => s.setExploded(s.exploded ? 0 : 1),
          },
        ]
      : []),
    ...(modes.includes('xray')
      ? [{ id: 'xray', name: 'Toggle X-Ray', key: 'x', run: s.toggleXray }]
      : []),
    ...((
      s.selectedId
        ? connectionsFor(s.systemId, s.selectedId).length
        : connections[s.systemId].length
    )
      ? [
          {
            id: 'connections',
            name: 'Show / Hide Connections',
            key: 'c',
            run: s.toggleConnections,
          },
        ]
      : []),
  ];
}
export function isTypingTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    !!target.closest(
      'input,textarea,select,[contenteditable]:not([contenteditable="false"]),[role="textbox"]',
    )
  );
}
