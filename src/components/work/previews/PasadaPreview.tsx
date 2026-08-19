import React from 'react';

/** Route line with units, queue bars and a coarse demand field. */
export function PasadaPreview() {
  const cells = Array.from({ length: 10 * 5 }).map((_, i) => {
    const cx = i % 10;
    const cy = Math.floor(i / 10);
    const d = Math.exp(-((cx - 6) ** 2 + (cy - 2) ** 2) / 6) + 0.55 * Math.exp(-((cx - 2) ** 2 + (cy - 3) ** 2) / 4);
    return { cx, cy, d };
  });
  return (
    <svg viewBox="0 0 520 300" className="h-full w-full" role="img" aria-label="Transit preview: jeepney route with unit positions, passenger queues and a demand heat field">
      <rect width="520" height="300" fill="var(--surface)" />
      <g>
        {cells.map(({ cx, cy, d }) =>
        <rect
          key={`${cx}-${cy}`}
          x={cx * 52}
          y={cy * 60}
          width="52"
          height="60"
          fill="var(--signal)"
          fillOpacity={d * 0.34} />

        )}
      </g>
      <g stroke="var(--hairline)" strokeWidth="1">
        {Array.from({ length: 11 }).map((_, i) =>
        <line key={i} x1={i * 52} y1="0" x2={i * 52} y2="300" />
        )}
      </g>
      <path
        d="M20 250 C 120 250, 150 150, 250 140 S 380 190, 420 90 L500 60"
        fill="none"
        stroke="var(--ink)"
        strokeWidth="2" />
      
      <g fill="var(--accent)">
        <rect x="112" y="222" width="9" height="9" transform="rotate(45 116.5 226.5)" />
        <rect x="246" y="136" width="9" height="9" transform="rotate(45 250.5 140.5)" />
        <rect x="414" y="86" width="9" height="9" transform="rotate(45 418.5 90.5)" />
      </g>
      <g fill="var(--ink)" fillOpacity="0.7">
        {[0, 1, 2, 3, 4, 5].map((i) =>
        <rect key={i} x={40 + i * 7} y={272 - i * 3} width="3" height={8 + i * 3} />
        )}
      </g>
      <text x="40" y="292" fontFamily="Geist Mono, monospace" fontSize="9" letterSpacing="1.4" fill="var(--graphite)">
        QUEUE
      </text>
      <text x="330" y="40" fontFamily="Geist Mono, monospace" fontSize="9" letterSpacing="1.4" fill="var(--ink)">
        LIVE ROUTE · QUEUE SIGNAL
      </text>
      <line x1="326" y1="46" x2="326" y2="86" stroke="var(--ink)" strokeWidth="1" />
    </svg>);

}