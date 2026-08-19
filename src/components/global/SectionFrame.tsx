import React, { useMemo, useRef } from 'react';
import { useSectionRegistration } from '../../hooks/useReveals';

interface Props {
  /** anchor id, also the rail's section key */
  id: string;
  /** two-digit index shown in the rail and the section head */
  index: string;
  /** section title — uppercase mono in the head, and the rail label */
  title: string;
  /** optional right-aligned annotation on the head rule */
  annotation?: string;
  /** rail nav hash when this section is a top-level destination */
  nav?: string;
  className?: string;
  children?: React.ReactNode;
  /** heading id for aria-labelledby wiring */
  headingId?: string;
}

/**
 * Every homepage section wears the same head: one ink rule, the section number,
 * the title in mono, and an optional annotation on the right. That consistency
 * is what allows the layouts underneath to vary so much without the page
 * falling apart — and it is what the contextual rail reads to know where the
 * visitor is.
 */
export function SectionFrame({
  id,
  index,
  title,
  annotation,
  nav,
  className = '',
  children,
  headingId
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const meta = useMemo(
    () => ({ id, index, label: title.toUpperCase(), nav }),
    [id, index, title, nav]
  );
  useSectionRegistration(ref, meta);

  const hId = headingId ?? `${id}-heading`;

  return (
    <section
      ref={ref}
      id={id}
      className={`anchor-offset relative ${className}`}
      aria-labelledby={hId}>
      
      <div className="atlas-grid">
        <div className="col-span-4 flex items-baseline justify-between gap-6 border-t border-ink pt-4 md:col-span-8 xl:col-span-12">
          <h2 id={hId} className="mono-label flex items-baseline gap-3 text-ink">
            <span className="text-graphite">{index}</span>
            <span>{title.toUpperCase()}</span>
          </h2>
          {annotation ?
          <span className="mono-label hidden shrink-0 text-right md:inline">{annotation}</span> :
          null}
        </div>
      </div>
      {children}
    </section>);

}