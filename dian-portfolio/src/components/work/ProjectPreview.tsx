import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function ProjectPreview() {
  const [active, setActive] = useState<{ title: string; category: string; year: string; accent: string } | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rows = document.querySelectorAll('[data-project-row]');
    const handleMouseEnter = (e: Event) => {
      const row = e.currentTarget as HTMLElement;
      const title = row.dataset.title || '';
      const category = row.dataset.category || '';
      const year = row.dataset.year || '';
      const accent = row.dataset.accent || '#D94F2B';
      setActive({ title, category, year, accent });
      previewRef.current!.style.opacity = '1';
      // Move preview
      const rect = row.getBoundingClientRect();
      gsap.to(previewRef.current, {
        left: rect.right + 20,
        top: rect.top,
        duration: 0.3,
        ease: 'power2.out'
      });
    };
    const handleMouseLeave = () => {
      setActive(null);
      previewRef.current!.style.opacity = '0';
    };

    rows.forEach((row) => {
      row.addEventListener('mouseenter', handleMouseEnter);
      row.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      rows.forEach((row) => {
        row.removeEventListener('mouseenter', handleMouseEnter);
        row.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  return (
    <div
      ref={previewRef}
      className="pointer-events-none fixed z-30 hidden md:block w-64 lg:w-80 h-40 bg-white border border-line p-4 opacity-0"
      style={{ transition: 'opacity 0.2s' }}
      aria-hidden="true"
    >
      {active && (
        <div className="flex flex-col justify-between h-full">
          <div>
            <span className="mono-label" style={{ color: active.accent }}>PROJECT</span>
            <h4 className="text-lg font-bold mt-1">{active.title}</h4>
            <p className="text-sm text-ink-muted">{active.category} / {active.year}</p>
          </div>
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <span key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: active.accent }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
