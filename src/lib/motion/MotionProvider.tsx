import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { registerGsap, ScrollTrigger } from './gsap';
import { initSmoothScroll } from './scroll';
import { PROFILE_QUERIES, resolveProfile, type MotionProfile } from './preferences';

interface MotionContextValue {
  profile: MotionProfile;
  reduced: boolean;
  /** fine pointer with hover — the only condition where pointer effects run */
  fine: boolean;
}

const MotionContext = createContext<MotionContextValue>({
  profile: resolveProfile(),
  reduced: false,
  fine: false
});

/**
 * The motion architecture's root. Registers GSAP once, owns the single Lenis
 * instance, resolves the active motion profile and refreshes ScrollTrigger when
 * the profile flips (rotation, resize, reduced-motion toggled mid-session).
 *
 * Nothing else in the codebase is allowed to create a scroll smoother or a
 * requestAnimationFrame loop.
 */
export function MotionProvider({ children }: {children: React.ReactNode;}) {
  const [profile, setProfile] = useState<MotionProfile>(() => resolveProfile());

  useEffect(() => {
    registerGsap();
    const destroy = initSmoothScroll();
    return () => destroy();
  }, []);

  useEffect(() => {
    const queries = PROFILE_QUERIES.map((q) => window.matchMedia(q));
    const onChange = () => {
      const next = resolveProfile();
      setProfile((prev) => prev.name === next.name ? prev : next);
      window.setTimeout(() => ScrollTrigger.refresh(), 120);
    };
    onChange();
    queries.forEach((q) => q.addEventListener('change', onChange));
    return () => queries.forEach((q) => q.removeEventListener('change', onChange));
  }, []);

  const value = useMemo<MotionContextValue>(
    () => ({
      profile,
      reduced: profile.name === 'REDUCED_MOTION',
      fine: profile.pointer
    }),
    [profile]
  );

  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
}

export function useMotion() {
  return useContext(MotionContext);
}