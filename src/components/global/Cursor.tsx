import { useEffect, useRef } from "react"
import { gsap } from "gsap"

type State = "default" | "view" | "external" | "probe" | "rotate" | "drag"

const LABELS: Record<State, string> = {
  default: "",
  view: "View",
  external: "↗",
  probe: "Probe",
  rotate: "Rotate",
  drag: "Drag",
}

/**
 * Analytical instrument cursor. Fine-pointer only; native cursor stays for
 * touch and reduced motion. A dot with inertial follow plus a ring that
 * changes label/scale based on the hovered element's data-cursor attribute.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!fine || reduced) return

    document.documentElement.classList.add("cursor-ready")

    const xDot = gsap.quickTo(dot.current, "x", { duration: 0.12, ease: "power3" })
    const yDot = gsap.quickTo(dot.current, "y", { duration: 0.12, ease: "power3" })
    const xRing = gsap.quickTo(ring.current, "x", { duration: 0.42, ease: "power3" })
    const yRing = gsap.quickTo(ring.current, "y", { duration: 0.42, ease: "power3" })

    let current: State = "default"

    const setState = (s: State) => {
      if (s === current) return
      current = s
      const active = s !== "default"
      gsap.to(ring.current, {
        scale: active ? 1 : 0.62,
        borderColor: active ? "var(--color-accent)" : "var(--color-ink)",
        duration: 0.32,
        ease: "power3.out",
      })
      if (labelRef.current) labelRef.current.textContent = LABELS[s]
    }

    const move = (e: PointerEvent) => {
      xDot(e.clientX)
      yDot(e.clientY)
      xRing(e.clientX)
      yRing(e.clientY)

      const el = (e.target as HTMLElement)?.closest?.("[data-cursor]") as HTMLElement | null
      if (el) {
        setState((el.dataset.cursor as State) || "default")
      } else {
        const anchor = (e.target as HTMLElement)?.closest?.("a[target=_blank]")
        setState(anchor ? "external" : "default")
      }
    }

    const down = () => gsap.to(ring.current, { scale: 0.5, duration: 0.2 })
    const up = () => gsap.to(ring.current, { scale: current === "default" ? 0.62 : 1, duration: 0.2 })
    const leave = () => gsap.to([dot.current, ring.current], { opacity: 0, duration: 0.2 })
    const enter = () => gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.2 })

    window.addEventListener("pointermove", move)
    window.addEventListener("pointerdown", down)
    window.addEventListener("pointerup", up)
    document.addEventListener("pointerleave", leave)
    document.addEventListener("pointerenter", enter)

    return () => {
      window.removeEventListener("pointermove", move)
      window.removeEventListener("pointerdown", down)
      window.removeEventListener("pointerup", up)
      document.removeEventListener("pointerleave", leave)
      document.removeEventListener("pointerenter", enter)
      document.documentElement.classList.remove("cursor-ready")
    }
  }, [])

  return (
    <div aria-hidden="true">
      <div
        ref={dot}
        className="atlas-cursor -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-ink"
      />
      <div
        ref={ring}
        className="atlas-cursor -ml-8 -mt-8 flex h-16 w-16 items-center justify-center rounded-full border border-ink"
        style={{ transform: "scale(0.62)" }}
      >
        <span
          ref={labelRef}
          className="mono !text-[0.6rem] uppercase tracking-widest text-accent-ink"
        />
      </div>
    </div>
  )
}
