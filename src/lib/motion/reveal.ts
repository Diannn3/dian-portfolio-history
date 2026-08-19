import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let registered = false;
export function registerGsap() {
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
  return gsap;
}

/**
 * The site's motion vocabulary. Three verbs only — masked line reveal for
 * typography, draw for rules, and a short clipped rise for media. Everything
 * else stays still on purpose.
 */
export function buildReveals(root: HTMLElement, reduced: boolean) {
  registerGsap();

  if (reduced) {
    root.querySelectorAll<HTMLElement>('[data-reveal] > *').forEach((el) => {
      gsap.set(el, { yPercent: 0, opacity: 1 });
    });
    root.querySelectorAll<HTMLElement>('[data-draw]').forEach((el) => gsap.set(el, { scaleX: 1 }));
    root.querySelectorAll<HTMLElement>('[data-clip]').forEach((el) =>
    gsap.set(el, { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 })
    );
    return;
  }

  /* the hero owns its own timeline; never double-animate it */
  const outsideHero = (el: HTMLElement) => !el.closest('[data-hero]');

  Array.from(root.querySelectorAll<HTMLElement>('[data-reveal-group]')).filter(outsideHero).forEach((group) => {
    const lines = group.querySelectorAll<HTMLElement>('[data-reveal] > *');
    if (!lines.length) return;
    gsap.set(lines, { yPercent: 108 });
    gsap.to(lines, {
      yPercent: 0,
      duration: 1.05,
      ease: 'expo.out',
      stagger: 0.075,
      scrollTrigger: { trigger: group, start: 'top 88%' }
    });
  });

  root.querySelectorAll<HTMLElement>('[data-draw]').forEach((el) => {
    gsap.set(el, { scaleX: 0, transformOrigin: 'left center' });
    gsap.to(el, {
      scaleX: 1,
      duration: 1.2,
      ease: 'expo.inOut',
      scrollTrigger: { trigger: el, start: 'top 94%' }
    });
  });

  root.querySelectorAll<HTMLElement>('[data-clip]').forEach((el) => {
    gsap.set(el, { clipPath: 'inset(0% 0% 100% 0%)', opacity: 0.4 });
    gsap.to(el, {
      clipPath: 'inset(0% 0% 0% 0%)',
      opacity: 1,
      duration: 1.15,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 86%' }
    });
  });

  root.querySelectorAll<HTMLElement>('[data-fade]').forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 14 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 92%' }
      }
    );
  });
}