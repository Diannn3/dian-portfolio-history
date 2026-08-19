import React, { useState } from 'react';
import { now } from '../../data/site';
import { SectionFrame } from '../global/SectionFrame';

/**
 * CURRENT VECTOR / WORKING SET
 *
 * The same four factual entries, composed as a routed path rather than a table.
 * A horizontal line threads the entries; hovering or focusing one routes the
 * line toward it. No invented percentages, no progress bars — the marker shows
 * position in the list, not fabricated completion.
 */
export function Now() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <SectionFrame
      id="now"
      index="03"
      title={now.period}
      annotation="CURRENT VECTOR / WORKING SET"
      className="pt-28 md:pt-40">
      
      <div className="atlas-grid mt-8 items-start md:mt-12">
        <div className="col-span-4 md:col-span-8 xl:col-span-7">
          <ol className="border-t border-hairline">
            {now.entries.map((entry, i) => {
              const on = active === i;
              return (
                <li
                  key={entry.id}
                  className="border-b border-hairline transition-opacity duration-500 ease-atlas"
                  style={{ opacity: active !== null && !on ? 0.5 : 1 }}
                  onPointerEnter={() => setActive(i)}
                  onPointerLeave={() => setActive(null)}>
                  
                  <div
                    className="flex items-baseline gap-4 py-5 md:gap-8"
                    tabIndex={0}
                    onFocus={() => setActive(i)}
                    onBlur={() => setActive(null)}>
                    
                    <span className="w-6 shrink-0 font-mono text-micro tracking-[0.16em] text-graphite">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="w-[7.5rem] shrink-0 font-mono text-label uppercase tracking-[0.14em]"
                    style={{ color: on ? 'var(--accent)' : 'var(--graphite)' }}>
                      {entry.state}
                    </span>
                    <span className="min-w-0 flex-1 font-heading text-display-3">
                      {entry.value}
                    </span>
                    <span
                      aria-hidden="true"
                      className="mt-2 hidden h-[1px] w-10 shrink-0 origin-left bg-accent transition-transform duration-500 ease-atlas md:block"
                      style={{ transform: `scaleX(${on ? 1 : 0.15})` }} />
                    
                  </div>
                </li>);

            })}
          </ol>
        </div>

        {/* the routed path */}
        <div className="col-span-4 mt-8 md:col-span-8 xl:col-span-4 xl:col-start-9 xl:mt-0" aria-hidden="true">
          <svg viewBox="0 0 200 320" className="w-full" preserveAspectRatio="none">
            <g stroke="var(--hairline)" strokeWidth="1">
              {[0, 1, 2, 3, 4].map((i) => <line key={i} x1={i * 50} y1="0" x2={i * 50} y2="320" />)}
            </g>
            <path
              d={
              active === null ?
              'M0 160 L200 160' :
              `M0 160 C 60 160, 70 ${44 + active * 76}, 200 ${44 + active * 76}`
              }
              fill="none"
              stroke="var(--accent)"
              strokeWidth="1.4"
              style={{ transition: 'all 620ms cubic-bezier(0.16,0.84,0.24,1)' }} />
            
            {now.entries.map((entry, i) =>
            <circle
              key={entry.id}
              cx="196"
              cy={44 + i * 76}
              r={active === i ? 4 : 2}
              fill={active === i ? 'var(--accent)' : 'var(--ink)'}
              style={{ transition: 'all 420ms cubic-bezier(0.16,0.84,0.24,1)' }} />
            )}
          </svg>
          <p className="mt-3 border-t border-hairline pt-3 text-note text-graphite">
            FIG. 02 / the working set as one path. Position in the list, not a completion figure.
          </p>
        </div>
      </div>
    </SectionFrame>);

}