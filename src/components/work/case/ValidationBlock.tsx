import React from 'react';
import type { ValidationItem } from '../../../types/project';

const stateTone: Record<ValidationItem['state'], string> = {
  VERIFIED: 'text-signal',
  DEFINED: 'text-ink',
  LIMITATION: 'text-graphite',
  'NOT CLAIMED': 'text-graphite',
};

export function ValidationBlock({ items }: { items: ValidationItem[] }) {
  return (
    <dl className="atlas-grid mt-8 gap-y-0 md:mt-12">
      {items.map((item) => (
        <div
          key={`${item.label}-${item.value}`}
          className="col-span-4 border-t border-hairline py-5 md:col-span-4 xl:col-span-4"
        >
          <div className="flex items-baseline justify-between gap-4">
            <dt className="font-mono text-label uppercase tracking-[0.16em] text-ink">{item.label}</dt>
            <span className={`font-mono text-micro uppercase tracking-[0.14em] ${stateTone[item.state]}`}>
              {item.state}
            </span>
          </div>
          <dd className="mt-3 max-w-[38ch] text-[0.9rem] leading-relaxed text-graphite">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
