import React from 'react';
import type { ProjectMedia } from '../../../types/project';

export function CaseMedia({ media }: { media: ProjectMedia[] }) {
  return (
    <div className="atlas-grid mt-10 gap-y-10 md:mt-12">
      {media.map((item, index) => (
        <figure
          key={`${item.src}-${index}`}
          className="col-span-4 md:col-span-8 xl:col-span-10 xl:col-start-2"
        >
          <div
            className="overflow-hidden border border-ink bg-surface"
            style={{ aspectRatio: item.aspectRatio ?? '16 / 10' }}
          >
            {item.type === 'image' ? (
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            ) : (
              <video
                controls
                preload="none"
                poster={item.poster}
                aria-label={item.alt}
                className="h-full w-full object-cover"
              >
                <source src={item.src} />
              </video>
            )}
          </div>
          <figcaption className="mt-3 flex gap-4 border-t border-hairline pt-3">
            <span className="font-mono text-micro tracking-[0.16em] text-graphite">
              FIG / {String(index + 1).padStart(2, '0')}
            </span>
            <span className="max-w-[62ch] text-[0.86rem] leading-relaxed text-graphite">
              {item.caption}
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
