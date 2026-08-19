import React from 'react';
import { about } from '../../data/site';
import { DisciplineGraph } from './DisciplineGraph';

export function About() {
  return (
    <section id="about" className="pt-28 md:pt-44" aria-labelledby="about-heading">
      <div className="atlas-grid">
        <div className="col-span-4 border-t border-ink pt-4 md:col-span-8 xl:col-span-12">
          <h2 id="about-heading" className="mono-label text-ink">
            ABOUT / 001
          </h2>
        </div>
      </div>

      <div className="atlas-grid mt-10 md:mt-16">
        <div className="col-span-4 md:col-span-8 xl:col-span-7 xl:col-start-1" data-reveal-group>
          <p className="font-heading text-display-2 font-medium leading-[1.02] tracking-tight">
            {about.statement.split(' ').map((w, i) =>
            <span className="reveal-line inline-block" data-reveal key={`${w}-${i}`}>
                <span className="pr-[0.28em]">{w}</span>
              </span>
            )}
          </p>
        </div>

        <div className="col-span-4 mt-10 space-y-5 md:col-span-5 xl:col-span-4 xl:col-start-9 xl:mt-2">
          {about.paragraphs.map((p) =>
          <p key={p} className="text-[0.98rem] leading-[1.62] text-graphite" data-fade>
              {p}
            </p>
          )}
        </div>
      </div>

      <div className="atlas-grid mt-16 md:mt-24">
        <div className="col-span-4 md:col-span-5 xl:col-span-6 xl:col-start-2">
          <DisciplineGraph />
        </div>
        <div className="col-span-4 mt-10 md:col-span-3 xl:col-span-3 xl:col-start-9 xl:mt-0">
          <span className="mono-label block border-t border-hairline pt-3">FIG. 01 / DISCIPLINE GRAPH</span>
          <p className="mt-4 text-[0.9rem] leading-relaxed text-graphite">
            Nothing here is a separate skill list. The edges are the point: most of what I build is one
            field borrowing a method from another.
          </p>
        </div>
      </div>
    </section>);

}