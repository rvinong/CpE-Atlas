import Link from 'next/link';
import { useState } from 'react';
import {
  Box,
  Search,
  ChevronRight,
  Cpu,
  CircuitBoard,
  Cable,
  Compass,
  Network,
  Bot,
  Binary,
  Layers,
  Check,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { systems, systemList } from '@/lib/atlas/systems';
import { useAtlas } from '@/lib/atlas/store';
import type { SystemId } from '@/lib/atlas/types';

const icons = {
  desktop: Box,
  motherboard: CircuitBoard,
  arduino: Cpu,
  rectifier: Cable,
};
export function AtlasSidebar({
  open,
  onClose,
  onSystem,
}: {
  open: boolean;
  onClose: () => void;
  onSystem: (id: SystemId) => void;
}) {
  const state = useAtlas();
  const system = systems[state.systemId];
  const [query, setQuery] = useState('');
  const parts = system.parts.filter((p) =>
    `${p.name} ${p.fullName}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <button
        className={`sidebar-scrim ${open ? 'show' : ''}`}
        onClick={onClose}
        aria-label="Close navigation"
        tabIndex={open ? 0 : -1}
      />
      <aside
        className={`atlas-sidebar ${open ? 'open' : ''}`}
        aria-label="Atlas navigation"
      >
        <div className="sidebar-brand">
          <Link className="brand" href="/">
            <Box size={26} />
            <span>
              CpE <b>ATLAS</b>
              <small>INTERACTIVE ENGINEERING</small>
            </span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="mobile-close"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <X size={17} />
          </Button>
        </div>
        <div className="sidebar-scroll">
          <div className="sidebar-section-title">
            THE ATLAS <span>V.01</span>
          </div>
          <Link href="/#systems" className="nav-item">
            <Compass size={16} />
            <span>Explore the systems</span>
            <ChevronRight size={13} />
          </Link>
          <nav className="category-nav" aria-label="System categories">
            {systemList.map((s) => {
              const Icon = icons[s.id];
              return (
                <button
                  key={s.id}
                  className={`nav-item ${s.id === state.systemId ? 'active' : ''}`}
                  aria-current={s.id === state.systemId ? 'page' : undefined}
                  onClick={() => {
                    setQuery('');
                    onSystem(s.id);
                    onClose();
                  }}
                >
                  <Icon size={16} />
                  <span>{s.category}</span>
                  {s.id === state.systemId && (
                    <span className="nav-active-dot" />
                  )}
                </button>
              );
            })}
            {[
              { label: 'Digital Systems', icon: Binary },
              { label: 'Networking', icon: Network },
              { label: 'Embedded Systems', icon: Layers },
              { label: 'Robotics', icon: Bot },
            ].map(({ label, icon: Icon }) => (
              <button
                disabled
                className="nav-item upcoming-nav"
                key={label}
                title={`${label} — coming soon`}
              >
                <Icon size={16} />
                <span>{label}</span>
                <span className="soon">SOON</span>
              </button>
            ))}
          </nav>
          <div className="components-section">
            <div className="sidebar-section-title">
              COMPONENTS{' '}
              <span>{String(system.parts.length).padStart(2, '0')}</span>
            </div>
            <label className="component-search">
              <Search size={13} />
              <input
                placeholder="Find a component…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Find a component"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  aria-label="Clear component search"
                >
                  <X size={12} />
                </button>
              )}
            </label>
            <div className="parts-list">
              {parts.map((p) => (
                <button
                  key={p.id}
                  className={`part-row ${state.selectedId === p.id ? 'selected' : ''}`}
                  aria-pressed={state.selectedId === p.id}
                  onClick={() => {
                    state.select(state.selectedId === p.id ? null : p.id);
                    onClose();
                  }}
                >
                  <span className="part-number">
                    {String(system.parts.indexOf(p) + 1).padStart(2, '0')}
                  </span>
                  <span>{p.name}</span>
                  {state.selectedId === p.id ? (
                    <Check size={12} />
                  ) : (
                    <ChevronRight size={11} />
                  )}
                </button>
              ))}
              {!parts.length && (
                <p className="search-empty">No components match “{query}”.</p>
              )}
            </div>
          </div>
        </div>
        <div className="sidebar-foot">
          <span className="status-dot" />
          <span>Made for curious minds.</span>
          <span>↗</span>
        </div>
      </aside>
    </>
  );
}
