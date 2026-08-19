import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { identity } from '../../data/site';
import { projectCatalog } from '../../data/projectCatalog';
import { preloadProject } from '../../content/projectRegistry';
import { preloadProjectPage } from '../../lib/navigation/projectPrefetch';
import { ProjectPreview } from '../work/ProjectPreview';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** navigate to a homepage section; returns true when it handled the target */
  onNavigate: (hash: string) => void;
  sections: {label: string;hash: string;}[];
}

/**
 * The atlas index. A full-screen destination on every viewport, not a mobile
 * afterthought — the same object the printed atlas would put at the front:
 * numbered sections, then numbered plates, each with its coordinates.
 *
 * The background is a quiet SVG crosshair field that recentres on whatever row
 * is selected. Deliberately not a second WebGL context and not a Spline scene:
 * one GPU surface (the hero) plus one spatial stage is the whole budget.
 */
export function AtlasMenu({ open, onOpenChange, onNavigate, sections }: Props) {
  const [hover, setHover] = useState<{x: number;y: number;key: string;} | null>(null);

  const crossX = hover ? hover.x : 0.5;
  const crossY = hover ? hover.y : 0.42;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-[70]"
          style={{ backgroundColor: 'rgba(17, 17, 17, 0.22)' }} />
        
        <Dialog.Content
          className="fixed inset-0 z-[80] flex flex-col overflow-y-auto bg-canvas focus:outline-none"
          aria-label="Atlas index">
          
          {/* background crosshair field */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            aria-hidden="true"
            preserveAspectRatio="none"
            viewBox="0 0 100 100">
            
            <g stroke="var(--hairline)" strokeWidth="0.12">
              {Array.from({ length: 13 }).map((_, i) =>
              <line key={`v${i}`} x1={i * (100 / 12)} y1="0" x2={i * (100 / 12)} y2="100" />
              )}
            </g>
            <g
              stroke="var(--accent)"
              strokeWidth="0.14"
              style={{ transition: 'opacity 420ms cubic-bezier(0.16,0.84,0.24,1)' }}
              opacity={hover ? 0.85 : 0.28}>
              
              <line
                x1="0"
                x2="100"
                y1={crossY * 100}
                y2={crossY * 100}
                style={{ transition: 'all 520ms cubic-bezier(0.16,0.84,0.24,1)' }} />
              
              <line
                y1="0"
                y2="100"
                x1={crossX * 100}
                x2={crossX * 100}
                style={{ transition: 'all 520ms cubic-bezier(0.16,0.84,0.24,1)' }} />
              
            </g>
          </svg>

          <div className="atlas-grid relative py-4">
            <div className="col-span-4 flex items-center justify-between md:col-span-8 xl:col-span-12">
              <Dialog.Title className="mono-label text-ink">
                INDEX / VECTOR ATLAS
              </Dialog.Title>
              <Dialog.Close
                aria-label="Close index"
                className="-mr-2 flex h-11 w-11 items-center justify-center text-ink">
                
                <X className="h-5 w-5" strokeWidth={1.4} aria-hidden="true" />
              </Dialog.Close>
            </div>
          </div>

          <div className="atlas-grid relative mt-6 flex-1 items-start gap-y-12 pb-10 md:mt-10">
            {/* sections */}
            <nav
              className="col-span-4 md:col-span-4 xl:col-span-6"
              aria-label="Sections">
              
              <span className="mono-label block border-t border-hairline pt-3">SECTIONS</span>
              <ul className="mt-2">
                {sections.map((item, i) =>
                <li key={item.label} className="border-b border-hairline">
                    <button
                    type="button"
                    onClick={() => onNavigate(item.hash)}
                    onPointerEnter={() =>
                    setHover({ x: 0.24, y: 0.3 + i * 0.11, key: item.label })}

                    onFocus={() => setHover({ x: 0.24, y: 0.3 + i * 0.11, key: item.label })}
                    onPointerLeave={() => setHover(null)}
                    onBlur={() => setHover(null)}
                    className="group flex w-full items-baseline justify-between gap-4 py-4 text-left">
                    
                      <span className="flex items-baseline gap-4">
                        <span className="font-mono text-micro text-graphite">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="font-heading text-display-2 font-medium uppercase leading-none transition-transform duration-500 ease-atlas group-hover:translate-x-2 group-focus-visible:translate-x-2">
                          {item.label}
                        </span>
                      </span>
                      <span
                      aria-hidden="true"
                      className="mt-2 h-[1px] w-8 shrink-0 origin-right scale-x-0 bg-accent transition-transform duration-500 ease-atlas group-hover:scale-x-100 group-focus-visible:scale-x-100" />
                    
                    </button>
                  </li>
                )}
              </ul>
            </nav>

            {/* plates */}
            <nav
              className="col-span-4 md:col-span-4 xl:col-span-5 xl:col-start-8"
              aria-label="Projects">
              
              <span className="mono-label block border-t border-hairline pt-3">PLATES</span>
              <ul className="mt-2">
                {projectCatalog.map((project, i) =>
                <li key={project.slug} className="border-b border-hairline">
                    <Link
                    to={`/work/${project.slug}`}
                    onClick={() => onOpenChange(false)}
                    onPointerEnter={() => {
                      setHover({ x: 0.74, y: 0.34 + i * 0.1, key: project.slug });
                      preloadProjectPage();
                      preloadProject(project.slug);
                    }}
                    onFocus={() => {
                      setHover({ x: 0.74, y: 0.34 + i * 0.1, key: project.slug });
                      preloadProjectPage();
                      preloadProject(project.slug);
                    }}
                    onPointerLeave={() => setHover(null)}
                    onBlur={() => setHover(null)}
                    className="group flex items-start gap-4 py-4"
                    data-cursor="view">
                    
                      <span className="mt-[0.35rem] font-mono text-micro text-graphite">
                        {project.index}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-heading text-display-3 font-medium uppercase leading-tight transition-transform duration-500 ease-atlas group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5">
                          {project.title}
                        </span>
                        <span className="mt-1 block font-mono text-micro uppercase tracking-[0.14em] text-graphite">
                          {project.category}
                        </span>
                        <span className="mt-1 flex items-center gap-3 font-mono text-micro uppercase tracking-[0.14em]">
                          <span style={{ color: project.accent }}>{project.status}</span>
                          <span className="text-graphite">{project.period}</span>
                        </span>
                      </span>
                      <span
                      aria-hidden="true"
                      className="hidden h-[3.1rem] w-[5rem] shrink-0 overflow-hidden border border-hairline transition-colors duration-500 ease-atlas group-hover:border-ink md:block">
                      
                        <ProjectPreview preview={project.preview} />
                      </span>
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
          </div>

          <div className="atlas-grid relative border-t border-hairline py-4">
            <div className="col-span-4 flex flex-col gap-1 md:col-span-8 md:flex-row md:items-center md:justify-between xl:col-span-12">
              <span className="mono-label">N 14.16° / E 121.24° — LOS BAÑOS</span>
              <span className="mono-label flex items-center gap-2">
                <span className="h-[5px] w-[5px] bg-accent" aria-hidden="true" />
                {identity.status}
              </span>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>);

}