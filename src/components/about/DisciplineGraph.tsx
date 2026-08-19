import React, { useState } from 'react';
import { disciplineEdges, disciplines } from '../../data/site';

/**
 * The discipline graph. Edges are drawn in SVG and marked decorative; every node
 * is a real HTML button positioned over the frame, so pointer and keyboard users
 * reach identical information. A definition list underneath carries the same
 * content for anyone who never sees the graphic.
 */
export function DisciplineGraph() {
  const [active, setActive] = useState<string | null>(null);
  const activeNode = disciplines.find((d) => d.id === active) ?? null;

  const isLinked = (id: string) =>
  Boolean(
    active &&
    disciplineEdges.some(([a, b]) => a === active && b === id || b === active && a === id)
  );

  return (
    <div>
      <div className="relative aspect-square w-full border border-hairline bg-surface/30">
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
          focusable="false">

          {/* plan lattice */}
          <g stroke="var(--hairline)" strokeWidth="0.25">
            {Array.from({ length: 7 }).map((_, i) =>
            <line key={`v${i}`} x1={12.5 + i * 12.5} y1="4" x2={12.5 + i * 12.5} y2="96" />
            )}
            {Array.from({ length: 7 }).map((_, i) =>
            <line key={`h${i}`} x1="4" y1={12.5 + i * 12.5} x2="96" y2={12.5 + i * 12.5} />
            )}
          </g>
          {/* edges: the 2.5D reading comes from the offset shadow copy */}
          <g>
            {disciplineEdges.map(([a, b]) => {
              const from = disciplines.find((d) => d.id === a);
              const to = disciplines.find((d) => d.id === b);
              if (!from || !to) return null;
              const on = active === a || active === b;
              return (
                <g key={`${a}-${b}`}>
                  <line
                    x1={from.x * 100}
                    y1={from.y * 100 + 2.2}
                    x2={to.x * 100}
                    y2={to.y * 100 + 2.2}
                    stroke="var(--ink)"
                    strokeOpacity="0.08"
                    strokeWidth="0.4" />

                  <line
                    x1={from.x * 100}
                    y1={from.y * 100}
                    x2={to.x * 100}
                    y2={to.y * 100}
                    stroke={on ? 'var(--accent)' : 'var(--ink)'}
                    strokeOpacity={on ? 0.9 : 0.28}
                    strokeWidth={on ? 0.6 : 0.35}
                    className="transition-all duration-500 ease-atlas" />

                </g>);

            })}
          </g>
        </svg>

        {disciplines.map((d) => {
          const on = active === d.id;
          const linked = isLinked(d.id);
          return (
            <button
              key={d.id}
              type="button"
              onMouseEnter={() => setActive(d.id)}
              onFocus={() => setActive(d.id)}
              onMouseLeave={() => setActive((prev) => prev === d.id ? null : prev)}
              onBlur={() => setActive((prev) => prev === d.id ? null : prev)}
              onClick={() => setActive((prev) => prev === d.id ? null : d.id)}
              aria-pressed={on}
              style={{ left: `${d.x * 100}%`, top: `${d.y * 100}%` }}
              className="absolute flex min-h-[44px] min-w-[44px] -translate-x-1/2 -translate-y-1/2 items-center justify-center"
              data-cursor="link">

              <span
                className={`flex items-center gap-2 border px-2 py-1 font-mono text-micro uppercase tracking-[0.14em] transition-colors duration-300 ease-atlas ${
                on ?
                'border-accent bg-canvas text-accent' :
                linked ?
                'border-ink bg-canvas text-ink' :
                'border-hairline bg-canvas text-graphite'}`
                }>

                <span
                  className={`block h-[5px] w-[5px] ${on ? 'bg-accent' : 'bg-ink'}`}
                  aria-hidden="true" />

                {d.label}
              </span>
            </button>);

        })}

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 border-t border-hairline bg-canvas/90 px-3 py-2"
          aria-live="polite">

          <p className="font-mono text-micro uppercase tracking-[0.14em] text-graphite">
            {activeNode ?
            `${activeNode.label} / ${activeNode.note}` :
            'SELECT A NODE — MOUSE, TOUCH OR KEYBOARD'}
          </p>
        </div>
      </div>

      <dl className="mt-6 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
        {disciplines.map((d) =>
        <div key={d.id} className="border-t border-hairline pt-2">
            <dt className="mono-label text-ink">{d.label}</dt>
            <dd className="mt-1 text-read-sm text-graphite">{d.note}</dd>
          </div>
        )}
      </dl>
    </div>);

}