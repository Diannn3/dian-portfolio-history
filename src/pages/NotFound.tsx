import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAtlas } from '../contexts/AtlasContext';
import { projectCatalog } from '../data/projectCatalog';

export function NotFound() {
  const { setMode, setProject, setChapter, registerSections } = useAtlas();

  useEffect(() => {
    setMode('content');
    setProject(null);
    setChapter(null);
    registerSections([]);
  }, [setMode, setProject, setChapter, registerSections]);

  return (
    <div className="min-h-[100svh] pt-28">
      <div className="atlas-grid">
        <div className="col-span-4 md:col-span-8 xl:col-span-12">
          <span className="block h-[1px] w-full bg-hairline" />
          <div className="flex flex-wrap items-baseline justify-between gap-4 pt-5">
            <span className="mono-label text-accent">ERR / 404</span>
            <span className="mono-label">OUT OF ATLAS BOUNDS</span>
          </div>
          <h1 className="mt-10 font-heading text-display-1 font-medium uppercase text-ink">
            No plate at
            <br />
            this coordinate.
          </h1>
          <p className="mt-6 max-w-[52ch] text-read text-graphite">
            The route you requested is not part of this atlas. The four project plates below are the
            complete index.
          </p>
        </div>
      </div>

      <div className="atlas-grid pt-14">
        <ul className="col-span-4 border-t border-hairline md:col-span-8 xl:col-span-8">
          {projectCatalog.map((p) =>
          <li key={p.slug} className="border-b border-hairline">
              <Link
              to={`/work/${p.slug}`}
              className="flex items-baseline gap-4 py-5"
              data-cursor="row">

                <span className="mono-label w-7 text-accent">{p.index}</span>
                <span className="font-heading text-display-3 font-medium uppercase text-ink">
                  {p.title}
                </span>
                <span className="mono-label ml-auto">{p.status}</span>
              </Link>
            </li>
          )}
        </ul>
      </div>

      <div className="atlas-grid py-14">
        <Link
          to="/"
          className="mono-label link-underline col-span-4 text-ink md:col-span-8 xl:col-span-12"
          data-cursor="link">

          ← RETURN TO INDEX
        </Link>
      </div>
    </div>);

}