import React, { useEffect, useState } from 'react';
import { ArtifactFallback } from './ArtifactFallback';

const VIEWER_SRC = 'https://unpkg.com/@splinetool/viewer@1.9.28/build/spline-viewer.js';

let loading: Promise<void> | null = null;

/** Loads the Spline viewer element once, on demand. No bundled dependency. */
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
 * Spline island. Only rendered when data/site.ts SPLINE_SCENE_URL is set, so
 * nothing is fetched for an empty slot. Falls back to the static instrument
 * drawing if the viewer or scene cannot load; reduced motion makes it inert.
 */
export function SplineScene({ url, reduced }: {url: string;reduced: boolean;}) {
  const [state, setState] = useState<'loading' | 'ready' | 'failed'>('loading');

  useEffect(() => {
    let alive = true;
    loadViewer().
    then(() => alive && setState('ready')).
    catch(() => alive && setState('failed'));
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