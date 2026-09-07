import {
  MousePointer2,
  Layers,
  Scan,
  Activity,
  Box,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAtlas } from '@/lib/atlas/store';
import { systems } from '@/lib/atlas/systems';
export function AtlasToolbar() {
  const state = useAtlas();
  const system = systems[state.systemId];
  return (
    <div className="toolbar-area">
      {state.exploded > 0 && (
        <div className="explode-slider">
          <div>
            <span>ASSEMBLY SEPARATION</span>
            <output>{Math.round(state.exploded * 100)}%</output>
          </div>
          <input
            aria-label="Assembly separation"
            type="range"
            min="0"
            max="100"
            value={Math.round(state.exploded * 100)}
            onChange={(e) => state.setExploded(Number(e.target.value) / 100)}
          />
          <div className="slider-captions">
            <span>Assembled</span>
            <span>Exploded</span>
          </div>
        </div>
      )}
      <div className="atlas-toolbar" role="toolbar" aria-label="View modes">
        <Button
          variant="ghost"
          className={
            !state.exploded && !state.xray && !state.learn ? 'active' : ''
          }
          onClick={() => {
            state.setExploded(0);
            if (state.xray) state.toggleXray();
            if (state.learn) state.toggleLearn();
          }}
          aria-pressed={!state.exploded && !state.xray && !state.learn}
        >
          <MousePointer2 size={18} />
          <span>Explore</span>
        </Button>
        <Button
          variant="ghost"
          className={state.exploded > 0 ? 'active' : ''}
          onClick={() => state.setExploded(state.exploded > 0 ? 0 : 1)}
          aria-pressed={state.exploded > 0}
        >
          <Layers size={18} />
          <span>Explode</span>
        </Button>
        <Button
          variant="ghost"
          className={state.xray ? 'active' : ''}
          disabled={!system.features.xray}
          title={
            !system.features.xray
              ? 'X-Ray applies to the desktop enclosure'
              : 'Reveal internal components'
          }
          onClick={state.toggleXray}
          aria-pressed={state.xray}
        >
          <Scan size={18} />
          <span>X-Ray</span>
        </Button>
        <Button
          variant="ghost"
          disabled
          title="Animated signal flow — coming soon"
          aria-label="Signal flow — coming soon"
        >
          <Activity size={18} />
          <span>
            Signal<small>SOON</small>
          </span>
        </Button>
        <span className="toolbar-divider" />
        <Button
          variant="ghost"
          onClick={state.reset}
          title="Restore the assembled system and default camera"
        >
          <Box size={18} />
          <span>Assembly</span>
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            if (!state.selectedId)
              state.select(
                system.parts.find(
                  (p) =>
                    p.id === 'gpu' ||
                    p.id === 'socket' ||
                    p.id === 'atmega' ||
                    p.id === 'd1',
                )?.id ?? system.parts[0].id,
              );
            state.toggleLearn();
          }}
          className={state.learn ? 'active' : ''}
          aria-pressed={state.learn}
        >
          <BookOpen size={18} />
          <span>Learn</span>
        </Button>
      </div>
    </div>
  );
}
