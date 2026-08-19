import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowUpRight } from 'lucide-react';
import { contactLinks } from '../../data/site';
import { subscribeTick } from '../../lib/motion/ticker';
import { usePointerFine, useReducedMotion } from '../../hooks/useEnvironment';

function MagneticAnchor({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const fine = usePointerFine();
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !fine || reduced) return;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const dx = (event.clientX - (rect.left + rect.width / 2)) / rect.width;
      const dy = (event.clientY - (rect.top + rect.height / 2)) / rect.height;
      xTo(dx * 16);
      yTo(dy * 10);
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      gsap.killTweensOf(el);
    };
  }, [fine, reduced]);

  return (
    <a
      ref={ref}
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      data-cursor="external"
      className="inline-flex h-14 items-center justify-center bg-ink px-7 font-mono text-label uppercase tracking-[0.14em] text-canvas transition-[background-color,color,transform] duration-500 ease-atlas hover:bg-accent hover:text-canvas focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      aria-label={`VIEW ${label} (opens in a new tab)`}
    >
      VIEW {label}
    </a>
  );
}

/**
 * Contact is the finale rather than another informational plate: the atlas grid
 * stretches back out into one long pointer-responsive streamline, then resolves
 * into a single verified channel. Text and links remain ordinary DOM content;
 * the field is decorative and disabled for coarse pointers / reduced motion.
 */
export function Contact() {
  const path = useRef<SVGPathElement>(null);
  const shell = useRef<HTMLDivElement>(null);
  const fine = usePointerFine();
  const reduced = useReducedMotion();
  const primary = contactLinks[0];

  useEffect(() => {
    const target = path.current;
    const el = shell.current;
    if (!target || !el) return;

    const state = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };

    const draw = () => {
      const damping = reduced || !fine ? 1 : 0.05;
      state.x += (state.tx - state.x) * damping;
      state.y += (state.ty - state.y) * damping;

      const bendX = 200 + state.x * 600;
      const bendY = 60 + state.y * 100;
      const d = `M0 150 C 220 ${150 - (bendY - 110) * 0.9}, ${bendX - 160} ${bendY}, ${bendX} ${bendY} S ${bendX + 260} ${200 - (bendY - 110) * 0.6}, 1200 120`;
      target.setAttribute('d', d);
    };

    draw();
    if (reduced || !fine) return;

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      state.tx = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
      state.ty = Math.min(Math.max((event.clientY - rect.top) / rect.height, 0), 1);
    };

    el.addEventListener('pointermove', onMove);
    const unsubscribe = subscribeTick(draw);
    return () => {
      el.removeEventListener('pointermove', onMove);
      unsubscribe();
    };
  }, [fine, reduced]);

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative mt-28 scroll-mt-24 md:mt-44"
    >
      <div ref={shell} className="relative overflow-hidden border-t border-ink pb-24 pt-14 md:pb-32 md:pt-20 xl:pb-36">
        <svg
          viewBox="0 0 1200 300"
          className="pointer-events-none absolute inset-x-0 top-8 h-[300px] w-full md:h-[340px] xl:h-[380px]"
          aria-hidden="true"
          preserveAspectRatio="none"
          data-contact-field
        >
          <g stroke="var(--hairline)" strokeWidth="1">
            {Array.from({ length: 13 }).map((_, index) => (
              <line key={index} x1={index * 100} y1="0" x2={index * 100} y2="300" />
            ))}
          </g>
          <path ref={path} fill="none" stroke="var(--accent)" strokeWidth="1.6" />
        </svg>

        <div className="atlas-grid relative" data-reveal-group>
          <div className="col-span-4 md:col-span-8 xl:col-span-12">
            <h2
              id="contact-heading"
              className="font-heading text-display-1 font-medium uppercase leading-[0.86] text-ink"
            >
              <span className="reveal-line" data-reveal>
                <span>Have a weird</span>
              </span>
              <span className="reveal-line" data-reveal>
                <span>problem?</span>
              </span>
              <span className="reveal-line" data-reveal>
                <span className="text-accent">Let&apos;s build something useful.</span>
              </span>
            </h2>
          </div>
        </div>

        {primary ? (
          <div className="atlas-grid relative mt-14 md:mt-20">
            <div className="col-span-4 md:col-span-4 xl:col-span-4">
              <MagneticAnchor href={primary.href} label={primary.label} />
              <p className="mt-4 font-mono text-micro uppercase tracking-[0.16em] text-graphite">
                PROJECTS / CODE / EXPERIMENTS
              </p>
            </div>
          </div>
        ) : null}

        <div className="atlas-grid relative mt-14 md:mt-20">
          <ul className="col-span-4 md:col-span-8 xl:col-span-8 xl:col-start-5">
            {contactLinks.map((link) => (
              <li key={link.label} className="border-t border-hairline">
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  data-cursor="external"
                  className="group flex items-baseline justify-between gap-6 py-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                >
                  <span className="font-mono text-label uppercase tracking-[0.16em] text-graphite">
                    {link.label}
                  </span>
                  <span className="flex items-baseline gap-3">
                    <span className="font-heading text-[1.1rem] tracking-tight transition-colors duration-500 ease-atlas group-hover:text-accent md:text-[1.3rem]">
                      {link.value}
                    </span>
                    <ArrowUpRight
                      className="h-4 w-4 shrink-0 text-graphite transition-transform duration-500 ease-atlas group-hover:-translate-y-[2px] group-hover:translate-x-[2px]"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                    <span className="sr-only"> (opens in a new tab)</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
