import React, { useEffect, useMemo, useState } from 'react';
import type { ProjectModule } from '../../../types/project';
import { getCaseSectionId } from '../../../lib/caseNavigation';
import { useAtlas } from '../../../contexts/AtlasContext';

interface Props {
  modules: ProjectModule[];
}

/** Sticky case-study chapter rail that also feeds the contextual Atlas header. */
export function CaseIndex({ modules }: Props) {
  const { setChapter } = useAtlas();
  const [activeId, setActiveId] = useState<string | null>(null);
  const entries = useMemo(
    () => [
      ...modules.map((module, index) => ({
        index: index + 1,
        label: module.title,
        id: getCaseSectionId(module, index + 1),
      })),
      { index: modules.length + 1, label: 'Technology', id: 'case-technology' },
    ],
    [modules]
  );

  useEffect(() => {
    const nodes = entries
      .map((entry) => document.getElementById(entry.id))
      .filter((node): node is HTMLElement => Boolean(node));
    if (!nodes.length) return;

    const ratios = new Map<string, number>();
    const observer = new IntersectionObserver(
      (changes) => {
        changes.forEach((change) => {
          ratios.set(change.target.id, change.isIntersecting ? change.intersectionRatio : 0);
        });
        let bestId: string | null = null;
        let best = 0;
        entries.forEach((entry) => {
          const ratio = ratios.get(entry.id) ?? 0;
          if (ratio > best) {
            best = ratio;
            bestId = entry.id;
          }
        });
        const current = entries.find((entry) => entry.id === bestId);
        if (current) {
          setActiveId(current.id);
          setChapter(`${String(current.index).padStart(2, '0')} / ${current.label.toUpperCase()}`);
        }
      },
      { threshold: [0, 0.2, 0.5, 0.8], rootMargin: '-120px 0px -45% 0px' }
    );

    nodes.forEach((node) => observer.observe(node));
    return () => {
      observer.disconnect();
      setActiveId(null);
      setChapter(null);
    };
  }, [entries, setChapter]);

  return (
    <nav
      className="sticky top-[3.55rem] z-40 mt-14 border-y border-hairline bg-canvas/95 md:mt-20"
      aria-label="Case study sections"
    >
      <div className="atlas-grid py-2">
        <div className="col-span-4 flex items-center gap-6 overflow-x-auto overscroll-x-contain md:col-span-8 md:gap-8 xl:col-span-12">
          <span className="mono-label shrink-0 text-ink">CASE INDEX</span>
          {entries.map((entry) => (
            <a
              key={entry.id}
              href={`#${entry.id}`}
              aria-current={activeId === entry.id ? 'location' : undefined}
              className={`link-underline flex shrink-0 items-baseline gap-2 py-1 font-mono text-micro uppercase tracking-[0.14em] transition-colors duration-300 ${
                activeId === entry.id ? 'text-ink' : 'text-graphite hover:text-ink focus-visible:text-ink'
              }`}
            >
              <span className={activeId === entry.id ? 'text-accent' : 'text-graphite'}>
                {String(entry.index).padStart(2, '0')}
              </span>
              {entry.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
