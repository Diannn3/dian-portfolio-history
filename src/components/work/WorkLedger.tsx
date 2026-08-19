import React, { Suspense, lazy, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { projectCatalog } from '../../data/projectCatalog';
import { preloadProject } from '../../content/projectRegistry';
import { preloadProjectPage } from '../../lib/navigation/projectPrefetch';
import { playRowDepart } from '../../lib/motion/transitions';
import { useInViewport, useNearViewport } from '../../hooks/useEnvironment';
import { useMotion } from '../../lib/motion/MotionProvider';
import { SectionFrame } from '../global/SectionFrame';
import { ProjectPreview } from './ProjectPreview';

const ProjectStage = lazy(() =>
import('./ProjectStage').then((m) => ({ default: m.ProjectStage }))
);

/**
 * EXPANDING PROJECT LEDGER
 *
 * A ledger, not four cards. Rows keep their number, title, category and status
 * at rest; on hover or keyboard focus the row opens by one band, its rule draws
 * across, neighbouring rows recede, and the shared stage to the right routes to
 * that project's spatial scene.
 *
 * Nothing here is hover-only: the category, status and period are always in the
 * DOM, and on touch the SVG preview sits inline in the row.
 */
export function WorkLedger() {
  const [active, setActive] = useState<number | null>(null);
  const shell = useRef<HTMLDivElement>(null);
  const rows = useRef<(HTMLAnchorElement | null)[]>([]);
  const { profile, reduced } = useMotion();

  const near = useNearViewport(shell, '300px');
  const inView = useInViewport(shell, 0.02);
  const spatial = profile.spatial && near;

  const current = active === null ? projectCatalog[0] : projectCatalog[active];

  return (
    <SectionFrame
      id="work"
      index="01"
      title="Selected work"
      nav="#work"
      annotation={`${String(projectCatalog.length).padStart(2, '0')} PLATES / 2026`}
      className="pt-24 md:pt-36">
      
      <div ref={shell} className="atlas-grid mt-2 items-start">
        {/* ---------------- the ledger ---------------- */}
        <ul className="col-span-4 md:col-span-8 xl:col-span-7">
          {projectCatalog.map((project, i) => {
            const on = active === i;
            const dim = active !== null && !on;
            return (
              <li key={project.slug}>
                <Link
                  ref={(el) => {rows.current[i] = el;}}
                  to={`/work/${project.slug}`}
                  data-cursor="view"
                  className="group block border-b border-hairline outline-offset-4 transition-[opacity,border-color] duration-500 ease-atlas hover:border-ink focus-visible:border-ink"
                  style={{ opacity: dim ? 0.42 : 1 }}
                  onPointerEnter={() => {
                    setActive(i);
                    preloadProjectPage();
                    preloadProject(project.slug);
                  }}
                  onPointerLeave={() => setActive((prev) => prev === i ? null : prev)}
                  onFocus={() => {
                    setActive(i);
                    preloadProjectPage();
                    preloadProject(project.slug);
                  }}
                  onBlur={() => setActive((prev) => prev === i ? null : prev)}
                  onClick={() => playRowDepart(rows.current[i], reduced)}
                  aria-label={`${project.title} — ${project.category}, ${project.status}`}>
                  
                  <div
                    className="flex items-baseline gap-4 transition-[padding] duration-500 ease-atlas md:gap-6"
                    style={{
                      paddingTop: on && profile.pointer ? '2.1rem' : '1.5rem',
                      paddingBottom: on && profile.pointer ? '2.1rem' : '1.5rem'
                    }}>
                    
                    <span className="w-6 shrink-0 font-mono text-label text-graphite">
                      {project.index}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-heading text-display-2 font-medium uppercase leading-[0.98]">
                        <span
                          className="inline-block transition-transform duration-[600ms] ease-atlas group-hover:translate-x-2 group-focus-visible:translate-x-2"
                          style={{ color: on ? project.accent : 'var(--ink)' }}>
                          
                          {project.title}
                        </span>
                      </span>
                      <span className="mt-2 flex flex-wrap items-baseline gap-x-5 gap-y-1">
                        <span className="text-note text-graphite">{project.category}</span>
                        <span
                          className="font-mono text-micro uppercase tracking-[0.14em]"
                          style={{ color: on ? project.accent : 'var(--graphite)' }}>
                          
                          {project.status}
                        </span>
                        <span className="font-mono text-micro uppercase tracking-[0.14em] text-graphite">
                          {project.period}
                        </span>
                      </span>
                    </span>
                    <ArrowUpRight
                      className="h-4 w-4 shrink-0 -translate-y-[2px] text-graphite transition-all duration-500 ease-atlas group-hover:translate-x-1 group-hover:text-ink group-focus-visible:text-ink"
                      strokeWidth={1.5}
                      aria-hidden="true" />
                    
                  </div>

                  {/* the rule that extends on focus, and stretches on departure */}
                  <span
                    data-row-rule
                    aria-hidden="true"
                    className="block h-[1px] w-full origin-left bg-accent transition-transform duration-[600ms] ease-atlas"
                    style={{ transform: `scaleX(${on ? 1 : 0})` }} />
                  

                  {/* touch + no-hover: the preview is inline, never hover-gated */}
                  <div className="pb-6 md:hidden">
                    <div className="aspect-[16/10] overflow-hidden border border-hairline">
                      <ProjectPreview preview={project.preview} />
                    </div>
                  </div>
                </Link>
              </li>);

          })}
        </ul>

        {/* ---------------- the shared stage ---------------- */}
        <div className="col-span-4 hidden md:col-span-8 md:mt-12 md:block xl:col-span-4 xl:col-start-9 xl:mt-2">
          <div className="sticky top-[calc(var(--rail)+3rem)]">
            <div
              className="aspect-square w-full overflow-hidden border border-ink bg-surface"
              data-settle>
              
              {spatial ?
              <Suspense
                fallback={
                <div className="h-full w-full opacity-50">
                      <ProjectPreview preview={current.preview} />
                    </div>
                }>
                
                  <ProjectStage preview={current.preview} active={inView} />
                </Suspense> :

              <ProjectPreview preview={current.preview} />
              }
            </div>
            <div className="mt-3 flex items-baseline justify-between gap-4 border-t border-hairline pt-3">
              <span className="mono-label">
                {active === null ? 'STAGE / IDLE' : `PLATE ${current.index}`}
              </span>
              <span
                className="font-mono text-micro uppercase tracking-[0.14em]"
                style={{ color: current.accent }}>
                
                {active === null ? 'HOVER OR TAB A ROW' : current.status}
              </span>
            </div>
            <p className="mt-3 max-w-[38ch] text-note text-graphite">
              {active === null ?
              'One stage, one WebGL context, four systems. The rows drive it; it never duplicates them.' :
              current.summary}
            </p>
          </div>
        </div>
      </div>
    </SectionFrame>);

}