import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Canvas } from "@react-three/fiber"
import { PerformanceMonitor } from "@react-three/drei"
import Scene from "./Scene"
import ProbeReadout from "./ProbeReadout"
import {
  detectQuality,
  configFor,
  hasWebGL,
  prefersReducedMotion,
  type Quality,
} from "@/lib/webgl/quality"
import {
  setHeroPointer,
  setHeroProgress,
  useHeroState,
} from "./hero-state"

/**
 * Hero WebGL island. Owns:
 *  - capability detection + adaptive quality (PerformanceMonitor)
 *  - pointer -> field probe wiring
 *  - scroll progress -> hero-state (native scroll listener, rAF-free math)
 *  - graceful bail to the Astro SVG fallback if WebGL is missing
 */
export default function HeroCanvas() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [supported, setSupported] = useState(true)
  const [tier, setTier] = useState<Quality>("medium")
  const [mobile, setMobile] = useState(false)
  const [ready, setReady] = useState(false)
  const state = useHeroState()

  useEffect(() => {
    if (!hasWebGL() || prefersReducedMotion()) {
      setSupported(false)
      return
    }
    state.reducedMotion = prefersReducedMotion()
    setTier(detectQuality().tier)
    setMobile(window.matchMedia("(max-width: 767px)").matches)
    setReady(true)
  }, [state])

  // ScrollTrigger maps the full 220vh hero stage to one 0..1 scene progress.
  // The previous v0 implementation measured the sticky canvas itself, whose
  // height is one viewport, so its computed progress never advanced.
  useEffect(() => {
    if (!supported) return
    const hero = document.getElementById("hero")
    if (!hero) return

    gsap.registerPlugin(ScrollTrigger)
    const trigger = ScrollTrigger.create({
      trigger: hero,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => setHeroProgress(self.progress),
    })

    setHeroProgress(trigger.progress)
    return () => trigger.kill()
  }, [supported])

  // pointer -> probe
  useEffect(() => {
    if (!supported) return
    const el = wrapRef.current
    if (!el) return
    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
      setHeroPointer(x, y, true)
    }
    const onLeave = () => setHeroPointer(0, 0, false)
    el.addEventListener("pointermove", onMove)
    el.addEventListener("pointerleave", onLeave)
    return () => {
      el.removeEventListener("pointermove", onMove)
      el.removeEventListener("pointerleave", onLeave)
    }
  }, [supported])

  if (!supported) return null

  const config = configFor(tier)

  return (
    <div ref={wrapRef} className="absolute inset-0" data-cursor="probe">
      {ready && (
        <>
          <Canvas
            className="!absolute inset-0"
            dpr={config.dpr}
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            camera={{ position: [0, 0.6, mobile ? 5.6 : 4.4], fov: 42 }}
            style={{ background: "transparent" }}
          >
            <PerformanceMonitor
              onDecline={() => setTier((t) => (t === "high" ? "medium" : "low"))}
              onIncline={() => setTier((t) => (t === "low" ? "medium" : t))}
            >
              <Scene config={config} mobile={mobile} />
            </PerformanceMonitor>
          </Canvas>
          {!mobile && <ProbeReadout />}
        </>
      )}
    </div>
  )
}
