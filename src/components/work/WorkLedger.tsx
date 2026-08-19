import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { projectCatalog } from '../../data/projectCatalog';
import { preloadProject } from '../../content/projectRegistry';
import { useCompact, useQuality, useReducedMotion } from '../../hooks/useEnvironment';
import { InlinePreview } from './InlinePreview';
import { ProjectStage } from './ProjectStage';

/**
 * SELECTED WORK as a ledger, not a card grid. One shared spatial stage is
 * attached to the ledger and follows whichever row is active; on compact or
 * reduced-motion devices the stage is replaced by inline flat previews so no
 * information ever hides behind hover.
 */
export function WorkLedger() {
  const [activeIndex, setActiveIndex] = useState(0);
  const compact = useCompact();
  const reduced = useReducedMotion();
  const { supported } = useQuality();
  const stageEnabled = supported && !compact;
  const active = projectCatalog[activeIndex];

  const activate = useCallback((i: number, slug: string) => {
    setActiveIndex(i);
    preloadProject(slug);
  }, []);

  return (
    <div className="atlas-grid gap-y-10 pb-6">
      <div className="col-span-4 md:col-span-8 xl:col-span-7">
        <ul className="border-t border-hairline">
          {projectCatalog.map((p, i) => {
            const isActive = i === activeIndex;
            return (
              <li key={p.slug} className="border-b border-hairline">
                <Link
                  to={`/work/${p.slug}`}
                  className="group block py-6 outline-offset-4 xl:py-7"
                  data-cursor="row"
                  onMouseEnter={() => activate(i, p.slug)}
                  onFocus={() => activate(i, p.slug)}
                  aria-describedby={`ledger-summary-${p.slug}`}>

                  <div
                    className={`flex flex-wrap items-baseline gap-x-5 gap-y-2 transition-opacity duration-500 ease-atlas ${
                    stageEnabled && !isActive ? 'opacity-55 group-hover:opacity-100' : 'opacity-100'}`
                    }>

                    <span
                      className={`mono-label w-7 shrink-0 transition-colors duration-300 ${
                      isActive ? 'text-accent' : ''}`
                      }>

                      {p.index}
                    </span>
                    <h3 className="font-heading text-display-3 font-medium uppercase leading-none text-ink transition-transform duration-500 ease-atlas group-hover:translate-x-1.5 xl:text-display-2">
                      {p.title}
                    </h3>
                    <span className="mono-label ml-auto shrink-0">{p.status}</span>
                    <span className="mono-label hidden shrink-0 md:inline">{p.period}</span>
                  </div>

                  <div className="mt-3 flex flex-wrap items-baseline gap-x-6 gap-y-2 pl-0 md:pl-12">
                    <span className="mono-label">{p.category}</span>
                    <span
                      id={`ledger-summary-${p.slug}`}
                      className="max-w-[52ch] text-read-sm text-graphite">

                      {p.summary}
                    </span>
                  </div>

                  {/* compact devices get the diagram inline instead of on hover */}
                  {!stageEnabled &&
                  <div className="mt-5 border border-hairline bg-surface/40 p-2">
                      <div className="aspect-[16/9] w-full">
                        <InlinePreview variant={p.preview} />
                      </div>
                      <p className="mono-label mt-2">
                        SYSTEM DIAGRAM — NOT A PRODUCT SCREENSHOT
                      </p>
                    </div>
                  }
                </Link>
              </li>);

          })}
        </ul>
      </div>

      {stageEnabled &&
      <div className="hidden xl:col-span-5 xl:col-start-8 xl:block">
          <div className="sticky top-28">
            <div className="border border-hairline bg-surface/30">
              <div className="flex items-baseline justify-between border-b border-hairline px-3 py-2">
                <span className="mono-label">
                  STAGE / {active.index} · {active.title}
                </span>
                <span className="mono-label">{reduced ? 'STATIC' : 'LIVE'}</span>
              </div>
              <div className="aspect-[4/3] w-full">
                <ProjectStage variant={active.preview} reduced={reduced} />
              </div>
              <div className="flex items-baseline justify-between border-t border-hairline px-3 py-2">
                <span className="mono-label">SYSTEM DIAGRAM — NOT A PRODUCT SCREENSHOT</span>
              </div>
            </div>
            <p className="mono-label mt-3">
              HOVER OR FOCUS A ROW TO CHANGE THE STAGE
            </p>
          </div>
        </div>
      }
    </div>);

}