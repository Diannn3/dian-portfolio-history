import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import type {
  CurrentStateItem,
  DiagramEdge,
  DiagramNode,
  ProjectDecision,
  ProjectLink,
  ValidationItem } from
'../../../types/project';

export function Pairs({ items }: {items: {label: string;value: string;note?: string;}[];}) {
  return (
    <dl className="border-t border-hairline">
      {items.map((it) =>
      <div key={it.label + it.value} className="flex gap-6 border-b border-hairline py-3">
          <dt className="w-[7rem] shrink-0 font-mono text-micro uppercase tracking-[0.16em] text-graphite">
            {it.label}
          </dt>
          <dd className="text-note text-ink">
            {it.value}
            {it.note ? <span className="mt-1 block text-note text-graphite">{it.note}</span> : null}
          </dd>
        </div>
      )}
    </dl>);

}

const W = 1000;
const H = 380;
const PAD = 70;

export function SystemDiagram({
  nodes,
  edges,
  accent,
  caption




}: {nodes: DiagramNode[];edges: DiagramEdge[];accent: string;caption: string;}) {
  const [active, setActive] = useState<string | null>(null);
  const pos = (n: DiagramNode) => ({ x: PAD + n.x * (W - PAD * 2), y: PAD + n.y * (H - PAD * 2) });
  const labelFor = (id: string) => nodes.find((node) => node.id === id)?.label ?? id;

  return (
    <figure className="w-full">
      <p className="mb-2 font-mono text-micro uppercase tracking-[0.16em] text-graphite md:hidden" aria-hidden="true">
        SCROLL →
      </p>
      <div
        className="overflow-x-auto overscroll-x-contain pb-2"
        tabIndex={0}
        aria-label={`${caption}. Scroll horizontally to inspect the full diagram on narrow screens.`}>
        
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[760px] md:min-w-0" aria-hidden="true">
          <g stroke="var(--hairline)" strokeWidth="1">
            {Array.from({ length: 11 }).map((_, i) =>
            <line key={i} x1={W / 10 * i} y1="0" x2={W / 10 * i} y2={H} />
            )}
          </g>
          <g>
            {edges.map((edge) => {
              const a = nodes.find((n) => n.id === edge.from);
              const b = nodes.find((n) => n.id === edge.to);
              if (!a || !b) return null;
              const pa = pos(a);
              const pb = pos(b);
              const mx = (pa.x + pb.x) / 2;
              const live = active === edge.from || active === edge.to;
              return (
                <g key={`${edge.from}-${edge.to}`}>
                  <path
                    d={`M${pa.x} ${pa.y} C ${mx} ${pa.y}, ${mx} ${pb.y}, ${pb.x} ${pb.y}`}
                    fill="none"
                    stroke={live ? accent : 'var(--ink)'}
                    strokeOpacity={live ? 0.95 : active ? 0.14 : 0.36}
                    strokeWidth={live ? 1.5 : 1}
                    style={{ transition: 'stroke 300ms, stroke-opacity 300ms' }} />
                  
                  {edge.label ?
                  <text
                    x={mx}
                    y={(pa.y + pb.y) / 2 - 8}
                    textAnchor="middle"
                    fontFamily="Geist Mono, monospace"
                    fontSize="9.5"
                    letterSpacing="1.4"
                    fill="var(--graphite)"
                    opacity={live ? 1 : 0.45}>
                    
                      {edge.label.toUpperCase()}
                    </text> :
                  null}
                </g>);

            })}
          </g>
          <g>
            {nodes.map((node) => {
              const p = pos(node);
              const on = active === node.id;
              return (
                <g key={node.id}>
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
                    
                    {node.label}
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
                    
                    {node.detail.toUpperCase()}
                  </text>
                </g>);

            })}
          </g>
        </svg>
      </div>

      {/* real controls, so the diagram is operable by keyboard */}
      <ul className="mt-3 flex flex-wrap gap-2">
        {nodes.map((node) =>
        <li key={node.id}>
            <button
            type="button"
            aria-pressed={active === node.id}
            onPointerEnter={() => setActive(node.id)}
            onPointerLeave={() => setActive(null)}
            onFocus={() => setActive(node.id)}
            onBlur={() => setActive(null)}
            onClick={() => setActive((p) => p === node.id ? null : node.id)}
            className="border border-hairline px-2 py-1 font-mono text-micro uppercase tracking-[0.14em] text-graphite transition-colors duration-300 hover:border-ink hover:text-ink"
            style={active === node.id ? { borderColor: accent, color: 'var(--ink)' } : undefined}>
            
              {node.label}
            </button>
          </li>
        )}
      </ul>

      <figcaption className="mt-3 border-t border-hairline pt-3 font-mono text-micro uppercase tracking-[0.16em] text-graphite">
        {caption}
      </figcaption>

      <details className="mt-4 border-t border-hairline pt-3">
        <summary className="w-fit cursor-pointer font-mono text-micro uppercase tracking-[0.16em] text-graphite hover:text-ink focus-visible:text-ink">
          View system as text +
        </summary>
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          <dl className="space-y-3">
            {nodes.map((node) =>
            <div key={node.id} className="grid grid-cols-[8rem_1fr] gap-4 border-t border-hairline pt-3">
                <dt className="font-mono text-micro uppercase tracking-[0.14em] text-ink">{node.label}</dt>
                <dd className="text-note text-graphite">{node.detail}</dd>
              </div>
            )}
          </dl>
          <ol className="space-y-3" aria-label="System connections">
            {edges.map((edge) =>
            <li key={`${edge.from}-${edge.to}`} className="border-t border-hairline pt-3 text-note text-graphite">
                {labelFor(edge.from)}
                <span aria-hidden="true"> → </span>
                {labelFor(edge.to)}
                {edge.label ? <span className="ml-2">/ {edge.label}</span> : null}
              </li>
            )}
          </ol>
        </div>
      </details>
    </figure>);

}

export function DecisionBlock({ decision }: {decision: ProjectDecision;}) {
  return (
    <div className="atlas-grid mt-8 gap-y-8 md:mt-12">
      <div className="col-span-4 md:col-span-3 xl:col-span-4">
        <span className="mono-label block">QUESTION</span>
        <p className="mt-3 font-heading text-display-3 leading-snug text-ink">{decision.question}</p>
        {decision.considered?.length ?
        <div className="mt-8 border-t border-hairline pt-3">
            <span className="mono-label block">CONSIDERED</span>
            <ul className="mt-3 space-y-2">
              {decision.considered.map((item) =>
            <li key={item} className="flex gap-3 text-note text-graphite">
                  <span aria-hidden="true" className="mt-[0.6rem] block h-[1px] w-3 shrink-0 bg-hairline" />
                  {item}
                </li>
            )}
            </ul>
          </div> :
        null}
      </div>
      <dl className="col-span-4 md:col-span-5 xl:col-span-6 xl:col-start-7">
        {[
        ['CHOICE', decision.choice],
        ['WHY', decision.rationale],
        ['TRADEOFF', decision.tradeoff]].
        map(([k, v]) =>
        <div key={k} className="border-t border-hairline py-4 md:grid md:grid-cols-[8rem_1fr] md:gap-6">
            <dt className="font-mono text-micro uppercase tracking-[0.16em] text-graphite">{k}</dt>
            <dd className="mt-2 text-body text-ink md:mt-0">{v}</dd>
          </div>
        )}
      </dl>
    </div>);

}

const stateTone: Record<ValidationItem['state'], string> = {
  VERIFIED: 'text-signal',
  DEFINED: 'text-ink',
  LIMITATION: 'text-graphite',
  'NOT CLAIMED': 'text-graphite'
};

export function ValidationBlock({ items }: {items: ValidationItem[];}) {
  return (
    <dl className="atlas-grid mt-8 gap-y-0 md:mt-12">
      {items.map((item) =>
      <div key={item.label} className="col-span-4 border-t border-hairline py-5 md:col-span-4 xl:col-span-4">
          <div className="flex items-baseline justify-between gap-4">
            <dt className="font-mono text-label uppercase tracking-[0.16em] text-ink">{item.label}</dt>
            <span className={`font-mono text-micro uppercase tracking-[0.14em] ${stateTone[item.state]}`}>
              {item.state}
            </span>
          </div>
          <dd className="mt-3 max-w-[38ch] text-note text-graphite">{item.value}</dd>
        </div>
      )}
    </dl>);

}

export function ProjectLinks({ links }: {links?: ProjectLink[];}) {
  if (!links?.length) return null;
  return (
    <nav aria-label="Project resources" className="border-t border-hairline pt-3">
      <span className="mono-label block">EVIDENCE / LINKS</span>
      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
        {links.map((link) =>
        <li key={`${link.kind}-${link.href}`}>
            <a
            href={link.href}
            target="_blank"
            rel="noreferrer"
            data-cursor="external"
            className="link-underline inline-flex items-center gap-1.5 font-mono text-label uppercase tracking-[0.14em] text-ink"
            title={link.note}>
            
              {link.label}
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
            </a>
          </li>
        )}
      </ul>
    </nav>);

}

export function CurrentState({ items }: {items: CurrentStateItem[];}) {
  return (
    <section className="atlas-grid mt-14 md:mt-20" aria-labelledby="current-state-heading">
      <div className="col-span-4 border-t border-ink pt-4 md:col-span-8 xl:col-span-12">
        <h2 id="current-state-heading" className="mono-label text-ink">
          CURRENT STATE / AUG 2026
        </h2>
      </div>
      <dl className="col-span-4 mt-5 grid grid-cols-1 md:col-span-8 md:grid-cols-2 md:gap-x-6 xl:col-span-12 xl:grid-cols-4 xl:gap-x-8">
        {items.map((item) =>
        <div key={item.label} className="border-t border-hairline py-4">
            <dt className="font-mono text-micro uppercase tracking-[0.16em] text-graphite">
              {item.label}
            </dt>
            <dd className="mt-2 max-w-[34ch] text-note text-ink">{item.value}</dd>
          </div>
        )}
      </dl>
    </section>);

}