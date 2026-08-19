import React from 'react';
import { now } from '../../data/site';

export function Now() {
  return (
    <section className="pt-28 md:pt-40" aria-labelledby="now-heading">
      <div className="atlas-grid">
        <div className="col-span-4 border-t border-ink pt-4 md:col-span-8 xl:col-span-12">
          <h2 id="now-heading" className="mono-label text-ink">
            {now.period}
          </h2>
        </div>
      </div>
      <dl className="atlas-grid mt-6 md:mt-10">
        {now.entries.map((entry, i) =>
        <div
          key={entry.label}
          className="col-span-4 flex items-baseline gap-5 border-b border-hairline py-4 md:col-span-8 xl:col-span-6"
          data-fade>
          
            <dt className="w-[8.5rem] shrink-0 font-mono text-label uppercase text-graphite">
              <span className="mr-3 text-graphite">{String(i + 1).padStart(2, '0')}</span>
              {entry.label}
            </dt>
            <dd className="font-heading text-display-3">{entry.value}</dd>
          </div>
        )}
      </dl>
    </section>);

}