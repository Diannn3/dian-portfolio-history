import React from 'react';

export function Footer() {
  return (
    <footer className="atlas-grid border-t border-hairline py-8">
      <div className="col-span-4 flex flex-wrap items-baseline justify-between gap-3 md:col-span-8 xl:col-span-12">
        <span className="mono-label">DIAN / VECTOR ATLAS · 2026</span>
        <span className="mono-label">N 14.16° / E 121.24°</span>
        <a
          className="mono-label link-underline text-ink"
          href="https://github.com/Diannn3"
          target="_blank"
          rel="noreferrer noopener"
          data-cursor="link">

          GITHUB ↗<span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </footer>);

}