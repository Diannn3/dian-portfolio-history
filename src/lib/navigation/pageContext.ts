import { useEffect, useState } from 'react';

export interface PageContext {
  kind: 'home' | 'project' | 'other';
  /** project or page title, shown in the rail once the reader has scrolled */
  title?: string;
  index?: string;
  status?: string;
  accent?: string;
  backTo?: string;
  backLabel?: string;
  nextTo?: string;
  nextLabel?: string;
}

const initial: PageContext = { kind: 'home' };

let current: PageContext = initial;
const listeners = new Set<(ctx: PageContext) => void>();

/**
 * The rail lives above the router outlet, so route-level context reaches it
 * through this tiny store rather than through React context. Set once per route,
 * never per frame.
 */
export function setPageContext(next: PageContext) {
  current = next;
  listeners.forEach((fn) => fn(current));
}

export function resetPageContext() {
  setPageContext(initial);
}

export function usePageContext(): PageContext {
  const [ctx, setCtx] = useState(current);
  useEffect(() => {
    const fn = (next: PageContext) => setCtx(next);
    listeners.add(fn);
    fn(current);
    return () => {
      listeners.delete(fn);
    };
  }, []);
  return ctx;
}