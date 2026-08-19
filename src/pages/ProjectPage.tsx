import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Project } from '../types/project';
import { hasProject, loadProject, preloadProject } from '../content/projectRegistry';
import { nextCatalogProject } from '../data/projectCatalog';
import { getCaseChapters } from '../lib/caseNavigation';
import { setPageContext } from '../lib/navigation/pageContext';
import { useReveals } from '../hooks/useReveals';
import { Seo } from '../components/global/Seo';
import { SplitReveal } from '../components/motion/SplitReveal';
import { ProjectPreview } from '../components/work/ProjectPreview';
import { CaseChapters } from '../components/work/case/CaseChapters';
import { CaseModule, CurrentState, ProjectLinks } from '../components/work/case/CaseModules';
import { NotFound } from './NotFound';

export function ProjectPage() {
  const { slug } = useParams<{slug: string;}>();
  const scope = useRef<HTMLDivElement>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [loadedSlug, setLoadedSlug] = useState<string | null>(null);

  useReveals(scope, [slug, loadedSlug]);

  useEffect(() => {
    let current = true;
    setProject(null);
    setLoadedSlug(null);
    if (!hasProject(slug)) return () => {current = false;};
    loadProject(slug).then((result) => {
      if (!current || !result) return;
      setProject(result);
      setLoadedSlug(slug);
    });
    return () => {
      current = false;
    };
  }, [slug]);

  const next = project ? nextCatalogProject(project.slug) : null;

  /* feed the contextual rail: back target, title, plate number, next plate */
  useEffect(() => {
    if (!project || !next) return;
    setPageContext({
      kind: 'project',
      title: project.title,
      index: project.index,
      status: project.status,
      accent: project.accent,
      backTo: '/#work',
      backLabel: 'WORK',
      nextTo: `/work/${next.slug}`,
      nextLabel: next.title.split(' ')[0].toUpperCase()
    });
  }, [project, next]);

  const chapters = useMemo(
    () => project ? getCaseChapters(project.modules) : [],
    [project]
  );

  if (!hasProject(slug)) return <NotFound />;

  if (!project || loadedSlug !== slug) {
    return (
      <main
        id="main"
        className="min-h-[70vh] pt-[8rem]"
        aria-busy="true"
        aria-label="Loading project" />);


  }

  return (
    <div ref={scope} className="pt-[5.5rem]">
      <Seo
        title={`${project.title} — ${project.category} / Dian`}
        description={project.summary}
        path={`/work/${project.slug}`}
        image={project.socialImage} />
      

      <main id="main">
        {/* ---------------- INTRO ---------------- */}
        <header className="pt-8 md:pt-16">
          <div className="atlas-grid">
            <div className="col-span-4 flex items-baseline justify-between gap-6 border-t border-ink pt-4 md:col-span-8 xl:col-span-12">
              <span className="mono-label text-ink">
                PLATE {project.index} / {project.category.toUpperCase()}
              </span>
              <span className="mono-label" style={{ color: project.accent }}>
                {project.status}
              </span>
            </div>
          </div>

          <div className="atlas-grid mt-10 md:mt-14">
            <SplitReveal
              element="h1"
              lines={[project.title]}
              className="col-span-4 font-heading text-display-1 font-medium uppercase leading-[0.86] md:col-span-8 xl:col-span-9" />
            

            <p className="col-span-4 mt-6 text-body-lg text-ink md:col-span-6 xl:col-span-6">
              {project.thesis}
            </p>

            <dl className="col-span-4 mt-8 md:col-span-2 xl:col-span-3 xl:col-start-10 xl:row-start-1 xl:mt-0">
              {[
              ['ROLE', project.role.join(', ')],
              ['PERIOD', project.period],
              ['STATE', project.status],
              ...(project.evidenceLevel ? [['EVIDENCE', project.evidenceLevel]] : [])].
              map(([k, v]) =>
              <div key={k} className="border-t border-hairline py-2">
                  <dt className="mono-label">{k}</dt>
                  <dd className="mt-1 text-note text-ink">{v}</dd>
                </div>
              )}
            </dl>

            {project.links?.length ?
            <div className="col-span-4 mt-8 md:col-span-8 xl:col-span-5 xl:col-start-8">
                <ProjectLinks links={project.links} />
              </div> :
            null}
          </div>

          {/* visual stage */}
          <div className="atlas-grid mt-12 md:mt-16">
            <div
              className="col-span-4 aspect-[16/10] overflow-hidden border border-ink md:col-span-8 xl:col-span-12"
              data-clip>
              
              <ProjectPreview preview={project.preview} />
            </div>
            <div className="col-span-4 mt-3 flex flex-col gap-1 md:col-span-8 md:flex-row md:items-baseline md:justify-between xl:col-span-12">
              <span className="mono-label">SYSTEM DIAGRAM — NOT A PRODUCT SCREENSHOT</span>
              <span className="mono-label">{project.verification}</span>
            </div>
          </div>

          {project.currentState?.length ? <CurrentState items={project.currentState} /> : null}
        </header>

        {/* ---------------- CHAPTERS ---------------- */}
        <div className="atlas-grid mt-14 md:mt-20">
          <div className="col-span-4 md:col-span-8 xl:col-span-12">
            <div className="xl:hidden">
              <CaseChapters chapters={chapters} />
            </div>
          </div>
        </div>

        <div className="atlas-grid mt-0 hidden xl:mt-6 xl:grid">
          <div className="xl:col-span-2 xl:col-start-1">
            <CaseChapters chapters={chapters} />
          </div>
        </div>

        <div>
          {project.modules.map((module, i) =>
          <CaseModule key={module.title} module={module} project={project} index={i + 1} />
          )}
        </div>

        {/* ---------------- TECHNOLOGY ---------------- */}
        <section id="case-technology" className="anchor-offset pt-24 md:pt-36">
          <div className="atlas-grid">
            <div className="col-span-4 flex items-baseline justify-between border-t border-ink pt-4 md:col-span-8 xl:col-span-12">
              <h2 className="mono-label flex items-baseline gap-3 text-ink">
                <span className="text-graphite">
                  {String(project.modules.length + 1).padStart(2, '0')}
                </span>
                <span>TECHNOLOGY</span>
              </h2>
            </div>
          </div>
          <div className="atlas-grid mt-8">
            {project.technologies.map((group) =>
            <div
              key={group.group}
              className="col-span-4 border-t border-hairline py-4 md:col-span-4 xl:col-span-4">
              
                <div className="flex items-baseline justify-between gap-4">
                  <span className="mono-label text-ink">{group.group}</span>
                  <span className="mono-label">{group.intent.toUpperCase()}</span>
                </div>
                <ul className="mt-3 space-y-1">
                  {group.items.map((item) =>
                <li key={item} className="text-note text-graphite">
                      {item}
                    </li>
                )}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* ---------------- NEXT ---------------- */}
        {next ?
        <section className="mt-24 md:mt-36">
            <Link
            to={`/work/${next.slug}`}
            data-cursor="view"
            onPointerEnter={() => preloadProject(next.slug)}
            onFocus={() => preloadProject(next.slug)}
            className="group block border-t border-ink">
            
              <div className="atlas-grid items-baseline py-10 md:py-14">
                <span className="col-span-1 mono-label">NEXT</span>
                <h2 className="col-span-3 font-heading text-display-2 font-medium uppercase md:col-span-6 xl:col-span-9">
                  <span className="inline-block transition-transform duration-[600ms] ease-atlas group-hover:translate-x-3">
                    {next.title}
                  </span>
                </h2>
                <span className="col-span-4 mt-2 flex items-center justify-end gap-3 md:col-span-1 md:mt-0 xl:col-span-2">
                  <span className="mono-label">{next.index}</span>
                  <ArrowRight
                  className="h-4 w-4 text-graphite transition-transform duration-500 ease-atlas group-hover:translate-x-1"
                  strokeWidth={1.5}
                  aria-hidden="true" />
                
                </span>
              </div>
            </Link>
          </section> :
        null}
      </main>
    </div>);

}