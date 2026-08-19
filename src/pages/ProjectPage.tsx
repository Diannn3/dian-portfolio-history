import React, { useRef } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { getProject, nextProject } from '../data/projects';
import { ProjectPreview } from '../components/work/ProjectPreview';
import { CaseModule } from '../components/work/case/CaseModules';
import { ProjectLinks } from '../components/work/case/ProjectLinks';
import { Seo } from '../components/global/Seo';
import { useReveals } from '../hooks/useReveals';

export function ProjectPage() {
  const { slug } = useParams<{slug: string;}>();
  const project = getProject(slug);
  const scope = useRef<HTMLDivElement>(null);
  useReveals(scope, [slug]);

  if (!project) return <Navigate to="/" replace />;
  const next = nextProject(project.slug);

  return (
    <div ref={scope} className="pt-[5.5rem]">
      <Seo
        title={`${project.title} — ${project.category} / Dian`}
        description={project.summary}
        path={`/work/${project.slug}`} />
      

      <main id="main">
        <header className="pt-8 md:pt-16">
          <div className="atlas-grid">
            <div className="col-span-4 flex items-baseline justify-between border-t border-ink pt-4 md:col-span-8 xl:col-span-12">
              <Link
                to="/#work"
                className="link-underline font-mono text-label uppercase tracking-[0.16em] text-graphite hover:text-ink">
                
                <ArrowLeft className="mr-2 inline h-3.5 w-3.5 -translate-y-[1px]" strokeWidth={1.5} aria-hidden="true" />
                INDEX
              </Link>
              <span className="mono-label" style={{ color: project.accent }}>
                {project.index} / {project.status}
              </span>
            </div>
          </div>

          <div className="atlas-grid mt-10 md:mt-14" data-reveal-group>
            <h1 className="col-span-4 font-heading text-display-1 font-medium uppercase leading-[0.86] md:col-span-8 xl:col-span-9">
              <span className="reveal-line" data-reveal>
                <span>{project.title}</span>
              </span>
            </h1>
            <p className="col-span-4 mt-6 text-body-lg leading-[1.45] md:col-span-6 xl:col-span-6 xl:col-start-1">
              {project.thesis}
            </p>
            <dl className="col-span-4 mt-8 md:col-span-2 xl:col-span-3 xl:col-start-10 xl:row-start-1 xl:mt-0">
              {[
              ['CATEGORY', project.category],
              ['ROLE', project.role.join(', ')],
              ['PERIOD', project.period],
              ['STATE', project.status],
              ...(project.evidenceLevel ? [['EVIDENCE', project.evidenceLevel] as [string, string]] : [])].
              map(([k, v]) =>
              <div key={k} className="border-t border-hairline py-2">
                  <dt className="mono-label">{k}</dt>
                  <dd className="mt-1 text-[0.88rem] text-ink">{v}</dd>
                </div>
              )}
            </dl>
          </div>

          {project.links?.length ? (
            <div className="atlas-grid mt-8">
              <div className="col-span-4 md:col-span-8 xl:col-span-5 xl:col-start-8">
                <ProjectLinks links={project.links} />
              </div>
            </div>
          ) : null}

          <div className="atlas-grid mt-12 md:mt-16">
            <div
              className="col-span-4 aspect-[16/10] overflow-hidden border border-ink md:col-span-8 xl:col-span-12"
              data-clip>
              
              <ProjectPreview preview={project.preview} />
            </div>
            <p className="col-span-4 mt-3 font-mono text-micro uppercase tracking-[0.16em] text-graphite md:col-span-8 xl:col-span-12">
              {project.verification}
            </p>
          </div>
        </header>

        {project.modules.map((module, i) =>
        <CaseModule key={module.title} module={module} project={project} index={i + 1} />
        )}

        <section className="pt-24 md:pt-36">
          <div className="atlas-grid">
            <div className="col-span-4 border-t border-ink pt-4 md:col-span-8 xl:col-span-12">
              <h2 className="mono-label text-ink">TECHNOLOGY</h2>
            </div>
          </div>
          <div className="atlas-grid mt-8">
            {project.technologies.map((group) =>
            <div
              key={group.group}
              className="col-span-4 border-t border-hairline py-4 md:col-span-4 xl:col-span-4">
              
                <div className="flex items-baseline justify-between">
                  <span className="mono-label text-ink">{group.group}</span>
                  <span className="mono-label">{group.intent.toUpperCase()}</span>
                </div>
                <ul className="mt-3 space-y-1">
                  {group.items.map((item) =>
                <li key={item} className="text-[0.92rem] text-graphite">
                      {item}
                    </li>
                )}
                </ul>
              </div>
            )}
          </div>
        </section>

        <section className="mt-24 md:mt-36">
          <Link
            to={`/work/${next.slug}`}
            data-cursor="view"
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
        </section>
      </main>
    </div>);

}