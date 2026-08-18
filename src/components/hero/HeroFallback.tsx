import React from 'react';

/**
 * SVG fallback: coordinate grid, streamline illustration and manifold outline.
 * Used when WebGL is unavailable or the canvas fails. The hero remains a
 * complete composition without it.
 */
export function HeroFallback() {
  const contours = [0, 1, 2, 3, 4, 5, 6];
  return (
    <svg
      viewBox="0 0 800 600"
      className="h-full w-full"
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMid slice">
      
      <g stroke="var(--hairline)" strokeWidth="1">
        {Array.from({ length: 13 }).map((_, i) =>
        <line key={`v${i}`} x1={60 + i * 56} y1="70" x2={60 + i * 56} y2="530" />
        )}
        {Array.from({ length: 9 }).map((_, i) =>
        <line key={`h${i}`} x1="60" y1={70 + i * 57.5} x2="732" y2={70 + i * 57.5} />
        )}
      </g>
      <g fill="none" stroke="var(--ink)" strokeOpacity="0.5" strokeWidth="1.1">
        {contours.map((i) =>
        <path
          key={i}
          d={`M110 ${330 - i * 16} C 250 ${240 - i * 26}, 330 ${420 - i * 10}, 420 ${330 - i * 18} S 620 ${
          200 - i * 22}, 700 ${
          300 - i * 14}`} />

        )}
      </g>
      <g fill="none" stroke="var(--accent)" strokeWidth="1.4" strokeOpacity="0.75">
        <path d="M80 470 C 220 430, 260 300, 400 286 S 610 320, 720 210" />
        <path d="M96 512 C 260 500, 300 360, 452 340 S 640 380, 736 268" strokeOpacity="0.4" />
      </g>
      <g fill="var(--ink)">
        <circle cx="400" cy="286" r="3" />
        <circle cx="452" cy="340" r="2" fillOpacity="0.5" />
      </g>
    </svg>);

}