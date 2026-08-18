import React, { useState } from 'react';
import type { DiagramEdge, DiagramNode } from '../../../types/project';

const W = 1000;
const H = 380;
const PAD = 70;

interface Props {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  accent: string;
  caption: string;
}

export function SystemDiagram({ nodes, edges, accent, caption }: Props) {
  const [active, setActive] = useState<string | null>(null);
  const pos = (n: DiagramNode) => ({
    x: PAD + n.x * (W - PAD * 2),
    y: PAD + n.y * (H - PAD * 2)
  });

  return (
    <figure className="w-full">
      <div className="overflow-x-auto overscroll-x-contain pb-2" tabIndex={0} aria-label={`${caption}. Scroll horizontally to inspect the full diagram on narrow screens.`}>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[760px] md:min-w-0" role="group" aria-label={caption}>
        <g stroke="var(--hairline)" strokeWidth="1">
          {Array.from({ length: 11 }).map((_, i) =>
          <line key={i} x1={W / 10 * i} y1="0" x2={W / 10 * i} y2={H} />
          )}
        </g>

        {edges.map((e) => {
          const a = nodes.find((n) => n.id === e.from);
          const b = nodes.find((n) => n.id === e.to);
          if (!a || !b) return null;
          const pa = pos(a);
          const pb = pos(b);
          const live = active === e.from || active === e.to;
          const mx = (pa.x + pb.x) / 2;
          return (
            <g key={`${e.from}-${e.to}`}>
              <path
                d={`M${pa.x} ${pa.y} C ${mx} ${pa.y}, ${mx} ${pb.y}, ${pb.x} ${pb.y}`}
                fill="none"
                stroke={live ? accent : 'var(--ink)'}
                strokeOpacity={live ? 0.95 : active ? 0.14 : 0.36}
                strokeWidth={live ? 1.5 : 1}
                style={{ transition: 'stroke 300ms, stroke-opacity 300ms' }} />
              
              {e.label &&
              <text
                x={mx}
                y={(pa.y + pb.y) / 2 - 8}
                textAnchor="middle"
                fontFamily="Geist Mono, monospace"
                fontSize="9.5"
                letterSpacing="1.4"
                fill="var(--graphite)"
                opacity={live ? 1 : 0.45}>
                
                  {e.label.toUpperCase()}
                </text>
              }
            </g>);

        })}

        {nodes.map((n) => {
          const p = pos(n);
          const on = active === n.id;
          return (
            <g
              key={n.id}
              tabIndex={0}
              role="group"
              aria-label={`${n.label}: ${n.detail}`}
              onMouseEnter={() => setActive(n.id)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(n.id)}
              onBlur={() => setActive(null)}
              style={{ cursor: 'default' }}>
              
              <rect
                x={p.x - 52}
                y={p.y - 17}
                width="104"
                height="34"
                fill="var(--canvas)"
                stroke={on ? accent : 'var(--ink)'}
                strokeWidth={on ? 1.5 : 1}
                style={{ transition: 'stroke 260ms' }} />
              
              <text
                x={p.x}
                y={p.y + 4}
                textAnchor="middle"
                fontFamily="Geist Mono, monospace"
                fontSize="10.5"
                letterSpacing="1.6"
                fill="var(--ink)">
                
                {n.label}
              </text>
              <text
                x={p.x}
                y={p.y + 31}
                textAnchor="middle"
                fontFamily="Geist Mono, monospace"
                fontSize="9"
                letterSpacing="1.1"
                fill="var(--graphite)"
                opacity={on ? 1 : 0.6}>
                
                {n.detail.toUpperCase()}
              </text>
            </g>);

        })}
        </svg>
      </div>
      <figcaption className="mt-3 border-t border-hairline pt-3 font-mono text-micro uppercase tracking-[0.16em] text-graphite">
        {caption}
      </figcaption>
    </figure>);

}