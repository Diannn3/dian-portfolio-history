import React from 'react';
import type { ProjectCatalogEntry } from '../../data/projectCatalog';

interface EvidenceRecord {
  src: string;
  alt: string;
  caption: string;
  state: string;
  width: number;
  height: number;
  fit: 'contain' | 'cover';
}

const records: Record<string, EvidenceRecord> = {
  uppetite: {
    src: '/work/uppetite/smart-picks-mobile.webp',
    alt: 'UPPETITE Smart Picks mobile view showing route stops, a break duration, food preference and ranked places.',
    caption: 'Smart Picks makes route, time and preference constraints visible before a place is chosen.',
    state: 'DETERMINISTIC MOBILE BASELINE',
    width: 780,
    height: 2400,
    fit: 'cover',
  },
  'campus-navigation': {
    src: '/work/ims/third-floor-schematic.png',
    alt: 'IMS Academic Hub schematic third-floor map with rooms, stairs and a site-verification note.',
    caption: 'The map is a schematic prototype; the geometry remains explicitly site-unverified.',
    state: 'SYNTHETIC / SITE-UNVERIFIED',
    width: 1200,
    height: 760,
    fit: 'contain',
  },
};

export function WorkEvidenceMedia({ project }: { project: ProjectCatalogEntry }) {
  const evidence = records[project.slug];
  if (!evidence) return null;

  return (
    <figure data-work-evidence className="border border-hairline bg-surface/40 p-2">
      <div className="aspect-[16/9] overflow-hidden bg-canvas">
        <img
          src={evidence.src}
          alt={evidence.alt}
          width={evidence.width}
          height={evidence.height}
          loading="lazy"
          decoding="async"
          className={`h-full w-full ${evidence.fit === 'contain' ? 'object-contain' : 'object-cover object-top'}`}
        />
      </div>
      <figcaption className="mt-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span className="max-w-[46ch] text-read-sm text-graphite">{evidence.caption}</span>
        <span className="mono-label shrink-0">{evidence.state}</span>
      </figcaption>
    </figure>
  );
}
