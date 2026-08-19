import React, { useState } from 'react';

const STAGES = [
{ id: 'capture', label: 'CAPTURE', note: 'Webcam frames in the prototype, not on this page.' },
{ id: 'landmarks', label: 'LANDMARKS', note: 'Hand landmarks per frame inside the prototype.' },
{ id: 'gesture', label: 'PINCH', note: 'Landmark distance thresholds become a grab state.' },
{ id: 'window', label: 'WINDOW', note: 'Grab state drives placement of a floating surface.' },
{ id: 'state', label: 'LOCAL STATE', note: 'Layout persists locally; no account, no upload.' }];


/**
 * L02 — a diagram of the AedriAIn prototype's pipeline. This page does not run
 * hand tracking, does not open a camera and makes no accuracy claim: it is an
 * abstraction of a separate prototype whose source is linked.
 */
export function AedriAInStudy() {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="border border-hairline bg-surface/30">
        <div className="flex items-baseline justify-between border-b border-hairline px-3 py-2">
          <span className="mono-label">FIG / PROTOTYPE PIPELINE</span>
          <span className="mono-label text-accent">NO CAMERA USED ON THIS PAGE</span>
        </div>
        <div className="p-4">
          <svg viewBox="0 0 100 40" className="h-auto w-full" aria-hidden="true">
            <g stroke="var(--hairline)" strokeWidth="0.2">
              {Array.from({ length: 10 }).map((_, i) =>
              <line key={i} x1={i * 10 + 5} y1="2" x2={i * 10 + 5} y2="38" />
              )}
            </g>
            {STAGES.map((s, i) => {
              const x = 8 + i * 21;
              const on = i === active;
              return (
                <g key={s.id}>
                  {i < STAGES.length - 1 &&
                  <line
                    x1={x + 3}
                    y1="20"
                    x2={x + 18}
                    y2="20"
                    stroke={i < active ? 'var(--accent)' : 'var(--ink)'}
                    strokeOpacity={i < active ? 0.8 : 0.25}
                    strokeWidth="0.4" />

                  }
                  <rect
                    x={x - 3}
                    y="17"
                    width="6"
                    height="6"
                    fill={on ? 'var(--accent)' : 'none'}
                    stroke={on ? 'var(--accent)' : 'var(--ink)'}
                    strokeWidth="0.4" />

                </g>);

            })}
          </svg>
        </div>
      </div>

      <ol className="mt-4 border-t border-hairline">
        {STAGES.map((s, i) =>
        <li key={s.id} className="border-b border-hairline">
            <button
            type="button"
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
            aria-pressed={i === active}
            className="flex w-full items-baseline gap-4 py-3 text-left"
            data-cursor="link">

              <span className={`mono-label w-6 shrink-0 ${i === active ? 'text-accent' : ''}`}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="mono-label w-28 shrink-0 text-ink">{s.label}</span>
              <span className="text-read-sm text-graphite">{s.note}</span>
            </button>
          </li>
        )}
      </ol>
    </div>);

}