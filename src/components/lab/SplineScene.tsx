import React, { useEffect, useState } from 'react';

const VIEWER_SRC = 'https://unpkg.com/@splinetool/viewer@1.9.28/build/spline-viewer.js';

interface Props {
  url: string;
}

/**
 * Mounts a published Spline scene through the official viewer element, which is
 * fetched at runtime only when a real scene URL exists. Nothing is bundled and
 * no placeholder scene is ever substituted.
 */
export function SplineScene({ url }: Props) {
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    if (!url) return;
    let cancelled = false;

    const existing = document.querySelector<HTMLScriptElement>('script[data-spline-viewer]');
    if (existing?.dataset.loaded === 'true') {
      setState('ready');
      return;
    }

    const script = existing ?? document.createElement('script');
    const onLoad = () => {
      script.dataset.loaded = 'true';
      if (!cancelled) setState('ready');
    };
    const onError = () => {
      if (!cancelled) setState('error');
    };

    script.addEventListener('load', onLoad);
    script.addEventListener('error', onError);

    if (!existing) {
      script.type = 'module';
      script.src = VIEWER_SRC;
      script.dataset.splineViewer = 'true';
      document.head.appendChild(script);
    }

    return () => {
      cancelled = true;
      script.removeEventListener('load', onLoad);
      script.removeEventListener('error', onError);
    };
  }, [url]);

  if (state === 'error')
  return (
    <p className="mono-label p-4 text-accent">
        VIEWER FAILED TO LOAD — SCENE NOT DISPLAYED
      </p>);


  if (state === 'loading')
  return <p className="mono-label p-4">LOADING VIEWER…</p>;

  /* custom element: created imperatively so no ambient JSX typing is invented */
  return React.createElement('spline-viewer', {
    url,
    'aria-hidden': 'true',
    style: { width: '100%', height: '100%', display: 'block' }
  });
}