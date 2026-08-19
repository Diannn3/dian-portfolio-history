import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { lab } from '../../data/site';

export function Lab() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section id="lab" className="pt-28 md:pt-44" aria-labelledby="lab-heading">
      <div className="atlas-grid">
        <div className="col-span-4 flex items-baseline justify-between border-t border-ink pt-4 md:col-span-8 xl:col-span-12">
          <h2 id="lab-heading" className="mono-label text-ink">
            LAB / OPEN INDEX
          </h2>
          <span className="mono-label hidden md:inline">SMALLER QUESTIONS, FASTER ANSWERS</span>
        </div>
      </div>

      <ul className="atlas-grid mt-6 gap-y-0 md:mt-8">
        {lab.map((item) => {
          const on = active === item.id;
          const content = (
            <>
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-mono text-micro tracking-[0.16em] text-graphite">{item.id}</span>
                <span
                  className="font-mono text-micro uppercase tracking-[0.16em]"
                  style={{ color: on ? 'var(--accent)' : 'var(--graphite)' }}
                >
                  {item.status}
                </span>
              </div>
              <h3 className="mt-3 font-heading text-[1.35rem] font-medium leading-tight">
                {item.title}
              </h3>
              <p
                className="mt-2 max-w-[34ch] text-[0.86rem] leading-relaxed text-graphite transition-opacity duration-500 ease-atlas"
                style={{ opacity: on ? 1 : 0.62 }}
              >
                {item.note}
              </p>
              <div className="mt-4 flex items-center justify-between gap-4">
                <span className="mono-label block text-graphite">{item.tag}</span>
                {item.href ? (
                  <span className="inline-flex items-center gap-1 font-mono text-micro uppercase tracking-[0.14em] text-ink">
                    SOURCE <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                ) : null}
              </div>
            </>
          );

          return (
            <li
              key={item.id}
              className="col-span-4 border-b border-hairline md:col-span-4 xl:col-span-4"
              onMouseEnter={() => setActive(item.id)}
              onMouseLeave={() => setActive(null)}
            >
              {item.href ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  onFocus={() => setActive(item.id)}
                  onBlur={() => setActive(null)}
                  className="group block py-5 outline-offset-4"
                >
                  {content}
                </a>
              ) : (
                <div className="group block py-5">{content}</div>
              )}
            </li>
          );
        })}
      </ul>
      <div className="atlas-grid mt-5">
        <p className="col-span-4 font-mono text-micro uppercase tracking-[0.16em] text-graphite md:col-span-8 xl:col-span-12">
          LAB ENTRIES ARE LABELLED BY STATE — NOTHING HERE CLAIMS TO BE FINISHED.
        </p>
      </div>
    </section>
  );
}
