import { lazy, Suspense, useEffect, useState } from "react"

const Spline = lazy(() => import("@splinetool/react-spline"))

function ArtifactFallback() {
  return (
    <div className="relative h-full min-h-[420px] overflow-hidden bg-paper-2" aria-label="Static computational artifact fallback">
      <svg viewBox="0 0 720 560" className="absolute inset-0 h-full w-full" role="img" aria-label="Layered coordinate artifact made from planes, axes, and contour lines">
        <rect width="720" height="560" fill="#ebe7dc" />
        <g fill="none" stroke="#c5bfb3" strokeWidth="1" opacity="0.8">
          {Array.from({ length: 11 }, (_, i) => <line key={`v-${i}`} x1={70 + i * 58} y1="40" x2={70 + i * 58} y2="520" />)}
          {Array.from({ length: 8 }, (_, i) => <line key={`h-${i}`} x1="48" y1={72 + i * 58} x2="674" y2={72 + i * 58} />)}
        </g>
        <g transform="translate(360 280)">
          <path d="M-180 58 C-130 -72 -56 -138 16 -109 C91 -79 157 -28 180 65 C127 118 52 139 -34 121 C-105 106 -158 88 -180 58Z" fill="#f2efe7" stroke="#17150f" strokeWidth="2" />
          <path d="M-151 45 C-111 -51 -48 -103 15 -82 C72 -63 128 -21 151 54" fill="none" stroke="#d9482b" strokeWidth="2" />
          <path d="M-118 31 C-84 -28 -38 -68 15 -57 C62 -48 103 -12 121 42" fill="none" stroke="#17150f" opacity="0.45" />
          <path d="M-85 19 C-56 -10 -25 -35 15 -31 C51 -27 78 -3 91 28" fill="none" stroke="#17150f" opacity="0.3" />
          <line x1="-226" y1="0" x2="230" y2="0" stroke="#8a867c" />
          <line x1="0" y1="-190" x2="0" y2="196" stroke="#8a867c" />
          <circle cx="15" cy="-82" r="5" fill="#d9482b" />
          <circle cx="-118" cy="31" r="3" fill="#17150f" />
          <circle cx="121" cy="42" r="3" fill="#17150f" />
        </g>
        <g fontFamily="JetBrains Mono Variable, monospace" fontSize="10" letterSpacing="1.4" fill="#5a5750">
          <text x="28" y="34">OBJECT / 001</text>
          <text x="28" y="535">STATIC FALLBACK / COMPUTATIONAL ARTIFACT</text>
          <text x="604" y="34">X/Y/Z</text>
        </g>
      </svg>
    </div>
  )
}

export default function DigitalArtifact({ sceneUrl }: { sceneUrl?: string }) {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const small = window.matchMedia("(max-width: 767px)").matches
    setEnabled(Boolean(sceneUrl) && !reduced && !small)
  }, [sceneUrl])

  if (!enabled || !sceneUrl) return <ArtifactFallback />

  return (
    <div className="relative h-full min-h-[420px] bg-paper-2" data-cursor="rotate">
      <Suspense fallback={<ArtifactFallback />}>
        <Spline scene={sceneUrl} renderOnDemand />
      </Suspense>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24" style={{ background: "linear-gradient(to top, var(--color-paper-2), transparent)" }} />
    </div>
  )
}
