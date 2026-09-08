import { MousePointer2, Layers, Scan, Tags, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAtlas } from '@/lib/atlas/store';
import { moduleInteraction } from '@/lib/atlas/interaction';
export function AtlasToolbar() {
  const state = useAtlas();
  const capabilities = moduleInteraction[state.systemId];
  const mode = state.xray ? 'xray' : state.exploded > 0 ? 'explode' : 'explore';
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
          className={mode === 'explore' ? 'active' : ''}
          aria-pressed={mode === 'explore'}
          onClick={() => {
            state.select(null);
            state.setExploded(0);
          }}
        >
          <MousePointer2 size={16} />
          <span>Explore</span>
        </Button>
        {capabilities.modes.includes('explode') && (
          <Button
            variant="ghost"
            className={mode === 'explode' ? 'active' : ''}
            aria-pressed={mode === 'explode'}
            onClick={() => state.setExploded(state.exploded ? 0 : 1)}
          >
            <Layers size={16} />
            <span>Explode</span>
          </Button>
        )}
        {capabilities.modes.includes('xray') && (
          <Button
            variant="ghost"
            className={state.xray ? 'active' : ''}
            aria-pressed={state.xray}
            onClick={state.toggleXray}
          >
            <Scan size={16} />
            <span>X-Ray</span>
          </Button>
        )}
        <span className="toolbar-divider" />
        <Button
          variant="ghost"
          className={state.labels ? 'active' : ''}
          aria-pressed={state.labels}
          onClick={state.toggleLabels}
          title="Show key component labels; hover or select any other part"
        >
          <Tags size={16} />
          <span>Labels</span>
        </Button>
        <Button
          variant="ghost"
          onClick={state.reset}
          title="Reset workspace (R)"
        >
          <RotateCcw size={16} />
          <span>Reset</span>
        </Button>
      </div>
    </div>
  );
}
