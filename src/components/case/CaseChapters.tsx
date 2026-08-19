import React, { useEffect } from 'react';
import { useAtlas } from '../../contexts/AtlasContext';

export interface Chapter {
  id: string;
  index: string;
  title: string;
}

interface Props {
  chapters: Chapter[];
}

/**
 * The chapter rail. One IntersectionObserver tracks which chapter owns the
 * viewport and reports it to the header; there is no second scroll handler.
 * Links are real anchors, so every chapter is reachable by keyboard and by URL.
 */
export function CaseChapters({ chapters }: Props) {
  const { setChapter } = useAtlas();

  useEffect(() => {
    const nodes = chapters.
    map((c) => document.getElementById(c.id)).
    filter((n): n is HTMLElement => Boolean(n));
    if (!nodes.length) return;

    const ratios = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => ratios.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0));
        let bestId: string | null = null;
        let best = 0;
        chapters.forEach((c) => {
          const r = ratios.get(c.id) ?? 0;
          if (r > best) {
            best = r;
            bestId = c.id;
          }
        });
        const found = chapters.find((c) => c.id === bestId);
        if (found) setChapter(found.title.toUpperCase());
      },
      { threshold: [0, 0.2, 0.5, 0.8], rootMargin: '-120px 0px -45% 0px' }
    );
    nodes.forEach((n) => io.observe(n));
    return () => {
      io.disconnect();
      setChapter(null);
    };
  }, [chapters, setChapter]);

  return (
    <nav
      aria-label="Case chapters"
      className="sticky top-[3.6rem] z-40 border-y border-hairline bg-canvas/95">

      <div className="atlas-grid py-2">
        <ul className="col-span-4 flex snap-x snap-mandatory gap-6 overflow-x-auto md:col-span-8 xl:col-span-12">
          {chapters.map((c) =>
          <li key={c.id} className="shrink-0 snap-start">
              <a
              href={`#${c.id}`}
              className="mono-label flex items-baseline gap-2 py-1 text-graphite transition-colors duration-300 hover:text-ink"
              data-cursor="link">

                <span className="text-accent">{c.index}</span>
                {c.title.toUpperCase()}
              </a>
            </li>
          )}
        </ul>
      </div>
    </nav>);

}