import { useEffect, useState } from 'react';

// A tiny interactivity demo: React state works exactly as you'd expect inside
// the immediately.run sandbox. Module-local state, no special wiring.
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <section>
      <div className="sechead">
        <span className="slug">/state</span>
        <h2>It's just React</h2>
      </div>
      <div className="counter">
        <span className="n grad-text">{count}</span>
        <div className="ctrls">
          <button type="button" aria-label="Decrement" onClick={() => setCount((c) => c - 1)}>
            −
          </button>
          <button type="button" aria-label="Increment" onClick={() => setCount((c) => c + 1)}>
            +
          </button>
        </div>
        <p className="hint">
          useState, useEffect, fetch, localStorage — all available. Build your
          real UI the same way.
        </p>
      </div>
    </section>
  );
}

export default Counter;

// R3-648 round-1 gate check — REVERTED by the next commit. A WARNING AND NOTHING ELSE:
// `react-hooks/exhaustive-deps` is warn-level in this repo, and the Lint step as first
// written (`env: CI: true`, no `--max-warnings`) passed one. This commit exists so the
// PR's own check history shows the FIXED step rejecting it — the earlier injection failed
// on an ERROR, which proved the step runs, not that it is strict.
export function R3648WarningProbe({ n }: { n: number }): null {
  const [, setV] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setV(n), 0);
    return () => clearTimeout(t);
  }, []);
  return null;
}
