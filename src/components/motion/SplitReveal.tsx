import React from 'react';

interface Props {
  /** one string per typographic line — the caller controls the break points */
  lines: string[];
  className?: string;
  /** heading level, or a plain block */
  element?: 'h1' | 'h2' | 'h3' | 'p' | 'div';
  id?: string;
  /** accent-coloured line indices */
  accentLines?: number[];
}

/**
 * CLIP REVEAL for typography. Each line is masked by its own overflow-hidden
 * box and rises into place, staggered. The DOM keeps one readable heading — the
 * split is per line, never per character, so screen readers and text selection
 * are unaffected.
 */
export function SplitReveal({
  lines,
  className = '',
  element = 'h2',
  id,
  accentLines = []
}: Props) {
  const Tag = element as React.ElementType;
  return (
    <Tag id={id} className={className} data-reveal-group>
      {lines.map((line, i) =>
      <span className="reveal-line" data-reveal key={`${line}-${i}`}>
          <span className={accentLines.includes(i) ? 'text-accent' : undefined}>{line}</span>
        </span>
      )}
    </Tag>);

}

/**
 * Word-level variant, used only for the About statement where the words need to
 * wrap and settle independently.
 */
export function SplitWords({ text, className = '' }: {text: string;className?: string;}) {
  return (
    <p className={className} data-reveal-group>
      {text.split(' ').map((word, i) =>
      <span className="reveal-line inline-block" data-reveal key={`${word}-${i}`}>
          <span className="pr-[0.28em]">{word}</span>
        </span>
      )}
    </p>);

}