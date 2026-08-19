import { subscribeTick } from './ticker';

export interface SectionMeta {
  id: string;
  /** two-digit index shown in the rail */
  index: string;
  /** short rail label, uppercase */
  label: string;
  /** rail nav target, when the section is a top-level destination */
  nav?: string;
}

interface Entry extends SectionMeta {
  el: HTMLElement;
}

const entries: Entry[] = [];
const listeners = new Set<(id: string | null) => void>();
let observer: IntersectionObserver | null = null;
let activeId: string | null = null;

/**
 * Continuous values are written into this mutable record and read on the shared
 * ticker. React state is only ever used for the DISCRETE active section, which
 * changes a handful of times per page — never per scrolled pixel.
 */
export const scrollState = {
  /** document scroll progress 0 → 1 */
  progress: 0,
  /** 1 = down, -1 = up */
  direction: 1,
  /** raw scrollY, so consumers do not each read layout */
  y: 0
};

let tickerAttached = 0;
let detachTicker: (() => void) | null = null;

function attachProgress() {
  tickerAttached += 1;
  if (detachTicker) return;
  let last = window.scrollY;
  detachTicker = subscribeTick(() => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    scrollState.y = y;
    scrollState.progress = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
    if (Math.abs(y - last) > 0.5) {
      scrollState.direction = y > last ? 1 : -1;
      last = y;
    }
  });
}

function releaseProgress() {
  tickerAttached -= 1;
  if (tickerAttached <= 0 && detachTicker) {
    detachTicker();
    detachTicker = null;
    tickerAttached = 0;
  }
}

function ensureObserver() {
  if (observer) return observer;
  observer = new IntersectionObserver(
    () => {
      /* Choose the section whose top edge is closest to just below the rail.
         Cheap, stable, and it does not fight sticky stages. */
      const anchor = window.innerHeight * 0.32;
      let best: Entry | null = null;
      let bestScore = Infinity;
      for (const entry of entries) {
        const rect = entry.el.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) continue;
        const score = Math.abs(rect.top - anchor);
        if (score < bestScore) {
          bestScore = score;
          best = entry;
        }
      }
      const next = best?.id ?? null;
      if (next !== activeId) {
        activeId = next;
        listeners.forEach((fn) => fn(activeId));
      }
    },
    { threshold: [0, 0.08, 0.2, 0.4, 0.6, 0.85, 1] }
  );
  return observer;
}

export function registerSection(el: HTMLElement, meta: SectionMeta) {
  const entry: Entry = { ...meta, el };
  entries.push(entry);
  const io = ensureObserver();
  io.observe(el);
  attachProgress();
  return () => {
    const i = entries.indexOf(entry);
    if (i >= 0) entries.splice(i, 1);
    io.unobserve(el);
    releaseProgress();
    if (activeId === entry.id) {
      activeId = null;
      listeners.forEach((fn) => fn(null));
    }
  };
}

export function subscribeSection(fn: (id: string | null) => void) {
  listeners.add(fn);
  fn(activeId);
  return () => listeners.delete(fn);
}

export function getSection(id: string | null) {
  if (!id) return null;
  return entries.find((entry) => entry.id === id) ?? null;
}

export function listSections() {
  return entries.map(({ id, index, label, nav }) => ({ id, index, label, nav }));
}

export function clearSections() {
  entries.length = 0;
  activeId = null;
  listeners.forEach((fn) => fn(null));
}