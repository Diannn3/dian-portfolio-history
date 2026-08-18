import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);
let ctx: gsap.Context | undefined;
let lenis: Lenis | undefined;
let ticker: ((time:number)=>void) | undefined;

export function destroySiteMotion() {
  ctx?.revert(); ctx = undefined;
  if (ticker) gsap.ticker.remove(ticker);
  ticker = undefined;
  lenis?.destroy(); lenis = undefined;
  ScrollTrigger.getAll().forEach(t => t.kill());
}

export function initSiteMotion() {
  destroySiteMotion();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;
  if (!reduced && fine) {
    lenis = new Lenis({ smoothWheel:true, syncTouch:false, anchors:true, autoRaf:false, lerp:.09 });
    lenis.on('scroll', ScrollTrigger.update);
    ticker = (time:number) => lenis?.raf(time * 1000);
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);
  }
  if (reduced) return;
  ctx = gsap.context(() => {
    gsap.utils.toArray<HTMLElement>('[data-reveal="clip"] > *').forEach((el) => {
      gsap.to(el,{ y:0,duration:1.05,ease:'power4.out',scrollTrigger:{trigger:el.parentElement,start:'top 88%',once:true} });
    });
    gsap.utils.toArray<HTMLElement>('[data-reveal="line"]').forEach((el) => {
      gsap.to(el,{ scaleX:1,duration:1.15,ease:'power3.inOut',scrollTrigger:{trigger:el,start:'top 92%',once:true} });
    });
    gsap.utils.toArray<HTMLElement>('[data-reveal="meta"]').forEach((el) => {
      gsap.to(el,{ opacity:1,duration:.55,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 90%',once:true} });
    });
  }, document.body);
  ScrollTrigger.refresh();
}
