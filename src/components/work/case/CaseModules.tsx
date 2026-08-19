import React from 'react';
import type { Project, ProjectModule } from '../../../types/project';
import { getCaseSectionId } from '../../../lib/caseNavigation';
import { SystemDiagram } from './SystemDiagram';
import { ProjectPreview } from '../ProjectPreview';
import { CaseMedia } from './CaseMedia';
import { DecisionBlock } from './DecisionBlock';
import { ValidationBlock } from './ValidationBlock';

function SectionHead({ index, module }: { index: number; module: ProjectModule }) {
  return (
    <div className="atlas-grid pb-4">
      <div className="col-span-4 md:col-span-8 xl:col-span-12" data-reveal-group>
        <span data-draw className="mb-5 block h-[1px] w-full bg-hairline" />
        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
          <span className="mono-label text-accent">CH {String(index).padStart(2, '0')}</span>
          <h2 className="font-heading text-display-3 font-medium uppercase text-ink">{module.title}</h2>
          <span className="mono-label ml-auto">{module.kind.toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
}

function ItemList({ items }: { items: { label: string; value: string; note?: string }[] }) {
  return (
    <dl className="border-t border-hairline">
      {items.map((item) => (
        <div key={`${item.label}-${item.value}`} className="border-b border-hairline py-4 md:grid md:grid-cols-[9rem_1fr] md:gap-6">
          <dt className="mono-label text-ink">{item.label}</dt>
          <dd className="mt-2 text-read-sm text-graphite md:mt-0">
            {item.value}
            {item.note ? <span className="mt-1 block text-read-sm text-graphite">{item.note}</span> : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function StepFlow({ steps }: { steps: { label: string; body: string }[] }) {
  return (
    <ol className="border-t border-hairline">
      {steps.map((step, index) => (
        <li key={`${step.label}-${index}`} className="border-b border-hairline py-5 md:grid md:grid-cols-[3rem_10rem_1fr] md:gap-6">
          <span className="mono-label text-accent">{String(index + 1).padStart(2, '0')}</span>
          <h3 className="mt-2 mono-label text-ink md:mt-0">{step.label}</h3>
          <p className="mt-2 max-w-[60ch] text-read-sm text-graphite md:mt-0">{step.body}</p>
        </li>
      ))}
    </ol>
  );
}

export function CaseModule({ module, project, index }: { module: ProjectModule; project: Project; index: number }) {
  const id = getCaseSectionId(module, index);
  const head = <SectionHead index={index} module={module} />;
  const media = module.media?.length ? <CaseMedia media={module.media} /> : null;

  switch (module.kind) {
    case 'context':
    case 'evidence':
    case 'reflection':
      return (
        <section id={id} className="scroll-mt-32 pt-20 md:pt-28">
          {head}
          <div className="atlas-grid gap-y-8">
            {module.body ? (
              <p className="col-span-4 max-w-[68ch] text-read-lg text-ink md:col-span-8 xl:col-span-6" data-fade>
                {module.body}
              </p>
            ) : null}
            {module.items?.length ? (
              <div className="col-span-4 md:col-span-8 xl:col-span-5 xl:col-start-8">
                <ItemList items={module.items} />
              </div>
            ) : null}
          </div>
          {media}
        </section>
      );

    case 'architecture':
      return (
        <section id={id} className="scroll-mt-32 pt-20 md:pt-32">
          {head}
          {module.body ? (
            <div className="atlas-grid">
              <p className="col-span-4 max-w-[68ch] text-read-lg text-graphite md:col-span-7 xl:col-span-7" data-fade>
                {module.body}
              </p>
            </div>
          ) : null}
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
          {media}
        </section>
      );

    case 'flow':
      return (
        <section id={id} className="scroll-mt-32 pt-20 md:pt-32">
          {head}
          <div className="atlas-grid gap-y-8">
            {module.body ? (
              <p className="col-span-4 max-w-[68ch] text-read-lg text-graphite md:col-span-7 xl:col-span-6" data-fade>
                {module.body}
              </p>
            ) : null}
            <div className="col-span-4 md:col-span-8 xl:col-span-10 xl:col-start-2">
              <StepFlow steps={module.steps ?? []} />
            </div>
          </div>
          {media}
        </section>
      );

    case 'interface':
    case 'spatial':
      return (
        <section id={id} className="scroll-mt-32 pt-20 md:pt-32">
          {head}
          <div className="atlas-grid gap-y-8 md:items-start">
            <div className="col-span-4 md:col-span-5 xl:col-span-7">
              <div className="aspect-[16/10] overflow-hidden border border-hairline" data-clip>
                <ProjectPreview preview={project.preview} />
              </div>
              <p className="mono-label mt-3">SYSTEM DIAGRAM — NOT A PRODUCT SCREENSHOT</p>
            </div>
            <div className="col-span-4 md:col-span-3 xl:col-span-4 xl:col-start-9">
              {module.body ? <p className="text-read text-ink">{module.body}</p> : null}
              {module.items?.length ? <div className="mt-6"><ItemList items={module.items} /></div> : null}
            </div>
          </div>
          {media}
        </section>
      );

    case 'detail':
      return (
        <section id={id} className="scroll-mt-32 pt-20 md:pt-32">
          {head}
          <div className="atlas-grid">
            <p className="col-span-4 font-heading text-display-3 leading-snug md:col-span-8 xl:col-span-8 xl:col-start-3" data-fade>
              {module.body}
            </p>
          </div>
          {media}
        </section>
      );

    case 'decision':
      if (!module.decision) return null;
      return (
        <section id={id} className="scroll-mt-32 pt-20 md:pt-32">
          {head}
          {module.body ? (
            <div className="atlas-grid">
              <p className="col-span-4 max-w-[68ch] text-read text-graphite md:col-span-7 xl:col-span-6">{module.body}</p>
            </div>
          ) : null}
          <DecisionBlock decision={module.decision} />
          {media}
        </section>
      );

    case 'validation':
      return (
        <section id={id} className="scroll-mt-32 pt-20 md:pt-32">
          {head}
          {module.body ? (
            <div className="atlas-grid">
              <p className="col-span-4 max-w-[68ch] text-read text-graphite md:col-span-7 xl:col-span-6">{module.body}</p>
            </div>
          ) : null}
          {module.validation?.length ? <ValidationBlock items={module.validation} /> : null}
          {media}
        </section>
      );

    case 'openQuestions':
      return (
        <section id={id} className="scroll-mt-32 pt-20 md:pt-32">
          {head}
          {module.body ? (
            <div className="atlas-grid">
              <p className="col-span-4 max-w-[68ch] text-read text-graphite md:col-span-7 xl:col-span-6">{module.body}</p>
            </div>
          ) : null}
          <ol className="atlas-grid mt-8">
            {(module.items ?? []).map((item, itemIndex) => (
              <li
                key={item.label}
                className="col-span-4 border-t border-hairline py-5 md:col-span-4 xl:col-span-4"
              >
                <span className="mono-label text-accent">{item.label || String(itemIndex + 1).padStart(2, '0')}</span>
                <p className="mt-3 max-w-[38ch] text-read text-ink">{item.value}</p>
                {item.note ? <p className="mt-2 max-w-[42ch] text-read-sm text-graphite">{item.note}</p> : null}
              </li>
            ))}
          </ol>
          {media}
        </section>
      );

    default:
      return null;
  }
}
