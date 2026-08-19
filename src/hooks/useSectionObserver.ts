import { useEffect } from 'react';
import { useAtlas, type SectionMeta } from '../contexts/AtlasContext';

/**
 * Registers a page's sections with the header and reports which one currently
 * owns the viewport. Discrete only — nothing here runs per frame.
 */
export function useSectionObserver(sections: SectionMeta[]) {
  const { registerSections, setActiveSection } = useAtlas();

  useEffect(() => {
    registerSections(sections);
    return () => {
      registerSections([]);
      setActiveSection(null);
    };
  }, [sections, registerSections, setActiveSection]);

  useEffect(() => {
    const nodes = sections.
    map((s) => document.getElementById(s.id)).
    filter((n): n is HTMLElement => Boolean(n));
    if (!nodes.length) return;

    const visible = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => visible.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0));
        let bestId: string | null = null;
        let best = 0;
        sections.forEach((s) => {
          const ratio = visible.get(s.id) ?? 0;
          if (ratio > best) {
            best = ratio;
            bestId = s.id;
          }
        });
        if (bestId) setActiveSection(bestId);
      },
      { threshold: [0, 0.15, 0.35, 0.6, 0.85], rootMargin: '-96px 0px -40% 0px' }
    );

    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [sections, setActiveSection]);
}