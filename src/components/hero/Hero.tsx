import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { identity } from '../../data/site';
import { sceneState } from '../../lib/webgl/sceneState';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { registerGsap } from '../../lib/motion/reveal';
import { subscribeTick } from '../../lib/motion/ticker';
import { usePointerFine, useQuality, useReducedMotion } from '../../hooks/useEnvironment';
import { HeroFallback } from './HeroFallback';
import { PointerProbe } from './PointerProbe';

const HeroCanvas = lazy(() => import('./HeroCanvas').then((m) => ({ default: m.HeroCanvas })));

export function Hero() {
  const shell = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [inView, setInView] = useState(true);
  const reduced = useReducedMotion();
  const fine = usePointerFine();
  const { supported, profile } = useQuality();
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    setCompact(mq.matches);
    const onChange = () => setCompact(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  /* island-style hydration: mount the canvas when visible and the tab is idle */
  useEffect(() => {
    if (!supported || !shell.current) return;
    const el = shell.current;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          const idle =
          (window as unknown as {requestIdleCallback?: (cb: () => void) => number;}).
          requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
          idle(() => setMounted(true));
          io.disconnect();
        }
      },
      { rootMargin: '120px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [supported]);

  /* pause the renderer entirely once the hero is off screen */
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => setInView(entries[0]?.isIntersecting ?? true), {
      threshold: 0.01
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* scroll choreography: hero progress drives the whole scene transformation */
  useEffect(() => {
    const gsap = registerGsap();
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: shell.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          sceneState.progress = self.progress;
        }
      });
      if (!reduced && stage.current) {
        gsap.to(stage.current.querySelectorAll('[data-hero-type]'), {
          yPercent: -18,
          opacity: 0,
          ease: 'none',
          stagger: 0.04,
          scrollTrigger: {
            trigger: shell.current,
            start: 'top top',
            end: '58% top',
            scrub: true
          }
        });
        gsap.to(stage.current.querySelectorAll('[data-hero-meta]'), {
          opacity: 0,
          ease: 'none',
          scrollTrigger: { trigger: shell.current, start: '12% top', end: '45% top', scrub: true }
        });
      }
      const lines = stage.current?.querySelectorAll<HTMLElement>('[data-reveal] > *');
      if (lines?.length) {
        if (reduced) gsap.set(lines, { yPercent: 0 });else
        gsap.from(lines, { yPercent: 112, duration: 1.25, ease: 'expo.out', stagger: 0.085, delay: 0.08 });
      }
    }, shell);
    return () => ctx.revert();
  }, [reduced]);

  /* pointer: smoothed inertia on the shared ticker, desktop only */
  useEffect(() => {
    if (!fine || reduced) return;
    const el = stage.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      sceneState.targetX = (e.clientX - r.left) / r.width * 2 - 1;
      sceneState.targetY = (e.clientY - r.top) / r.height * 2 - 1;
      sceneState.probing = true;
    };
    const onLeave = () => {
      sceneState.probing = false;
      sceneState.targetX = 0;
      sceneState.targetY = 0;
    };
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    const unsub = subscribeTick(() => {
      sceneState.pointerX += (sceneState.targetX - sceneState.pointerX) * 0.07;
      sceneState.pointerY += (sceneState.targetY - sceneState.pointerY) * 0.07;
    });
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      unsub();
      sceneState.probing = false;
    };
  }, [fine, reduced]);

  return (
    <div ref={shell} className="relative h-[240vh]" data-cursor="probe" data-hero>
      <div ref={stage} className="sticky top-0 h-[100svh] w-full overflow-hidden">
        <div className="absolute inset-0" aria-hidden="true">
          {supported && mounted ?
          <Suspense fallback={<HeroFallback />}>
              <HeroCanvas profile={profile} reduced={reduced} compact={compact} active={inView} />
            </Suspense> :

          <div className="h-full w-full opacity-70">
              <HeroFallback />
            </div>
          }
        </div>

        <div className="atlas-grid pointer-events-none relative h-full items-end pb-10 pt-[6.5rem] md:pb-14">
          <header
            className="col-span-4 flex h-full flex-col justify-between md:col-span-8 xl:col-span-12"
            data-reveal-group>
            
            <div className="flex items-start justify-between gap-6">
              <div>
                <div className="mono-label mb-3 flex items-center gap-3" data-hero-meta>
                  <span className="h-[1px] w-8 bg-hairline" />
                  VECTOR ATLAS / 2026
                </div>
                <h1
                  className="font-heading text-display-1 font-medium uppercase text-ink md:max-w-[13ch]"
                  data-hero-type>
                  
                  {identity.headline.map((line) =>
                  <span className="reveal-line" data-reveal key={line}>
                      <span>{line}</span>
                    </span>
                  )}
                </h1>
              </div>
              <dl className="hidden shrink-0 flex-col gap-1 text-right md:flex" data-hero-meta>
                {identity.meta.map((m) =>
                <div key={m.key} className="mono-label flex items-baseline justify-end gap-2">
                    <dt className="text-graphite">{m.key} /</dt>
                    <dd className="text-graphite">{m.value}</dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="flex items-end justify-between gap-8">
              <div className="relative" data-hero-type>
                <span
                  className="block font-heading text-display-xl font-medium leading-[0.8] text-ink"
                  aria-hidden="true">
                  
                  {identity.name}
                </span>
                <span className="mono-label absolute -top-1 left-[calc(100%+0.6rem)] hidden md:block">
                  N 14.16° / E 121.24°
                </span>
              </div>
              <div className="hidden max-w-[34ch] shrink-0 md:block" data-hero-meta>
                <p className="text-[0.95rem] leading-relaxed text-graphite">{identity.support}</p>
                <div className="mt-5 border-t border-hairline pt-3">
                  <PointerProbe />
                </div>
              </div>
            </div>

            <p className="mt-6 max-w-[38ch] text-[0.95rem] leading-relaxed text-graphite md:hidden">
              {identity.support}
            </p>
          </header>
        </div>

        <div className="pointer-events-none absolute bottom-0 left-0 right-0">
          <div className="atlas-grid">
            <div className="col-span-4 flex items-center justify-between border-t border-hairline py-3 md:col-span-8 xl:col-span-12">
              <span className="mono-label">SCROLL / FIELD → DIAGRAM</span>
              <span className="mono-label hidden md:inline">
                {supported ? `RENDER / WEBGL · ${profile.tier.toUpperCase()}` : 'RENDER / SVG FALLBACK'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>);

}