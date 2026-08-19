import React, { useEffect, useRef } from 'react';
import { gsap, registerGsap, ScrollTrigger } from '../../lib/motion/gsap';
import { useMotion } from '../../lib/motion/MotionProvider';

interface Props {
  /** travel in pixels across the whole trigger, scaled by the motion profile */
  distance?: number;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Controlled parallax. One ScrollTrigger per layer, scoped and reverted, travel
 * scaled by the active motion profile and switched off entirely for reduced
 * motion and mobile. Transform only — never a layout property.
 */
export function ParallaxLayer({ distance = 48, className, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { profile, reduced } = useMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || !profile.scrub) {
      if (el) gsap.set(el, { clearProps: 'transform' });
      return;
    }
    registerGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: distance * profile.travel },
        {
          y: -distance * profile.travel,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        }
      );
    }, el);
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 200);
    return () => {
      window.clearTimeout(id);
      ctx.revert();
    };
  }, [distance, profile, reduced]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>);

}