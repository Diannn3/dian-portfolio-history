import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { ProjectLink } from '../../../types/project';

export function ProjectLinks({ links }: { links?: ProjectLink[] }) {
  if (!links?.length) return null;

  return (
    <nav aria-label="Project resources" className="mt-6 border-t border-hairline pt-3">
      <span className="mono-label block">EVIDENCE / LINKS</span>
      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
        {links.map((link) => (
          <li key={`${link.kind}-${link.href}`}>
            <a
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="link-underline inline-flex items-center gap-1.5 font-mono text-label uppercase tracking-[0.14em] text-ink"
              title={link.note}
            >
              {link.label}
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
