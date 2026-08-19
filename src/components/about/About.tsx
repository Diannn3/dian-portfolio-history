import React from 'react';
import { about } from '../../data/site';
import { SectionFrame } from '../global/SectionFrame';
import { SplitWords } from '../motion/SplitReveal';
import { ParallaxLayer } from '../motion/ParallaxLayer';
import { DisciplineGraph } from './DisciplineGraph';

/**
 * An editorial spread rather than two columns with a hole in the middle.
 *
 *   LEFT    the statement, set large
 *   CENTRE  a spatial annotation column — coordinate ticks and vector segments
 *           that tie each numbered annotation to its paragraph
 *   RIGHT   the body copy, numbered to match
 *
 * The centre column is the connective tissue: it is what makes the two text
 * blocks read as one system instead of two unrelated boxes.
 */
export function About() {
  return (
    <SectionFrame
      id="about"
      index="02"
      title="About"
      nav="#about"
      annotation="001 / STATEMENT + FIELD"
      className="pt-28 md:pt-44">
      
      <div className="atlas-grid mt-10 items-start md:mt-16">
        {/* LEFT — statement */}
        <div className="col-span-4 md:col-span-8 xl:col-span-5">
          <SplitWords
            text={about.statement}
            className="font-heading text-display-2 font-medium leading-[1.02] tracking-tight" />
          
        </div>

        {/* CENTRE — spatial annotation */}
        <ParallaxLayer
          distance={26}
          className="col-span-4 mt-10 md:col-span-3 xl:col-span-2 xl:col-start-7 xl:mt-1">
          
          <div aria-hidden="true" className="relative">
            <span className="block h-[1px] w-full bg-hairline" data-draw />
            <ul className="mt-4 space-y-8 md:space-y-14">
              {about.annotations.map((note, i) =>
              <li key={note.id} className="relative flex items-start gap-3">
                  <span className="mt-[0.3rem] block h-[1px] w-4 shrink-0 bg-accent" />
                  <span className="min-w-0">
                    <span className="block font-mono text-micro tracking-[0.18em] text-ink">
                      {note.id}
                    </span>
                    <span className="mt-1 block font-mono text-[0.6rem] uppercase leading-[1.5] tracking-[0.16em] text-graphite">
                      {note.label}
                    </span>
                  </span>
                  {i < about.annotations.length - 1 ?
                <span className="absolute left-[0.05rem] top-6 block h-[calc(100%+1.6rem)] w-[1px] bg-hairline" /> :
                null}
                </li>
              )}
            </ul>
          </div>
        </ParallaxLayer>

        {/* RIGHT — body */}
        <div className="col-span-4 mt-8 space-y-6 md:col-span-5 xl:col-span-4 xl:col-start-9 xl:mt-1">
          {about.paragraphs.map((p, i) =>
          <p key={p} className="flex gap-4 text-body text-graphite" data-fade>
              <span
              aria-hidden="true"
              className="mt-[0.45rem] shrink-0 font-mono text-[0.6rem] tracking-[0.18em] text-accent">
              
                {about.annotations[i]?.id}
              </span>
              <span>{p}</span>
            </p>
          )}
        </div>
      </div>

      <div className="atlas-grid mt-16 items-start md:mt-24">
        <div className="col-span-4 md:col-span-5 xl:col-span-6 xl:col-start-2">
          <DisciplineGraph />
        </div>
        <div className="col-span-4 mt-10 md:col-span-3 xl:col-span-3 xl:col-start-9 xl:mt-0">
          <span className="mono-label block border-t border-hairline pt-3">
            FIG. 01 / DISCIPLINE GRAPH
          </span>
          <p className="mt-4 text-note text-graphite">
            Nothing here is a separate skill list. The edges are the point: most of what I build is
            one field borrowing a method from another.
          </p>
        </div>
      </div>
    </SectionFrame>);

}