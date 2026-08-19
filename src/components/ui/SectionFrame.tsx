import React from 'react';

interface Props {
  id: string;
  index: string;
  title: string;
  lede?: string;
  coordinate?: string;
  children: React.ReactNode;
}

/**
 * Every section carries the same atlas notation: an index, a plate title, a
 * coordinate annotation and one hairline. Consistency is what makes the site
 * read as one document rather than a stack of blocks.
 */
export function SectionFrame({ id, index, title, lede, coordinate, children }: Props) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24">
      <div className="atlas-grid pb-8 pt-20 md:pt-28">
        <div className="col-span-4 md:col-span-8 xl:col-span-12" data-reveal-group>
          <span data-draw className="mb-6 block h-[1px] w-full bg-hairline" />
          <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
            <div className="flex items-baseline gap-4">
              <span className="mono-label text-accent">{index}</span>
              <h2
                id={`${id}-title`}
                className="overflow-hidden font-heading text-display-2 font-medium uppercase text-ink">

                <span data-reveal className="reveal-line">
                  <span>{title}</span>
                </span>
              </h2>
            </div>
            {coordinate && <span className="mono-label">{coordinate}</span>}
          </div>
          {lede &&
          <p className="mt-6 max-w-[62ch] text-read text-graphite" data-fade>
              {lede}
            </p>
          }
        </div>
      </div>
      {children}
    </section>);

}