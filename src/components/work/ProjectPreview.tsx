import { useEffect, useRef, useState, type ReactNode } from 'react';
import gsap from 'gsap';

interface ProjectData {
  id: string;
  title: string;
  category: string;
  status: string;
  summary: string;
  accent: string;
  technologies: string[];
}

const patterns: Record<string, ReactNode> = {
  uppetite: <><path d="M-20 230C80 190 120 90 250 130S330 255 520 90" fill="none" stroke="#aaa49c"/><path d="M40 70C170 125 250 30 430 95" fill="none" stroke="#aaa49c"/><circle cx="105" cy="195" r="7"/><circle cx="255" cy="135" r="7"/><circle cx="390" cy="150" r="7"/></>,
  pasada: <><path d="M30 245C140 265 195 105 310 150S410 260 530 95" fill="none" strokeWidth="4"/><rect x="100" y="200" width="14" height="14" fill="#111"/><rect x="305" y="144" width="14" height="14" fill="#111"/><rect x="455" y="175" width="14" height="14" fill="#111"/></>,
  'disaster-response': <><circle cx="280" cy="160" r="105" fill="none" stroke="#aaa49c"/><path d="M130 250L280 60L455 250Z" fill="none" strokeWidth="3"/></>,
  'campus-navigation': <><path d="M65 55H490V270H65Z M65 145H220V270M220 55V210H390V55" fill="none" stroke="#111"/><path d="M100 225C180 175 265 225 435 105" fill="none" strokeWidth="4" strokeDasharray="9 8"/></>,
};

export default function ProjectPreview({ projects }: { projects: ProjectData[] }) {
  const root = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<ProjectData | undefined>(projects[0]);

  useEffect(() => {
    if (!card.current || !root.current) return;
    const cardElement = card.current;
    const section = root.current.closest('section');
    const xTo = gsap.quickTo(cardElement, 'x', { duration: 0.55, ease: 'power3.out' });
    const yTo = gsap.quickTo(cardElement, 'y', { duration: 0.55, ease: 'power3.out' });
    const handlers = new Map<Element, () => void>();

    document.querySelectorAll('[data-project-id]').forEach((item) => {
      const id = item.getAttribute('data-project-id');
      const show = () => {
        const project = projects.find((candidate) => candidate.id === id);
        if (project) setActive(project);
      };
      item.addEventListener('pointerenter', show);
      item.addEventListener('focus', show);
      handlers.set(item, show);
    });

    const move = (event: PointerEvent) => {
      const rect = section?.getBoundingClientRect();
      if (!rect) return;
      const nx = (event.clientX - rect.left) / rect.width - 0.5;
      const ny = (event.clientY - rect.top) / rect.height - 0.5;
      xTo(nx * 18);
      yTo(ny * 14);
    };
    const reset = () => { xTo(0); yTo(0); };
    section?.addEventListener('pointermove', move);
    section?.addEventListener('pointerleave', reset);

    return () => {
      section?.removeEventListener('pointermove', move);
      section?.removeEventListener('pointerleave', reset);
      handlers.forEach((handler, item) => {
        item.removeEventListener('pointerenter', handler);
        item.removeEventListener('focus', handler);
      });
      gsap.killTweensOf(cardElement);
    };
  }, [projects]);

  if (!active) return null;

  return (
    <div ref={root} aria-hidden="true" className="relative aspect-[4/5] overflow-hidden border border-hairline bg-canvas-raised/50">
      <div ref={card} className="absolute inset-5 flex flex-col justify-between border border-hairline bg-canvas/80 p-5 will-change-transform">
        <div className="flex justify-between font-mono text-[9px] uppercase tracking-widest text-graphite"><span>Preview / active</span><span>{active.status}</span></div>
        <svg viewBox="0 0 560 320" className="w-full" fill={active.accent} stroke={active.accent}>{patterns[active.id]}</svg>
        <div><p className="font-display text-2xl font-semibold">{active.title}</p><p className="mt-2 text-sm leading-6 text-graphite">{active.summary}</p></div>
      </div>
    </div>
  );
}
