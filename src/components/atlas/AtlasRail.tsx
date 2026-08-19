import React, { useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useAtlas } from '../../contexts/AtlasContext';
import { useReducedMotion } from '../../hooks/useEnvironment';
import { preloadProject } from '../../content/projectRegistry';
import { preloadProjectPage } from '../../lib/navigation/projectPrefetch';
import { railState } from '../../lib/atlas/railState';
import { subscribeTick } from '../../lib/motion/ticker';
import { nextCatalogProject } from '../../data/projectCatalog';
import { identity } from '../../data/site';

const TICKS = 24;

/**
 * The contextual header. Three states — TOP (quiet, hero dominant), CONTENT
 * (section index + progress) and PROJECT (case-study instrument). Per-frame
 * values are written straight to the DOM; only discrete state enters React.
 */
export function AtlasRail() {
  const shell = useRef<HTMLElement>(null);
  const ticks = useRef<HTMLSpanElement[]>([]);
  const accent = useRef<HTMLSpanElement>(null);
  const readout = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const location = useLocation();
  const { mode, sections, activeSection, project, chapter, setMenuOpen } = useAtlas();
  const reduced = useReducedMotion();

  const active = sections.find((s) => s.id === activeSection) ?? null;
  const next = project ? nextCatalogProject(project.slug) : null;

  /* progress notation: ticks fill, one accent mark travels, percentage reads out */
  React.useEffect(() => {
    return subscribeTick(() => {
      const p = railState.progress;
      const filled = Math.round(p * TICKS);
      for (let i = 0; i < ticks.current.length; i++) {
        const el = ticks.current[i];
        if (!el) continue;
        const on = i < filled;
        const want = on ? '1' : '0.24';
        if (el.style.opacity !== want) el.style.opacity = want;
      }
      if (accent.current)
      accent.current.style.transform = `translateX(${p * (TICKS - 1) * 6}px)`;
      if (readout.current) {
        const label = `${Math.round(p * 100)}`.padStart(3, '0');
        if (readout.current.textContent !== label) readout.current.textContent = label;
      }
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
    });
  }, []);

  /* INDEX SHIFT — the rail changes register without morphing loudly */
  useGSAP(
    () => {
      const rows = shell.current?.querySelectorAll<HTMLElement>('[data-rail-row]');
      if (!rows?.length) return;
      if (reduced) {
        gsap.set(rows, { yPercent: 0, opacity: 1 });
        return;
      }
      gsap.fromTo(
        rows,
        { yPercent: 40, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.5, ease: 'expo.out', stagger: 0.04 }
      );
    },
    { dependencies: [mode, project?.slug, reduced], scope: shell, revertOnUpdate: true }
  );

  const onTop = mode === 'top';

  return (
    <header
      ref={shell}
      data-rail-mode={mode}
      className={`fixed left-0 right-0 top-0 z-50 transition-colors duration-500 ease-atlas ${
      onTop ? 'border-b border-transparent' : 'border-b border-hairline bg-canvas/95'}`
      }>

      <div className="atlas-grid py-3">
        <div className="col-span-4 flex items-center justify-between gap-4 md:col-span-8 xl:col-span-12">
          {/* LEFT — identity or return path */}
          <div className="flex min-w-0 items-baseline gap-3" data-rail-row>
            {mode === 'project' && project ?
            <>
                <Link
                to="/#work"
                className="mono-label link-underline shrink-0 text-ink"
                data-cursor="link">

                  ← WORK
                </Link>
                <span className="mono-label shrink-0">/ {project.index}</span>
                <span className="truncate font-heading text-[0.95rem] font-medium uppercase tracking-tight text-ink">
                  {project.title}
                </span>
              </> :

            <>
                <Link
                to="/"
                className="font-heading text-[0.95rem] font-medium uppercase tracking-tight text-ink"
                data-cursor="link">

                  {identity.name}
                </Link>
                <span className="mono-label hidden sm:inline">/ 2026</span>
              </>
            }
          </div>

          {/* CENTRE — current position in the document */}
          <div className="hidden min-w-0 flex-1 items-baseline justify-center gap-3 md:flex" data-rail-row>
            {mode === 'project' ?
            <span className="mono-label truncate">
                {chapter ? `CHAPTER / ${chapter}` : 'CASE / READING'}
              </span> :
            mode === 'content' && active ?
            <>
                <span className="mono-label shrink-0 text-accent">{active.index}</span>
                <span className="mono-label truncate text-ink">{active.label}</span>
              </> :

            <nav aria-label="Sections" className="flex items-baseline gap-6">
                {['WORK', 'ABOUT', 'LAB', 'CONTACT'].map((item) =>
              <Link
                key={item}
                to={`/#${item.toLowerCase()}`}
                className="mono-label link-underline hover:text-ink"
                data-cursor="link">

                    {item}
                  </Link>
              )}
              </nav>
            }
          </div>

          {/* RIGHT — progress notation + index */}
          <div className="flex shrink-0 items-center gap-4" data-rail-row>
            {!onTop &&
            <div className="hidden items-center gap-3 lg:flex" aria-hidden="true">
                <div className="relative">
                  <div className="flex items-end gap-[5px]">
                    {Array.from({ length: TICKS }).map((_, i) =>
                  <span
                    key={i}
                    ref={(el) => {if (el) ticks.current[i] = el;}}
                    className="block w-[1px] bg-ink"
                    style={{ height: i % 6 === 0 ? '11px' : '6px', opacity: 0.24 }} />

                  )}
                  </div>
                  <span
                  ref={accent}
                  className="absolute -bottom-[5px] left-0 block h-[3px] w-[1px] bg-accent" />

                </div>
                <span className="font-mono text-micro uppercase tracking-[0.16em] text-graphite">
                  <span ref={readout}>000</span>
                </span>
              </div>
            }

            {mode === 'project' && next &&
            <Link
              to={`/work/${next.slug}`}
              onPointerEnter={() => { preloadProjectPage(); preloadProject(next.slug); }}
              onFocus={() => { preloadProjectPage(); preloadProject(next.slug); }}
              className="mono-label link-underline hidden text-ink sm:inline"
              data-cursor="link">

                NEXT / {next.index}
              </Link>
            }

            {onTop &&
            <span className="mono-label hidden lg:inline">SYSTEM / {identity.meta[2].value}</span>
            }

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="mono-label flex items-center gap-2 border border-hairline px-3 py-1.5 text-ink transition-colors duration-300 ease-atlas hover:border-ink"
              data-cursor="link"
              aria-haspopup="dialog">

              INDEX
              <span className="flex flex-col gap-[3px]" aria-hidden="true">
                <span className="block h-[1px] w-3 bg-ink" />
                <span className="block h-[1px] w-3 bg-ink" />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* travelling hairline: document position as an atlas edge mark */}
      {!onTop &&
      <div className="relative h-[1px] w-full bg-transparent" aria-hidden="true">
          <span
          ref={bar}
          key={location.pathname}
          className="absolute left-0 top-0 block h-[1px] w-full origin-left bg-accent"
          style={{ transform: 'scaleX(0)' }} />

        </div>
      }
    </header>);

}