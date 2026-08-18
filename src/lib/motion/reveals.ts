import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

/**
 * Motion vocabulary — NOT "everything fades up".
 *  - [data-reveal="lines"]  : masked line reveal for headings (per child)
 *  - [data-reveal="rise"]   : small upward settle for blocks
 *  - [data-reveal="draw"]   : SVG path / hairline draw-in via scaleX
 *  - [data-reveal="clip"]   : media clip-path wipe
 *
 * Returns a gsap.context() so callers scope + revert cleanly across Astro
 * navigations. Reduced motion resolves everything to its final state.
 */
export function initReveals(root: HTMLElement | Document = document) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

  const ctx = gsap.context(() => {
    if (reduced) {
      gsap.set("[data-reveal]", { opacity: 1, clearProps: "all" })
      return
    }

    const heroLines = gsap.utils.toArray<HTMLElement>("[data-hero-line]")
    if (heroLines.length) {
      gsap.from(heroLines, {
        yPercent: 108,
        duration: 1.08,
        ease: "power4.out",
        stagger: 0.065,
        delay: 0.08,
      })
    }

    gsap.utils.toArray<HTMLElement>('[data-reveal="lines"]').forEach((el) => {
      const lines = el.querySelectorAll<HTMLElement>(".reveal-line > *")
      const targets = lines.length ? lines : [el]
      gsap.set(el, { opacity: 1 })
      gsap.from(targets, {
        yPercent: 108,
        duration: 1,
        ease: "power4.out",
        stagger: 0.08,
        scrollTrigger: { trigger: el, start: "top 85%" },
      })
    })

    gsap.utils.toArray<HTMLElement>('[data-reveal="rise"]').forEach((el) => {
      gsap.set(el, { opacity: 1 })
      gsap.from(el, {
        y: 26,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%" },
      })
    })

    gsap.utils.toArray<HTMLElement>('[data-reveal="draw"]').forEach((el) => {
      gsap.set(el, { opacity: 1, transformOrigin: el.dataset.origin || "left center" })
      gsap.from(el, {
        scaleX: 0,
        duration: 1.1,
        ease: "power4.inOut",
        scrollTrigger: { trigger: el, start: "top 90%" },
      })
    })

    gsap.utils.toArray<HTMLElement>('[data-reveal="clip"]').forEach((el) => {
      gsap.set(el, { opacity: 1 })
      gsap.from(el, {
        clipPath: "inset(0 0 100% 0)",
        duration: 1.15,
        ease: "power4.out",
        scrollTrigger: { trigger: el, start: "top 85%" },
      })
    })
  }, root as Element)

  return ctx
}
