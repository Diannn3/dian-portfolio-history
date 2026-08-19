import React, { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useReducedMotion } from '../../hooks/useEnvironment';

/**
 * ROUTE — a single hairline sheet wipes across the canvas on navigation.
 * Under reduced motion the mask never appears at all.
 */
export function RouteMask() {
  const shell = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !shell.current) return;
      gsap.fromTo(
        shell.current,
        { scaleY: 1, transformOrigin: 'top center' },
        { scaleY: 0, transformOrigin: 'bottom center', duration: 0.62, ease: 'expo.inOut' }
      );
    },
    { dependencies: [location.pathname, reduced], scope: shell, revertOnUpdate: true }
  );

  if (reduced) return null;

  return (
    <div
      ref={shell}
      data-route-mask
      aria-hidden="true"
      style={{ transform: 'scaleY(0)' }}
      className="pointer-events-none fixed inset-0 z-[70] origin-top bg-canvas">

      <div className="atlas-grid h-full items-center">
        <div className="col-span-4 border-t border-hairline md:col-span-8 xl:col-span-12" />
      </div>
    </div>);

}