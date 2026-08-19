import React, { useState } from 'react';
import * as Collapsible from '@radix-ui/react-collapsible';
import type { LabEntry } from '../../data/site';

interface Props {
  entry: LabEntry;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

/**
 * One notebook entry. Collapsed by default so nothing runs until it is opened —
 * the content is only mounted while the entry is expanded.
 */
export function LabExperiment({ entry, defaultOpen = false, children }: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen} className="border-b border-hairline">
      <Collapsible.Trigger
        className="group flex w-full items-baseline gap-4 py-5 text-left"
        data-cursor="link">

        <span className={`mono-label w-9 shrink-0 ${open ? 'text-accent' : ''}`}>{entry.id}</span>
        <span className="font-heading text-display-3 font-medium uppercase leading-none text-ink">
          {entry.title}
        </span>
        <span className="mono-label ml-auto hidden shrink-0 sm:inline">{entry.tag}</span>
        <span className="mono-label shrink-0">{entry.status}</span>
        <span
          aria-hidden="true"
          className="mono-label shrink-0 text-ink transition-transform duration-500 ease-atlas group-data-[state=open]:rotate-45">

          +
        </span>
      </Collapsible.Trigger>

      <Collapsible.Content className="overflow-hidden">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 pb-8 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="max-w-[46ch] text-read-sm text-graphite">{entry.note}</p>
            {entry.href &&
            <a
              href={entry.href}
              target="_blank"
              rel="noreferrer noopener"
              className="mono-label link-underline mt-4 inline-block text-ink"
              data-cursor="link">

                SOURCE ↗<span className="sr-only"> (opens in a new tab)</span>
              </a>
            }
          </div>
          <div className="md:col-span-8">{children}</div>
        </div>
      </Collapsible.Content>
    </Collapsible.Root>);

}