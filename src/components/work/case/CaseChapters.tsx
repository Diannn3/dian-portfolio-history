import React, { useEffect, useState } from 'react';
import type { CaseChapter } from '../../../lib/caseNavigation';
import { scrollToTarget } from '../../../lib/motion/scroll';
import { subscribeSection } from '../../../lib/motion/section-state';

/**
 * The chapter navigator. Real anchors, so URL hashes, deep links, middle-click
 * and keyboard activation all work natively; the click handler only adds the
 * smooth scroll on top. Sticky on desktop, a horizontal rail on narrow screens.
 */
export function CaseChapters({ chapters }: {chapters: CaseChapter[];}) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => subscribeSection(setActive), []);

  return (
    <nav aria-label="Case study chapters">
      {/* narrow: horizontal rail */}
      <div className="atlas-grid xl:hidden">
        <div className="col-span-4 border-y border-hairline md:col-span-8">
          <div className="flex items-center gap-6 overflow-x-auto overscroll-x-contain py-3">
            <span className="mono-label shrink-0 text-ink">CHAPTERS</span>
            {chapters.map((chapter) =>
            <a
              key={chapter.id}
              href={`#${chapter.id}`}
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey) return;
                e.preventDefault();
                if (scrollToTarget(`#${chapter.id}`, -80)) {
                  window.history.replaceState(null, '', `#${chapter.id}`);
                }
              }}
              className="link-underline shrink-0 font-mono text-micro uppercase tracking-[0.14em] text-graphite hover:text-ink focus-visible:text-ink"
              style={active === chapter.id ? { color: 'var(--ink)' } : undefined}>
              
                {chapter.index} {chapter.title}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* wide: sticky column */}
      <div className="hidden xl:block">
        <ol className="sticky top-[calc(var(--rail)+3rem)] border-t border-hairline">
          {chapters.map((chapter) => {
            const on = active === chapter.id;
            return (
              <li key={chapter.id} className="border-b border-hairline">
                <a
                  href={`#${chapter.id}`}
                  onClick={(e) => {
                    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
                    e.preventDefault();
                    if (scrollToTarget(`#${chapter.id}`, -80)) {
                      window.history.replaceState(null, '', `#${chapter.id}`);
                    }
                  }}
                  aria-current={on ? 'true' : undefined}
                  className="group flex items-baseline gap-3 py-2.5">
                  
                  <span
                    aria-hidden="true"
                    className="mt-[0.55rem] block h-[1px] w-3 shrink-0 origin-left bg-accent transition-transform duration-500 ease-atlas"
                    style={{ transform: `scaleX(${on ? 1 : 0})` }} />
                  
                  <span className="font-mono text-micro tracking-[0.16em] text-graphite">
                    {chapter.index}
                  </span>
                  <span
                    className="font-mono text-micro uppercase tracking-[0.14em] transition-colors duration-300 group-hover:text-ink"
                    style={{ color: on ? 'var(--ink)' : 'var(--graphite)' }}>
                    
                    {chapter.title}
                  </span>
                </a>
              </li>);

          })}
        </ol>
      </div>
    </nav>);

}