import type { CSSProperties } from "react"

export type ProjectVisualKind = "uppetite" | "pasada" | "disaster" | "campus"

interface Props {
  kind: ProjectVisualKind
  accent: string
  active?: boolean
}

const lineStyle = { vectorEffect: "non-scaling-stroke" as const }

function Uppetite({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 720 520" className="h-full w-full" role="img" aria-label="Abstract map preview for UPPETITE ELBI">
      <rect width="720" height="520" fill="#ede9df" />
      <g fill="none" stroke="#c9c3b7" strokeWidth="1" opacity="0.85" style={lineStyle}>
        <path d="M-30 94 C120 55 185 142 324 112 S525 33 758 84" />
        <path d="M-20 194 C105 142 245 230 380 184 S591 118 748 156" />
        <path d="M-20 336 C130 287 238 374 371 330 S579 250 746 288" />
        <path d="M88 -20 C132 92 91 174 165 263 S234 397 221 548" />
        <path d="M311 -20 C282 96 350 165 329 270 S298 405 376 548" />
        <path d="M557 -20 C492 88 568 182 514 276 S474 404 548 548" />
      </g>
      <g fill="none" stroke="#8f8a80" strokeWidth="2" style={lineStyle}>
        <path d="M-20 414 C105 390 173 315 267 302 C382 286 416 385 532 363 C617 347 656 290 742 276" />
        <path d="M101 -10 C111 90 181 118 196 207 C214 311 146 344 169 536" />
      </g>
      <g fill="#17150f">
        <circle cx="169" cy="360" r="4" />
        <circle cx="264" cy="302" r="4" />
        <circle cx="419" cy="365" r="4" />
        <circle cx="533" cy="361" r="4" />
      </g>
      <g fill={accent}>
        <circle cx="352" cy="330" r="8" />
        <circle cx="352" cy="330" r="17" opacity="0.12" />
      </g>
      <g fontFamily="JetBrains Mono Variable, monospace" fontSize="11" fill="#5a5750" letterSpacing="1.5">
        <text x="36" y="40">LOCAL FIELD / ELBI</text>
        <text x="36" y="492">PLACES  ·  ROUTES  ·  COMMUNITY DATA</text>
        <text x="371" y="319" fill={accent}>ACTIVE NODE</text>
      </g>
      <g transform="translate(500 62)">
        <rect width="174" height="112" fill="#f2efe7" stroke="#c9c3b7" />
        <text x="16" y="25" fontFamily="JetBrains Mono Variable, monospace" fontSize="10" fill="#5a5750">PLACE / 024</text>
        <line x1="16" y1="40" x2="158" y2="40" stroke="#d6d1c4" />
        <rect x="16" y="56" width="91" height="7" fill="#17150f" />
        <rect x="16" y="73" width="124" height="5" fill="#8a867c" opacity="0.75" />
        <rect x="16" y="87" width="72" height="5" fill={accent} opacity="0.85" />
      </g>
    </svg>
  )
}

function Pasada({ accent }: { accent: string }) {
  const nodes = [90, 178, 272, 372, 470, 576, 650]
  return (
    <svg viewBox="0 0 720 520" className="h-full w-full" role="img" aria-label="Abstract transit route preview for PASADA">
      <rect width="720" height="520" fill="#eee9df" />
      <g stroke="#d5d0c6" fill="none" strokeWidth="1" opacity="0.9" style={lineStyle}>
        {Array.from({ length: 9 }, (_, i) => <line key={i} x1="0" y1={64 + i * 48} x2="720" y2={64 + i * 48} />)}
      </g>
      <path d="M48 316 C140 242 190 362 279 298 S437 211 520 263 S614 339 684 246" fill="none" stroke="#17150f" strokeWidth="2.5" style={lineStyle} />
      <path d="M48 316 C140 242 190 362 279 298 S437 211 520 263 S614 339 684 246" fill="none" stroke={accent} strokeWidth="9" opacity="0.12" style={lineStyle} />
      {nodes.map((x, i) => (
        <g key={x}>
          <circle cx={x} cy={i % 2 === 0 ? 294 - i * 2 : 318 - i * 7} r="5" fill="#f2efe7" stroke="#17150f" strokeWidth="2" />
          <rect x={x - 13} y={390 - (i % 3) * 20} width="26" height={38 + (i % 3) * 20} fill={accent} opacity={0.08 + i * 0.025} />
        </g>
      ))}
      <g transform="translate(286 275)">
        <rect x="-26" y="-12" width="52" height="24" rx="2" fill={accent} />
        <rect x="-16" y="-7" width="20" height="7" fill="#f2efe7" opacity="0.9" />
        <circle cx="-15" cy="14" r="4" fill="#17150f" />
        <circle cx="15" cy="14" r="4" fill="#17150f" />
      </g>
      <g fontFamily="JetBrains Mono Variable, monospace" fontSize="11" fill="#5a5750" letterSpacing="1.4">
        <text x="36" y="40">ROUTE FIELD / DEMAND</text>
        <text x="36" y="492">QUEUE DENSITY  ·  ETA  ·  MOVEMENT</text>
        <text x="311" y="262" fill={accent}>UNIT / MOVING</text>
      </g>
    </svg>
  )
}

function Disaster({ accent }: { accent: string }) {
  const events = [
    [137, 146, 18], [241, 237, 9], [416, 162, 12], [535, 315, 22], [344, 362, 7], [608, 118, 11],
  ] as const
  return (
    <svg viewBox="0 0 720 520" className="h-full w-full" role="img" aria-label="Abstract incident and hazard field preview for the disaster response platform">
      <rect width="720" height="520" fill="#eeeae1" />
      <g fill="none" stroke="#c8c3b8" strokeWidth="1" style={lineStyle}>
        <path d="M24 274 C125 201 191 215 278 183 S453 93 697 151" />
        <path d="M11 334 C152 247 274 307 348 260 S516 166 708 220" />
        <path d="M18 400 C155 319 260 385 391 334 S559 259 708 305" />
      </g>
      <g fill={accent} opacity="0.07">
        <path d="M79 119 C145 63 260 65 315 133 C374 207 303 278 207 273 C103 267 31 197 79 119Z" />
        <path d="M412 238 C481 186 605 202 651 278 C689 343 625 417 528 416 C438 415 365 330 412 238Z" />
      </g>
      <g stroke="#8c877e" strokeWidth="1" opacity="0.8" style={lineStyle}>
        <line x1="137" y1="146" x2="241" y2="237" />
        <line x1="241" y1="237" x2="416" y2="162" />
        <line x1="416" y1="162" x2="535" y2="315" />
        <line x1="344" y1="362" x2="535" y2="315" />
        <line x1="416" y1="162" x2="608" y2="118" />
      </g>
      {events.map(([x, y, r], i) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r={r * 1.8} fill={i === 3 ? accent : "#17150f"} opacity="0.04" />
          <circle cx={x} cy={y} r={r} fill={i === 3 ? accent : "#f2efe7"} stroke={i === 3 ? accent : "#17150f"} strokeWidth="2" />
          <circle cx={x} cy={y} r="2.5" fill={i === 3 ? "#f2efe7" : "#17150f"} />
        </g>
      ))}
      <g transform="translate(430 342)">
        <rect width="234" height="118" fill="#f2efe7" stroke="#c8c3b8" />
        <text x="15" y="24" fontFamily="JetBrains Mono Variable, monospace" fontSize="10" fill={accent}>INCIDENT / PRIORITY</text>
        <line x1="15" y1="38" x2="219" y2="38" stroke="#d6d1c4" />
        <text x="15" y="59" fontFamily="Inter Variable, sans-serif" fontSize="14" fill="#17150f">REPORT → STRUCTURED EVENT</text>
        <text x="15" y="82" fontFamily="JetBrains Mono Variable, monospace" fontSize="9" fill="#5a5750">LOC / RESOLVE</text>
        <text x="124" y="82" fontFamily="JetBrains Mono Variable, monospace" fontSize="9" fill="#5a5750">DUP / CHECK</text>
        <rect x="15" y="96" width="204" height="5" fill={accent} opacity="0.25" />
      </g>
      <g fontFamily="JetBrains Mono Variable, monospace" fontSize="11" fill="#5a5750" letterSpacing="1.3">
        <text x="36" y="40">INCIDENT FIELD / PH</text>
        <text x="36" y="492">REPORTS  ·  HAZARDS  ·  RESPONSE STATE</text>
      </g>
    </svg>
  )
}

function Campus({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 720 520" className="h-full w-full" role="img" aria-label="Abstract floor plan and navigation preview for campus navigation experiments">
      <rect width="720" height="520" fill="#ece9df" />
      <g transform="translate(58 70)" fill="none" stroke="#858178" strokeWidth="1.4" style={lineStyle}>
        <path d="M0 0 H538 V360 H0 Z" />
        <path d="M0 104 H215 V0 M215 104 H386 V0 M386 104 H538" />
        <path d="M0 244 H155 V104 M155 244 H300 V360 M300 244 H433 V104 M433 244 H538" />
        <path d="M215 104 H433 V244 H155" stroke="#c8c3b8" />
        <path d="M255 104 V244 M342 104 V244" stroke="#c8c3b8" />
      </g>
      <path d="M93 370 L213 370 L213 298 L313 298 L313 174 L469 174 L469 123 L578 123" fill="none" stroke={accent} strokeWidth="4" strokeLinecap="square" strokeLinejoin="miter" style={lineStyle} />
      <g fill="#f2efe7" stroke={accent} strokeWidth="2">
        <circle cx="93" cy="370" r="7" />
        <circle cx="578" cy="123" r="7" />
      </g>
      <g fontFamily="JetBrains Mono Variable, monospace" fontSize="10" fill="#5a5750">
        <text x="72" y="393">START</text>
        <text x="588" y="126" fill={accent}>ROOM / 204</text>
        <text x="36" y="40" fontSize="11" letterSpacing="1.3">LEVEL / ROUTE / LANDMARK</text>
        <text x="36" y="492" fontSize="11" letterSpacing="1.3">CAMPUS → BUILDING → ROOM</text>
      </g>
      <g transform="translate(566 347)">
        <rect width="104" height="84" fill="#f2efe7" stroke="#c8c3b8" />
        <text x="12" y="20" fontFamily="JetBrains Mono Variable, monospace" fontSize="9" fill="#5a5750">LEVEL</text>
        <text x="12" y="44" fontFamily="Space Grotesk Variable, sans-serif" fontSize="25" fill="#17150f">02</text>
        <line x1="54" y1="12" x2="54" y2="71" stroke="#d6d1c4" />
        <text x="66" y="32" fontFamily="JetBrains Mono Variable, monospace" fontSize="9" fill={accent}>UP</text>
        <text x="66" y="53" fontFamily="JetBrains Mono Variable, monospace" fontSize="9" fill="#8a867c">01</text>
      </g>
    </svg>
  )
}

export default function ProjectPreviewVisual({ kind, accent, active = true }: Props) {
  const style = { "--preview-accent": accent } as CSSProperties
  return (
    <div
      className={`absolute inset-0 transition-[opacity,transform] duration-700 ease-[var(--ease-atlas)] ${active ? "scale-100 opacity-100" : "scale-[0.985] opacity-0"}`}
      style={style}
    >
      {kind === "uppetite" && <Uppetite accent={accent} />}
      {kind === "pasada" && <Pasada accent={accent} />}
      {kind === "disaster" && <Disaster accent={accent} />}
      {kind === "campus" && <Campus accent={accent} />}
    </div>
  )
}
