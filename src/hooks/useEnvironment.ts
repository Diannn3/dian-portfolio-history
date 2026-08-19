import { useEffect, useState } from 'react';
import { profiles, type QualityProfile } from '../lib/webgl/sceneState';

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

export function usePointerFine() {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    setFine(mq.matches);
    const onChange = () => setFine(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return fine;
}

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
    window.WebGLRenderingContext && (
    canvas.getContext('webgl2') || canvas.getContext('webgl')));

  } catch {
    return false;
  }
}

/**
 * Quality is inferred from lightweight capability signals (WebGL support,
 * memory, CPU cores, DPR and pointer type) — never from viewport width alone.
 */
export function useQuality(): {supported: boolean;profile: QualityProfile;} {
  const [state, setState] = useState<{supported: boolean;profile: QualityProfile;}>({
    supported: true,
    profile: profiles.medium
  });

  useEffect(() => {
    const supported = detectWebGL();
    if (!supported) {
      setState({ supported: false, profile: profiles.low });
      return;
    }
    const nav = navigator as Navigator & {deviceMemory?: number;hardwareConcurrency?: number;};
    const cores = nav.hardwareConcurrency ?? 4;
    const mem = (nav as unknown as {deviceMemory?: number;}).deviceMemory ?? 4;
    const coarse = window.matchMedia('(pointer: coarse)').matches;

    let tier: 'low' | 'medium' | 'high' = 'medium';
    if (cores <= 4 || mem <= 2) tier = 'low';
    if (!coarse && cores >= 8 && window.devicePixelRatio <= 2.5) tier = 'high';

    setState({ supported: true, profile: profiles[tier] });
  }, []);

  return state;
}

/**
 * Mounts a spatial island only once it is genuinely worth mounting: near the
 * viewport, and after the browser has had an idle moment.
 */
export function useNearViewport(
ref: React.RefObject<HTMLElement>,
rootMargin = '200px')
: boolean {
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          const idle =
          (window as unknown as {requestIdleCallback?: (cb: () => void) => number;}).
          requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
          idle(() => setNear(true));
          io.disconnect();
        }
      },
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);
  return near;
}

/** True while the element is on screen. Used to stop render loops. */
export function useInViewport(
ref: React.RefObject<HTMLElement>,
threshold = 0.05)
: boolean {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => setInView(entries[0]?.isIntersecting ?? false), {
      threshold
    });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold]);
  return inView;
}