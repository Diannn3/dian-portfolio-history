import React from 'react';
import type { PreviewKey } from '../../types/project';

interface Props {
  variant: PreviewKey;
  className?: string;
}

/**
 * Flat procedural previews used where the shared WebGL stage is not mounted
 * (mobile, reduced motion, no WebGL). These are editorial diagrams of each
 * system — never product screenshots.
 */
export function InlinePreview({ variant, className = '' }: Props) {
  return (
    <svg
      viewBox="0 0 320 180"
      className={`h-full w-full ${className}`}
      aria-hidden="true"
      focusable="false">

      <g stroke="var(--hairline)" strokeWidth="0.6">
        {Array.from({ length: 9 }).map((_, i) =>
        <line key={`v${i}`} x1={20 + i * 35} y1="14" x2={20 + i * 35} y2="166" />
        )}
        {Array.from({ length: 5 }).map((_, i) =>
        <line key={`h${i}`} x1="20" y1={20 + i * 36} x2="300" y2={20 + i * 36} />
        )}
      </g>
      {variant === 'uppetite' && <Uppetite />}
      {variant === 'campus' && <Campus />}
      {variant === 'pasada' && <Pasada />}
      {variant === 'disaster' && <Disaster />}
    </svg>);

}

function Uppetite() {
  return (
    <g>
      <path
        d="M40 140 L92 108 L150 118 L206 74 L268 56"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.4" />

      {[
      [40, 140],
      [92, 108],
      [150, 118],
      [206, 74],
      [268, 56]].
      map(([x, y], i) =>
      <rect
        key={i}
        x={x - 3}
        y={y - 3}
        width="6"
        height="6"
        fill={i === 3 ? 'var(--accent)' : 'var(--ink)'} />

      )}
      <circle cx="206" cy="74" r="16" fill="none" stroke="var(--accent)" strokeWidth="0.7" />
    </g>);

}

function Campus() {
  return (
    <g>
      {[0, 1, 2].map((i) =>
      <g key={i} transform={`translate(0 ${i * 34})`}>
          <path
          d="M70 118 L170 88 L250 112 L150 142 Z"
          fill="none"
          stroke="var(--ink)"
          strokeOpacity={i === 1 ? 0.9 : 0.35}
          strokeWidth="1" />

        </g>
      )}
      <path
        d="M104 128 L152 112 L176 92 L214 104"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.4"
        strokeDasharray="4 3" />

      <rect x="211" y="101" width="6" height="6" fill="var(--accent)" />
    </g>);

}

function Pasada() {
  return (
    <g>
      <path
        d="M30 130 C 90 120, 110 60, 180 62 S 262 96, 296 66"
        fill="none"
        stroke="var(--ink)"
        strokeWidth="1.2" />

      {[0, 1, 2, 3, 4, 5].map((i) =>
      <rect
        key={i}
        x={44 + i * 42}
        y={148}
        width="26"
        height={4 + i % 3 * 7}
        fill="var(--ink)"
        fillOpacity={0.18 + i % 3 * 0.18}
        transform={`translate(0 ${-(4 + i % 3 * 7)})`} />

      )}
      <circle cx="180" cy="62" r="4" fill="var(--accent)" />
      <circle cx="252" cy="88" r="3" fill="var(--accent)" fillOpacity="0.5" />
    </g>);

}

function Disaster() {
  return (
    <g>
      {[0, 1, 2, 3].map((i) =>
      <line
        key={i}
        x1="34"
        y1={44 + i * 30}
        x2="150"
        y2={92}
        stroke="var(--ink)"
        strokeOpacity="0.4"
        strokeWidth="0.9" />

      )}
      <line x1="150" y1="92" x2="228" y2="72" stroke="var(--accent)" strokeWidth="1.3" />
      <line x1="150" y1="92" x2="228" y2="120" stroke="var(--accent)" strokeWidth="1.3" strokeOpacity="0.5" />
      <circle cx="150" cy="92" r="9" fill="none" stroke="var(--ink)" strokeWidth="0.9" />
      <rect x="225" y="69" width="6" height="6" fill="var(--ink)" />
      <rect x="225" y="117" width="6" height="6" fill="var(--ink)" fillOpacity="0.5" />
    </g>);

}