import React from 'react';

export function ArtifactFallback() {
  return (
    <svg viewBox="0 0 420 420" className="h-full w-full" aria-hidden="true">
      <g fill="none" stroke="var(--ink)" strokeOpacity="0.6">
        <ellipse cx="210" cy="210" rx="132" ry="132" />
        <ellipse cx="210" cy="210" rx="132" ry="44" />
        <ellipse cx="210" cy="210" rx="44" ry="132" />
        <ellipse cx="210" cy="210" rx="112" ry="88" transform="rotate(32 210 210)" />
      </g>
      <g fill="none" stroke="var(--accent)" strokeWidth="1.4">
        <ellipse cx="210" cy="210" rx="86" ry="30" transform="rotate(-18 210 210)" />
      </g>
      <g stroke="var(--ink)" strokeOpacity="0.35">
        <line x1="210" y1="42" x2="210" y2="378" />
        <line x1="42" y1="210" x2="378" y2="210" />
      </g>
      <circle cx="210" cy="210" r="5" fill="var(--ink)" />
    </svg>);

}