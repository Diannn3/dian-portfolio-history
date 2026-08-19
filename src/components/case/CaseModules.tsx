import React from 'react';
import type { ProjectModule } from '../../types/project';
import { CaseDiagram } from './CaseDiagram';
import { CaseFigure } from './CaseFigure';
import {
  DecisionBlock,
  ItemList,
  StepFlow,
  ValidationBlock } from
'./CaseParts';

export function moduleId(module: ProjectModule, i: number) {
  const slug = module.title.
  toLowerCase().
  replace(/[^a-z0-9]+/g, '-').
  replace(/^-|-$/g, '');
  return `ch-${String(i + 1).padStart(2, '0')}-${slug}`;
}

interface Props {
  modules: ProjectModule[];
}

/**
 * Case modules. Layout varies by module kind so a case study reads as a sequence
 * of different plates rather than one repeated template — but every plate uses
 * the same notation, reading scale and hairlines.
 */
export function CaseModules({ modules }: Props) {
  return (
    <div>
      {modules.map((module, i) => {
        const id = moduleId(module, i);
        const index = String(i + 1).padStart(2, '0');
        const wide = module.kind === 'architecture' || module.kind === 'flow';

        return (
          <section
            key={id}
            id={id}
            aria-labelledby={`${id}-title`}
            className="scroll-mt-32">

            <div className="atlas-grid pb-4 pt-16">
              <div className="col-span-4 md:col-span-8 xl:col-span-12" data-reveal-group>
                <span data-draw className="mb-5 block h-[1px] w-full bg-hairline" />
                <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
                  <span className="mono-label text-accent">CH {index}</span>
                  <h2
                    id={`${id}-title`}
                    className="font-heading text-display-3 font-medium uppercase text-ink">

                    {module.title}
                  </h2>
                  <span className="mono-label ml-auto">{module.kind.toUpperCase()}</span>
                </div>
              </div>
            </div>

            <div className="atlas-grid gap-y-8 pb-6">
              {/* prose column: capped measure, reading scale, never fine print */}
              {module.body &&
              <div
                className={
                wide ?
                'col-span-4 md:col-span-8 xl:col-span-7' :
                'col-span-4 md:col-span-8 xl:col-span-6'
                }>

                  <p className="max-w-[68ch] text-read-lg text-graphite" data-fade>
                    {module.body}
                  </p>
                </div>
              }

              {module.items && module.kind !== 'openQuestions' &&
              <div
                className={
                module.body ?
                'col-span-4 md:col-span-8 xl:col-span-5 xl:col-start-8' :
                'col-span-4 md:col-span-8 xl:col-span-9'
                }>

                  <ItemList items={module.items} />
                </div>
              }

              {module.kind === 'openQuestions' && module.items &&
              <ol className="col-span-4 grid grid-cols-1 gap-0 border-t border-hairline md:col-span-8 md:grid-cols-2 xl:col-span-10">
                  {module.items.map((item) =>
                <li
                  key={item.label}
                  className="border-b border-hairline py-4 md:odd:border-r md:odd:pr-6 md:even:pl-6">

                      <span className="mono-label text-accent">{item.label}</span>
                      <p className="mt-2 max-w-[52ch] text-read text-ink">{item.value}</p>
                    </li>
                )}
                </ol>
              }

              {module.steps &&
              <div className="col-span-4 md:col-span-8 xl:col-span-12">
                  <StepFlow steps={module.steps} />
                </div>
              }

              {module.nodes && module.edges &&
              <div className="col-span-4 md:col-span-8 xl:col-span-10">
                  <CaseDiagram
                  figure={`FIG / ${index}`}
                  title={module.title}
                  nodes={module.nodes}
                  edges={module.edges} />

                </div>
              }

              {module.decision &&
              <div className="col-span-4 md:col-span-8 xl:col-span-10">
                  <DecisionBlock decision={module.decision} />
                </div>
              }

              {module.validation &&
              <div className="col-span-4 md:col-span-8 xl:col-span-10">
                  <ValidationBlock items={module.validation} />
                </div>
              }

              {module.media?.length ?
              <div className="col-span-4 grid grid-cols-1 gap-6 md:col-span-8 xl:col-span-10">
                  {module.media.map((m, mi) =>
                <CaseFigure key={m.src} figure={`FIG / ${index}.${mi + 1}`} media={m} />
                )}
                </div> :
              null}
            </div>
          </section>);

      })}
    </div>);

}