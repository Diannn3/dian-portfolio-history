import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import DigitalArtifactFallback from './DigitalArtifactFallback';
import SplineErrorBoundary from './SplineErrorBoundary';

const Spline = lazy(() => import('@splinetool/react-spline'));

export default function DigitalArtifact() {
  const scene = import.meta.env.PUBLIC_SPLINE_SCENE_URL as string | undefined;
  const root = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!root.current || reducedMotion) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { rootMargin: '240px' });
    observer.observe(root.current);
    return () => observer.disconnect();
  }, [reducedMotion]);

  const canLoadScene = Boolean(scene && visible && !reducedMotion);
  const fallback = <DigitalArtifactFallback />;

  return (
    <div ref={root} className="relative min-h-[420px] overflow-hidden border-y border-hairline bg-canvas" data-spline-artifact>
      {!canLoadScene ? fallback : (
        <SplineErrorBoundary fallback={fallback}>
          <Suspense fallback={fallback}>
            {!loaded && <div className="absolute inset-0 z-10">{fallback}</div>}
            <Spline scene={scene!} onLoad={() => setLoaded(true)} renderOnDemand style={{ width: '100%', height: '520px' }} />
          </Suspense>
        </SplineErrorBoundary>
      )}
      {!scene && <p className="absolute bottom-5 left-5 font-mono text-[10px] uppercase tracking-widest text-graphite">Spline / scene URL intentionally unconfigured</p>}
      {reducedMotion && scene && <p className="absolute bottom-5 left-5 font-mono text-[10px] uppercase tracking-widest text-graphite">Spline / static fallback for reduced motion</p>}
    </div>
  );
}
