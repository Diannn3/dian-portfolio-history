import React, { useState } from 'react';
import { disciplineEdges, disciplines } from '../../data/site';

const W = 520;
const H = 420;

/**
 * 2.5D FIELD GRAPH
 *
 * The same six fields and ten relationships, now with depth: each node carries a
 * z value, so focusing one brings it forward while the unrelated ones recede.
 *
 * Accessibility is not an afterthought here. The nodes are real <button>
 * elements positioned over the drawing — not ARIA roles bolted onto <g> — so
 * they are reachable, activatable and announced natively. The full relationship
 * set is also available as text below, which means WebGL or SVG is never the
 * only way to understand the graph.
 */
export function DisciplineGraph() {
  const [active, setActive] = useState<string | null>(null);

  const related = (id: string) =>
  active === id ||
  active !== null &&
  disciplineEdges.some(([a, b]) => a === active && b === id || b === active && a === id);

  /** depth projection: nodes drift toward the viewer when focused */
  const project = (d: (typeof disciplines)[number]) => {
    const on = active === d.id;
    const scale = 1 + d.z * 0.045 + (on ? 0.055 : 0);
    const cx = (d.x - 0.5) * scale + 0.5;
    const cy = (d.y - 0.5) * scale + 0.5;
    return { x: cx * W, y: cy * H };
  };

  const activeNode = disciplines.find((d) => d.id === active) ?? null;

  return (
    <figure className="w-full">
      <div className="relative">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          aria-hidden="true"
          focusable="false">
          
          <g stroke="var(--hairline)" strokeWidth="1">
            {Array.from({ length: 9 }).map((_, i) =>
            <line key={i} x1="0" y1={H / 8 * i} x2={W} y2={H / 8 * i} />
            )}
          </g>
          <g>
            {disciplineEdges.map(([a, b]) => {
              const na = disciplines.find((d) => d.id === a)!;
              const nb = disciplines.find((d) => d.id === b)!;
              const pa = project(na);
              const pb = project(nb);
              const live = active !== null && (a === active || b === active);
              return (
                <line
                  key={`${a}-${b}`}
                  x1={pa.x}
                  y1={pa.y}
                  x2={pb.x}
                  y2={pb.y}
                  stroke={live ? 'var(--accent)' : 'var(--ink)'}
                  strokeOpacity={live ? 0.9 : active ? 0.1 : 0.28}
                  strokeWidth={live ? 1.5 : 1}
                  style={{ transition: 'all 380ms cubic-bezier(0.16,0.84,0.24,1)' }} />);

            })}
          </g>
          <g>
            {disciplines.map((d) => {
              const p = project(d);
              const on = active === d.id;
              const dim = active !== null && !related(d.id);
              return (
                <g
                  key={d.id}
                  style={{ opacity: dim ? 0.3 : 1, transition: 'opacity 320ms' }}>
                  
                  {/* DEPTH FOCUS: a shadow offset stands in for z */}
                  {on ?
                  <circle cx={p.x + 3} cy={p.y + 3} r="7" fill="var(--ink)" fillOpacity="0.12" /> :
                  null}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={on ? 7 : 4}
                    fill={on ? 'var(--accent)' : 'var(--ink)'}
                    style={{ transition: 'all 320ms cubic-bezier(0.16,0.84,0.24,1)' }} />
                  
                  <text
                    x={p.x + 12}
                    y={p.y + 4}
                    fontFamily="Geist Mono, monospace"
                    fontSize="10.5"
                    letterSpacing="1.6"
                    fill="var(--ink)">
                    
                    {d.label}
                  </text>
                </g>);

            })}
          </g>
        </svg>

        {/* real, focusable controls layered over the drawing */}
        <div className="absolute inset-0">
          {disciplines.map((d) => {
            const p = project(d);
            return (
              <button
                key={d.id}
                type="button"
                aria-pressed={active === d.id}
                onPointerEnter={() => setActive(d.id)}
                onPointerLeave={() => setActive(null)}
                onFocus={() => setActive(d.id)}
                onBlur={() => setActive(null)}
                onClick={() => setActive((prev) => prev === d.id ? null : d.id)}
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-none"
                style={{
                  left: `${p.x / W * 100}%`,
                  top: `${p.y / H * 100}%`,
                  width: '2.6rem',
                  height: '2.6rem'
                }}>
                
                <span className="sr-only">
                  {d.label}: {d.note}
                </span>
              </button>);

          })}
        </div>
      </div>

      <figcaption className="mt-4 min-h-[3.4rem] border-t border-hairline pt-3">
        {activeNode ?
        <span className="font-mono text-label uppercase tracking-[0.14em] text-graphite">
            <span className="text-ink">{activeNode.label}</span> / {activeNode.note}
            <span className="mt-1 block text-accent">{activeNode.method}</span>
          </span> :

        <span className="font-mono text-label uppercase tracking-[0.14em] text-graphite">
            HOVER, TAB OR TAP A NODE / SIX FIELDS, TEN RELATIONSHIPS
          </span>
        }
      </figcaption>

      <details className="mt-4 border-t border-hairline pt-3">
        <summary className="w-fit cursor-pointer font-mono text-micro uppercase tracking-[0.16em] text-graphite hover:text-ink focus-visible:text-ink">
          View graph as text +
        </summary>
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          <dl className="space-y-3">
            {disciplines.map((d) =>
            <div key={d.id} className="grid grid-cols-[6rem_1fr] gap-4 border-t border-hairline pt-3">
                <dt className="font-mono text-micro uppercase tracking-[0.14em] text-ink">{d.label}</dt>
                <dd className="text-note text-graphite">{d.note}</dd>
              </div>
            )}
          </dl>
          <ol className="space-y-3" aria-label="Relationships">
            {disciplineEdges.map(([a, b]) =>
            <li key={`${a}-${b}`} className="border-t border-hairline pt-3 text-note text-graphite">
                {disciplines.find((d) => d.id === a)?.label}
                <span aria-hidden="true"> → </span>
                {disciplines.find((d) => d.id === b)?.label}
              </li>
            )}
          </ol>
        </div>
      </details>
    </figure>);

}