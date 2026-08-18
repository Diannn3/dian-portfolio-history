import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { twMerge } from 'tailwind-merge';
import { button } from './Button';
import { usePointerFine, useReducedMotion } from '../../hooks/useEnvironment';

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  intent?: 'solid' | 'outline';
}

/**
 * Used for exactly one thing: the primary contact CTA. The pull is small — 8px
 * at the edge — and disabled for touch and reduced motion.
 */
export function MagneticLink({ className, intent = 'solid', children, ...props }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const fine = usePointerFine();
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !fine || reduced) return;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) / r.width * 16);
      yTo((e.clientY - (r.top + r.height / 2)) / r.height * 10);
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
    <a ref={ref} className={twMerge(button({ intent, size: 'lg' }), className)} {...props}>
      {children}
    </a>);

}