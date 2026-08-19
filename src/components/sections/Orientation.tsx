import React from 'react';
import { contactLinks } from '../../data/site';

/** A short reading cue between the frozen hero and the first evidence plate. */
export function Orientation() {
  return (
    <div data-orientation className="atlas-grid border-y border-hairline py-7 md:py-9">
      <div className="col-span-4 flex flex-col gap-6 md:col-span-8 md:flex-row md:items-end md:justify-between xl:col-span-12">
        <div className="max-w-[66ch]">
          <p className="mono-label mb-3">ORIENTATION / READ THE PROOF</p>
          <p data-orientation-copy className="text-read text-graphite">
            A small atlas of product systems, studio practice, and system studies. Start with the work that has the clearest proof, then follow the threads into tools, experiments, and questions still in motion. Each entry names its state, role, and evidence boundary before you open it.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-x-6 gap-y-3">
          <a
            href="#work"
            className="mono-label link-underline text-ink"
            data-cursor="link"
          >
            VIEW SELECTED WORK ↓
          </a>
          <a
            href={contactLinks[0].href}
            target="_blank"
            rel="noreferrer noopener"
            className="mono-label link-underline text-graphite"
            data-cursor="external"
          >
            PUBLIC PROFILE ↗<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </div>
    </div>
  );
}
