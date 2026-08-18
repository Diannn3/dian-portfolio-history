import React from 'react';
import { tools } from '../../data/site';

export function Tools() {
  return (
    <section className="pt-28 md:pt-44" aria-labelledby="tools-heading">
      <div className="atlas-grid">
        <div className="col-span-4 border-t border-ink pt-4 md:col-span-8 xl:col-span-12">
          <h2 id="tools-heading" className="mono-label text-ink">
            TOOLS I REACH FOR
          </h2>
        </div>
      </div>
      <dl className="atlas-grid mt-8 md:mt-12">
        <div className="col-span-4 md:col-span-8 xl:col-span-10 xl:col-start-2">
          {tools.map((t) =>
          <div
            key={t.group}
            className="flex flex-col gap-1 border-b border-hairline py-5 md:flex-row md:items-baseline md:gap-10">
            
              <dt className="w-[11rem] shrink-0 font-mono text-label uppercase tracking-[0.16em] text-graphite">
                {t.group}
              </dt>
              <dd className="font-heading text-[1.15rem] tracking-tight md:text-[1.35rem]">{t.items}</dd>
            </div>
          )}
        </div>
      </dl>
    </section>);

}