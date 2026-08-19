import React, { useState } from 'react';
import { disciplineEdges, disciplines } from '../../data/site';

const W = 520;
const H = 420;

export function DisciplineGraph() {
  const [active, setActive] = useState<string | null>(null);

  const isLive = (id: string) =>
  active === id ||
  active !== null &&
  disciplineEdges.some(([a, b]) => a === active && b === id || b === active && a === id);

  return (
    <figure className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="group" aria-label="Discipline graph: how mathematics, software, AI, data, spatial systems and design connect">
        <g stroke="var(--hairline)" strokeWidth="1">
          {Array.from({ length: 9 }).map((_, i) =>
          <line key={i} x1="0" y1={H / 8 * i} x2={W} y2={H / 8 * i} />
          )}
        </g>
        <g>
          {disciplineEdges.map(([a, b]) => {
            const na = disciplines.find((d) => d.id === a)!;
            const nb = disciplines.find((d) => d.id === b)!;
            const live = active !== null && (a === active || b === active);
            return (
              <line
                key={`${a}-${b}`}
                x1={na.x * W}
                y1={na.y * H}
                x2={nb.x * W}
                y2={nb.y * H}
                stroke={live ? 'var(--accent)' : 'var(--ink)'}
                strokeOpacity={live ? 0.9 : active ? 0.12 : 0.28}
                strokeWidth={live ? 1.4 : 1}
                style={{ transition: 'stroke-opacity 350ms, stroke 350ms' }} />);


          })}
        </g>
        <g>
          {disciplines.map((d) => {
            const live = isLive(d.id);
            const dim = active !== null && !live;
            return (
              <g
                key={d.id}
                tabIndex={0}
                role="group"
                aria-label={`${d.label}: ${d.note}`}
                onMouseEnter={() => setActive(d.id)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(d.id)}
                onBlur={() => setActive(null)}
                style={{ cursor: 'default', opacity: dim ? 0.34 : 1, transition: 'opacity 300ms' }}>
                
                <circle
                  cx={d.x * W}
                  cy={d.y * H}
                  r={active === d.id ? 7 : 4}
                  fill={active === d.id ? 'var(--accent)' : 'var(--ink)'}
                  style={{ transition: 'r 300ms cubic-bezier(0.16,0.84,0.24,1)' }} />
                
                <circle cx={d.x * W} cy={d.y * H} r="16" fill="transparent" />
                <text
                  x={d.x * W + 12}
                  y={d.y * H + 4}
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
      <figcaption className="mt-4 min-h-[3.2rem] border-t border-hairline pt-3 font-mono text-label uppercase text-graphite">
        {active ?
        <>
            <span className="text-ink">{disciplines.find((d) => d.id === active)?.label}</span>{' '}
            / {disciplines.find((d) => d.id === active)?.note}
          </> :

        'HOVER OR TAB A NODE / SIX FIELDS, TEN RELATIONSHIPS'
        }
      </figcaption>
    </figure>);

}