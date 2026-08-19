import React from 'react';
import type { ProjectMedia } from '../../../types/project';

export function CaseMedia({ media, lead = false }: { media: ProjectMedia[]; lead?: boolean }) {
  return (
    <div className={`atlas-grid gap-y-10 ${lead ? 'mt-12 md:mt-16' : 'mt-10 md:mt-12'}`}>
      {media.map((item, index) => {
        const aspectRatio = item.aspectRatio ??
          (item.width && item.height ? `${item.width} / ${item.height}` : '16 / 10');
        const fit = item.fit ?? 'cover';

        return (
          <figure
            key={`${item.src}-${index}`}
            data-case-lead-evidence={lead ? true : undefined}
            className="col-span-4 md:col-span-8 xl:col-span-10 xl:col-start-2"
          >
            <div
              className="overflow-hidden border border-ink bg-surface"
              style={{ aspectRatio }}
            >
              {item.type === 'image' ? (
                <img
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  loading={item.priority ? 'eager' : 'lazy'}
                  fetchPriority={item.priority ? 'high' : 'auto'}
                  decoding="async"
                  className={`h-full w-full ${fit === 'contain' ? 'object-contain' : 'object-cover'}`}
                />
              ) : (
                <video
                  controls
                  preload="none"
                  poster={item.poster}
                  aria-label={item.alt}
                  className={`h-full w-full ${fit === 'contain' ? 'object-contain' : 'object-cover'}`}
                >
                  <source src={item.src} />
                </video>
              )}
            </div>
            <figcaption className="mt-3 border-t border-hairline pt-3">
              <div className="flex gap-4">
                <span className="font-mono text-micro tracking-[0.16em] text-graphite">
                  FIG / {String(index + 1).padStart(2, '0')}
                </span>
                <span className="max-w-[62ch] text-read-sm text-graphite">
                  {item.caption}
                </span>
              </div>
              {(item.proves || item.dataState || item.capturedAt || item.source) ? (
                <dl className="mt-4 grid gap-x-6 gap-y-3 border-t border-hairline pt-3 sm:grid-cols-2">
                  {item.proves ? (
                    <div>
                      <dt className="mono-label text-ink">PROVES</dt>
                      <dd className="mt-1 text-read-sm text-graphite">{item.proves}</dd>
                    </div>
                  ) : null}
                  {item.dataState ? (
                    <div>
                      <dt className="mono-label text-ink">DATA STATE</dt>
                      <dd className="mt-1 text-read-sm text-graphite">{item.dataState}</dd>
                    </div>
                  ) : null}
                  {item.capturedAt ? (
                    <div>
                      <dt className="mono-label text-ink">CAPTURED</dt>
                      <dd className="mt-1 text-read-sm text-graphite">{item.capturedAt}</dd>
                    </div>
                  ) : null}
                  {item.source ? (
                    <div>
                      <dt className="mono-label text-ink">SOURCE</dt>
                      <dd className="mt-1 break-words text-read-sm text-graphite">{item.source}</dd>
                    </div>
                  ) : null}
                </dl>
              ) : null}
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
}
