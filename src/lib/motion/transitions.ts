import { registerGsap, gsap, EASE, DUR } from './gsap';

/**
 * Route transitions are restrained on purpose. Navigation happens immediately —
 * the router is never delayed for spectacle. What follows is a single geometric
 * wipe over the incoming page plus one hairline that draws across it.
 *
 * Total budget: ~720ms. History, back/forward and scroll restoration are
 * untouched because nothing here awaits the navigation.
 */
export function playRouteEnter(
mask: HTMLElement | null,
rule: HTMLElement | null,
reduced: boolean)
{
  registerGsap();
  if (!mask) return;

  if (reduced) {
    gsap.set(mask, { autoAlpha: 0 });
    if (rule) gsap.set(rule, { scaleX: 0 });
    return;
  }

  gsap.killTweensOf([mask, rule].filter(Boolean) as HTMLElement[]);

  const tl = gsap.timeline();
  tl.set(mask, { autoAlpha: 1, clipPath: 'inset(0% 0% 0% 0%)' });
  if (rule) {
    tl.set(rule, { scaleX: 0, transformOrigin: 'left center', autoAlpha: 1 });
    tl.to(rule, { scaleX: 1, duration: 0.34, ease: EASE.draw }, 0);
  }
  tl.to(
    mask,
    {
      clipPath: 'inset(0% 0% 100% 0%)',
      duration: DUR.route,
      ease: EASE.draw
    },
    0.08
  );
  tl.set(mask, { autoAlpha: 0 });
  if (rule) tl.to(rule, { autoAlpha: 0, duration: 0.2 }, '-=0.1');
  return tl;
}

/**
 * The outbound half: the row the visitor clicked stretches its rule before the
 * route changes. Fire-and-forget — it must never gate navigation.
 */
export function playRowDepart(row: HTMLElement | null, reduced: boolean) {
  if (!row || reduced) return;
  registerGsap();
  const rule = row.querySelector<HTMLElement>('[data-row-rule]');
  if (!rule) return;
  gsap.fromTo(
    rule,
    { scaleX: 0, transformOrigin: 'left center' },
    { scaleX: 1, duration: 0.42, ease: EASE.draw, overwrite: true }
  );
}

/** Briefly expose the column grid during a large section change. */
export function flashColumns(el: HTMLElement | null, reduced: boolean) {
  if (!el || reduced) return;
  registerGsap();
  gsap.fromTo(
    el,
    { opacity: 0 },
    { opacity: 0.5, duration: 0.28, ease: EASE.shift, yoyo: true, repeat: 1 }
  );
}