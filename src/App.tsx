import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AtlasProvider } from './contexts/AtlasContext';
import { MotionProvider } from './components/motion/MotionProvider';
import { RouteMask } from './components/motion/RouteMask';
import { AtlasRail } from './components/atlas/AtlasRail';
import { AtlasMenu } from './components/atlas/AtlasMenu';
import { Cursor } from './components/global/Cursor';
import { Footer } from './components/global/Footer';
import { Home } from './pages/Home';
import { ProjectPage } from './pages/ProjectPage';
import { NotFound } from './pages/NotFound';

export function App() {
  return (
    <BrowserRouter>
      <AtlasProvider>
        <MotionProvider>
          <div className="paper relative w-full bg-canvas">
            <a
              href="#main"
              className="sr-only z-[80] bg-ink px-4 py-2 font-mono text-label uppercase tracking-[0.14em] text-canvas focus:not-sr-only focus:absolute focus:left-4 focus:top-4">

              Skip to content
            </a>
            <AtlasRail />
            <AtlasMenu />
            <Cursor />
            <RouteMask />
            <main id="main">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/work/:slug" element={<ProjectPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </MotionProvider>
      </AtlasProvider>
    </BrowserRouter>);

}