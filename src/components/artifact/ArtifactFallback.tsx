import React from 'react';

/** Flat equivalent of the artifact, used without WebGL or under reduced motion. */
export function ArtifactFallback() {
  return (
    <svg
      viewBox="0 0 400 400"
      className="h-full w-full"
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMid meet">

      <g stroke="var(--hairline)" strokeWidth="0.8">
        {Array.from({ length: 9 }).map((_, i) =>
        <line key={`v${i}`} x1={40 + i * 40} y1="40" x2={40 + i * 40} y2="360" />
        )}
        {Array.from({ length: 9 }).map((_, i) =>
        <line key={`h${i}`} x1="40" y1={40 + i * 40} x2="360" y2={40 + i * 40} />
        )}
      </g>
      <path
        d="M96 268 C 150 180, 176 246, 216 186 S 300 150, 322 108"
        fill="none"
        stroke="var(--ink)"
        strokeWidth="6"
        strokeOpacity="0.85"
        strokeLinecap="round" />

      <path
        d="M96 268 C 150 180, 176 246, 216 186 S 300 150, 322 108"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1"
        strokeDasharray="3 5" />

      {[96, 150, 216, 280, 322].map((x, i) =>
      <rect key={x} x={x - 3} y={268 - i * 40 - 4} width="6" height="6" fill="var(--accent)" />
      )}
    </svg>);

}