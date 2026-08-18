import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { Nav } from './components/global/Nav';
import { Cursor } from './components/global/Cursor';
import { Footer } from './components/global/Footer';
import { Home } from './pages/Home';
import { ProjectPage } from './pages/ProjectPage';
import { initSmoothScroll } from './lib/motion/smoothScroll';
import { registerGsap } from './lib/motion/reveal';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

function RouteLifecycle() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        window.setTimeout(() => el.scrollIntoView({ block: 'start' }), 60);
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0 });
    window.setTimeout(() => ScrollTrigger.refresh(), 180);
  }, [pathname, hash]);

  return null;
}

export function App() {
  useEffect(() => {
    registerGsap();
    const destroy = initSmoothScroll();
    return () => destroy();
  }, []);

  return (
    <BrowserRouter>
      <div className="paper relative min-h-screen w-full bg-canvas text-ink">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:border focus:border-ink focus:bg-canvas focus:px-4 focus:py-2 focus:font-mono focus:text-label focus:uppercase">
          
          Skip to content
        </a>
        <Cursor />
        <Nav />
        <RouteLifecycle />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work/:slug" element={<ProjectPage />} />
          <Route path="*" element={<Home />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>);

}