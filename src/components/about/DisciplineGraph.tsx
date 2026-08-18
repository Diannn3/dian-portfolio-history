import { useMemo, useState } from "react"

type NodeId = "math" | "software" | "ai" | "data" | "spatial" | "design"

const nodes: Array<{ id: NodeId; label: string; x: number; y: number }> = [
  { id: "math", label: "MATH", x: 16, y: 20 },
  { id: "software", label: "SOFTWARE", x: 67, y: 16 },
  { id: "ai", label: "AI", x: 84, y: 48 },
  { id: "data", label: "DATA", x: 54, y: 73 },
  { id: "spatial", label: "SPATIAL", x: 18, y: 72 },
  { id: "design", label: "DESIGN", x: 46, y: 42 },
]

const edges: Array<[NodeId, NodeId]> = [
  ["math", "data"],
  ["math", "ai"],
  ["math", "spatial"],
  ["software", "ai"],
  ["software", "data"],
  ["software", "design"],
  ["software", "spatial"],
  ["ai", "data"],
  ["data", "spatial"],
  ["spatial", "design"],
  ["design", "math"],
]

export default function DisciplineGraph() {
  const [active, setActive] = useState<NodeId | null>("design")
  const byId = useMemo(() => Object.fromEntries(nodes.map((node) => [node.id, node])), []) as Record<NodeId, (typeof nodes)[number]>

  return (
    <div className="relative aspect-[1.25/1] min-h-[300px] border border-hairline bg-paper-2" onMouseLeave={() => setActive(null)}>
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 80" aria-hidden="true" preserveAspectRatio="none">
        {edges.map(([a, b]) => {
          const from = byId[a]
          const to = byId[b]
          const highlighted = active === a || active === b
          return (
            <line
              key={`${a}-${b}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              vectorEffect="non-scaling-stroke"
              stroke={highlighted ? "#d9482b" : "#c7c1b5"}
              strokeWidth={highlighted ? 1.5 : 1}
              opacity={active && !highlighted ? 0.35 : 0.95}
              className="transition-[opacity,stroke] duration-300"
            />
          )
        })}
      </svg>

      {nodes.map((node) => {
        const selected = active === node.id
        const connected = !active || selected || edges.some(([a, b]) => (a === active && b === node.id) || (b === active && a === node.id))
        return (
          <button
            key={node.id}
            type="button"
            onMouseEnter={() => setActive(node.id)}
            onFocus={() => setActive(node.id)}
            onBlur={() => setActive(null)}
            aria-pressed={selected}
            className="absolute -translate-x-1/2 -translate-y-1/2 border border-hairline bg-paper px-3 py-2 font-mono text-[10px] tracking-[0.14em] transition-[opacity,border-color,color,transform] duration-300 focus-visible:z-20"
            style={{
              left: `${node.x}%`,
              top: `${(node.y / 80) * 100}%`,
              color: selected ? "#d9482b" : "#17150f",
              borderColor: selected ? "#d9482b" : "#d6d1c4",
              opacity: connected ? 1 : 0.42,
              transform: `translate(-50%, -50%) scale(${selected ? 1.05 : 1})`,
            }}
          >
            {node.label}
          </button>
        )
      })}

      <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex justify-between font-mono text-[9px] uppercase tracking-[0.12em] text-graphite-2">
        <span>Hover / focus a discipline</span>
        <span>Relationships, not rankings</span>
      </div>
    </div>
  )
}
