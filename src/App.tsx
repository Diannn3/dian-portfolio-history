import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { MotionProvider } from './lib/motion/MotionProvider';
import { ScrollTrigger } from './lib/motion/gsap';
import { scrollToTarget } from './lib/motion/scroll';
import { clearSections } from './lib/motion/section-state';
import { loadProjectPage } from './lib/navigation/projectPrefetch';
import { AtlasRail } from './components/global/AtlasRail';
import { Cursor } from './components/global/Cursor';
import { Footer } from './components/global/Footer';
import { RouteMask } from './components/motion/RouteMask';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';

const ProjectPage = lazy(loadProjectPage);

/**
 * Scroll restoration and anchor handling. Deliberately native: hashes resolve to
 * real elements, a fresh route starts at the top, and ScrollTrigger is refreshed
 * once the new layout has settled so no trigger is measured against the old page.
 */
function RouteLifecycle() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    clearSections();
    if (hash) {
      const id = window.setTimeout(() => scrollToTarget(hash, -80), 80);
      const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 240);
      return () => {
        window.clearTimeout(id);
        window.clearTimeout(refresh);
      };
    }
    window.scrollTo({ top: 0, left: 0 });
    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 180);
    return () => window.clearTimeout(refresh);
  }, [pathname, hash]);

  return null;
}

function ProjectRoute() {
  return (
    <Suspense
      fallback={<main id="main" className="min-h-[70vh] pt-[8rem]" aria-label="Loading project" />}>
      
      <ProjectPage />
    </Suspense>);

}

export function App() {
  return (
    <MotionProvider>
      <BrowserRouter>
        <div className="paper relative min-h-screen w-full bg-canvas text-ink">
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:border focus:border-ink focus:bg-canvas focus:px-4 focus:py-2 focus:font-mono focus:text-label focus:uppercase">
            
            Skip to content
          </a>
          <Cursor />
          <AtlasRail />
          <RouteMask />
          <RouteLifecycle />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/work/:slug" element={<ProjectRoute />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </MotionProvider>);

}