import React from 'react';

/** Place data over a road network: clusters, points, one selected record. */
export function UppetitePreview() {
  const roads = [
  'M0 118 L200 96 L360 132 L520 108',
  'M60 0 L96 160 L120 300',
  'M240 0 L268 300',
  'M0 226 L180 208 L340 240 L520 214',
  'M400 0 L432 300',
  'M140 60 L520 34'];

  const points = [
  [96, 118, 5], [268, 132, 3], [268, 208, 6], [432, 214, 3],
  [120, 226, 4], [432, 96, 3], [176, 34, 2], [356, 240, 4]];

  return (
    <svg viewBox="0 0 520 300" className="h-full w-full" role="img" aria-label="Map preview: place points clustered along a road network in Los Baños">
      <rect width="520" height="300" fill="var(--surface)" />
      <g stroke="var(--hairline)" strokeWidth="1">
        {Array.from({ length: 11 }).map((_, i) => <line key={i} x1={i * 52} y1="0" x2={i * 52} y2="300" />)}
        {Array.from({ length: 6 }).map((_, i) => <line key={`h${i}`} x1="0" y1={i * 60} x2="520" y2={i * 60} />)}
      </g>
      <g fill="none" stroke="var(--ink)" strokeOpacity="0.28" strokeWidth="1.6">
        {roads.map((d) => <path key={d} d={d} />)}
      </g>
      <g>
        {points.map(([x, y, r], i) =>
        <g key={i}>
            <circle cx={x} cy={y} r={r * 3.4} fill="var(--accent)" fillOpacity="0.08" />
            <circle cx={x} cy={y} r={r} fill={i === 2 ? 'var(--accent)' : 'var(--ink)'} />
          </g>
        )}
      </g>
      <g stroke="var(--accent)" strokeWidth="1">
        <line x1="268" y1="208" x2="268" y2="150" />
        <line x1="268" y1="150" x2="356" y2="150" />
      </g>
      <text x="362" y="147" fontFamily="Geist Mono, monospace" fontSize="9" letterSpacing="1.4" fill="var(--ink)">
        PLACE / VERIFIED
      </text>
      <text x="16" y="288" fontFamily="Geist Mono, monospace" fontSize="9" letterSpacing="1.6" fill="var(--graphite)">
        COMMUNITY DATA · VERIFIED
      </text>
    </svg>);

}