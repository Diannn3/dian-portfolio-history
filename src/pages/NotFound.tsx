import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Seo } from '../components/global/Seo';

export function NotFound() {
  const { pathname } = useLocation();

  return (
    <main id="main" className="min-h-[78vh] pt-[8rem] md:pt-[11rem]">
      <Seo
        title="404 — Outside Defined Field / Dian"
        description="The requested coordinate does not belong to this atlas."
        path={pathname}
        noIndex
      />
      <div className="atlas-grid">
        <div className="col-span-4 border-t border-ink pt-4 md:col-span-8 xl:col-span-12">
          <span className="mono-label text-ink">404 / COORDINATE NOT FOUND</span>
        </div>
      </div>
      <div className="atlas-grid mt-10 md:mt-16">
        <h1 className="col-span-4 font-heading text-display-1 font-medium uppercase leading-[0.88] md:col-span-7 xl:col-span-9">
          Outside defined field.
        </h1>
        <p className="col-span-4 mt-8 max-w-[42ch] text-body-lg leading-[1.5] text-graphite md:col-span-5 xl:col-span-5">
          The requested coordinate is not part of this atlas. The route may have moved, or it may never have existed.
        </p>
        <div className="col-span-4 mt-10 md:col-span-4 xl:col-span-4">
          <Link
            to="/"
            className="link-underline inline-flex items-center gap-2 font-mono text-label uppercase tracking-[0.16em] text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
            Return to origin
          </Link>
        </div>
      </div>
    </main>
  );
}
