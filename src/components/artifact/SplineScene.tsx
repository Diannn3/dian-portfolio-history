import React, { useEffect, useState } from 'react';
import { ArtifactFallback } from './ArtifactFallback';

const VIEWER_SRC = 'https://unpkg.com/@splinetool/viewer@1.9.28/build/spline-viewer.js';

let loading: Promise<void> | null = null;

/** Module-level singleton: exactly one Spline runtime is ever injected. */
function loadViewer() {
  if (loading) return loading;
  loading = new Promise<void>((resolve, reject) => {
    if (document.querySelector(`script[src="${VIEWER_SRC}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.type = 'module';
    script.src = VIEWER_SRC;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('spline viewer failed to load'));
    document.head.appendChild(script);
  });
  return loading;
}

/**
 * Spline has exactly one job on this site, and it only does it when a real
 * published scene exists. The runtime is never in the route bundle, only one
 * instance is ever mounted, and every failure path lands on the procedural
 * artifact rather than an empty frame.
 */
export function SplineScene({ url, reduced }: {url: string;reduced: boolean;}) {
  const [state, setState] = useState<'loading' | 'ready' | 'failed'>('loading');

  useEffect(() => {
    let alive = true;
    loadViewer().
    then(() => {
      if (alive) setState('ready');
    }).
    catch(() => {
      if (alive) setState('failed');
    });
    return () => {
      alive = false;
    };
  }, []);

  if (state === 'failed') return <ArtifactFallback />;

  return (
    <div
      className="h-full w-full"
      data-cursor="rotate"
      style={{ pointerEvents: reduced ? 'none' : 'auto' }}>
      
      {state === 'loading' ?
      <div className="h-full w-full opacity-40">
          <ArtifactFallback />
        </div> :

      React.createElement('spline-viewer', {
        url,
        'events-target': reduced ? 'local' : 'global',
        style: { width: '100%', height: '100%' }
      })
      }
    </div>);

}