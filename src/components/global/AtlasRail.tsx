import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { identity } from '../../data/site';
import { gsap, registerGsap } from '../../lib/motion/gsap';
import { subscribeTick } from '../../lib/motion/ticker';
import { scrollToTarget } from '../../lib/motion/scroll';
import { getSection, scrollState, subscribeSection } from '../../lib/motion/section-state';
import { usePageContext } from '../../lib/navigation/pageContext';
import { useMotion } from '../../lib/motion/MotionProvider';
import { AtlasMenu } from './AtlasMenu';

const LINKS = [
{ label: 'WORK', hash: '#work', coord: 'X 01' },
{ label: 'ABOUT', hash: '#about', coord: 'X 02' },
{ label: 'LAB', hash: '#lab', coord: 'X 03' },
{ label: 'CONTACT', hash: '#contact', coord: 'X 04' }];


/** Which rail destination each registered homepage section belongs to. */
const NAV_GROUP: Record<string, string> = {
  work: 'WORK',
  about: 'ABOUT',
  now: 'ABOUT',
  artifact: 'LAB',
  lab: 'LAB',
  tools: 'LAB',
  contact: 'CONTACT'
};

/**
 * CONTEXTUAL ATLAS RAIL
 *
 * Part navigation, part page instrument, part coordinate system. Three states:
 *
 *   A / TOP      quiet: identity, coordinates, destinations. The hero leads.
 *   B / CONTENT  compressed and informative: active section index + title,
 *                document progress as twelve grid ticks.
 *   C / PROJECT  reading context: back to index, project title, current
 *                chapter, next plate.
 *
 * Continuous values (progress, compression threshold) are written straight to
 * the DOM on the shared ticker. React state only ever holds the DISCRETE active
 * section, which changes a handful of times per page.
 */
export function AtlasRail() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const page = usePageContext();
  const { reduced } = useMotion();

  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const rule = useRef<HTMLSpanElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const pct = useRef<HTMLSpanElement>(null);
  const indicator = useRef<HTMLSpanElement>(null);
  const navList = useRef<HTMLUListElement>(null);
  const readout = useRef<HTMLDivElement>(null);

  const isProject = page.kind === 'project';

  /* ---- discrete: has the reader left the top? ---- */
  useEffect(() => {
    let last = false;
    return subscribeTick(() => {
      const next = scrollState.y > 24;
      if (next !== last) {
        last = next;
        setScrolled(next);
      }
    });
  }, []);

  /* ---- discrete: which section owns the viewport? ---- */
  useEffect(() => subscribeSection(setActiveId), []);

  /* ---- continuous: progress ticks + percentage, straight to the DOM ---- */
  useEffect(() => {
    let lastPct = -1;
    return subscribeTick(() => {
      const p = scrollState.progress;
      if (fill.current) {
        fill.current.style.clipPath = `inset(0 ${(1 - p) * 100}% 0 0)`;
      }
      const rounded = Math.round(p * 100);
      if (pct.current && rounded !== lastPct) {
        lastPct = rounded;
        pct.current.textContent = `${String(rounded).padStart(2, '0')}%`;
      }
    });
  }, []);

  /* ---- the hairline draws itself in as the rail becomes a content rail ---- */
  useEffect(() => {
    const el = rule.current;
    if (!el) return;
    registerGsap();
    gsap.to(el, {
      scaleX: scrolled ? 1 : 0,
      duration: reduced ? 0.12 : 0.6,
      ease: 'expo.inOut',
      overwrite: true
    });
  }, [scrolled, reduced]);

  /* ---- the readout morphs rather than swapping ---- */
  const section = getSection(activeId);
  const readoutKey = isProject ?
  `${page.title ?? ''}/${section?.index ?? ''}` :
  `${section?.index ?? ''}${scrolled ? 'c' : 'a'}`;

  useEffect(() => {
    const el = readout.current;
    if (!el) return;
    registerGsap();
    if (reduced) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }
    gsap.fromTo(
      el,
      { opacity: 0, y: 6 },
      { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out', overwrite: true }
    );
  }, [readoutKey, reduced]);

  /* ---- the status tick travels along the nav baseline to the active link ---- */
  const activeNav = useMemo(() => {
    if (isProject) return null;
    if (!activeId) return null;
    return NAV_GROUP[activeId] ?? null;
  }, [activeId, isProject]);

  useEffect(() => {
    const bar = indicator.current;
    const list = navList.current;
    if (!bar || !list) return;
    registerGsap();
    if (!activeNav) {
      gsap.to(bar, { autoAlpha: 0, duration: 0.3, overwrite: true });
      return;
    }
    const item = list.querySelector<HTMLElement>(`[data-nav="${activeNav}"]`);
    if (!item) return;
    const listRect = list.getBoundingClientRect();
    const rect = item.getBoundingClientRect();
    gsap.to(bar, {
      autoAlpha: 1,
      x: rect.left - listRect.left,
      width: rect.width,
      duration: reduced ? 0.12 : 0.5,
      ease: 'power3.out',
      overwrite: true
    });
  }, [activeNav, reduced, scrolled]);

  const goTo = useCallback(
    (hash: string) => {
      setMenuOpen(false);
      if (pathname !== '/') {
        navigate(`/${hash}`);
        return;
      }
      if (!scrollToTarget(hash, -40)) return;
      if (window.history.replaceState) {
        window.history.replaceState(null, '', hash);
      }
    },
    [navigate, pathname]
  );

  const compact = scrolled || isProject;

  return (
    <>
      <header
        className="fixed left-0 right-0 top-0 z-50 transition-[background-color,backdrop-filter] duration-500 ease-atlas"
        style={
        compact ?
        { backgroundColor: 'rgba(244, 242, 237, 0.9)', backdropFilter: 'blur(6px)' } :
        undefined
        }>
        
        <nav className="atlas-grid" aria-label="Primary">
          <div
            className="col-span-4 flex items-center justify-between gap-4 transition-[padding] duration-500 ease-atlas md:col-span-8 xl:col-span-12"
            style={{ paddingBlock: compact ? '0.7rem' : '1rem' }}>
            
            {/* ---------- LEFT: identity + reading context ---------- */}
            <div className="flex min-w-0 items-baseline gap-4 md:gap-6">
              <Link
                to="/"
                className="shrink-0 font-heading text-[1.05rem] font-medium uppercase tracking-tight text-ink"
                aria-label="Dian — home">
                
                {identity.name}
                <span className="ml-2 align-super font-mono text-micro text-graphite">
                  {compact && !isProject ? '/ VECTOR ATLAS' : '/ 2026'}
                </span>
              </Link>

              {isProject && page.backTo ?
              <Link
                to={page.backTo}
                className="link-underline hidden shrink-0 items-center gap-1.5 font-mono text-label uppercase tracking-[0.14em] text-graphite transition-colors duration-300 hover:text-ink sm:inline-flex">
                
                  <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
                  {page.backLabel ?? 'INDEX'}
                </Link> :
              null}
            </div>

            {/* ---------- CENTRE: the instrument ---------- */}
            <div
              ref={readout}
              className="pointer-events-none hidden min-w-0 flex-1 items-baseline justify-center gap-4 md:flex"
              aria-hidden="true">
              
              {isProject ?
              <>
                  <span className="truncate font-mono text-label uppercase tracking-[0.14em] text-ink">
                    {page.title}
                  </span>
                  {section ?
                <span className="shrink-0 font-mono text-micro uppercase tracking-[0.14em] text-graphite">
                      {section.index} / {section.label}
                    </span> :
                null}
                </> :
              compact && section ?
              <span className="font-mono text-label uppercase tracking-[0.14em] text-graphite">
                  <span className="text-ink">{section.index}</span> / {section.label}
                </span> :

              <span className="font-mono text-micro uppercase tracking-[0.16em] text-graphite">
                  N 14.16° / E 121.24°
                </span>
              }
            </div>

            {/* ---------- RIGHT: destinations, progress, index ---------- */}
            <div className="flex shrink-0 items-center gap-5 md:gap-7">
              {!isProject ?
              <ul ref={navList} className="relative hidden items-center gap-6 md:flex">
                  {LINKS.map((link) =>
                <li key={link.label} data-nav={link.label} className="relative">
                      <button
                    type="button"
                    onClick={() => goTo(link.hash)}
                    className="group relative block py-1 font-mono text-label uppercase tracking-[0.14em] text-graphite transition-colors duration-300 hover:text-ink focus-visible:text-ink">
                    
                        <span className="link-underline block transition-transform duration-300 ease-atlas group-hover:-translate-y-[2px] group-focus-visible:-translate-y-[2px]">
                          {link.label}
                        </span>
                        <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -top-3 left-0 font-mono text-[0.5rem] tracking-[0.2em] text-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                      
                          {link.coord}
                        </span>
                      </button>
                    </li>
                )}
                  <span
                  ref={indicator}
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-[3px] left-0 h-[1px] bg-accent opacity-0" />
                
                </ul> :

              <div className="hidden items-baseline gap-5 md:flex">
                  {page.nextTo ?
                <Link
                  to={page.nextTo}
                  data-cursor="view"
                  className="link-underline inline-flex items-baseline gap-1.5 font-mono text-label uppercase tracking-[0.14em] text-graphite transition-colors duration-300 hover:text-ink">
                  
                      NEXT / {page.nextLabel}
                      <ArrowUpRight className="h-3.5 w-3.5 self-center" strokeWidth={1.5} aria-hidden="true" />
                    </Link> :
                null}
                </div>
              }

              {/* progress as twelve grid ticks — the same vertical system as the page */}
              <div className="hidden items-center gap-3 lg:flex" aria-hidden="true">
                <span className="relative block h-[7px] w-[84px]">
                  <span className="absolute inset-0 flex justify-between">
                    {Array.from({ length: 12 }).map((_, i) =>
                    <span key={i} className="block h-full w-[1px] bg-hairline" />
                    )}
                  </span>
                  <span
                    ref={fill}
                    className="absolute inset-0 flex justify-between"
                    style={{ clipPath: 'inset(0 100% 0 0)' }}>
                    
                    {Array.from({ length: 12 }).map((_, i) =>
                    <span key={i} className="block h-full w-[1px] bg-ink" />
                    )}
                  </span>
                </span>
                <span ref={pct} className="font-mono text-micro tabular-nums text-graphite">
                  00%
                </span>
              </div>

              {!isProject ?
              <span className="mono-label hidden items-center gap-2 xl:flex">
                  <span className="h-[5px] w-[5px] bg-accent" aria-hidden="true" />
                  {identity.status}
                </span> :

              <span
                className="mono-label hidden items-center gap-2 xl:flex"
                style={{ color: page.accent }}>
                
                  {page.index} / {page.status}
                </span>
              }

              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-expanded={menuOpen}
                aria-haspopup="dialog"
                className="group flex items-center gap-2 font-mono text-label uppercase tracking-[0.14em] text-ink">
                
                <span className="hidden sm:inline">INDEX</span>
                <span className="flex flex-col items-end gap-[5px]" aria-hidden="true">
                  <span className="block h-[1.5px] w-6 bg-ink transition-[width] duration-500 ease-atlas group-hover:w-4" />
                  <span className="block h-[1.5px] w-4 bg-ink transition-[width] duration-500 ease-atlas group-hover:w-6" />
                </span>
                <span className="sr-only">Open atlas index</span>
              </button>
            </div>
          </div>
        </nav>

        <span
          ref={rule}
          aria-hidden="true"
          className="block h-[1px] w-full origin-left scale-x-0 bg-hairline" />
        
      </header>

      <AtlasMenu
        open={menuOpen}
        onOpenChange={setMenuOpen}
        onNavigate={goTo}
        sections={LINKS.map(({ label, hash }) => ({ label, hash }))} />
      
    </>);

}