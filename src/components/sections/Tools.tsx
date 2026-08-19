import React, { useState } from 'react';
import { tools } from '../../data/site';
import { SectionFrame } from '../ui/SectionFrame';

/** Which fields actually meet each other in the work. Relationships, not ratings. */
const RELATIONS: Record<string, string[]> = {
  INTERFACE: ['VISUAL', 'DATA'],
  COMPUTATION: ['DATA', 'SPATIAL'],
  SPATIAL: ['COMPUTATION', 'VISUAL', 'DATA'],
  VISUAL: ['INTERFACE', 'SPATIAL'],
  DATA: ['COMPUTATION', 'INTERFACE', 'AI'],
  AI: ['DATA', 'COMPUTATION']
};

export function Tools() {
  const [active, setActive] = useState<string | null>(null);
  const related = active ? RELATIONS[active] ?? [] : [];

  return (
    <SectionFrame
      id="tools"
      index="06"
      title="Tools"
      coordinate="PLATE 06 / RELATIONS"
      lede="Grouped by what they are for, and by which other group they usually end up talking to. No proficiency scores — those would be invented.">

      <div className="atlas-grid pb-10">
        <ul className="col-span-4 grid grid-cols-1 gap-0 border-t border-hairline md:col-span-8 md:grid-cols-2 xl:col-span-10 xl:grid-cols-3">
          {tools.map((group) => {
            const on = active === group.group;
            const linked = related.includes(group.group);
            return (
              <li
                key={group.group}
                className={`border-b border-hairline transition-colors duration-500 ease-atlas md:border-r ${
                on ? 'bg-surface/60' : linked ? 'bg-surface/25' : ''}`
                }>

                <button
                  type="button"
                  onMouseEnter={() => setActive(group.group)}
                  onFocus={() => setActive(group.group)}
                  onMouseLeave={() => setActive((p) => p === group.group ? null : p)}
                  onBlur={() => setActive((p) => p === group.group ? null : p)}
                  onClick={() => setActive((p) => p === group.group ? null : group.group)}
                  aria-pressed={on}
                  className="flex h-full w-full flex-col gap-3 p-4 text-left xl:p-5"
                  data-cursor="link">

                  <span className="flex items-baseline justify-between gap-3">
                    <span
                      className={`mono-label transition-colors duration-300 ${
                      on ? 'text-accent' : linked ? 'text-ink' : ''}`
                      }>

                      {group.group}
                    </span>
                    <span
                      className={`block h-[1px] w-8 transition-colors duration-300 ${
                      on ? 'bg-accent' : 'bg-hairline'}`
                      }
                      aria-hidden="true" />

                  </span>
                  <span className="text-read-sm text-ink">{group.items}</span>
                  <span className="mono-label mt-auto">
                    MEETS / {(RELATIONS[group.group] ?? []).join(' · ') || '—'}
                  </span>
                </button>
              </li>);

          })}
        </ul>
      </div>
    </SectionFrame>);

}