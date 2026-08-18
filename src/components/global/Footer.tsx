import React from 'react';

export function Footer() {
  return (
    <footer className="mt-20 pb-8">
      <div className="atlas-grid">
        <div className="col-span-4 flex flex-col gap-2 border-t border-hairline pt-4 md:col-span-8 md:flex-row md:items-center md:justify-between xl:col-span-12">
          <span className="mono-label">DIAN / VECTOR ATLAS — 2026</span>
          <span className="mono-label">
            BUILT WITH REACT · THREE.JS · GSAP · TAILWIND
          </span>
          <span className="mono-label">N 14.16° / E 121.24°</span>
        </div>
      </div>
    </footer>);

}