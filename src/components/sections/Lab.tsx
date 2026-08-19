import React, { Suspense, lazy, useState } from 'react';
import * as Collapsible from '@radix-ui/react-collapsible';
import { ArrowUpRight, Minus, Plus } from 'lucide-react';
import { lab } from '../../data/site';
import { SectionFrame } from '../global/SectionFrame';

const LabExperiment = lazy(() =>
import('../lab/LabExperiment').then((m) => ({ default: m.LabExperiment }))
);

/**
 * LAB / OPEN INDEX — an open notebook, not a card grid.
 *
 * Rows expand in place. The behaviour comes from a Radix Collapsible (the same
 * primitive shadcn/ui wraps) so the trigger/content relationship, aria-expanded
 * and keyboard handling are correct; the visual language stays entirely Vector
 * Atlas — square, hairline, mono. Every experiment module is lazy: nothing here
 * is in the initial route graph.
 */
export function Lab() {
  const [open, setOpen] = useState<string | null>(lab[0]?.id ?? null);

  return (
    <SectionFrame
      id="lab"
      index="05"
      title="Lab / open index"
      nav="#lab"
      annotation="SMALLER QUESTIONS, FASTER ANSWERS"
      className="pt-28 md:pt-44">
      
      <div className="atlas-grid mt-6 md:mt-10">
        <ul className="col-span-4 md:col-span-8 xl:col-span-10 xl:col-start-2">
          {lab.map((item) => {
            const isOpen = open === item.id;
            return (
              <li key={item.id} className="border-b border-hairline first:border-t first:border-hairline">
                <Collapsible.Root
                  open={isOpen}
                  onOpenChange={(next) => setOpen(next ? item.id : null)}>
                  
                  <Collapsible.Trigger asChild>
                    <button
                      type="button"
                      className="group flex w-full items-baseline gap-4 py-5 text-left md:gap-6">
                      
                      <span className="w-8 shrink-0 font-mono text-micro tracking-[0.16em] text-graphite">
                        {item.id}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-heading text-display-3 font-medium leading-tight">
                          <span className="inline-block transition-transform duration-500 ease-atlas group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5">
                            {item.title}
                          </span>
                        </span>
                        <span className="mt-1 flex flex-wrap items-baseline gap-x-5 gap-y-1">
                          <span className="mono-label">{item.tag}</span>
                          <span
                            className="font-mono text-micro uppercase tracking-[0.14em]"
                            style={{ color: isOpen ? 'var(--accent)' : 'var(--graphite)' }}>
                            
                            {item.status}
                          </span>
                        </span>
                      </span>
                      <span aria-hidden="true" className="shrink-0 text-graphite transition-colors duration-300 group-hover:text-ink">
                        {isOpen ?
                        <Minus className="h-4 w-4" strokeWidth={1.5} /> :
                        <Plus className="h-4 w-4" strokeWidth={1.5} />}
                      </span>
                    </button>
                  </Collapsible.Trigger>

                  <Collapsible.Content>
                    <div className="grid gap-8 pb-8 md:grid-cols-[1fr_1fr] md:gap-10">
                      <div>
                        <p className="max-w-[46ch] text-body text-graphite">{item.note}</p>
                        <dl className="mt-6 border-t border-hairline">
                          {item.notes.map((note) =>
                          <div
                            key={note.label}
                            className="flex flex-col gap-1 border-b border-hairline py-3 md:flex-row md:gap-6">
                            
                              <dt className="w-[6.5rem] shrink-0 mono-label">{note.label}</dt>
                              <dd className="text-note text-graphite">{note.value}</dd>
                            </div>
                          )}
                        </dl>
                        {item.href ?
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noreferrer"
                          data-cursor="external"
                          className="link-underline mt-5 inline-flex items-center gap-1.5 font-mono text-label uppercase tracking-[0.14em] text-ink">
                          
                            SOURCE
                            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
                          </a> :
                        null}
                      </div>
                      <div>
                        {isOpen ?
                        <Suspense
                          fallback={
                          <div className="h-full min-h-[10rem] border border-hairline bg-surface" />
                          }>
                          
                            <LabExperiment kind={item.experiment} />
                          </Suspense> :
                        null}
                      </div>
                    </div>
                  </Collapsible.Content>
                </Collapsible.Root>
              </li>);

          })}
        </ul>
      </div>

      <div className="atlas-grid mt-5">
        <p className="col-span-4 font-mono text-micro uppercase tracking-[0.16em] text-graphite md:col-span-8 xl:col-span-12">
          LAB ENTRIES ARE LABELLED BY STATE — NOTHING HERE CLAIMS TO BE FINISHED.
        </p>
      </div>
    </SectionFrame>);

}