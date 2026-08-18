import { useMemo } from "react"
import { field, magnitude, manifoldHeight, seeded } from "@/lib/math/field"

/**
 * Static analytical rendering of the SAME vector field used by the WebGL
 * hero. Rendered for reduced-motion users and when WebGL is unavailable, so
 * the "vector atlas" identity is preserved without any animation. Pure SVG,
 * computed once, deterministic.
 */
export default function HeroFallback() {
  const { arrows, contours, manifoldLines } = useMemo(() => {
    const W = 1200
    const H = 720
    const cols = 26
    const rows = 16
    const t = 0.6 // frozen time slice

    const arrows: { x: number; y: number; dx: number; dy: number; m: number }[] = []
    for (let iy = 0; iy < rows; iy++) {
      for (let ix = 0; ix < cols; ix++) {
        const u = (ix / (cols - 1)) * 3.6 - 1.8
        const v = (iy / (rows - 1)) * 2.4 - 1.2
        const f = field(u, v, 0, t)
        const m = magnitude(f)
        const px = (ix / (cols - 1)) * W
        const py = (1 - iy / (rows - 1)) * H
        const len = Math.min(26, 8 + m * 26)
        const ang = Math.atan2(f[1], f[0])
        arrows.push({
          x: px,
          y: py,
          dx: Math.cos(ang) * len,
          dy: -Math.sin(ang) * len,
          m,
        })
      }
    }

    // a few integrated streamlines as smooth polylines
    const rnd = seeded(7)
    const contours: string[] = []
    for (let s = 0; s < 9; s++) {
      let x = rnd() * 3.2 - 1.6
      let y = rnd() * 2 - 1
      let d = ""
      for (let i = 0; i < 90; i++) {
        const f = field(x, y, 0, t)
        const px = ((x + 1.8) / 3.6) * W
        const py = (1 - (y + 1.2) / 2.4) * H
        d += `${i === 0 ? "M" : "L"}${px.toFixed(1)},${py.toFixed(1)} `
        x += f[0] * 0.06
        y += f[1] * 0.06
        if (x < -1.9 || x > 1.9 || y < -1.3 || y > 1.3) break
      }
      contours.push(d)
    }

    // Project slices of the same procedural saddle used in WebGL so the
    // fallback retains a clear central object, not only atmospheric lines.
    const manifoldLines: string[] = []
    for (let row = 0; row < 13; row++) {
      const v = -1.08 + (row / 12) * 2.16
      let d = ""
      for (let col = 0; col < 72; col++) {
        const u = -1.35 + (col / 71) * 2.7
        const z = manifoldHeight(u, v, t)
        const px = W / 2 + u * 165 + v * 88
        const py = H / 2 + v * 69 - z * 92
        d += `${col === 0 ? "M" : "L"}${px.toFixed(1)},${py.toFixed(1)} `
      }
      manifoldLines.push(d)
    }

    return { arrows, contours, manifoldLines }
  }, [])

  return (
    <svg
      viewBox="0 0 1200 720"
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Static vector atlas showing a projected parametric manifold, directional field arrows, and integrated streamlines."
    >
      <defs>
        <marker id="fa-head" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
          <circle cx="2" cy="2" r="1.4" fill="var(--color-accent)" />
        </marker>
      </defs>
      <g aria-hidden="true">
        {manifoldLines.map((d, i) => (
          <path
            key={`m-${i}`}
            d={d}
            fill="none"
            stroke={i === 6 ? "var(--color-accent)" : "var(--color-ink)"}
            strokeOpacity={i === 6 ? 0.8 : 0.52}
            strokeWidth={i === 6 ? 2.2 : 1.35}
          />
        ))}
      </g>
      {contours.map((d, i) => (
        <path
          key={`c-${i}`}
          d={d}
          fill="none"
          stroke="var(--color-accent)"
          strokeOpacity={0.28}
          strokeWidth={1.4}
        />
      ))}
      {arrows.map((a, i) => (
        <line
          key={`a-${i}`}
          x1={a.x}
          y1={a.y}
          x2={a.x + a.dx}
          y2={a.y + a.dy}
          stroke="var(--color-ink)"
          strokeOpacity={0.18 + a.m * 0.4}
          strokeWidth={1}
          markerEnd="url(#fa-head)"
        />
      ))}
    </svg>
  )
}
