import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { hasProject, loadProject, preloadProject } from '../content/projectRegistry';
import type { Project } from '../types/project';
import { nextCatalogProject } from '../data/projectCatalog';
import { ProjectPreview } from '../components/work/ProjectPreview';
import { CaseModule } from '../components/work/case/CaseModules';
import { ProjectLinks } from '../components/work/case/ProjectLinks';
import { CaseIndex } from '../components/work/case/CaseIndex';
import { CurrentState } from '../components/work/case/CurrentState';
import { Seo } from '../components/global/Seo';
import { useAtlas } from '../contexts/AtlasContext';
import { useReveals } from '../hooks/useReveals';
import { NotFound } from './NotFound';

export function ProjectPage() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loadedSlug, setLoadedSlug] = useState<string | null>(null);
  const scope = useRef<HTMLDivElement>(null);
  const { setMode, setProject: setRailProject, setChapter } = useAtlas();
  useReveals(scope, [slug, loadedSlug]);

  useEffect(() => {
    if (hasProject(slug)) setMode('project');
  }, [slug, setMode]);

  useEffect(() => {
    let current = true;
    setProject(null);
    setLoadedSlug(null);
    if (!hasProject(slug)) return () => { current = false; };
    loadProject(slug).then((result) => {
      if (!current || !result) return;
      setProject(result);
      setLoadedSlug(slug);
    });
    return () => { current = false; };
  }, [slug]);

  useEffect(() => {
    if (!project) return;
    setMode('project');
    setRailProject({ slug: project.slug, index: project.index, title: project.title });
    return () => {
      setRailProject(null);
      setChapter(null);
    };
  }, [project, setMode, setRailProject, setChapter]);

  // RouteLifecycle remains the single scroll owner. This event simply tells it
  // that the lazy case module has committed its chapter DOM for a hash deep
  // link, avoiding a race with the initial retry window.
  useEffect(() => {
    if (!project || loadedSlug !== slug) return;
    const timer = window.setTimeout(() => {
      window.dispatchEvent(new Event('vector:route-ready'));
    }, 0);
    return () => window.clearTimeout(timer);
  }, [project, loadedSlug, slug]);

  if (!hasProject(slug)) return <NotFound />;
  if (!project || loadedSlug !== slug) {
    return <main id="main" className="min-h-[70vh] pt-[8rem]" aria-busy="true" aria-label="Loading project" />;
  }

  const next = nextCatalogProject(project.slug);

  return (
    <div ref={scope} className="pt-[5.5rem]">
      <Seo
        title={`${project.title} — ${project.category} / Dian`}
        description={project.summary}
        path={`/work/${project.slug}`}
        image={project.socialImage}
      />

      <main id="main">
        <header className="pt-8 md:pt-16">
          <div className="atlas-grid">
            <div className="col-span-4 flex items-baseline justify-between border-t border-ink pt-4 md:col-span-8 xl:col-span-12">
              <Link to="/#work" className="link-underline mono-label text-ink">
                <ArrowLeft className="mr-2 inline h-3.5 w-3.5 -translate-y-[1px]" strokeWidth={1.5} aria-hidden="true" />
                INDEX
              </Link>
              <span className="mono-label text-accent">
                {project.index} / {project.status}
              </span>
            </div>
          </div>

          <div className="atlas-grid mt-10 gap-y-8 md:mt-14" data-reveal-group>
            <h1 className="col-span-4 font-heading text-display-1 font-medium uppercase leading-[0.86] md:col-span-8 xl:col-span-9">
              <span className="reveal-line" data-reveal>
                <span>{project.title}</span>
              </span>
            </h1>
            <p className="col-span-4 max-w-[48ch] text-read-lg text-ink md:col-span-6 xl:col-span-6">
              {project.thesis}
            </p>
            <dl className="col-span-4 md:col-span-2 xl:col-span-3 xl:col-start-10 xl:row-start-1">
              {[
                ['CATEGORY', project.category],
                ['ROLE', project.role.join(' · ')],
                ['PERIOD', project.period],
                ['STATE', project.status],
                ...(project.evidenceLevel ? [['EVIDENCE', project.evidenceLevel] as [string, string]] : []),
              ].map(([key, value]) => (
                <div key={key} className="border-t border-hairline py-3">
                  <dt className="mono-label">{key}</dt>
                  <dd className="mt-1 text-read-sm text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="atlas-grid mt-8 gap-y-6">
            <p className="col-span-4 max-w-[68ch] text-read text-graphite md:col-span-6 xl:col-span-7">
              {project.summary}
            </p>
            {project.links?.length ? (
              <div className="col-span-4 md:col-span-2 xl:col-span-4 xl:col-start-9">
                <ProjectLinks links={project.links} />
              </div>
            ) : null}
          </div>

          <div className="atlas-grid mt-12 md:mt-16">
            <div className="col-span-4 aspect-[16/10] overflow-hidden border border-ink md:col-span-8 xl:col-span-12" data-clip>
              <ProjectPreview preview={project.preview} />
            </div>
            <div className="col-span-4 mt-3 flex flex-wrap items-baseline justify-between gap-3 md:col-span-8 xl:col-span-12">
              <p className="mono-label">SYSTEM DIAGRAM — NOT A PRODUCT SCREENSHOT</p>
              <p className="mono-label">{project.verification}</p>
            </div>
          </div>

          {project.currentState?.length ? <CurrentState items={project.currentState} /> : null}
          <CaseIndex modules={project.modules} />
        </header>

        {project.modules.map((module, index) => (
          <CaseModule key={`${module.kind}-${module.title}`} module={module} project={project} index={index + 1} />
        ))}

        <section id="case-technology" className="scroll-mt-32 pt-24 md:pt-36">
          <div className="atlas-grid pb-4">
            <div className="col-span-4 md:col-span-8 xl:col-span-12">
              <span className="mb-5 block h-[1px] w-full bg-hairline" />
              <div className="flex items-baseline gap-5">
                <span className="mono-label text-accent">CH {String(project.modules.length + 1).padStart(2, '0')}</span>
                <h2 className="font-heading text-display-3 font-medium uppercase text-ink">Technology</h2>
                <span className="mono-label ml-auto">STACK</span>
              </div>
            </div>
          </div>
          <div className="atlas-grid mt-6">
            {project.technologies.map((group) => (
              <div key={group.group} className="col-span-4 border-t border-hairline py-5 md:col-span-4 xl:col-span-4">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="mono-label text-ink">{group.group}</span>
                  <span className="mono-label">{group.intent.toUpperCase()}</span>
                </div>
                <ul className="mt-3 space-y-1">
                  {group.items.map((item) => (
                    <li key={item} className="text-read-sm text-graphite">{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-24 md:mt-36">
          <Link
            to={`/work/${next.slug}`}
            data-cursor="row"
            onPointerEnter={() => preloadProject(next.slug)}
            onFocus={() => preloadProject(next.slug)}
            className="group block border-t border-ink"
          >
            <div className="atlas-grid items-baseline py-10 md:py-14">
              <span className="col-span-1 mono-label">NEXT PLATE</span>
              <h2 className="col-span-3 font-heading text-display-2 font-medium uppercase md:col-span-6 xl:col-span-9">
                <span className="inline-block transition-transform duration-500 ease-atlas group-hover:translate-x-3 group-focus-visible:translate-x-3">
                  {next.title}
                </span>
              </h2>
              <span className="col-span-4 mt-2 flex items-center justify-end gap-3 md:col-span-1 md:mt-0 xl:col-span-2">
                <span className="mono-label">{next.index}</span>
                <ArrowRight className="h-4 w-4 text-graphite" strokeWidth={1.5} aria-hidden="true" />
              </span>
            </div>
          </Link>
        </section>
      </main>
    </div>
  );
}
