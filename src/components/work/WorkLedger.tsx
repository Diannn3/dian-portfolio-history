import React, { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { projectCatalog, type ProjectCatalogEntry } from '../../data/projectCatalog';
import { preloadProject } from '../../content/projectRegistry';
import { preloadProjectPage } from '../../lib/navigation/projectPrefetch';
import { usePointerFine, useQuality, useReducedMotion } from '../../hooks/useEnvironment';
import { ProjectPreview } from './ProjectPreview';
import { StudioPractice } from './StudioPractice';
import { WorkEvidenceMedia } from './WorkEvidenceMedia';

const LazyProjectStage = lazy(() =>
  import('./ProjectStage').then((module) => ({ default: module.ProjectStage })),
);

const productProjects = projectCatalog.filter((project) =>
  project.slug === 'uppetite' || project.slug === 'campus-navigation',
);
const studyProjects = projectCatalog.filter((project) =>
  project.slug === 'pasada' || project.slug === 'disaster-response',
);

interface RowProps {
  project: ProjectCatalogEntry;
  product: boolean;
  stageEnabled: boolean;
  onActivate: (project: ProjectCatalogEntry) => void;
}

function ProjectRow({ project, product, stageEnabled, onActivate }: RowProps) {
  return (
    <li
      data-product-entry={product ? project.slug : undefined}
      data-study-entry={!product ? project.slug : undefined}
      className="border-b border-hairline"
    >
      <Link
        to={`/work/${project.slug}`}
        className="group block py-6 outline-offset-4 xl:py-7"
        data-cursor="row"
        onPointerEnter={() => onActivate(project)}
        onFocus={() => onActivate(project)}
        aria-describedby={`ledger-summary-${project.slug}`}
      >
        <div
          className={`flex flex-wrap items-baseline gap-x-5 gap-y-2 transition-opacity duration-500 ease-atlas ${
            stageEnabled && product ? 'opacity-55 group-hover:opacity-100 group-focus-visible:opacity-100' : 'opacity-100'
          }`}
        >
          <span className="mono-label w-7 shrink-0 text-accent">{project.index}</span>
          {!product ? <span className="mono-label shrink-0 text-signal">CONCEPT STUDY</span> : null}
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

        {product ? (
          <div
            data-work-preview={!stageEnabled ? 'inline' : undefined}
            className="mt-5 md:pl-12 xl:max-w-[54ch]"
          >
            <WorkEvidenceMedia project={project} />
          </div>
        ) : !stageEnabled ? (
          <div data-work-preview="inline" className="mt-5 border border-hairline bg-surface/40 p-2">
            <div className="aspect-[16/10] w-full overflow-hidden">
              <ProjectPreview preview={project.preview} />
            </div>
            <p className="mono-label mt-2">CONCEPT STUDY — SYSTEM DIAGRAM / NOT A PRODUCT SCREENSHOT</p>
          </div>
        ) : (
          <div className="mt-5 max-w-[26rem] border border-hairline bg-surface/40 p-2">
            <div className="aspect-[16/10] w-full overflow-hidden">
              <ProjectPreview preview={project.preview} />
            </div>
            <p className="mono-label mt-2">CONCEPT STUDY — SYSTEM DIAGRAM / NOT A PRODUCT SCREENSHOT</p>
          </div>
        )}
      </Link>
    </li>
  );
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-4 flex items-baseline gap-3 border-b border-hairline pb-3 font-mono text-micro uppercase tracking-[0.16em] text-graphite">
      <span className="h-[1px] w-5 bg-accent" aria-hidden="true" />
      {children}
    </h3>
  );
}

/**
 * SELECTED WORK as one evidence-weighted ledger. Product Systems get the
 * shared stage and real DOM evidence; Studio Practice is an external feature;
 * System Studies stay compact and visibly conceptual.
 */
export function WorkLedger() {
  const [activeSlug, setActiveSlug] = useState(productProjects[0]?.slug ?? '');
  const [largeViewport, setLargeViewport] = useState(false);
  const [stageNear, setStageNear] = useState(false);
  const shell = useRef<HTMLDivElement>(null);
  const fine = usePointerFine();
  const reduced = useReducedMotion();
  const { supported, profile } = useQuality();
  const active = productProjects.find((project) => project.slug === activeSlug) ?? productProjects[0];

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
      { rootMargin: '320px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [largeViewport, fine, reduced, supported, profile.tier]);

  const stageEnabled = supported && profile.tier !== 'low' && fine && largeViewport && !reduced;

  const activate = useCallback((project: ProjectCatalogEntry) => {
    if (productProjects.some((candidate) => candidate.slug === project.slug)) {
      setActiveSlug(project.slug);
    }
    preloadProjectPage();
    preloadProject(project.slug);
  }, []);

  return (
    <div ref={shell} className="atlas-grid gap-y-10 pb-6" data-work-registry="product-systems studio-practice system-studies">
      <div className="col-span-4 md:col-span-8 xl:col-span-7">
        <section aria-labelledby="product-systems-title" data-work-group="product-systems">
          <GroupLabel>
            <span id="product-systems-title">Product Systems</span>
          </GroupLabel>
          <ul className="border-t border-hairline">
            {productProjects.map((project) => (
              <ProjectRow
                key={project.slug}
                project={project}
                product
                stageEnabled={stageEnabled}
                onActivate={activate}
              />
            ))}
          </ul>
        </section>

        <section aria-labelledby="studio-practice-title" data-work-group="studio-practice" className="mt-14">
          <GroupLabel>
            <span id="studio-practice-title">Studio Practice</span>
          </GroupLabel>
          <StudioPractice />
        </section>

        <section aria-labelledby="system-studies-title" data-work-group="system-studies" className="mt-14">
          <GroupLabel>
            <span id="system-studies-title">System Studies</span>
          </GroupLabel>
          <ul className="border-t border-hairline">
            {studyProjects.map((project) => (
              <ProjectRow
                key={project.slug}
                project={project}
                product={false}
                stageEnabled={stageEnabled}
                onActivate={activate}
              />
            ))}
          </ul>
        </section>
      </div>

      {stageEnabled && active ? (
        <div data-work-stage-shell className="hidden xl:col-span-5 xl:col-start-8 xl:block">
          <div className="sticky top-28">
            <div className="border border-hairline bg-surface/30">
              <div className="flex items-baseline justify-between border-b border-hairline px-3 py-2">
                <span className="mono-label">STAGE / {active.index} · {active.title}</span>
                <span className="mono-label">PRODUCT SYSTEM</span>
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
            <p className="mono-label mt-3">HOVER OR FOCUS A PRODUCT ROW TO CHANGE THE STAGE</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
