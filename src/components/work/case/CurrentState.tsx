import React from 'react';
import type { CurrentStateItem } from '../../../types/project';

export function CurrentState({ items }: { items: CurrentStateItem[] }) {
  return (
    <section className="atlas-grid mt-14 md:mt-20" aria-labelledby="current-state-heading">
      <div className="col-span-4 border-t border-ink pt-4 md:col-span-8 xl:col-span-12">
        <h2 id="current-state-heading" className="mono-label text-ink">CURRENT STATE / AUG 2026</h2>
      </div>
      <dl className="col-span-4 mt-5 grid grid-cols-1 md:col-span-8 md:grid-cols-2 md:gap-x-6 xl:col-span-12 xl:grid-cols-4 xl:gap-x-8">
        {items.map((item) => (
          <div key={item.label} className="border-t border-hairline py-4">
            <dt className="font-mono text-micro uppercase tracking-[0.16em] text-graphite">{item.label}</dt>
            <dd className="mt-2 max-w-[34ch] text-[0.9rem] leading-relaxed text-ink">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
