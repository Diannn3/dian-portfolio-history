import React, { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { contactLinks } from '../../data/site';
import { subscribeTick } from '../../lib/motion/ticker';
import { gsap, registerGsap } from '../../lib/motion/gsap';
import { useMotion } from '../../lib/motion/MotionProvider';
import { useSectionRegistration } from '../../hooks/useReveals';
import { MagneticLink } from '../motion/Magnetic';

/**
 * The atlas returns, flattened: one long streamline crossing the footer, its
 * control points bending toward the pointer with heavy damping, terminating at
 * the contact links rather than trailing off.
 *
 * Only verified contact methods appear here. GitHub is the one that exists, so
 * it is the only one shown — no email, phone, LinkedIn, availability or client
 * list is invented, and there is no href="#".
 */
export function Contact() {
  const section = useRef<HTMLElement>(null);
  const shell = useRef<HTMLDivElement>(null);
  const path = useRef<SVGPathElement>(null);
  const weird = useRef<HTMLSpanElement>(null);
  const { fine, reduced } = useMotion();

  useSectionRegistration(section, {
    id: 'contact',
    index: '07',
    label: 'CONTACT',
    nav: '#contact'
  });

  useEffect(() => {
    const state = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    const draw = () => {
      state.x += (state.tx - state.x) * (reduced ? 1 : 0.05);
      state.y += (state.ty - state.y) * (reduced ? 1 : 0.05);
      const bx = 200 + state.x * 600;
      const by = 60 + state.y * 100;
      const d = `M0 150 C 220 ${150 - (by - 110) * 0.9}, ${bx - 160} ${by}, ${bx} ${by} S ${
      bx + 260} ${
      200 - (by - 110) * 0.6}, 1200 120`;
      path.current?.setAttribute('d', d);
    };
    draw();
    if (reduced || !fine) return;

    const el = shell.current;
    const onMove = (e: PointerEvent) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      state.tx = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      state.ty = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
    };
    window.addEventListener('pointermove', onMove);
    const unsub = subscribeTick(draw);
    return () => {
      window.removeEventListener('pointermove', onMove);
      unsub();
    };
  }, [fine, reduced]);

  /* "WEIRD PROBLEM?" leans in the direction the pointer is travelling. */
  useEffect(() => {
    const el = weird.current;
    if (!el || !fine || reduced) return;
    registerGsap();
    const xTo = gsap.quickTo(el, 'x', { duration: 0.9, ease: 'power3.out' });
    let last = 0;
    const onMove = (e: PointerEvent) => {
      const dx = e.clientX - last;
      last = e.clientX;
      xTo(Math.max(-10, Math.min(10, dx * 0.8)));
    };
    window.addEventListener('pointermove', onMove);
    return () => {
      window.removeEventListener('pointermove', onMove);
      gsap.killTweensOf(el);
    };
  }, [fine, reduced]);

  return (
    <section
      ref={section}
      id="contact"
      className="anchor-offset relative mt-28 md:mt-44"
      aria-labelledby="contact-heading">
      
      <div ref={shell} className="relative overflow-hidden border-t border-ink pt-14 md:pt-20">
        <svg
          viewBox="0 0 1200 300"
          className="pointer-events-none absolute inset-x-0 top-8 h-[300px] w-full"
          aria-hidden="true"
          preserveAspectRatio="none">
          
          <g stroke="var(--hairline)" strokeWidth="1">
            {Array.from({ length: 13 }).map((_, i) =>
            <line key={i} x1={i * 100} y1="0" x2={i * 100} y2="300" />
            )}
          </g>
          <path ref={path} fill="none" stroke="var(--accent)" strokeWidth="1.6" />
        </svg>

        <div className="atlas-grid relative">
          <div className="col-span-4 md:col-span-8 xl:col-span-12">
            <h2
              id="contact-heading"
              className="font-heading text-display-1 font-medium uppercase leading-[0.86]"
              data-reveal-group>
              
              <span className="reveal-line" data-reveal>
                <span>Have a</span>
              </span>
              <span className="reveal-line" data-reveal>
                <span ref={weird} className="inline-block">weird problem?</span>
              </span>
              <span className="reveal-line" data-reveal>
                <span className="text-accent">Let’s build something useful.</span>
              </span>
            </h2>
          </div>
        </div>

        <div className="atlas-grid relative mt-14 items-end md:mt-20">
          <div className="col-span-4 md:col-span-4 xl:col-span-4">
            <MagneticLink
              href="https://github.com/Diannn3"
              target="_blank"
              rel="noreferrer"
              data-cursor="external"
              aria-label="View Dian on GitHub">
              
              VIEW GITHUB
            </MagneticLink>
            <p className="mt-4 font-mono text-micro uppercase tracking-[0.16em] text-graphite">
              PROJECTS / CODE / EXPERIMENTS
            </p>
          </div>

          <ul className="col-span-4 mt-12 md:col-span-4 md:mt-0 xl:col-span-7 xl:col-start-6">
            {contactLinks.map((link) =>
            <li key={link.label} className="border-t border-hairline">
                <a
                href={link.href}
                target="_blank"
                rel="noreferrer"
                data-cursor="external"
                className="group flex items-baseline justify-between gap-6 py-5">
                
                  <span className="font-mono text-label uppercase tracking-[0.14em] text-graphite">
                    {link.label}
                  </span>
                  <span className="flex items-baseline gap-3">
                    <span className="font-heading text-[1.1rem] tracking-tight transition-colors duration-500 ease-atlas group-hover:text-accent md:text-[1.3rem]">
                      {link.value}
                    </span>
                    <ArrowUpRight
                    className="h-4 w-4 shrink-0 text-graphite transition-transform duration-500 ease-atlas group-hover:-translate-y-[2px] group-hover:translate-x-[2px]"
                    strokeWidth={1.5}
                    aria-hidden="true" />
                  
                  </span>
                </a>
              </li>
            )}
            <li className="border-t border-hairline pt-4">
              <p className="text-note text-graphite">
                This is the only contact channel published here. Anything else would be invented.
              </p>
            </li>
          </ul>
        </div>
      </div>
    </section>);

}