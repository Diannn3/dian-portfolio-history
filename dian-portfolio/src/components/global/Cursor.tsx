import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: fine)').matches === false) return;

    const cursor = cursorRef.current!;
    const textEl = textRef.current!;
    let rafId: number;
    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;
    const speed = 0.18;

    const move = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.opacity = '1';
    };

    const handleHoverTargets = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a, button, [data-cursor]');
      if (target) {
        const cursorType = target.getAttribute('data-cursor') || 'view';
        textEl.textContent = cursorType.toUpperCase();
        gsap.to(cursor, { scale: 1.5, duration: 0.2 });
      } else {
        textEl.textContent = '';
        gsap.to(cursor, { scale: 1, duration: 0.2 });
      }
    };

    const loop = () => {
      currentX += (mouseX - currentX) * speed;
      currentY += (mouseY - currentY) * speed;
      cursor.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;
      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', handleHoverTargets);
    loop();

    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', handleHoverTargets);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed left-0 top-0 z-[9999] mix-blend-difference text-white opacity-0"
      aria-hidden="true"
    >
      <span ref={textRef} className="text-xs font-mono"></span>
    </div>
  );
}
