import React from 'react';

type Verb = 'fade' | 'settle' | 'clip' | 'draw';

interface Props {
  /** which verb of the motion vocabulary this block uses */
  as?: Verb;
  className?: string;
  children?: React.ReactNode;
  /** render as something other than a div */
  element?: keyof JSX.IntrinsicElements;
}

const ATTR: Record<Verb, string> = {
  fade: 'data-fade',
  settle: 'data-settle',
  clip: 'data-clip',
  draw: 'data-draw'
};

/**
 * Declarative entry into the shared reveal system. The actual tweens are built
 * once per page by useReveals() inside a single gsap.context, so nothing here
 * creates its own ScrollTrigger and nothing leaks on unmount.
 */
export function Reveal({ as = 'fade', className, children, element = 'div' }: Props) {
  const Tag = element as React.ElementType;
  const attrs = { [ATTR[as]]: '' } as Record<string, string>;
  return (
    <Tag className={className} {...attrs}>
      {children}
    </Tag>);

}

/** A hairline that draws itself along its axis. VECTOR DRAW. */
export function VectorRule({
  className = '',
  tone = 'hairline'



}: {className?: string;tone?: 'hairline' | 'ink' | 'accent';}) {
  const colour =
  tone === 'ink' ? 'bg-ink' : tone === 'accent' ? 'bg-accent' : 'bg-hairline';
  return <span aria-hidden="true" data-draw className={`block h-[1px] w-full ${colour} ${className}`} />;
}