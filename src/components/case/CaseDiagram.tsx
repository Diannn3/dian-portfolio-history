import React, { useState } from 'react';
import type { DiagramEdge, DiagramNode } from '../../types/project';

interface Props {
  figure: string;
  title: string;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

/**
 * An architecture plate. The SVG carries the geometry and is decorative; the
 * nodes themselves are real buttons and the relationships are repeated as text,
 * so nothing here is only available to someone who can see the drawing.
 */
export function CaseDiagram({ figure, title, nodes, edges }: Props) {
  const [active, setActive] = useState<string | null>(null);
  const activeNode = nodes.find((n) => n.id === active) ?? null;
  const label = (id: string) => nodes.find((n) => n.id === id)?.label ?? id;

  return (
    <figure className="m-0">
      <div className="border border-hairline bg-surface/30">
        <figcaption className="flex flex-wrap items-baseline justify-between gap-3 border-b border-hairline px-3 py-2">
          <span className="mono-label">
            {figure} / {title}
          </span>
          <span className="mono-label">SYSTEM DIAGRAM — NOT A PRODUCT SCREENSHOT</span>
        </figcaption>

        <div className="relative aspect-[16/9] w-full">
          <svg
            viewBox="0 0 100 56"
            className="absolute inset-0 h-full w-full"
            aria-hidden="true"
            focusable="false">

            <g stroke="var(--hairline)" strokeWidth="0.2">
              {Array.from({ length: 11 }).map((_, i) =>
              <line key={`v${i}`} x1={i * 10} y1="0" x2={i * 10} y2="56" />
              )}
              {Array.from({ length: 7 }).map((_, i) =>
              <line key={`h${i}`} x1="0" y1={i * 9.33} x2="100" y2={i * 9.33} />
              )}
            </g>
            {edges.map((e, i) => {
              const from = nodes.find((n) => n.id === e.from);
              const to = nodes.find((n) => n.id === e.to);
              if (!from || !to) return null;
              const on = active === e.from || active === e.to;
              const x1 = from.x * 100;
              const y1 = from.y * 56;
              const x2 = to.x * 100;
              const y2 = to.y * 56;
              return (
                <g key={`${e.from}-${e.to}-${i}`}>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={on ? 'var(--accent)' : 'var(--ink)'}
                    strokeOpacity={on ? 0.9 : 0.3}
                    strokeWidth={on ? 0.5 : 0.3}
                    className="transition-all duration-500 ease-atlas" />

                  {e.label &&
                  <text
                    x={(x1 + x2) / 2}
                    y={(y1 + y2) / 2 - 1.2}
                    textAnchor="middle"
                    fill="var(--graphite)"
                    fontSize="1.7"
                    letterSpacing="0.12"
                    style={{ fontFamily: 'Geist Mono, ui-monospace, monospace' }}>

                      {e.label.toUpperCase()}
                    </text>
                  }
                </g>);

            })}
          </svg>

          {nodes.map((n) => {
            const on = active === n.id;
            return (
              <button
                key={n.id}
                type="button"
                onMouseEnter={() => setActive(n.id)}
                onFocus={() => setActive(n.id)}
                onMouseLeave={() => setActive((p) => p === n.id ? null : p)}
                onBlur={() => setActive((p) => p === n.id ? null : p)}
                onClick={() => setActive((p) => p === n.id ? null : n.id)}
                aria-pressed={on}
                style={{ left: `${n.x * 100}%`, top: `${n.y * 100}%` }}
                className="absolute flex min-h-[44px] -translate-x-1/2 -translate-y-1/2 items-center"
                data-cursor="link">

                <span
                  className={`border bg-canvas px-2 py-1 font-mono text-micro uppercase tracking-[0.14em] transition-colors duration-300 ease-atlas ${
                  on ? 'border-accent text-accent' : 'border-hairline text-ink'}`
                  }>

                  {n.label}
                </span>
              </button>);

          })}
        </div>

        <div className="border-t border-hairline px-3 py-2" aria-live="polite">
          <p className="mono-label">
            {activeNode ? `${activeNode.label} / ${activeNode.detail}` : 'SELECT A NODE FOR DETAIL'}
          </p>
        </div>
      </div>

      <dl className="mt-5 grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-2">
        {nodes.map((n) =>
        <div key={n.id} className="border-t border-hairline pt-2">
            <dt className="mono-label text-ink">{n.label}</dt>
            <dd className="mt-1 text-read-sm text-graphite">{n.detail}</dd>
          </div>
        )}
      </dl>

      <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
        {edges.map((e, i) =>
        <li key={`${e.from}-${e.to}-text-${i}`} className="mono-label">
            {label(e.from)} → {label(e.to)}
            {e.label ? ` (${e.label})` : ''}
          </li>
        )}
      </ul>
    </figure>);

}