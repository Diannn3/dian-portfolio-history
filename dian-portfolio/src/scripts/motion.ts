import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initMotion() {
  const ctx = gsap.context(() => {
    // Typography reveals for sections
    document.querySelectorAll('[data-reveal]').forEach((el) => {
      gsap.fromTo(el, 
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    // Line draw
    document.querySelectorAll('[data-line-draw]').forEach((el) => {
      gsap.fromTo(el,
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: 'top',
          duration: 0.6,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });
  });

  // Cleanup on page unload (Astro client router)
  document.addEventListener('astro:before-swap', () => {
    ctx.revert();
  });
  document.addEventListener('astro:page-load', () => {
    // Re-initialize for the new page if needed
  });
}
