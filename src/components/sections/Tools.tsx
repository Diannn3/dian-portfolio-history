import React, { useState } from 'react';
import { tools } from '../../data/site';
import { SectionFrame } from '../global/SectionFrame';

const W = 320;
const H = 320;

/** Category positions in the small constellation — same language as FIG. 01. */
const POS: Record<string, [number, number]> = {
  INTERFACE: [0.5, 0.12],
  COMPUTATION: [0.86, 0.4],
  SPATIAL: [0.14, 0.4],
  VISUAL: [0.5, 0.52],
  DATA: [0.24, 0.86],
  AI: [0.78, 0.84]
};

/**
 * TOOL RELATIONSHIP MAP
 *
 * No logo cloud, no percentages, no badges. Six category rows; focusing one
 * makes its tools dominant, dims the rest, and lights the matching node plus the
 * edges to the categories it actually shares work with. The tool names are DOM
 * text — the constellation only annotates them.
 */
export function Tools() {
  const [active, setActive] = useState<string | null>(null);

  const activeTool = tools.find((t) => t.group === active) ?? null;
  const isLinked = (group: string) =>
  active === group || Boolean(activeTool?.relates.includes(group));

  return (
    <SectionFrame
      id="tools"
      index="06"
      title="Tools I reach for"
      annotation="RELATIONSHIPS, NOT A SKILL LIST"
      className="pt-28 md:pt-44">
      
      <div className="atlas-grid mt-8 items-start md:mt-12">
        <dl className="col-span-4 md:col-span-8 xl:col-span-7">
          {tools.map((tool) => {
            const on = active === tool.group;
            const dim = active !== null && !isLinked(tool.group);
            return (
              <div
                key={tool.group}
                className="border-b border-hairline transition-opacity duration-500 ease-atlas first:border-t"
                style={{ opacity: dim ? 0.4 : 1 }}
                onPointerEnter={() => setActive(tool.group)}
                onPointerLeave={() => setActive(null)}>
                
                <div
                  className="flex flex-col gap-1 py-5 md:flex-row md:items-baseline md:gap-10"
                  tabIndex={0}
                  onFocus={() => setActive(tool.group)}
                  onBlur={() => setActive(null)}>
                  
                  <dt className="flex w-[11rem] shrink-0 items-baseline gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-[0.4rem] block h-[1px] w-4 origin-left bg-accent transition-transform duration-500 ease-atlas"
                      style={{ transform: `scaleX(${on ? 1 : 0})` }} />
                    
                    <span
                      className="font-mono text-label uppercase tracking-[0.14em]"
                      style={{ color: on ? 'var(--ink)' : 'var(--graphite)' }}>
                      
                      {tool.group}
                    </span>
                  </dt>
                  <dd className="font-heading text-[1.15rem] tracking-tight md:text-[1.35rem]">
                    {tool.list.map((name, i) =>
                    <React.Fragment key={name}>
                        {i > 0 ?
                      <span className="px-2 text-graphite" aria-hidden="true">
                            /
                          </span> :
                      null}
                        <span
                        className="transition-colors duration-500 ease-atlas"
                        style={{ color: on ? 'var(--ink)' : undefined }}>
                        
                          {name}
                        </span>
                      </React.Fragment>
                    )}
                  </dd>
                </div>
              </div>);

          })}
        </dl>

        <div className="col-span-4 mt-10 md:col-span-4 md:mt-12 xl:col-span-4 xl:col-start-9 xl:mt-0">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-hidden="true">
            <g stroke="var(--hairline)" strokeWidth="1">
              {Array.from({ length: 5 }).map((_, i) =>
              <line key={i} x1="0" y1={i * (H / 4)} x2={W} y2={i * (H / 4)} />
              )}
            </g>
            <g>
              {tools.flatMap((tool) =>
              tool.relates.map((other) => {
                const a = POS[tool.group];
                const b = POS[other];
                if (!a || !b) return null;
                const live = active === tool.group || active === other;
                return (
                  <line
                    key={`${tool.group}-${other}`}
                    x1={a[0] * W}
                    y1={a[1] * H}
                    x2={b[0] * W}
                    y2={b[1] * H}
                    stroke={live ? 'var(--accent)' : 'var(--ink)'}
                    strokeOpacity={live ? 0.85 : active ? 0.08 : 0.22}
                    strokeWidth={live ? 1.4 : 1}
                    style={{ transition: 'all 380ms cubic-bezier(0.16,0.84,0.24,1)' }} />);

              })
              )}
            </g>
            <g>
              {tools.map((tool) => {
                const p = POS[tool.group];
                if (!p) return null;
                const on = active === tool.group;
                return (
                  <circle
                    key={tool.group}
                    cx={p[0] * W}
                    cy={p[1] * H}
                    r={on ? 6 : 3}
                    fill={on ? 'var(--accent)' : 'var(--ink)'}
                    fillOpacity={active !== null && !isLinked(tool.group) ? 0.25 : 1}
                    style={{ transition: 'all 320ms cubic-bezier(0.16,0.84,0.24,1)' }} />);

              })}
            </g>
          </svg>
          <p className="mt-3 border-t border-hairline pt-3 text-note text-graphite">
            FIG. 03 / {activeTool ?
            `${activeTool.group} shares work with ${activeTool.relates.join(' and ')}.` :
            'six categories, and the pairs that actually meet inside a project.'}
          </p>
        </div>
      </div>
    </SectionFrame>);

}