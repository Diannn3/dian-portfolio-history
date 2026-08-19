import React from 'react';
import { about, identity } from '../../data/site';
import { SectionFrame } from '../ui/SectionFrame';
import { DisciplineGraph } from './DisciplineGraph';

/**
 * An editorial spread: statement and prose on the left, a central annotation
 * axis, the discipline graph on the right. The reading column is capped so the
 * text stays a comfortable measure at 1920 instead of stretching thin.
 */
export function About() {
  return (
    <SectionFrame id="about" index="02" title="About" coordinate="PLATE 02 / POSITION">
      <div className="atlas-grid gap-y-12 pb-10">
        <div className="col-span-4 md:col-span-8 xl:col-span-6" data-reveal-group>
          <p className="max-w-[34ch] font-heading text-display-3 font-medium leading-tight text-ink">
            {about.statement}
          </p>
          <div className="mt-8 flex max-w-[60ch] flex-col gap-5">
            {about.paragraphs.map((p) =>
            <p key={p.slice(0, 24)} className="text-read text-graphite" data-fade>
                {p}
              </p>
            )}
          </div>
          <div data-trajectory-marker className="mt-10 border-t border-hairline pt-4">
            <p className="mono-label text-accent">TRAJECTORY / PRACTICE</p>
            <p className="mt-2 max-w-[48ch] text-read-sm text-graphite">
              Founder of Aescent Web Studio and a UPLB student here in Laguna.
            </p>
          </div>
        </div>

        {/* annotation axis: metadata reads as marginalia, not as a sidebar widget */}
        <div className="col-span-4 md:col-span-3 xl:col-span-2 xl:col-start-7">
          <div className="border-l border-hairline pl-4">
            <dl className="flex flex-col gap-4">
              {identity.meta.map((m) =>
              <div key={m.key}>
                  <dt className="mono-label">{m.key}</dt>
                  <dd className="mt-1 text-read-sm text-ink">{m.value}</dd>
                </div>
              )}
              <div>
                <dt className="mono-label">COORD</dt>
                <dd className="mt-1 text-read-sm text-ink">N 14.16° / E 121.24°</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="col-span-4 md:col-span-5 xl:col-span-4 xl:col-start-9">
          <p className="mono-label mb-3">FIG / DISCIPLINE GRAPH</p>
          <DisciplineGraph />
          <p className="mono-label mt-3">
            RELATIONSHIPS BETWEEN FIELDS — NOT SKILL LEVELS
          </p>
        </div>
      </div>
    </SectionFrame>);

}
