import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAtlas } from '../contexts/AtlasContext';
import { hasProject, loadProject, preloadProject } from '../content/projectRegistry';
import { nextCatalogProject } from '../data/projectCatalog';
import { CaseChapters, type Chapter } from '../components/case/CaseChapters';
import { CaseModules, moduleId } from '../components/case/CaseModules';
import { CurrentStateBlock, ProjectLinks } from '../components/case/CaseParts';
import { NotFound } from './NotFound';
import type { Project } from '../types/project';

export function ProjectPage() {
  const { slug } = useParams<{slug: string;}>();
  const { setMode, setProject: setRailProject, setChapter, registerSections } = useAtlas();
  const [project, setProject] = useState<Project | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');

  const valid = hasProject(slug);

  useEffect(() => {
    if (!valid || !slug) return;
    let cancelled = false;
    setState('loading');
    loadProject(slug).
    then((p) => {
      if (cancelled) return;
      if (!p) {
        setState('error');
        return;
      }
      setProject(p);
      setState('ready');
    }).
    catch(() => {
      if (!cancelled) setState('error');
    });
    return () => {
      cancelled = true;
    };
  }, [slug, valid]);

  useEffect(() => {
    registerSections([]);
    if (!project) return;
    setMode('project');
    setRailProject({ slug: project.slug, index: project.index, title: project.title });
    return () => {
      setRailProject(null);
      setChapter(null);
    };
  }, [project, setMode, setRailProject, setChapter, registerSections]);

  const chapters = useMemo<Chapter[]>(() => {
    if (!project) return [];
    return project.modules.map((m, i) => ({
      id: moduleId(m, i),
      index: String(i + 1).padStart(2, '0'),
      title: m.title
    }));
  }, [project]);

  if (!valid) return <NotFound />;

  if (state !== 'ready' || !project)
  return (
    <div className="atlas-grid min-h-[70svh] items-center pt-28">
        <p className="mono-label col-span-4 md:col-span-8 xl:col-span-12" role="status">
          {state === 'error' ? 'PLATE FAILED TO LOAD — RETURN TO THE INDEX' : 'LOADING PLATE…'}
        </p>
      </div>);


  const next = nextCatalogProject(project.slug);

  return (
    <article className="pt-24">
      {/* header plate */}
      <header className="atlas-grid pb-8 pt-6">
        <div className="col-span-4 md:col-span-8 xl:col-span-12" data-reveal-group>
          <span className="block h-[1px] w-full bg-hairline" />
          <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 pt-4">
            <span className="mono-label text-accent">{project.index}</span>
            <span className="mono-label">{project.category}</span>
            <span className="mono-label">{project.status}</span>
            <span className="mono-label">{project.period}</span>
          </div>

          <h1 className="mt-8 overflow-hidden font-heading text-display-1 font-medium uppercase text-ink">
            <span className="reveal-line" data-reveal>
              <span>{project.title}</span>
            </span>
          </h1>

          <p className="mt-8 max-w-[46ch] font-heading text-display-3 font-medium leading-tight text-ink">
            {project.thesis}
          </p>
        </div>
      </header>

      <div className="atlas-grid gap-y-8 pb-10">
        <div className="col-span-4 md:col-span-8 xl:col-span-7">
          <p className="max-w-[68ch] text-read-lg text-graphite">{project.summary}</p>
          <p className="mono-label mt-6 border-l-2 border-accent pl-3 text-ink">
            {project.verification}
          </p>
        </div>

        <div className="col-span-4 md:col-span-8 xl:col-span-4 xl:col-start-9">
          <dl className="border-t border-hairline">
            <div className="border-b border-hairline py-3">
              <dt className="mono-label">ROLE</dt>
              <dd className="mt-1 text-read-sm text-ink">{project.role.join(' · ')}</dd>
            </div>
            {project.technologies.map((t) =>
            <div key={t.group} className="border-b border-hairline py-3">
                <dt className="mono-label">
                  {t.group.toUpperCase()} / {t.intent.toUpperCase()}
                </dt>
                <dd className="mt-1 text-read-sm text-ink">{t.items.join(' · ')}</dd>
              </div>
            )}
          </dl>
          {project.links?.length ?
          <div className="mt-6">
              <p className="mono-label mb-3">EVIDENCE</p>
              <ProjectLinks links={project.links} />
            </div> :
          <p className="mono-label mt-6">
              NO PUBLIC IMPLEMENTATION LINK — CONCEPT STAGE
            </p>
          }
        </div>
      </div>

      {project.currentState?.length ?
      <div className="atlas-grid pb-10">
          <div className="col-span-4 md:col-span-8 xl:col-span-12">
            <p className="mono-label mb-3">CURRENT STATE</p>
            <CurrentStateBlock items={project.currentState} />
          </div>
        </div> :
      null}

      <CaseChapters chapters={chapters} />
      <CaseModules modules={project.modules} />

      {/* next plate */}
      <div className="atlas-grid py-16">
        <Link
          to={`/work/${next.slug}`}
          onMouseEnter={() => preloadProject(next.slug)}
          onFocus={() => preloadProject(next.slug)}
          className="group col-span-4 border-t border-hairline pt-5 md:col-span-8 xl:col-span-12"
          data-cursor="row">

          <span className="mono-label">NEXT PLATE / {next.index}</span>
          <span className="mt-3 block font-heading text-display-2 font-medium uppercase text-ink transition-transform duration-500 ease-atlas group-hover:translate-x-2">
            {next.title} →
          </span>
        </Link>
      </div>
    </article>);

}