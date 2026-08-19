import React, { useEffect, useRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { gsap, registerGsap } from '../../lib/motion/gsap';
import { useMotion } from '../../lib/motion/MotionProvider';
import { button } from '../ui/Button';

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  intent?: 'solid' | 'outline';
}

/**
 * INDEX SHIFT, applied to a pointer. The pull is deliberately small — a couple
 * of grid units at most — so the element still feels like it belongs to the
 * layout rather than escaping it. Disabled entirely without a fine pointer.
 */
export function MagneticLink({ className, intent = 'solid', children, ...props }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const { fine, reduced } = useMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !fine || reduced) return;
    registerGsap();
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