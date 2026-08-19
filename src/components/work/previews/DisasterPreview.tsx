import React from 'react';

/** Incident events, message lines into a priority graph, hazard field behind. */
export function DisasterPreview() {
  const incidents = [
  [92, 196, 'A'], [168, 122, 'B'], [268, 214, 'C'], [316, 108, 'D'], [402, 176, 'E']] as const;

  return (
    <svg viewBox="0 0 520 300" className="h-full w-full" role="img" aria-label="Emergency preview: incident reports linked into a prioritised graph over a hazard field">
      <rect width="520" height="300" fill="var(--surface)" />
      <g fill="none" stroke="var(--ink)" strokeOpacity="0.16" strokeWidth="1">
        {[0, 1, 2, 3, 4].map((i) =>
        <path key={i} d={`M-20 ${70 + i * 46} C 120 ${20 + i * 46}, 300 ${140 + i * 40}, 540 ${60 + i * 44}`} />
        )}
      </g>
      <g stroke="var(--accent)" strokeWidth="1" strokeDasharray="3 4">
        <line x1="92" y1="196" x2="168" y2="122" />
        <line x1="168" y1="122" x2="268" y2="214" />
        <line x1="268" y1="214" x2="316" y2="108" />
        <line x1="316" y1="108" x2="402" y2="176" />
        <line x1="92" y1="196" x2="268" y2="214" />
      </g>
      <g>
        {incidents.map(([x, y, id], i) =>
        <g key={id}>
            <circle cx={x} cy={y} r={i === 3 ? 9 : 5} fill={i === 3 ? 'var(--accent)' : 'var(--ink)'} />
            <circle cx={x} cy={y} r={i === 3 ? 20 : 12} fill="none" stroke="var(--ink)" strokeOpacity="0.3" />
            <text x={x + (i === 3 ? 26 : 18)} y={y + 3} fontFamily="Geist Mono, monospace" fontSize="9" letterSpacing="1.2" fill="var(--graphite)">
              {id}
            </text>
          </g>
        )}
      </g>
      <g fill="var(--ink)" fillOpacity="0.85">
        {[0, 1, 2, 3].map((i) => <rect key={i} x={430} y={40 + i * 14} width={70 - i * 16} height="5" />)}
      </g>
      <text x="430" y="30" fontFamily="Geist Mono, monospace" fontSize="9" letterSpacing="1.4" fill="var(--graphite)">URGENCY</text>
      <text x="20" y="286" fontFamily="Geist Mono, monospace" fontSize="9" letterSpacing="1.4" fill="var(--graphite)">MULTI-CHANNEL · DEDUP</text>
    </svg>);

}