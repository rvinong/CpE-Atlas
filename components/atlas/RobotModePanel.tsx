import { useAtlas } from '@/lib/atlas/store';
import { lineBehavior, type LineState } from '@/lib/atlas/robot';
import { Button } from '@/components/ui/button';
export function RobotModePanel() {
  const mode = useAtlas((s) => s.teachingMode),
    state = useAtlas((s) => s.lineState),
    setState = useAtlas((s) => s.setLineState);
  if (!mode) return null;
  const behavior = lineBehavior[state];
  return (
    <section
      className="robot-mode-panel"
      aria-label={
        mode === 'line' ? 'Line following demonstration' : 'Signal flow guide'
      }
    >
      {mode === 'line' ? (
        <>
          <fieldset
            className="line-state-selector"
            aria-label="Robot movement state"
          >
            {Object.entries(lineBehavior).map(([key, value]) => (
              <Button
                key={key}
                variant="ghost"
                aria-pressed={key === state}
                className={key === state ? 'active' : ''}
                onClick={() => setState(key as LineState)}
              >
                {value.label}
              </Button>
            ))}
          </fieldset>
          <div className="robot-state-summary" aria-live="polite">
            <span>
              L sensor: <b>{behavior.sensors[0]}</b>
            </span>
            <span>
              R sensor: <b>{behavior.sensors[1]}</b>
            </span>
            <span>
              L motor: <b>{behavior.motors[0] ? 'Forward' : 'Stop'}</b>
            </span>
            <span>
              R motor: <b>{behavior.motors[1] ? 'Forward' : 'Stop'}</b>
            </span>
          </div>
        </>
      ) : (
        <>
          <p>
            Sensors &rarr; Uno decision &rarr; Driver &rarr; Motors &rarr;
            Motion
          </p>
          <div className="flow-legend">
            <span className="signal-key">Data / control (dashed)</span>
            <span className="power-key">Motor power (solid)</span>
          </div>
        </>
      )}
    </section>
  );
}
