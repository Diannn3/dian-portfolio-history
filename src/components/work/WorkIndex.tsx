import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { projectCatalog } from '../../data/projectCatalog';
import { preloadProjectPage } from '../../lib/navigation/projectPrefetch';
import { preloadProject } from '../../content/projectRegistry';
import { ProjectPreview } from './ProjectPreview';
import { usePointerFine, useReducedMotion } from '../../hooks/useEnvironment';

export function WorkIndex() {
  const [active, setActive] = useState<number | null>(null);
  const floater = useRef<HTMLDivElement>(null);
  const fine = usePointerFine();
  const reduced = useReducedMotion();

  /* one shared interaction loop for the whole index, not one per row */
  useEffect(() => {
    if (!fine || !floater.current) return;
    const el = floater.current;
    const xTo = gsap.quickTo(el, 'x', { duration: reduced ? 0 : 0.55, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: reduced ? 0 : 0.7, ease: 'power3.out' });
    const onMove = (e: PointerEvent) => {
      xTo(e.clientX - 190);
      yTo(e.clientY - 260);
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, [fine, reduced]);

  const current = active === null ? null : projectCatalog[active];

  return (
    <section id="work" className="relative pt-24 md:pt-36" aria-labelledby="work-heading">
      <div className="atlas-grid">
        <div className="col-span-4 flex items-baseline justify-between border-t border-ink pt-4 md:col-span-8 xl:col-span-12">
          <h2 id="work-heading" className="mono-label text-ink">
            SELECTED WORK
          </h2>
          <span className="mono-label">{String(projectCatalog.length).padStart(2, '0')} ENTRIES / 2026</span>
        </div>
      </div>

      <ul className="mt-2">
        {projectCatalog.map((project, i) => {
          const isActive = active === i;
          return (
            <li key={project.slug}>
              <Link
                to={`/work/${project.slug}`}
                className="group block border-b border-hairline transition-colors duration-500 ease-atlas hover:border-ink focus-visible:border-ink"
                data-cursor="view"
                onPointerEnter={() => { setActive(i); preloadProjectPage(); preloadProject(project.slug); }}
                onPointerLeave={() => setActive((prev) => prev === i ? null : prev)}
                onFocus={() => { setActive(i); preloadProjectPage(); preloadProject(project.slug); }}
                onBlur={() => setActive((prev) => prev === i ? null : prev)}
                aria-label={`${project.title} — ${project.category}, ${project.status}`}>
                
                <div className="atlas-grid items-baseline py-6 md:py-8">
                  <span className="col-span-1 font-mono text-label text-graphite md:col-span-1">
                    {project.index}
                  </span>
                  <h3 className="col-span-3 font-heading text-display-2 font-medium uppercase md:col-span-4 xl:col-span-5">
                    <span
                      className="inline-block transition-transform duration-[600ms] ease-atlas group-hover:translate-x-2 group-focus-visible:translate-x-2"
                      style={{ color: isActive ? project.accent : 'var(--ink)' }}>
                      
                      {project.title}
                    </span>
                  </h3>
                  <p className="col-span-4 mt-2 text-[0.9rem] text-graphite md:col-span-2 md:mt-0 xl:col-span-3">
                    {project.category}
                  </p>
                  <span className="col-span-3 mt-1 font-mono text-label uppercase text-graphite md:col-span-1 md:mt-0 xl:col-span-2">
                    {project.status}
                  </span>
                  <span className="col-span-1 flex justify-end md:col-span-1">
                    <ArrowUpRight
                      className="h-4 w-4 shrink-0 -translate-y-[2px] text-graphite transition-all duration-500 ease-atlas group-hover:translate-x-1 group-hover:text-ink group-focus-visible:text-ink"
                      strokeWidth={1.5}
                      aria-hidden="true" />
                    
                  </span>
                </div>

                {/* mobile: previews are inline, never hover-dependent */}
                <div className="atlas-grid pb-8 md:hidden">
                  <div className="col-span-4 aspect-[16/10] overflow-hidden border border-hairline">
                    <ProjectPreview preview={project.preview} />
                  </div>
                </div>
              </Link>
            </li>);

        })}
      </ul>

      {fine &&
      <div
        ref={floater}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-40 hidden w-[380px] md:block"
        style={{ opacity: current ? 1 : 0, transition: 'opacity 380ms cubic-bezier(0.16,0.84,0.24,1)' }}>
        
          <div className="border border-ink bg-canvas shadow-[6px_6px_0_0_rgba(17,17,17,0.06)]">
            <div className="aspect-[16/10] overflow-hidden">
              {current && <ProjectPreview preview={current.preview} />}
            </div>
            <div className="flex items-center justify-between border-t border-ink px-3 py-2">
              <span className="font-mono text-micro uppercase tracking-[0.16em] text-graphite">
                {current ? current.period : ''}
              </span>
              <span
              className="font-mono text-micro uppercase tracking-[0.16em]"
              style={{ color: current?.accent }}>
              
                {current ? current.status : ''}
              </span>
            </div>
          </div>
        </div>
      }
    </section>);

}