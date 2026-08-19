import React from 'react';
import type { ProjectModule } from '../../../types/project';
import { getCaseSectionId } from '../../../lib/caseNavigation';

interface Props {
  modules: ProjectModule[];
}

export function CaseIndex({ modules }: Props) {
  const entries = modules.map((module, index) => ({
    index: index + 1,
    label: module.title,
    href: `#${getCaseSectionId(module, index + 1)}`,
  }));

  return (
    <nav className="atlas-grid mt-14 md:mt-20" aria-label="Case study sections">
      <div className="col-span-4 border-y border-hairline md:col-span-8 xl:col-span-12">
        <div className="flex items-center gap-6 overflow-x-auto py-3 overscroll-x-contain md:gap-8">
          <span className="mono-label shrink-0 text-ink">CASE INDEX</span>
          {entries.map((entry) => (
            <a
              key={entry.href}
              href={entry.href}
              className="link-underline shrink-0 font-mono text-micro uppercase tracking-[0.14em] text-graphite hover:text-ink focus-visible:text-ink"
            >
              {String(entry.index).padStart(2, '0')} {entry.label}
            </a>
          ))}
          <a
            href="#case-technology"
            className="link-underline shrink-0 font-mono text-micro uppercase tracking-[0.14em] text-graphite hover:text-ink focus-visible:text-ink"
          >
            {String(entries.length + 1).padStart(2, '0')} Technology
          </a>
        </div>
      </div>
    </nav>
  );
}
