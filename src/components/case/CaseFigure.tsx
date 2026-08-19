import React from 'react';
import type { ProjectMedia } from '../../types/project';

interface Props {
  figure: string;
  media: ProjectMedia;
}

/**
 * Atlas figure frame for real interface evidence: index, title, the image at its
 * own dimensions, caption and technical note. No device chrome, no mockups.
 * Only genuine captures should ever be passed in here.
 */
export function CaseFigure({ figure, media }: Props) {
  return (
    <figure className="m-0 border border-hairline bg-surface/30">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-3 border-b border-hairline px-3 py-2">
        <span className="mono-label">{figure}</span>
        <span className="mono-label">INTERFACE CAPTURE</span>
      </figcaption>
      <div
        className="w-full bg-canvas"
        style={{ aspectRatio: media.aspectRatio ?? (media.width && media.height ? `${media.width} / ${media.height}` : '16 / 10') }}>

        {media.type === 'image' ?
        <img
          src={media.src}
          alt={media.alt}
          width={media.width}
          height={media.height}
          loading={media.priority ? 'eager' : 'lazy'}
          decoding="async"
          className={`h-full w-full ${media.fit === 'cover' ? 'object-cover' : 'object-contain'}`} /> :


        <video
          src={media.src}
          poster={media.poster}
          controls
          preload="none"
          className="h-full w-full object-contain">

            <track kind="captions" />
          </video>
        }
      </div>
      <p className="border-t border-hairline px-3 py-2 text-read-sm text-graphite">{media.caption}</p>
    </figure>);

}