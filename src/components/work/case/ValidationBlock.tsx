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
          <dt className="flex items-baseline justify-between gap-4 font-mono text-label uppercase tracking-[0.16em] text-ink">
            <span>{item.label}</span>
            <span className={`font-mono text-micro uppercase tracking-[0.14em] ${stateTone[item.state]}`}>
              {item.state}
            </span>
          </dt>
          <dd className="mt-3 max-w-[42ch] text-read-sm text-graphite">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
