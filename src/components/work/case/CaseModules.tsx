import React, { useMemo, useRef } from 'react';
import type { Project, ProjectModule } from '../../../types/project';
import { getCaseSectionId } from '../../../lib/caseNavigation';
import { useSectionRegistration } from '../../../hooks/useReveals';
import { ProjectPreview } from '../ProjectPreview';
import {
  CurrentState,
  DecisionBlock,
  Pairs,
  ProjectLinks,
  SystemDiagram,
  ValidationBlock } from
'./CaseParts';

export { CurrentState, ProjectLinks };

function Head({ index, title }: {index: number;title: string;}) {
  return (
    <div className="atlas-grid">
      <div className="col-span-4 flex items-baseline justify-between gap-6 border-t border-ink pt-4 md:col-span-8 xl:col-span-12">
        <h2 className="mono-label flex items-baseline gap-3 text-ink">
          <span className="text-graphite">{String(index).padStart(2, '0')}</span>
          <span>{title.toUpperCase()}</span>
        </h2>
      </div>
    </div>);

}

/**
 * One chapter, composed according to what it actually is.
 *
 * The point of this file is that no two consecutive chapters use the same
 * template. A context chapter is a 60/40 spread; an architecture chapter is a
 * sticky diagram beside scrolling explanation; a decision is a comparison; a
 * reflection is a single large statement. The content was not poured into
 * repeated rows.
 */
export function CaseModule({
  module,
  project,
  index




}: {module: ProjectModule;project: Project;index: number;}) {
  const ref = useRef<HTMLElement>(null);
  const id = getCaseSectionId(module, index);
  const meta = useMemo(
    () => ({ id, index: String(index).padStart(2, '0'), label: module.title.toUpperCase() }),
    [id, index, module.title]
  );
  useSectionRegistration(ref, meta);

  const body = (() => {
    switch (module.kind) {
      /* ---------- 60 / 40 text–data spread ---------- */
      case 'context':
        return (
          <div className="atlas-grid mt-8 md:mt-12">
            <p className="col-span-4 text-body-lg text-ink md:col-span-5 xl:col-span-6">
              {module.body}
            </p>
            <div className="col-span-4 mt-8 md:col-span-3 xl:col-span-4 xl:col-start-9 xl:mt-0">
              {module.items ? <Pairs items={module.items} /> : null}
            </div>
          </div>);


      /* ---------- visual-first spread ---------- */
      case 'evidence':
        return (
          <div className="atlas-grid mt-8 items-start md:mt-12">
            {module.body ?
            <p className="col-span-4 font-heading text-display-3 leading-snug md:col-span-8 xl:col-span-6">
                {module.body}
              </p> :
            null}
            <div className="col-span-4 mt-8 md:col-span-8 md:mt-10 xl:col-span-10 xl:col-start-2">
              {module.items ?
              <dl className="grid grid-cols-1 border-t border-hairline md:grid-cols-2 md:gap-x-8">
                  {module.items.map((it) =>
                <div key={it.label} className="border-b border-hairline py-4">
                      <dt className="mono-label">{it.label}</dt>
                      <dd className="mt-2 max-w-[46ch] text-note text-ink">{it.value}</dd>
                    </div>
                )}
                </dl> :
              null}
            </div>
          </div>);


      /* ---------- sticky diagram + scrolling explanation ---------- */
      case 'architecture':
        return (
          <div className="atlas-grid mt-8 items-start md:mt-12">
            <div className="col-span-4 md:col-span-8 xl:col-span-4">
              <div className="xl:sticky xl:top-[calc(var(--rail)+3rem)]">
                <p className="max-w-[44ch] text-body text-graphite">{module.body}</p>
                <p className="mt-6 border-t border-hairline pt-3 mono-label">
                  SYSTEM DIAGRAM — NOT A PRODUCT SCREENSHOT
                </p>
              </div>
            </div>
            <div className="col-span-4 mt-10 md:col-span-8 xl:col-span-7 xl:col-start-6 xl:mt-0">
              <SystemDiagram
                nodes={module.nodes ?? []}
                edges={module.edges ?? []}
                accent={project.accent}
                caption={`FIG. ${String(index).padStart(2, '0')} / ${module.title.toUpperCase()}`} />
              
            </div>
          </div>);


      /* ---------- timeline ---------- */
      case 'flow':
        return (
          <>
            {module.body ?
            <div className="atlas-grid mt-8 md:mt-10">
                <p className="col-span-4 max-w-[54ch] text-body text-graphite md:col-span-6">
                  {module.body}
                </p>
              </div> :
            null}
            <ol className="atlas-grid mt-8 md:mt-12">
              {(module.steps ?? []).map((s, i) =>
              <li
                key={s.label}
                className="col-span-4 flex gap-5 border-t border-hairline py-5 md:col-span-8 xl:col-span-10 xl:col-start-2">
                
                  <span className="font-mono text-micro tracking-[0.16em] text-graphite">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="flex flex-1 flex-col gap-2 md:flex-row md:items-baseline md:gap-10">
                    <h3 className="w-[9rem] shrink-0 font-mono text-label uppercase tracking-[0.16em] text-ink">
                      {s.label}
                    </h3>
                    <p className="max-w-[58ch] text-body text-graphite">{s.body}</p>
                  </div>
                </li>
              )}
            </ol>
          </>);


      /* ---------- decision comparison ---------- */
      case 'decision':
        return module.decision ? <DecisionBlock decision={module.decision} /> : null;

      /* ---------- technical ledger ---------- */
      case 'validation':
        return (
          <>
            {module.body ?
            <div className="atlas-grid mt-8">
                <p className="col-span-4 max-w-[58ch] text-body text-graphite md:col-span-6">
                  {module.body}
                </p>
              </div> :
            null}
            {module.validation?.length ? <ValidationBlock items={module.validation} /> : null}
          </>);


      /* ---------- large statement ---------- */
      case 'reflection':
        return (
          <div className="atlas-grid mt-8 gap-y-8 md:mt-12">
            <p className="col-span-4 font-heading text-display-3 leading-snug md:col-span-5 xl:col-span-6 xl:col-start-2">
              {module.body}
            </p>
            {module.items ?
            <div className="col-span-4 md:col-span-3 xl:col-span-3 xl:col-start-9">
                <Pairs items={module.items} />
              </div> :
            null}
          </div>);


      case 'detail':
        return (
          <div className="atlas-grid mt-8 md:mt-12">
            <p className="col-span-4 font-heading text-display-3 leading-snug md:col-span-8 xl:col-span-7 xl:col-start-4">
              {module.body}
            </p>
          </div>);


      /* ---------- visual-first ---------- */
      case 'interface':
      case 'spatial':
        return (
          <div className="atlas-grid mt-8 items-start md:mt-12">
            <div
              className={
              module.kind === 'spatial' ?
              'col-span-4 md:col-span-5 xl:col-span-6 xl:col-start-7 xl:row-start-1' :
              'col-span-4 md:col-span-5 xl:col-span-7'
              }>
              
              <div className="aspect-[16/10] overflow-hidden border border-ink" data-clip>
                <ProjectPreview preview={project.preview} />
              </div>
              <p className="mt-3 mono-label">SYSTEM DIAGRAM — NOT A PRODUCT SCREENSHOT</p>
            </div>
            <div
              className={
              module.kind === 'spatial' ?
              'col-span-4 mt-8 md:col-span-3 xl:col-span-5 xl:col-start-1 xl:row-start-1 xl:mt-0' :
              'col-span-4 mt-8 md:col-span-3 xl:col-span-4 xl:col-start-9 xl:mt-0'
              }>
              
              <p className="text-body-lg text-ink">{module.body}</p>
              {module.items ?
              <div className="mt-6">
                  <Pairs items={module.items} />
                </div> :
              null}
            </div>
          </div>);


      /* ---------- open questions grid ---------- */
      case 'openQuestions':
        return (
          <>
            {module.body ?
            <div className="atlas-grid mt-8">
                <p className="col-span-4 max-w-[54ch] text-body text-graphite md:col-span-6">
                  {module.body}
                </p>
              </div> :
            null}
            <ul className="atlas-grid mt-8 md:mt-12">
              {(module.items ?? []).map((it) =>
              <li
                key={it.label}
                className="col-span-4 border-t border-hairline py-5 md:col-span-4 xl:col-span-3">
                
                  <span className="font-mono text-micro tracking-[0.16em] text-accent">{it.label}</span>
                  <p className="mt-3 max-w-[30ch] font-heading text-[1.15rem] leading-snug">
                    {it.value}
                  </p>
                </li>
              )}
            </ul>
          </>);


      default:
        return null;
    }
  })();

  if (!body) return null;

  return (
    <section ref={ref} id={id} className="anchor-offset pt-24 md:pt-36">
      <Head index={index} title={module.title} />
      {body}
    </section>);

}