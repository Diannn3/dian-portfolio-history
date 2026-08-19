import React from 'react';
import type { Project, ProjectModule } from '../../../types/project';
import { SystemDiagram } from './SystemDiagram';
import { ProjectPreview } from '../ProjectPreview';
import { CaseMedia } from './CaseMedia';
import { DecisionBlock } from './DecisionBlock';
import { ValidationBlock } from './ValidationBlock';
import { getCaseSectionId } from '../../../lib/caseNavigation';

function SectionHead({ index, title }: { index: number; title: string }) {
  return (
    <div className="atlas-grid">
      <div className="col-span-4 flex items-baseline justify-between border-t border-ink pt-4 md:col-span-8 xl:col-span-12">
        <h2 className="mono-label text-ink">{title.toUpperCase()}</h2>
        <span className="mono-label">{String(index).padStart(2, '0')}</span>
      </div>
    </div>
  );
}

function Pairs({ items }: { items: { label: string; value: string; note?: string }[] }) {
  return (
    <dl className="border-t border-hairline">
      {items.map((it) => (
        <div key={it.label + it.value} className="flex gap-6 border-b border-hairline py-3">
          <dt className="w-[7rem] shrink-0 font-mono text-micro uppercase tracking-[0.16em] text-graphite">
            {it.label}
          </dt>
          <dd className="text-[0.9rem] leading-relaxed text-ink">
            {it.value}
            {it.note ? <span className="mt-1 block text-[0.8rem] text-graphite">{it.note}</span> : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function CaseModule({
  module,
  project,
  index,
}: {
  module: ProjectModule;
  project: Project;
  index: number;
}) {
  const head = <SectionHead index={index} title={module.title} />;
  const sectionId = getCaseSectionId(module, index);

  switch (module.kind) {
    case 'context':
      return (
        <section id={sectionId} className="scroll-mt-28 pt-24 md:pt-32">
          {head}
          <div className="atlas-grid mt-8 md:mt-12">
            <p className="col-span-4 text-body-lg leading-[1.5] text-ink md:col-span-5 xl:col-span-6 xl:col-start-1">
              {module.body}
            </p>
            <div className="col-span-4 mt-8 md:col-span-3 xl:col-span-4 xl:col-start-9 xl:mt-0">
              {module.items && <Pairs items={module.items} />}
            </div>
          </div>
        </section>
      );

    case 'architecture':
      return (
        <section id={sectionId} className="scroll-mt-28 pt-24 md:pt-36">
          {head}
          <div className="atlas-grid mt-8 md:mt-10">
            <p className="col-span-4 max-w-[46ch] text-[0.95rem] leading-relaxed text-graphite md:col-span-5 xl:col-span-5">
              {module.body}
            </p>
          </div>
          <div className="atlas-grid mt-10">
            <div className="col-span-4 md:col-span-8 xl:col-span-12">
              <SystemDiagram
                nodes={module.nodes ?? []}
                edges={module.edges ?? []}
                accent={project.accent}
                caption={`FIG. ${String(index).padStart(2, '0')} / ${module.title.toUpperCase()} — HOVER OR TAB A NODE`}
              />
            </div>
          </div>
        </section>
      );

    case 'flow':
      return (
        <section id={sectionId} className="scroll-mt-28 pt-24 md:pt-36">
          {head}
          {module.body ? (
            <div className="atlas-grid mt-8 md:mt-10">
              <p className="col-span-4 max-w-[54ch] text-[0.95rem] leading-relaxed text-graphite md:col-span-6 xl:col-span-6">
                {module.body}
              </p>
            </div>
          ) : null}
          <ol className="atlas-grid mt-8 md:mt-12">
            {(module.steps ?? []).map((s, i) => (
              <li
                key={s.label}
                className="col-span-4 flex gap-5 border-t border-hairline py-5 md:col-span-8 xl:col-span-10 xl:col-start-2"
              >
                <span className="font-mono text-micro tracking-[0.16em] text-graphite">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="flex flex-1 flex-col gap-2 md:flex-row md:items-baseline md:gap-10">
                  <h3 className="w-[9rem] shrink-0 font-mono text-label uppercase tracking-[0.16em] text-ink">
                    {s.label}
                  </h3>
                  <p className="max-w-[58ch] text-[0.93rem] leading-relaxed text-graphite">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      );

    case 'interface':
      return (
        <section id={sectionId} className="scroll-mt-28 pt-24 md:pt-36">
          {head}
          <div className="atlas-grid mt-8 items-start md:mt-12">
            <div className="col-span-4 md:col-span-5 xl:col-span-7">
              <div className="aspect-[16/10] overflow-hidden border border-ink" data-clip>
                <ProjectPreview preview={project.preview} />
              </div>
            </div>
            <div className="col-span-4 mt-8 md:col-span-3 xl:col-span-4 xl:col-start-9 xl:mt-0">
              <p className="text-[0.95rem] leading-relaxed text-ink">{module.body}</p>
              {module.items && <div className="mt-6"><Pairs items={module.items} /></div>}
            </div>
          </div>
        </section>
      );

    case 'spatial':
      return (
        <section id={sectionId} className="scroll-mt-28 pt-24 md:pt-36">
          {head}
          <div className="atlas-grid mt-8 md:mt-12">
            <p className="col-span-4 text-body-lg leading-[1.5] md:col-span-5 xl:col-span-5 xl:col-start-1">
              {module.body}
            </p>
            <div className="col-span-4 mt-8 md:col-span-3 xl:col-span-6 xl:col-start-7 xl:mt-0">
              <div className="aspect-[16/10] overflow-hidden border border-hairline" data-clip>
                <ProjectPreview preview={project.preview} />
              </div>
            </div>
          </div>
        </section>
      );

    case 'detail':
      return (
        <section id={sectionId} className="scroll-mt-28 pt-24 md:pt-36">
          {head}
          <div className="atlas-grid mt-8 md:mt-12">
            <p className="col-span-4 font-heading text-display-3 leading-snug md:col-span-8 xl:col-span-7 xl:col-start-4">
              {module.body}
            </p>
          </div>
        </section>
      );

    case 'evidence':
      return (
        <section id={sectionId} className="scroll-mt-28 pt-24 md:pt-36">
          {head}
          <div className="atlas-grid mt-8 md:mt-12">
            {module.body ? (
              <p className="col-span-4 text-body-lg leading-[1.5] text-ink md:col-span-5 xl:col-span-5">
                {module.body}
              </p>
            ) : null}
            {module.items ? (
              <div className="col-span-4 mt-8 md:col-span-3 md:mt-0 xl:col-span-6 xl:col-start-7">
                <Pairs items={module.items} />
              </div>
            ) : null}
          </div>
          {module.media?.length ? <CaseMedia media={module.media} /> : null}
        </section>
      );

    case 'decision':
      if (!module.decision) return null;
      return (
        <section id={sectionId} className="scroll-mt-28 pt-24 md:pt-36">
          {head}
          {module.body ? (
            <div className="atlas-grid mt-8">
              <p className="col-span-4 max-w-[54ch] text-[0.95rem] leading-relaxed text-graphite md:col-span-6 xl:col-span-6">
                {module.body}
              </p>
            </div>
          ) : null}
          <DecisionBlock decision={module.decision} />
        </section>
      );

    case 'validation':
      return (
        <section id={sectionId} className="scroll-mt-28 pt-24 md:pt-36">
          {head}
          {module.body ? (
            <div className="atlas-grid mt-8">
              <p className="col-span-4 max-w-[58ch] text-[0.95rem] leading-relaxed text-graphite md:col-span-6 xl:col-span-6">
                {module.body}
              </p>
            </div>
          ) : null}
          {module.validation?.length ? <ValidationBlock items={module.validation} /> : null}
        </section>
      );

    case 'reflection':
      return (
        <section id={sectionId} className="scroll-mt-28 pt-24 md:pt-36">
          {head}
          <div className="atlas-grid mt-8 gap-y-8 md:mt-12">
            <p className="col-span-4 font-heading text-display-3 leading-snug md:col-span-5 xl:col-span-6">
              {module.body}
            </p>
            {module.items ? (
              <div className="col-span-4 md:col-span-3 xl:col-span-4 xl:col-start-9">
                <Pairs items={module.items} />
              </div>
            ) : null}
          </div>
        </section>
      );

    case 'openQuestions':
      return (
        <section id={sectionId} className="scroll-mt-28 pt-24 md:pt-36">
          {head}
          {module.body ? (
            <div className="atlas-grid mt-8">
              <p className="col-span-4 max-w-[54ch] text-[0.95rem] leading-relaxed text-graphite md:col-span-6 xl:col-span-6">
                {module.body}
              </p>
            </div>
          ) : null}
          <ul className="atlas-grid mt-8 md:mt-12">
            {(module.items ?? []).map((it) => (
              <li key={it.label} className="col-span-4 border-t border-hairline py-5 md:col-span-4 xl:col-span-4">
                <span className="font-mono text-micro tracking-[0.16em] text-graphite">{it.label}</span>
                <p className="mt-3 max-w-[30ch] font-heading text-[1.15rem] leading-snug">{it.value}</p>
                {it.note ? <p className="mt-2 max-w-[36ch] text-[0.82rem] leading-relaxed text-graphite">{it.note}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      );

    default:
      return null;
  }
}
