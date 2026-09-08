'use client';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  RotateCcw,
  Menu,
  Maximize,
  Minimize,
  HelpCircle,
  X,
  MousePointer2,
  Move,
  Command,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAtlas } from '@/lib/atlas/store';
import { isSystemId, systems } from '@/lib/atlas/systems';
import type { SystemId } from '@/lib/atlas/types';
import { AtlasSidebar } from './AtlasSidebar';
import { InspectorPanel } from './InspectorPanel';
import { AtlasToolbar } from './AtlasToolbar';
const AtlasScene = lazy(() => import('@/components/three/AtlasScene'));
export default function AtlasWorkspace() {
  const state = useAtlas();
  const system = systems[state.systemId];
  const [navOpen, setNavOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [notice, setNotice] = useState('');
  const help = useRef<HTMLDialogElement>(null);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const sync = () => {
      const value = new URLSearchParams(window.location.search).get('system');
      useAtlas.getState().setSystem(isSystemId(value) ? value : 'desktop');
    };
    sync();
    window.addEventListener('popstate', sync);
    const full = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', full);
    const keys = (e: KeyboardEvent) => {
      if (
        (e.target as HTMLElement).closest('input,textarea,select,dialog') ||
        e.ctrlKey ||
        e.metaKey ||
        e.altKey
      )
        return;
      if (e.key === 'Escape') {
        const current = useAtlas.getState();
        if (current.selectedId) current.select(null);
        else current.reset();
        setNavOpen(false);
      }
      if (e.key.toLowerCase() === 'r') useAtlas.getState().reset();
    };
    window.addEventListener('keydown', keys);
    return () => {
      window.removeEventListener('popstate', sync);
      window.removeEventListener('keydown', keys);
      document.removeEventListener('fullscreenchange', full);
    };
  }, []);
  const changeSystem = (id: SystemId) => {
    state.setSystem(id);
    window.history.pushState({}, '', `/atlas?system=${id}`);
  };
  const toggleFull = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (root.current?.requestFullscreen)
        await root.current.requestFullscreen();
      else setNotice('Fullscreen is unavailable in this browser.');
    } catch {
      setNotice('Fullscreen is unavailable in this browser.');
    }
  };
  return (
    <div
      className={`atlas-app ${state.exploded > 0 ? 'catalog-view' : ''}`}
      ref={root}
    >
      <AtlasSidebar
        open={navOpen}
        onClose={() => setNavOpen(false)}
        onSystem={changeSystem}
      />
      <div className="atlas-main">
        <header className="atlas-header">
          <div className="breadcrumbs">
            <Button
              className="mobile-menu"
              variant="ghost"
              size="icon"
              onClick={() => setNavOpen(true)}
              aria-label="Open system navigation"
            >
              <Menu size={18} />
            </Button>
            <Link href="/">Atlas</Link>
            <ChevronRight size={12} />
            <span>{system.category}</span>
            <ChevronRight size={12} />
            <strong>{system.name}</strong>
          </div>
          <div className="header-meta">
            <span className="live-indicator">
              <span className="status-dot" /> INTERACTIVE 3D
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => help.current?.showModal()}
              aria-label="Open controls guide"
            >
              <HelpCircle size={17} />
            </Button>
          </div>
        </header>
        <div className="atlas-content">
          <main
            className="viewport"
            aria-label={`${system.name} interactive 3D viewer`}
          >
            <div className="viewport-title">
              <div className="eyebrow">
                SYSTEM {system.number} <span>/</span> {system.category}
              </div>
              <h1>{system.name}</h1>
              <p>{system.description}</p>
            </div>
            <div className="scene-container">
              <Suspense
                fallback={
                  <output className="scene-loading">
                    Preparing your workspace...
                  </output>
                }
              >
                <AtlasScene />
              </Suspense>
            </div>
            <div className="viewport-controls">
              <Button
                variant="outline"
                size="icon"
                onClick={state.reset}
                title="Reset view (R)"
                aria-label="Reset view"
              >
                <RotateCcw size={16} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleFull}
                aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                title="Fullscreen"
              >
                {fullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
              </Button>
            </div>
            {state.isolated && (
              <Button
                variant="outline"
                className="isolate-notice"
                onClick={state.toggleIsolate}
              >
                Isolated view <X size={12} />
              </Button>
            )}
            <AtlasToolbar />
            <div className="viewport-foot">
              <span>
                <MousePointer2 size={11} /> Drag to orbit <i /> Scroll to zoom
              </span>
              <span>
                {state.isolated
                  ? 'ISOLATED'
                  : state.exploded > 0
                    ? 'EXPLODED'
                    : state.xray
                      ? 'X-RAY'
                      : 'EXPLORE'}{' '}
                <span className="status-dot" />
              </span>
            </div>
          </main>
          <InspectorPanel />
        </div>
        <div className="atlas-status">
          <span>
            CpE ATLAS <i /> LEARN BY LOOKING CLOSER
          </span>
          <span>
            {system.parts.length} COMPONENTS <i /> CONCEPT MODEL
          </span>
        </div>
      </div>
      {notice && (
        <output className="notice">
          {notice}
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={() => setNotice('')}
            aria-label="Dismiss message"
          >
            <X size={13} />
          </Button>
        </output>
      )}
      <dialog ref={help} className="help-dialog">
        <div className="help-heading">
          <span className="eyebrow">YOUR WORKSPACE</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => help.current?.close()}
            aria-label="Close controls guide"
          >
            <X size={18} />
          </Button>
        </div>
        <h2>A little orientation.</h2>
        <p>Explore with a mouse, touch, or the component list.</p>
        <div className="help-row">
          <Move size={18} />
          <span>Rotate the model</span>
          <b>Drag</b>
        </div>
        <div className="help-row">
          <Maximize size={18} />
          <span>Zoom in and out</span>
          <b>Scroll / pinch</b>
        </div>
        <div className="help-row">
          <MousePointer2 size={18} />
          <span>Inspect a component</span>
          <b>Click / tap</b>
        </div>
        <div className="help-row">
          <Command size={18} />
          <span>Navigate controls</span>
          <b>Tab + Enter</b>
        </div>
        <div className="help-row">
          <RotateCcw size={18} />
          <span>Reset the workspace</span>
          <b>R</b>
        </div>
        <div className="help-row">
          <X size={18} />
          <span>Clear selection</span>
          <b>Esc</b>
        </div>
        <Button className="help-done" onClick={() => help.current?.close()}>
          Got it. Let’s explore.
        </Button>
      </dialog>
    </div>
  );
}
