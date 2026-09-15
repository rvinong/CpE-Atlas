/* eslint-disable jsx-a11y/prefer-tag-over-role -- Rich ARIA combobox options include result type and system context. */
import { useRef, useState, type RefObject } from 'react';
import { atlasCommands } from '@/lib/atlas/commands';
import { normalize, searchAtlas, type SearchResult } from '@/lib/atlas/search';
import { useAtlas } from '@/lib/atlas/store';
import type { SystemId } from '@/lib/atlas/types';
export function CommandPalette({
  dialog,
  navigate,
}: {
  dialog: RefObject<HTMLDialogElement | null>;
  navigate: (id: SystemId, part?: string, lesson?: string) => void;
}) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const list = useRef<HTMLDivElement>(null);
  const state = useAtlas();
  const commands = atlasCommands(state);
  const results = searchAtlas(
    query,
    commands.map((c) => ({
      id: c.id,
      name: c.name,
      kind: 'Action',
      detail: 'Current system',
      text: normalize(c.name),
    })),
  );
  const choose = (result: SearchResult) => {
    dialog.current?.close();
    if (result.kind === 'Action')
      commands.find((c) => c.id === result.id)?.run();
    else if (result.system)
      navigate(result.system, result.component, result.lesson);
  };
  return (
    <dialog
      ref={dialog}
      className="atlas-search-dialog"
      aria-label="Search CpE Atlas"
      onClose={() => {
        setQuery('');
        setActive(0);
      }}
    >
      <div className="search-heading">
        <label htmlFor="atlas-global-search">Search CpE Atlas</label>
        <button
          onClick={() => dialog.current?.close()}
          aria-label="Close search"
        >
          Esc
        </button>
      </div>
      <input
        id="atlas-global-search"
        autoFocus
        placeholder="Systems, components, actions, lessons..."
        value={query}
        role="combobox"
        aria-expanded="true"
        aria-controls="atlas-results"
        aria-autocomplete="list"
        aria-activedescendant={results[active] ? `result-${active}` : undefined}
        onChange={(e) => {
          setQuery(e.target.value);
          setActive(0);
          list.current?.scrollTo(0, 0);
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            const next = Math.max(
              0,
              Math.min(
                results.length - 1,
                active + (e.key === 'ArrowDown' ? 1 : -1),
              ),
            );
            setActive(next);
            document
              .getElementById(`result-${next}`)
              ?.scrollIntoView({ block: 'nearest' });
          }
          if (e.key === 'Enter' && results[active]) {
            e.preventDefault();
            choose(results[active]);
          }
        }}
      />
      <div
        id="atlas-results"
        role="listbox"
        aria-label="Search results"
        className="search-results"
        ref={list}
      >
        {results.map((result, index) => (
          <div
            tabIndex={-1}
            onKeyDown={(e) => {
              if (e.key === 'Enter') choose(result);
            }}
            role="option"
            aria-selected={active === index}
            id={`result-${index}`}
            key={result.id}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => choose(result)}
          >
            <strong>{result.name}</strong>
            <small>
              {result.kind} / {result.detail}
            </small>
          </div>
        ))}
        {!results.length && (
          <output>No matches. Try a component name or topic.</output>
        )}
      </div>
      <small className="search-hint">
        Arrow keys to navigate / Enter to open / Esc to close
      </small>
    </dialog>
  );
}
