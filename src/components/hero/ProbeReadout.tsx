import { useEffect, useRef } from "react"
import { field, magnitude } from "@/lib/math/field"
import { useHeroState } from "./hero-state"

/**
 * Analytical HUD that follows the pointer and reports the sampled vector
 * field value F(x, y) at the probed coordinate. Pure DOM, updated on a
 * single rAF loop so it never triggers React re-renders.
 */
export default function ProbeReadout() {
  const state = useHeroState()
  const boxRef = useRef<HTMLDivElement>(null)
  const cxRef = useRef<HTMLSpanElement>(null)
  const cyRef = useRef<HTMLSpanElement>(null)
  const fxRef = useRef<HTMLSpanElement>(null)
  const fyRef = useRef<HTMLSpanElement>(null)
  const magRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (state.reducedMotion) return
    let raf = 0
    const t0 = performance.now()
    const tick = () => {
      raf = requestAnimationFrame(tick)
      const box = boxRef.current
      if (!box) return
      const active = state.pointerActive > 0.5
      box.style.opacity = active ? "1" : "0"
      if (!active) return

      const t = (performance.now() - t0) / 1000
      // map pointer (-1..1) into field domain
      const x = state.pointer.x * 1.8
      const y = state.pointer.y * 1.2
      const f = field(x, y, 0, t)
      const m = magnitude(f)

      box.style.left = `${(state.pointer.x * 0.5 + 0.5) * 100}%`
      box.style.top = `${(-state.pointer.y * 0.5 + 0.5) * 100}%`

      if (cxRef.current) cxRef.current.textContent = x.toFixed(2)
      if (cyRef.current) cyRef.current.textContent = y.toFixed(2)
      if (fxRef.current) fxRef.current.textContent = f[0].toFixed(2)
      if (fyRef.current) fyRef.current.textContent = f[1].toFixed(2)
      if (magRef.current) magRef.current.textContent = m.toFixed(3)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [state])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        ref={boxRef}
        className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-300 will-change-transform"
      >
        <div className="translate-x-4 translate-y-4 rounded-sm border border-hairline bg-paper/80 px-3 py-2 font-mono text-[10px] uppercase leading-relaxed tracking-wide text-graphite backdrop-blur-sm">
          <div className="mb-1 flex items-center gap-2 text-accent">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
            probe · F(x,y)
          </div>
          <div>
            u <span ref={cxRef} className="text-ink">0.00</span> · v{" "}
            <span ref={cyRef} className="text-ink">0.00</span>
          </div>
          <div>
            Fx <span ref={fxRef} className="text-ink">0.00</span> · Fy{" "}
            <span ref={fyRef} className="text-ink">0.00</span>
          </div>
          <div>
            |F| <span ref={magRef} className="text-ink">0.000</span>
          </div>
        </div>
      </div>
    </div>
  )
}
