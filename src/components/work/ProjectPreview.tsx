import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface ProjectData {
  slug: string;
  title: string;
  category: string;
  status: string;
  summary: string;
  accent: string;
  technologies: string[];
}

export default function ProjectPreview({ projects }: { projects: ProjectData[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const currentIndex = useRef(0);
  const activeProject = useRef<ProjectData | null>(null);
  const xTo = useRef(gsap.quickTo(previewRef, 'x', { duration: 0.6, ease: 'power3.out' }));
  const yTo = useRef(gsap.quickTo(previewRef, 'y', { duration: 0.6, ease: 'power3.out' }));
  const opacityTo = useRef(gsap.quickTo(previewRef, 'opacity', { duration: 0.4 }));

  useEffect(() => {
    if (!containerRef.current || !previewRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      xTo.current(e.clientX + 20);
      yTo.current(e.clientY + 20);
    };

    const listItems = containerRef.current.closest('section')?.querySelectorAll('a[data-project-index]');
    if (listItems) {
      listItems.forEach((item, index) => {
        item.addEventListener('mouseenter', () => {
          currentIndex.current = index;
          activeProject.current = projects[index] || null;
          if (activeProject.current && previewRef.current) {
            previewRef.current.innerHTML = '';
            previewRef.current.appendChild(renderPreview(activeProject.current));
            opacityTo.current(1);
          }
        });
        item.addEventListener('mouseleave', () => {
          opacityTo.current(0);
        });
      });
    }

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      listItems?.forEach((item) => {
        item.removeEventListener('mouseenter', () => {});
        item.removeEventListener('mouseleave', () => {});
      });
    };
  }, [projects]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-10 pointer-events-none"
    >
      <div
        ref={previewRef}
        className="fixed left-0 top-0 w-72 h-48 bg-canvas border border-hairline shadow-sm opacity-0 pointer-events-none transition-shadow"
        style={{ willChange: 'transform, opacity' }}
      />
    </div>
  );
}

function renderPreview(project: ProjectData): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.style.width = '100%';
  wrapper.style.height = '100%';
  wrapper.style.position = 'relative';
  wrapper.style.overflow = 'hidden';
  wrapper.style.padding = '12px';
  wrapper.style.boxSizing = 'border-box';

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.style.position = 'absolute';
  svg.style.top = '0';
  svg.style.left = '0';

  // Generate project-specific SVG patterns (simplified)
  const accent = project.accent || '#D94F2B';
  if (project.slug === 'uppetite') {
    // map dots
    for (let i = 0; i < 12; i++) {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', String(20 + Math.random() * 200));
      circle.setAttribute('cy', String(20 + Math.random() * 100));
      circle.setAttribute('r', '3');
      circle.setAttribute('fill', accent);
      svg.appendChild(circle);
    }
    // roads
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M10 80 Q100 20 200 60 T300 40');
    path.setAttribute('stroke', '#111111');
    path.setAttribute('stroke-width', '1');
    path.setAttribute('fill', 'none');
    svg.appendChild(path);
  } else if (project.slug === 'pasada') {
    // routes and nodes
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', '20'); line.setAttribute('y1', '80');
    line.setAttribute('x2', '250'); line.setAttribute('y2', '40');
    line.setAttribute('stroke', accent);
    line.setAttribute('stroke-width', '2');
    svg.appendChild(line);
    for (let i = 0; i < 5; i++) {
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', String(30 + i * 50));
      rect.setAttribute('y', '50');
      rect.setAttribute('width', '10');
      rect.setAttribute('height', '10');
      rect.setAttribute('fill', '#111111');
      svg.appendChild(rect);
    }
  } else if (project.slug === 'disaster-response') {
    // communication lines and nodes
    const triangle = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    triangle.setAttribute('points', '150,20 250,80 50,80');
    triangle.setAttribute('stroke', accent);
    triangle.setAttribute('stroke-width', '1');
    triangle.setAttribute('fill', 'none');
    svg.appendChild(triangle);
  } else if (project.slug === 'campus-navigation') {
    // floor plan lines
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', '40'); rect.setAttribute('y', '30');
    rect.setAttribute('width', '200'); rect.setAttribute('height', '80');
    rect.setAttribute('stroke', '#111111');
    rect.setAttribute('stroke-width', '1');
    rect.setAttribute('fill', 'none');
    svg.appendChild(rect);
  }

  wrapper.appendChild(svg);

  const label = document.createElement('p');
  label.style.position = 'absolute';
  label.style.bottom = '8px';
  label.style.left = '12px';
  label.style.fontFamily = 'JetBrains Mono, monospace';
  label.style.fontSize = '10px';
  label.style.textTransform = 'uppercase';
  label.style.color = '#555555';
  label.textContent = `${project.status} / ${project.category}`;
  wrapper.appendChild(label);

  return wrapper;
}