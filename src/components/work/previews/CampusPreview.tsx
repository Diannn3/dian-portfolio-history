import React from 'react';

/** Three offset floor plates with a continuous route crossing levels. */
export function CampusPreview() {
  const plate = (dx: number, dy: number, active: boolean) =>
  <g key={`${dx}-${dy}`} transform={`translate(${dx} ${dy}) skewX(-24)`}>
      <rect x="0" y="0" width="230" height="130"
    fill={active ? 'var(--canvas)' : 'none'}
    stroke={active ? 'var(--ink)' : 'var(--hairline)'}
    strokeWidth={active ? 1.4 : 1} />
      <g stroke={active ? 'var(--ink)' : 'var(--hairline)'} strokeOpacity={active ? 0.5 : 1} strokeWidth="1">
        <line x1="0" y1="44" x2="230" y2="44" />
        <line x1="86" y1="44" x2="86" y2="130" />
        <line x1="152" y1="0" x2="152" y2="44" />
        <line x1="196" y1="44" x2="196" y2="130" />
      </g>
    </g>;

  return (
    <svg viewBox="0 0 520 300" className="h-full w-full" role="img" aria-label="Navigation preview: three stacked floor plates with a route continuing between levels">
      <rect width="520" height="300" fill="var(--surface)" />
      {plate(150, 30, false)}
      {plate(120, 100, true)}
      {plate(90, 170, false)}
      <g fill="none" stroke="var(--accent)" strokeWidth="2">
        <path d="M330 76 L282 96 L250 132" />
        <path d="M250 132 L214 152 L196 190" strokeDasharray="4 4" />
        <path d="M196 190 L160 214 L128 236" />
      </g>
      <g fill="var(--accent)">
        <circle cx="330" cy="76" r="4" />
        <circle cx="128" cy="236" r="4" />
      </g>
      <g fill="var(--ink)">
        <circle cx="250" cy="132" r="2.5" />
        <circle cx="196" cy="190" r="2.5" />
      </g>
      <text x="352" y="80" fontFamily="Geist Mono, monospace" fontSize="9" letterSpacing="1.4" fill="var(--graphite)">L3 / ROOM</text>
      <text x="20" y="248" fontFamily="Geist Mono, monospace" fontSize="9" letterSpacing="1.4" fill="var(--graphite)">L1 / ENTRANCE</text>
      <text x="20" y="286" fontFamily="Geist Mono, monospace" fontSize="9" letterSpacing="1.4" fill="var(--graphite)">MULTI-LEVEL · ROUTING</text>
    </svg>);

}