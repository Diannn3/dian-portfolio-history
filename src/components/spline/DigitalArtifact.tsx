import { lazy, Suspense, useState } from 'react';
import { DigitalArtifactFallback } from './DigitalArtifactFallback';

const Spline = lazy(() => import('@splinetool/react-spline'));

export function DigitalArtifact() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div className="relative w-full h-[500px] md:h-[600px] border border-hairline bg-canvas">
      {error ? (
        <DigitalArtifactFallback />
      ) : (
        <Suspense fallback={<DigitalArtifactFallback />}>
          <Spline
            scene="https://prod.spline.design/abc123def456/scene.splinecode"
            onLoad={() => setLoading(false)}
            onError={() => setError(true)}
            style={{ width: '100%', height: '100%' }}
          />
        </Suspense>
      )}
      {loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="font-mono text-xs uppercase tracking-widest text-graphite">Loading artifact…</p>
        </div>
      )}
    </div>
  );
}

export default DigitalArtifact;