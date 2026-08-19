import { registerGsap, gsap, EASE, DUR } from './gsap';

export { registerGsap };

/**
 * The site's motion vocabulary, applied declaratively via data attributes.
 * Seven verbs, no more (see docs/DESIGN.md):
 *
 *   data-reveal-group / data-reveal  CLIP REVEAL — masked line reveal
 *   data-draw                        VECTOR DRAW — a line grows along an axis
 *   data-clip                        CLIP REVEAL — content through a straight mask
 *   data-fade                        INDEX SHIFT — one baseline of travel
 *   data-settle                      FIELD SETTLE — damped arrival at coordinate
 *
 * DEPTH FOCUS, ROUTE and DECOMPOSE are inherently spatial and live in their
 * own components rather than as global scroll triggers.
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
    root.querySelectorAll<HTMLElement>('[data-fade]').forEach((el) =>
    gsap.set(el, { opacity: 1, y: 0 })
    );
    root.querySelectorAll<HTMLElement>('[data-settle]').forEach((el) =>
    gsap.set(el, { opacity: 1, y: 0, x: 0 })
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
      duration: DUR.reveal,
      ease: EASE.settle,
      stagger: 0.075,
      scrollTrigger: { trigger: group, start: 'top 88%' }
    });
  });

  root.querySelectorAll<HTMLElement>('[data-draw]').forEach((el) => {
    gsap.set(el, { scaleX: 0, transformOrigin: 'left center' });
    gsap.to(el, {
      scaleX: 1,
      duration: DUR.draw,
      ease: EASE.draw,
      scrollTrigger: { trigger: el, start: 'top 94%' }
    });
  });

  root.querySelectorAll<HTMLElement>('[data-clip]').forEach((el) => {
    gsap.set(el, { clipPath: 'inset(0% 0% 100% 0%)', opacity: 0.4 });
    gsap.to(el, {
      clipPath: 'inset(0% 0% 0% 0%)',
      opacity: 1,
      duration: 1.15,
      ease: EASE.settle,
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
        ease: EASE.shift,
        scrollTrigger: { trigger: el, start: 'top 92%' }
      }
    );
  });

  /* FIELD SETTLE: a block arrives at its coordinate with damped overshoot-free
     motion. Used for spatial stages and diagram frames, in small doses. */
  root.querySelectorAll<HTMLElement>('[data-settle]').forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 34, x: -10 },
      {
        opacity: 1,
        y: 0,
        x: 0,
        duration: 1.1,
        ease: EASE.settle,
        scrollTrigger: { trigger: el, start: 'top 90%' }
      }
    );
  });
}