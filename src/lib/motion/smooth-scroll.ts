import Lenis from "lenis"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

let lenis: Lenis | null = null

/**
 * One timing source. Lenis drives GSAP's ticker; ScrollTrigger updates on
 * Lenis scroll. Disabled entirely for reduced motion / touch so we fall back
 * to native scrolling. Returns a teardown for Astro's view-transition
 * lifecycle so we never stack competing rAF loops across navigations.
 */
export function initSmoothScroll(): () => void {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  const coarse = window.matchMedia("(pointer: coarse)").matches

  if (reduced || coarse) {
    // native scroll; still refresh triggers on load
    ScrollTrigger.refresh()
    return () => {}
  }

  lenis = new Lenis({
    duration: 1.05,
    easing: (x) => Math.min(1, 1.001 - Math.pow(2, -10 * x)),
    smoothWheel: true,
  })

  document.documentElement.classList.add("lenis")

  lenis.on("scroll", ScrollTrigger.update)

  const tick = (time: number) => {
    lenis?.raf(time * 1000)
  }
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)

  // intra-page anchor links routed through Lenis
  const onClick = (e: Event) => {
    const a = (e.target as HTMLElement)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null
    if (!a) return
    const id = a.getAttribute("href")
    if (!id || id === "#") return
    const el = document.querySelector(id)
    if (!el) return
    e.preventDefault()
    lenis?.scrollTo(el as HTMLElement, { offset: -40 })
  }
  document.addEventListener("click", onClick)

  return () => {
    document.removeEventListener("click", onClick)
    gsap.ticker.remove(tick)
    lenis?.destroy()
    lenis = null
    document.documentElement.classList.remove("lenis")
  }
}

export function getLenis() {
  return lenis
}
