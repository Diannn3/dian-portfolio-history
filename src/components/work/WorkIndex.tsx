import { useEffect, useRef, useState } from "react"
import ProjectPreviewVisual, { type ProjectVisualKind } from "./ProjectPreviewVisual"

export interface WorkProject {
  id: string
  title: string
  shortTitle: string
  index: number
  status: string
  year?: number
  category: string
  summary: string
  accent: string
  visual: ProjectVisualKind
}

export default function WorkIndex({ projects }: { projects: WorkProject[] }) {
  const [activeId, setActiveId] = useState(projects[0]?.id ?? "")
  const previewRef = useRef<HTMLDivElement>(null)
  const target = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })

  const active = projects.find((p) => p.id === activeId) ?? projects[0]

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)")
    if (!media.matches) return

    let raf = 0
    const tick = () => {
      raf = requestAnimationFrame(tick)
      current.current.x += (target.current.x - current.current.x) * 0.08
      current.current.y += (target.current.y - current.current.y) * 0.08
      if (previewRef.current) {
        previewRef.current.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0)`
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  if (!active) return null

  const onPointerMove = (e: React.PointerEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const nx = (e.clientX - rect.left) / rect.width - 0.5
    const ny = (e.clientY - rect.top) / rect.height - 0.5
    target.current.x = nx * 8
    target.current.y = ny * 8
  }

  const resetPointer = () => {
    target.current.x = 0
    target.current.y = 0
  }

  return (
    <div className="atlas-grid gap-y-10 lg:min-h-[720px]" onPointerMove={onPointerMove} onPointerLeave={resetPointer}>
      <ol className="col-span-4 border-t border-hairline md:col-span-8 lg:col-span-7">
        {projects.map((project) => {
          const selected = project.id === active.id
          return (
            <li key={project.id} className="group border-b border-hairline">
              <a
                href={`/work/${project.id}/`}
                onMouseEnter={() => setActiveId(project.id)}
                onFocus={() => setActiveId(project.id)}
                className="relative grid grid-cols-4 gap-x-4 gap-y-3 py-7 md:grid-cols-8 md:py-9"
                data-cursor="view"
                aria-describedby={`summary-${project.id}`}
              >
                <span className="mono col-span-1 text-graphite-2">{String(project.index).padStart(2, "0")}</span>

                <span className="col-span-3 md:col-span-4">
                  <span
                    className="font-display block text-[clamp(1.75rem,3.2vw,3.8rem)] leading-[0.95] tracking-[-0.035em] transition-transform duration-500 ease-[var(--ease-atlas)] group-hover:translate-x-2 group-focus-visible:translate-x-2"
                    style={{ color: selected ? project.accent : "var(--color-ink)" }}
                  >
                    {project.shortTitle}
                  </span>
                  <span id={`summary-${project.id}`} className="mt-3 block max-w-[48ch] text-sm leading-relaxed text-graphite md:text-base">
                    {project.summary}
                  </span>
                </span>

                <span className="col-span-3 col-start-2 flex items-end justify-between gap-4 md:col-span-3 md:col-start-6 md:flex-col md:items-end md:justify-between">
                  <span className="label text-right">{project.category}</span>
                  <span className="mono flex items-center gap-3 text-graphite-2">
                    <span>{project.year ?? project.status}</span>
                    <span aria-hidden="true" className="text-ink transition-transform duration-500 group-hover:translate-x-1 group-focus-visible:translate-x-1">→</span>
                  </span>
                </span>


                <span className="col-span-4 mt-3 block md:col-span-8 lg:hidden">
                  <span className="relative block aspect-[1.3/1] overflow-hidden border border-hairline bg-paper-2">
                    <ProjectPreviewVisual kind={project.visual} accent={project.accent} />
                  </span>
                </span>

                <span
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 transition-transform duration-700 ease-[var(--ease-atlas)] group-hover:scale-x-100 group-focus-within:scale-x-100"
                  style={{ background: project.accent }}
                  aria-hidden="true"
                />
              </a>
            </li>
          )
        })}
      </ol>

      <aside className="col-span-4 hidden lg:col-span-5 lg:block" aria-label="Project preview">
        <div className="sticky top-28">
          <div ref={previewRef} className="relative aspect-[1.16/1] overflow-hidden border border-hairline bg-paper-2 will-change-transform">
            {projects.map((project) => (
              <ProjectPreviewVisual
                key={project.id}
                kind={project.visual}
                accent={project.accent}
                active={project.id === active.id}
              />
            ))}
          </div>
          <div className="mono mt-3 flex items-center justify-between text-graphite-2">
            <span>PREVIEW / {String(active.index).padStart(2, "0")}</span>
            <span style={{ color: active.accent }}>{active.status}</span>
          </div>
        </div>
      </aside>

    </div>
  )
}
