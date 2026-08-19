import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AtlasProvider } from './contexts/AtlasContext';
import { MotionProvider } from './components/motion/MotionProvider';
import { RouteMask } from './components/motion/RouteMask';
import { AtlasRail } from './components/atlas/AtlasRail';
import { AtlasMenu } from './components/atlas/AtlasMenu';
import { Cursor } from './components/global/Cursor';
import { Footer } from './components/global/Footer';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';
import { loadProjectPage } from './lib/navigation/projectPrefetch';
import { getLenis } from './lib/motion/smoothScroll';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const ProjectPage = lazy(loadProjectPage);

/**
 * Preserve direct hash/deep-link behavior independently from the visual rail.
 * Lenis owns smooth scrolling on desktop; native scrolling remains the fallback.
 */
function RouteLifecycle() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    let cancelled = false;
    let timer = 0;
    let attempts = 0;

    const scrollToRoutePosition = () => {
      if (cancelled) return;

      if (hash) {
        const id = decodeURIComponent(hash.slice(1));
        const target = document.getElementById(id);
        if (target) {
          const lenis = getLenis();
          if (lenis) lenis.scrollTo(target, { offset: -96, immediate: false });
          else target.scrollIntoView({ block: 'start' });
          ScrollTrigger.refresh();
          return;
        }

        // Project content is lazy: allow the requested chapter to mount before
        // treating the hash as missing. This also makes direct deep links robust.
        if (attempts < 20) {
          attempts += 1;
          timer = window.setTimeout(scrollToRoutePosition, 50);
          return;
        }
      }

      const lenis = getLenis();
      if (lenis) lenis.scrollTo(0, { immediate: true });
      else window.scrollTo({ top: 0, left: 0 });
      ScrollTrigger.refresh();
    };

    timer = window.setTimeout(scrollToRoutePosition, 40);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [pathname, hash]);

  return null;
}

function ProjectRoute() {
  return (
    <Suspense
      fallback={
        <main id="main" className="min-h-[70vh] pt-[8rem]" aria-label="Loading project" aria-busy="true" />
      }
    >
      <ProjectPage />
    </Suspense>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AtlasProvider>
        <MotionProvider>
          <div className="paper relative min-h-screen w-full bg-canvas text-ink">
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:border focus:border-ink focus:bg-canvas focus:px-4 focus:py-2 focus:font-mono focus:text-label focus:uppercase"
            >
              Skip to content
            </a>
            <Cursor />
            <AtlasRail />
            <AtlasMenu />
            <RouteMask />
            <RouteLifecycle />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/work/:slug" element={<ProjectRoute />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </div>
        </MotionProvider>
      </AtlasProvider>
    </BrowserRouter>
  );
}
