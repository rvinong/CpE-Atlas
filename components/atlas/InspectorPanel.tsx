import { desktopWires } from '@/lib/atlas/desktop-wires';
import { useState } from 'react';
import Link from 'next/link';
import { lineBehavior } from '@/lib/atlas/robot';
import {
  ArrowUpRight,
  Crosshair,
  X,
  Box,
  ArrowRight,
  Move,
  Layers,
  Link2,
  ChevronUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAtlas } from '@/lib/atlas/store';
import { systems } from '@/lib/atlas/systems';
import { moduleInteraction } from '@/lib/atlas/interaction';

export function InspectorPanel() {
  const state = useAtlas();
  const system = systems[state.systemId];
  const part = system.parts.find((p) => p.id === state.selectedId);
  const [expanded, setExpanded] = useState(false);
  return (
    <aside
      className={`inspector ${part ? 'has-selection' : ''} ${expanded ? 'expanded' : ''}`}
      aria-label="Component inspector"
    >
      <div className="inspector-heading">
        <span>INSPECTOR</span>
        <span>{part ? 'COMPONENT' : 'SYSTEM OVERVIEW'}</span>
        <Button
          className="sheet-toggle"
          variant="ghost"
          size="icon-sm"
          aria-label={expanded ? 'Collapse inspector' : 'Expand inspector'}
          aria-expanded={expanded}
          onClick={() => setExpanded(!expanded)}
        >
          <ChevronUp size={15} />
        </Button>
      </div>
      <div className="inspector-scroll" key={part?.id ?? system.id}>
        {system.id === 'robot' && state.teachingMode === 'line' && (
          <section
            className="inspector-section robot-decision"
            aria-live="polite"
          >
            <h3>ARDUINO DECISION / {lineBehavior[state.lineState].label}</h3>
            <p className="role-description">
              {lineBehavior[state.lineState].decision}
            </p>
            <small>
              Illustrative surface-state mapping; not an electrical HIGH/LOW pin
              map.
            </small>
          </section>
        )}
        {system.id === 'desktop' && state.wires && (
          <section className="inspector-section">
            <h3>POWER CABLES</h3>
            <p className="role-description">
              Illustrative cable routes. Select an endpoint to highlight its
              connections.{' '}
              {state.exploded > 0
                ? 'Cables are disconnected in exploded view.'
                : 'Use X-Ray to see routes behind the board.'}
            </p>
            {desktopWires
              .filter(
                (wire) => !part || wire.from === part.id || wire.to === part.id,
              )
              .map((wire) => (
                <div key={wire.id}>
                  <Button variant="ghost" onClick={() => state.select(wire.to)}>
                    {wire.name}
                  </Button>
                  <p className="role-description">{wire.description}</p>
                </div>
              ))}
            <p className="role-description">
              RAM and the M.2 SSD connect directly to the motherboard; they do
              not need separate PSU cables. The existing AIO tubes carry
              coolant, not electricity. Fan, pump, lighting and front-panel
              wiring are not shown yet.
            </p>
          </section>
        )}
        {part ? (
          <>
            <div className="inspector-meta">
              <span className="eyebrow">
                {part.subsystem
                  ? `ROBOTICS / ${part.subsystem}`
                  : part.category}
              </span>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => state.select(null)}
                aria-label="Clear selection"
              >
                <X size={15} />
              </Button>
            </div>
            <Button
              variant="ghost"
              className="return-system"
              onClick={() => state.select(null)}
            >
              Back to system <span>Esc</span>
            </Button>
            <h2>{part.name}</h2>
            {part.fullName !== part.name && (
              <p className="full-name">{part.fullName}</p>
            )}
            <span className="selected-badge">
              <span className="status-dot" /> COMPONENT SELECTED
            </span>
            <p className="inspector-description">{part.description}</p>
            <Button
              className="isolate-button"
              variant={state.isolated ? 'default' : 'outline'}
              onClick={state.toggleIsolate}
              aria-pressed={state.isolated}
            >
              <Crosshair size={15} />
              {state.isolated ? 'Show complete system' : 'Isolate component'}
              <ArrowUpRight size={14} />
            </Button>
            <section className="inspector-section">
              <h3>SPECIFICATIONS</h3>
              <dl>
                {Object.entries(part.specifications).map(([key, value]) => (
                  <div key={key}>
                    <dt>{key}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </section>
            <section className="inspector-section">
              <h3>{part.subsystem ? 'ROLE IN ROBOT' : 'ROLE IN SYSTEM'}</h3>
              <p className="role-description">{part.lesson}</p>
            </section>
            {part.inputs && (
              <section className="inspector-section">
                <h3>INPUTS / OUTPUTS</h3>
                <dl>
                  <div>
                    <dt>Input</dt>
                    <dd>{part.inputs}</dd>
                  </div>
                  <div>
                    <dt>Output</dt>
                    <dd>{part.outputs}</dd>
                  </div>
                </dl>
              </section>
            )}
            {part.relatedSystem && (
              <Link
                className="robot-system-link"
                href={`/atlas?system=${part.relatedSystem}`}
                onClick={() => state.setSystem(part.relatedSystem!)}
              >
                Explore Arduino Uno <ArrowUpRight size={14} />
              </Link>
            )}
            {part.subsystem === 'Sensing' && (
              <section className="inspector-section">
                <h3>REFLECTED INFRARED</h3>
                <p className="role-description">
                  White surface: more reflection returns to the receiver.
                  <br />
                  Black line: less reflection returns. Adjusting the threshold
                  changes what counts as black.
                </p>
              </section>
            )}
            <section className="inspector-section">
              <h3>
                <Link2 size={12} />
                RELATED COMPONENTS
              </h3>
              <div className="related-list">
                {part.relatedComponents.map((id) => {
                  const related = system.parts.find((p) => p.id === id);
                  return related ? (
                    <button key={id} onClick={() => state.select(id)}>
                      {related.name}
                      <ArrowUpRight size={12} />
                    </button>
                  ) : null;
                })}
              </div>
            </section>
            <section className="inspector-section">
              <h3>RELATED CpE TOPICS</h3>
              <div className="topic-tags">
                {part.relatedTopics.map((topic) => (
                  <span key={topic}>{topic}</span>
                ))}
              </div>
            </section>
          </>
        ) : (
          <>
            <div className="overview-icon">
              <Box size={27} strokeWidth={1} />
              <span>FIG. {system.number}</span>
            </div>
            <span className="eyebrow">{system.category}</span>
            <h2>{system.name}</h2>
            <p className="inspector-description">
              {moduleInteraction[system.id].purpose}
            </p>
            <section className="inspector-section getting-started">
              <h3>A CLOSER LOOK</h3>
              <div>
                <Move size={16} />
                <p>
                  <strong>Make it your perspective</strong>Drag to orbit. Scroll
                  or pinch to zoom.
                </p>
              </div>
              <div>
                <Crosshair size={16} />
                <p>
                  <strong>Pick something interesting</strong>Select a part on
                  the model or in the list.
                </p>
              </div>
              <div>
                <Layers size={16} />
                <p>
                  <strong>See the whole assembly</strong>Use Explode to reveal
                  the layers inside.
                </p>
              </div>
            </section>
            <Button
              className="start-exploring"
              variant="outline"
              onClick={() =>
                state.select(
                  system.parts.find(
                    (p) =>
                      p.id === 'gpu' ||
                      p.id === 'socket' ||
                      p.id === 'atmega' ||
                      p.id === 'd1',
                  )?.id ?? system.parts[0].id,
                )
              }
            >
              Inspect a component <ArrowRight size={15} />
            </Button>
            {state.learn && (
              <section className="lesson-content">
                <span className="eyebrow">FIELD NOTES</span>
                <p>
                  Select any component to open its explanation, specifications,
                  and related parts.
                </p>
              </section>
            )}
          </>
        )}
        <p className="model-disclaimer">
          SIMPLIFIED EDUCATIONAL MODEL
          <br />
          <span>
            Consistent component scale ·{' '}
            {system.id === 'rectifier'
              ? 'example hardware'
              : 'reference-based geometry'}
          </span>
        </p>
      </div>
    </aside>
  );
}
