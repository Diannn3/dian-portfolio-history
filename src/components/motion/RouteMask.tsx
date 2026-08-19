import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { playRouteEnter } from '../../lib/motion/transitions';
import { useMotion } from '../../lib/motion/MotionProvider';

/**
 * The inbound half of a route transition. Navigation is never awaited — the
 * router changes immediately and this panel wipes off the new page, so back and
 * forward navigation, deep links and scroll restoration all behave natively.
 */
export function RouteMask() {
  const mask = useRef<HTMLDivElement>(null);
  const rule = useRef<HTMLSpanElement>(null);
  const { reduced } = useMotion();
  const { pathname } = useLocation();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const tl = playRouteEnter(mask.current, rule.current, reduced);
    return () => {
      tl?.kill();
    };
  }, [pathname, reduced]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[85]" aria-hidden="true">
      <div
        ref={mask}
        className="absolute inset-0 bg-canvas opacity-0"
        style={{ clipPath: 'inset(0% 0% 100% 0%)' }} />
      
      <span
        ref={rule}
        className="absolute left-0 top-1/2 block h-[1px] w-full origin-left scale-x-0 bg-accent opacity-0" />
      
    </div>);

}