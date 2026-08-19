import React, { useState } from 'react';
import { now } from '../../data/site';
import { SectionFrame } from '../ui/SectionFrame';

/**
 * CURRENT VECTOR — what is actually in progress, drawn as one route with a stop
 * per entry. No percentages, no progress bars: none of that would be measurable.
 */
export function Now() {
  const [active, setActive] = useState(0);
  const count = now.entries.length;

  return (
    <SectionFrame id="now" index="03" title="Current Vector" coordinate={now.period}>
      <div className="atlas-grid gap-y-8 pb-10">
        <div className="col-span-4 md:col-span-8 xl:col-span-7">
          <ul className="border-t border-hairline">
            {now.entries.map((entry, i) =>
            <li key={entry.value} className="border-b border-hairline">
                <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                aria-pressed={active === i}
                className="flex w-full items-baseline gap-4 py-4 text-left"
                data-cursor="link">

                  <span
                  className={`mono-label w-24 shrink-0 transition-colors duration-300 ${
                  active === i ? 'text-accent' : ''}`
                  }>

                    {entry.label}
                  </span>
                  <span className="text-read text-ink">{entry.value}</span>
                  <span className="mono-label ml-auto hidden shrink-0 md:inline">
                    {String(i + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
                  </span>
                </button>
              </li>
            )}
          </ul>
        </div>

        <div className="col-span-4 md:col-span-8 xl:col-span-4 xl:col-start-9">
          <p className="mono-label mb-3">FIG / ROUTE</p>
          <div className="border border-hairline bg-surface/30 p-3">
            <svg viewBox="0 0 100 120" className="h-auto w-full" aria-hidden="true">
              <line
                x1="18"
                y1="10"
                x2="18"
                y2="110"
                stroke="var(--hairline)"
                strokeWidth="0.6" />

              <line
                x1="18"
                y1="10"
                x2="18"
                y2={10 + (active + 1) / count * 100}
                stroke="var(--accent)"
                strokeWidth="1.1"
                className="transition-all duration-500 ease-atlas" />

              {now.entries.map((entry, i) => {
                const y = 10 + (i + 0.5) / count * 100;
                const on = i === active;
                return (
                  <g key={entry.value}>
                    <line
                      x1="18"
                      y1={y}
                      x2={on ? 44 : 32}
                      y2={y}
                      stroke={on ? 'var(--accent)' : 'var(--ink)'}
                      strokeOpacity={on ? 1 : 0.3}
                      strokeWidth="0.7"
                      className="transition-all duration-500 ease-atlas" />

                    <rect
                      x={16.4}
                      y={y - 1.6}
                      width="3.2"
                      height="3.2"
                      fill={on ? 'var(--accent)' : 'var(--ink)'}
                      fillOpacity={on ? 1 : 0.4} />

                  </g>);

              })}
            </svg>
          </div>
          <p className="mono-label mt-3">
            {now.entries[active].label} / {now.entries[active].value}
          </p>
        </div>
      </div>
    </SectionFrame>);

}