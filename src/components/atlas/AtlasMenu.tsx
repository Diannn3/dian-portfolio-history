import React, { useEffect, useRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Link, useNavigate } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useAtlas } from '../../contexts/AtlasContext';
import { projectCatalog } from '../../data/projectCatalog';
import { contactLinks, identity } from '../../data/site';
import { preloadProject } from '../../content/projectRegistry';
import { getLenis } from '../../lib/motion/smoothScroll';
import { useReducedMotion } from '../../hooks/useEnvironment';

const SECTIONS = [
{ id: 'work', index: '01', label: 'SELECTED WORK' },
{ id: 'about', index: '02', label: 'ABOUT' },
{ id: 'now', index: '03', label: 'CURRENT VECTOR' },
{ id: 'artifact', index: '04', label: 'DIGITAL ARTIFACT' },
{ id: 'lab', index: '05', label: 'LAB' },
{ id: 'tools', index: '06', label: 'TOOLS' },
{ id: 'contact', index: '07', label: 'CONTACT' }];


/**
 * Fullscreen index. Radix Dialog supplies the focus trap, Escape handling and
 * focus restoration; Lenis is paused while it is open so there is one scroll
 * owner at a time. Background field is SVG — no second GPU context.
 */
export function AtlasMenu() {
  const { menuOpen, setMenuOpen } = useAtlas();
  const panel = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const navigate = useNavigate();

  /** close, return to the index route if needed, then bring the section into view */
  const goToSection = (event: React.MouseEvent, id: string) => {
    event.preventDefault();
    setMenuOpen(false);
    const scroll = () => {
      const el = document.getElementById(id);
      if (!el) return;
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(el, { offset: -96 });else
      el.scrollIntoView({ block: 'start' });
    };
    if (window.location.pathname !== '/') {
      navigate('/');
      window.setTimeout(scroll, 220);
      return;
    }
    requestAnimationFrame(scroll);
  };

  useEffect(() => {
    const lenis = getLenis();
    if (!lenis) return;
    if (menuOpen) lenis.stop();else
    lenis.start();
    return () => lenis.start();
  }, [menuOpen]);

  useGSAP(
    () => {
      if (!menuOpen || !panel.current) return;
      const rows = panel.current.querySelectorAll<HTMLElement>('[data-menu-row]');
      const rules = panel.current.querySelectorAll<HTMLElement>('[data-menu-rule]');
      if (reduced) {
        gsap.set(rows, { yPercent: 0, opacity: 1 });
        gsap.set(rules, { scaleX: 1 });
        return;
      }
      gsap.fromTo(
        rules,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.7, ease: 'expo.inOut', stagger: 0.03, transformOrigin: 'left center' }
      );
      gsap.fromTo(
        rows,
        { yPercent: 60, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.75, ease: 'expo.out', stagger: 0.045, delay: 0.04 }
      );
    },
    { dependencies: [menuOpen, reduced], scope: panel, revertOnUpdate: true }
  );

  return (
    <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-ink/10" />
        <Dialog.Content
          className="fixed inset-0 z-[61] overflow-y-auto bg-canvas focus:outline-none"
          aria-label="Atlas index">

          <div ref={panel} className="relative min-h-full">
            {/* background field: flat SVG notation, not a WebGL context */}
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              aria-hidden="true"
              preserveAspectRatio="none"
              viewBox="0 0 100 100">

              {Array.from({ length: 12 }).map((_, i) =>
              <line
                key={`v${i}`}
                x1={i * 9 + 4}
                y1="0"
                x2={i * 9 + 4}
                y2="100"
                stroke="var(--hairline)"
                strokeWidth="0.08" />

              )}
              <path
                d="M2 78 C 22 70, 30 40, 52 36 S 82 44, 98 18"
                fill="none"
                stroke="var(--accent)"
                strokeOpacity="0.35"
                strokeWidth="0.18" />

            </svg>

            <div className="atlas-grid relative py-5">
              <div className="col-span-4 flex items-center justify-between md:col-span-8 xl:col-span-12">
                <span className="mono-label">INDEX / VECTOR ATLAS</span>
                <Dialog.Close
                  className="mono-label flex items-center gap-2 border border-hairline px-3 py-1.5 text-ink transition-colors duration-300 ease-atlas hover:border-ink"
                  data-cursor="link">

                  CLOSE ✕
                </Dialog.Close>
              </div>
            </div>

            <div className="atlas-grid relative gap-y-12 pb-16 pt-6">
              <div className="col-span-4 md:col-span-5 xl:col-span-7">
                <Dialog.Title className="mono-label mb-4">PROJECTS</Dialog.Title>
                <ul>
                  {projectCatalog.map((p) =>
                  <li key={p.slug}>
                      <span data-menu-rule className="block h-[1px] w-full origin-left bg-hairline" />
                      <Link
                      to={`/work/${p.slug}`}
                      onClick={() => setMenuOpen(false)}
                      onMouseEnter={() => preloadProject(p.slug)}
                      onFocus={() => preloadProject(p.slug)}
                      className="group flex items-baseline gap-4 py-4 md:py-5"
                      data-cursor="row">

                        <span className="mono-label w-8 shrink-0 text-accent">{p.index}</span>
                        <span className="overflow-hidden">
                          <span
                          data-menu-row
                          className="block font-heading text-display-2 font-medium uppercase leading-[0.95] text-ink transition-transform duration-500 ease-atlas group-hover:translate-x-2">

                            {p.title}
                          </span>
                        </span>
                        <span className="mono-label ml-auto hidden shrink-0 self-center md:inline">
                          {p.status}
                        </span>
                      </Link>
                    </li>
                  )}
                  <li>
                    <span data-menu-rule className="block h-[1px] w-full origin-left bg-hairline" />
                  </li>
                </ul>
              </div>

              <div className="col-span-4 md:col-span-3 xl:col-span-4 xl:col-start-9">
                <p className="mono-label mb-4">SECTIONS</p>
                <ul className="mb-10 flex flex-col gap-1">
                  {SECTIONS.map((s) =>
                  <li key={s.id} className="overflow-hidden">
                      <a
                      href={`/#${s.id}`}
                      onClick={(e) => goToSection(e, s.id)}
                      data-menu-row
                      className="flex items-baseline gap-3 py-1 text-read text-graphite transition-colors duration-300 hover:text-ink"
                      data-cursor="link">

                        <span className="mono-label w-6 shrink-0">{s.index}</span>
                        {s.label}
                      </a>
                    </li>
                  )}
                </ul>

                <p className="mono-label mb-3">CONTACT</p>
                <ul className="flex flex-col gap-2">
                  {contactLinks.map((c) =>
                  <li key={c.label} className="overflow-hidden">
                      <a
                      data-menu-row
                      href={c.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="link-underline text-read text-ink"
                      data-cursor="link">

                        {c.value} ↗<span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    </li>
                  )}
                </ul>

                <p className="mono-label mt-10">
                  {identity.meta.map((m) => `${m.key} ${m.value}`).join(' / ')}
                </p>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>);

}