import React, { useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { contactLinks } from '../../data/site';
import { SectionFrame } from '../ui/SectionFrame';
import { usePointerFine, useReducedMotion } from '../../hooks/useEnvironment';

/**
 * CONTACT. Only verified methods appear here — GitHub is the one channel I can
 * point at honestly, so it is the only one listed. No email, availability or
 * client history is implied.
 */
export function Contact() {
  const shell = useRef<HTMLDivElement>(null);
  const vector = useRef<SVGLineElement>(null);
  const fine = usePointerFine();
  const reduced = useReducedMotion();

  /* DEPTH FOCUS: the rule under the headline draws itself once, in view */
  useGSAP(
    () => {
      const rule = shell.current?.querySelector('[data-contact-rule]');
      if (!rule) return;
      if (reduced) {
        gsap.set(rule, { scaleX: 1 });
        return;
      }
      gsap.fromTo(
        rule,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.1,
          ease: 'expo.inOut',
          transformOrigin: 'left center',
          scrollTrigger: { trigger: shell.current, start: 'top 82%' }
        }
      );
    },
    { dependencies: [reduced], scope: shell, revertOnUpdate: true }
  );

  /* a single directional readout: where the pointer sits relative to the plate */
  useEffect(() => {
    if (!fine || reduced) return;
    const el = shell.current;
    const target = vector.current;
    if (!el || !target) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      target.setAttribute('x2', String(6 + x * 88));
      target.setAttribute('y2', String(4 + y * 40));
    };
    el.addEventListener('pointermove', onMove);
    return () => el.removeEventListener('pointermove', onMove);
  }, [fine, reduced]);

  return (
    <SectionFrame id="contact" index="07" title="Contact" coordinate="PLATE 07 / CHANNEL">
      <div ref={shell} className="atlas-grid gap-y-10 pb-24">
        <div className="col-span-4 md:col-span-8 xl:col-span-7" data-reveal-group>
          <p className="mono-label mb-4">HAVE A WEIRD PROBLEM?</p>
          <h3 className="overflow-hidden font-heading text-display-1 font-medium uppercase leading-[0.9] text-ink">
            <span className="reveal-line" data-reveal>
              <span>Let&apos;s build</span>
            </span>
            <span className="reveal-line" data-reveal>
              <span>something useful.</span>
            </span>
          </h3>
          <span
            data-contact-rule
            className="mt-8 block h-[1px] w-full origin-left bg-hairline"
            aria-hidden="true" />

          <ul className="mt-8 flex flex-col gap-4">
            {contactLinks.map((c) =>
            <li key={c.label} className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
                <span className="mono-label w-20 shrink-0">{c.label}</span>
                <a
                href={c.href}
                target="_blank"
                rel="noreferrer noopener"
                className="link-underline text-read-lg text-ink"
                data-cursor="external">

                  {c.value} ↗<span className="sr-only"> (opens in a new tab)</span>
                </a>
                <span className="mono-label ml-auto">VERIFIED</span>
              </li>
            )}
          </ul>
          <p className="mt-6 max-w-[56ch] text-read-sm text-graphite">
            GitHub is the only channel listed because it is the only one this page can verify. No
            availability, rate or client history is implied.
          </p>
        </div>

        <div className="col-span-4 md:col-span-8 xl:col-span-4 xl:col-start-9">
          <p className="mono-label mb-3">FIG / BEARING</p>
          <div className="border border-hairline bg-surface/30 p-3">
            <svg viewBox="0 0 100 48" className="h-auto w-full" aria-hidden="true">
              <g stroke="var(--hairline)" strokeWidth="0.3">
                {Array.from({ length: 8 }).map((_, i) =>
                <line key={i} x1={6 + i * 12.5} y1="4" x2={6 + i * 12.5} y2="44" />
                )}
              </g>
              <line
                ref={vector}
                x1="6"
                y1="44"
                x2="50"
                y2="24"
                stroke="var(--accent)"
                strokeWidth="0.8" />

              <rect x="4.6" y="42.6" width="2.8" height="2.8" fill="var(--ink)" />
            </svg>
          </div>
          <p className="mono-label mt-3">POINTER BEARING — DECORATIVE READOUT</p>
        </div>
      </div>
    </SectionFrame>);

}