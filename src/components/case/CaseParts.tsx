import React from 'react';
import type {
  CurrentStateItem,
  ProjectDecision,
  ProjectLink,
  ValidationItem } from
'../../types/project';

/** Shared case-study primitives: all hairlines, indexing and reading-scale text. */

export function ItemList({
  items



}: {items: {label: string;value: string;note?: string;}[];}) {
  return (
    <dl className="border-t border-hairline">
      {items.map((item) =>
      <div
        key={item.label + item.value.slice(0, 12)}
        className="flex flex-col gap-1 border-b border-hairline py-4 md:flex-row md:gap-8">

          <dt className="mono-label md:w-40 md:shrink-0">{item.label}</dt>
          <dd className="max-w-[62ch] text-read text-ink">
            {item.value}
            {item.note && <span className="mt-1 block text-read-sm text-graphite">{item.note}</span>}
          </dd>
        </div>
      )}
    </dl>);

}

export function StepFlow({ steps }: {steps: {label: string;body: string;}[];}) {
  return (
    <ol className="grid grid-cols-1 gap-0 border-t border-hairline md:grid-cols-5 md:border-t-0">
      {steps.map((step, i) =>
      <li
        key={step.label}
        className="border-b border-hairline py-4 md:border-b-0 md:border-t md:pr-5 md:pt-4">

          <div className="flex items-baseline gap-3">
            <span className="mono-label text-accent">{String(i + 1).padStart(2, '0')}</span>
            <span className="mono-label text-ink">{step.label}</span>
          </div>
          <p className="mt-3 max-w-[38ch] text-read-sm text-graphite">{step.body}</p>
        </li>
      )}
    </ol>);

}

export function DecisionBlock({ decision }: {decision: ProjectDecision;}) {
  return (
    <div className="border border-hairline">
      <p className="border-b border-hairline px-4 py-3 text-read-lg text-ink">{decision.question}</p>
      <dl className="grid grid-cols-1 md:grid-cols-3">
        <div className="border-b border-hairline p-4 md:border-b-0 md:border-r">
          <dt className="mono-label text-accent">CHOICE</dt>
          <dd className="mt-2 text-read text-ink">{decision.choice}</dd>
        </div>
        <div className="border-b border-hairline p-4 md:border-b-0 md:border-r">
          <dt className="mono-label">RATIONALE</dt>
          <dd className="mt-2 text-read-sm text-graphite">{decision.rationale}</dd>
        </div>
        <div className="p-4">
          <dt className="mono-label">TRADE-OFF</dt>
          <dd className="mt-2 text-read-sm text-graphite">{decision.tradeoff}</dd>
        </div>
      </dl>
      {decision.considered?.length ?
      <p className="border-t border-hairline px-4 py-3 mono-label">
          CONSIDERED / {decision.considered.join(' · ')}
        </p> :
      null}
    </div>);

}

const STATE_TONE: Record<ValidationItem['state'], string> = {
  VERIFIED: 'text-signal',
  DEFINED: 'text-ink',
  LIMITATION: 'text-accent',
  'NOT CLAIMED': 'text-graphite'
};

export function ValidationBlock({ items }: {items: ValidationItem[];}) {
  return (
    <ul className="border-t border-hairline">
      {items.map((item) =>
      <li
        key={item.label}
        className="flex flex-col gap-2 border-b border-hairline py-4 md:flex-row md:items-baseline md:gap-8">

          <span className="mono-label md:w-32 md:shrink-0">{item.label}</span>
          <span className="max-w-[62ch] text-read text-ink">{item.value}</span>
          <span className={`mono-label md:ml-auto md:shrink-0 ${STATE_TONE[item.state]}`}>
            {item.state}
          </span>
        </li>
      )}
    </ul>);

}

export function CurrentStateBlock({ items }: {items: CurrentStateItem[];}) {
  return (
    <dl className="grid grid-cols-1 border-t border-hairline md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) =>
      <div key={item.label} className="border-b border-hairline p-4 md:border-r">
          <dt className="mono-label text-accent">{item.label}</dt>
          <dd className="mt-2 text-read-sm text-ink">{item.value}</dd>
        </div>
      )}
    </dl>);

}

export function ProjectLinks({ links }: {links: ProjectLink[];}) {
  return (
    <ul className="flex flex-col gap-3">
      {links.map((link) =>
      <li key={link.href} className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <span className="mono-label w-20 shrink-0">{link.kind.toUpperCase()}</span>
          <a
          href={link.href}
          target="_blank"
          rel="noreferrer noopener"
          className="link-underline text-read text-ink"
          data-cursor="link">

            {link.label} ↗<span className="sr-only"> (opens in a new tab)</span>
          </a>
          {link.note && <span className="text-read-sm text-graphite">{link.note}</span>}
        </li>
      )}
    </ul>);

}