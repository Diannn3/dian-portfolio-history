import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { buildReveals, registerGsap } from '../../lib/motion/reveal';
import { initSmoothScroll } from '../../lib/motion/smoothScroll';
import { railState } from '../../lib/atlas/railState';
import { useReducedMotion } from '../../hooks/useEnvironment';

/**
 * Owns the single scroll architecture for the whole site:
 * one Lenis instance, one GSAP ticker, one ScrollTrigger registry.
 * Reveals are rebuilt per route inside a gsap.context so every trigger created
 * for a page is reverted when that page unmounts.
 */
export function MotionProvider({ children }: {children: React.ReactNode;}) {
  const location = useLocation();
  const reduced = useReducedMotion();

  useEffect(() => {
    registerGsap();
    return initSmoothScroll();
  }, [reduced]);

  /* document progress readout for the header — written outside React */
  useEffect(() => {
    const gsap = registerGsap();
    railState.progress = 0;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          railState.progress = self.progress;
        }
      });
    });
    return () => ctx.revert();
  }, [location.pathname]);

  /* per-route reveals; RouteLifecycle is the single owner of route/hash scrolling */
  useEffect(() => {
    const gsap = registerGsap();

    const ctx = gsap.context(() => {
      buildReveals(document.body, reduced);
    });

    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(raf);
      ctx.revert();
    };
  }, [location.pathname, reduced]);

  return <>{children}</>;
}