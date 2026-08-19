import React, { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { projectCatalog } from '../../data/projectCatalog';
import { preloadProject } from '../../content/projectRegistry';
import { preloadProjectPage } from '../../lib/navigation/projectPrefetch';
import { usePointerFine, useQuality, useReducedMotion } from '../../hooks/useEnvironment';
import { ProjectPreview } from './ProjectPreview';

const LazyProjectStage = lazy(() =>
  import('./ProjectStage').then((module) => ({ default: module.ProjectStage }))
);

/**
 * SELECTED WORK as an expanding ledger. The authored SVG previews remain the
 * universal fallback; one shared Three.js stage is progressively enhanced on
 * large, fine-pointer desktops and is loaded only when the ledger is near view.
 */
export function WorkLedger() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [largeViewport, setLargeViewport] = useState(false);
  const [stageNear, setStageNear] = useState(false);
  const shell = useRef<HTMLDivElement>(null);
  const fine = usePointerFine();
  const reduced = useReducedMotion();
  const { supported, profile } = useQuality();
  const active = projectCatalog[activeIndex];

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1280px)');
    const update = () => setLargeViewport(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const el = shell.current;
    if (!el || !largeViewport || !fine || reduced || !supported || profile.tier === 'low') {
      setStageNear(false);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setStageNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: '320px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [largeViewport, fine, reduced, supported, profile.tier]);

  const stageEnabled = supported && profile.tier !== 'low' && fine && largeViewport && !reduced;

  const activate = useCallback((index: number, slug: string) => {
    setActiveIndex(index);
    preloadProjectPage();
    preloadProject(slug);
  }, []);

  return (
    <div ref={shell} className="atlas-grid gap-y-10 pb-6">
      <div className="col-span-4 md:col-span-8 xl:col-span-7">
        <ul className="border-t border-hairline">
          {projectCatalog.map((project, index) => {
            const isActive = index === activeIndex;
            return (
              <li key={project.slug} className="border-b border-hairline">
                <Link
                  to={`/work/${project.slug}`}
                  className="group block py-6 outline-offset-4 xl:py-7"
                  data-cursor="row"
                  onPointerEnter={() => activate(index, project.slug)}
                  onFocus={() => activate(index, project.slug)}
                  aria-describedby={`ledger-summary-${project.slug}`}
                >
                  <div
                    className={`flex flex-wrap items-baseline gap-x-5 gap-y-2 transition-opacity duration-500 ease-atlas ${
                      stageEnabled && !isActive ? 'opacity-55 group-hover:opacity-100 group-focus-visible:opacity-100' : 'opacity-100'
                    }`}
                  >
                    <span className={`mono-label w-7 shrink-0 ${isActive ? 'text-accent' : ''}`}>
                      {project.index}
                    </span>
                    <h3 className="font-heading text-display-3 font-medium uppercase leading-none text-ink transition-transform duration-500 ease-atlas group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5 xl:text-display-2">
                      {project.title}
                    </h3>
                    <span className="mono-label ml-auto shrink-0">{project.status}</span>
                    <span className="mono-label hidden shrink-0 md:inline">{project.period}</span>
                  </div>

                  <div className="mt-3 flex flex-wrap items-baseline gap-x-6 gap-y-2 md:pl-12">
                    <span className="mono-label">{project.category}</span>
                    <span id={`ledger-summary-${project.slug}`} className="max-w-[52ch] text-read-sm text-graphite">
                      {project.summary}
                    </span>
                  </div>

                  {!stageEnabled ? (
                    <div data-work-preview="inline" className="mt-5 border border-hairline bg-surface/40 p-2">
                      <div className="aspect-[16/10] w-full overflow-hidden">
                        <ProjectPreview preview={project.preview} />
                      </div>
                      <p className="mono-label mt-2">SYSTEM DIAGRAM — NOT A PRODUCT SCREENSHOT</p>
                    </div>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {stageEnabled ? (
        <div data-work-stage-shell className="hidden xl:col-span-5 xl:col-start-8 xl:block">
          <div className="sticky top-28">
            <div className="border border-hairline bg-surface/30">
              <div className="flex items-baseline justify-between border-b border-hairline px-3 py-2">
                <span className="mono-label">STAGE / {active.index} · {active.title}</span>
                <span className="mono-label">LIVE</span>
              </div>
              <div className="aspect-[4/3] w-full">
                {stageNear ? (
                  <Suspense
                    fallback={
                      <div className="h-full w-full p-2">
                        <ProjectPreview preview={active.preview} />
                      </div>
                    }
                  >
                    <LazyProjectStage variant={active.preview} reduced={false} />
                  </Suspense>
                ) : (
                  <div className="h-full w-full p-2">
                    <ProjectPreview preview={active.preview} />
                  </div>
                )}
              </div>
              <div className="border-t border-hairline px-3 py-2">
                <span className="mono-label">SYSTEM DIAGRAM — NOT A PRODUCT SCREENSHOT</span>
              </div>
            </div>
            <p className="mono-label mt-3">HOVER OR FOCUS A ROW TO CHANGE THE STAGE</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
