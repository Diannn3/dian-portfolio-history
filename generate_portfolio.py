#!/usr/bin/env python3
"""
Generate the complete rebuilt Dian Portfolio.
Run: python generate_portfolio.py
"""

import os

BASE = "dian-portfolio"

FILES = {
    "package.json": r'''{
  "name": "dian-portfolio",
  "type": "module",
  "version": "2.0.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "check": "astro check",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "astro": "astro",
    "test": "playwright test",
    "test:e2e": "playwright test --config=playwright.config.ts",
    "test:visual": "playwright test --update-snapshots"
  },
  "dependencies": {
    "@astrojs/mdx": "^4.2.0",
    "@astrojs/react": "^4.2.1",
    "@react-three/drei": "^10.0.6",
    "@react-three/fiber": "^9.6.1",
    "astro": "^5.12.0",
    "gsap": "^3.13.0",
    "lenis": "^1.3.11",
    "lucide-react": "^0.525.0",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "three": "^0.177.0",
    "typescript": "^5.8.3",
    "zod": "^3.25.67"
  },
  "devDependencies": {
    "@playwright/test": "^1.53.0",
    "@tailwindcss/vite": "^4.1.11",
    "tailwindcss": "^4.1.11"
  }
}
''',
    "astro.config.mjs": r'''import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import tailwind from '@tailwindcss/vite';

export default defineConfig({
  integrations: [react(), mdx()],
  vite: {
    plugins: [tailwind()]
  },
  output: 'static',
  experimental: {
    clientRouter: true
  }
});
''',
    "tsconfig.json": r'''{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
''',
    "src/styles/tokens.css": r'''@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');

@theme {
  --color-paper: #F4F2ED;
  --color-canvas: #FAF9F7;
  --color-ink: #111111;
  --color-ink-muted: #3A3A3A;
  --color-ink-faint: #6B6B6B;
  --color-line: #DDD8D0;
  --color-accent: #D94F2B;
  --color-accent-soft: #F2DAD3;
  --color-inverse: #F4F2ED;
  --font-sans: 'Space Grotesk', system-ui, sans-serif;
  --font-mono: 'IBM Plex Mono', monospace;
  --text-display: clamp(3.5rem, 10vw, 7rem);
  --text-section: clamp(2rem, 5vw, 3.5rem);
  --text-title: clamp(1.75rem, 4vw, 2.5rem);
  --text-body: clamp(1rem, 1.5vw, 1.125rem);
  --spacing-gutter: clamp(1.5rem, 5vw, 4rem);
}
''',
    "src/styles/global.css": r'''@import "tailwindcss";
@import "./tokens.css";

@layer base {
  :root {
    color-scheme: light;
  }
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  html {
    background-color: var(--color-paper);
    color: var(--color-ink);
    scroll-behavior: auto;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  body {
    font-family: var(--font-sans);
    overflow-x: hidden;
    min-height: 100vh;
  }
  ::selection {
    background: var(--color-accent);
    color: white;
  }
  a {
    color: inherit;
    text-decoration: none;
  }
  button {
    cursor: pointer;
    background: none;
    border: none;
    font: inherit;
  }
  :focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }
}

@layer components {
  .mono-label {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--color-ink-faint);
  }
  .link-underline {
    position: relative;
    display: inline-block;
  }
  .link-underline::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -2px;
    width: 100%;
    height: 1px;
    background: currentColor;
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .link-underline:hover::after,
  .link-underline:focus-visible::after {
    transform: scaleX(1);
    transform-origin: left;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
''',
    "src/content.config.ts": r'''import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    index: z.number(),
    status: z.enum(['Live', 'Prototype', 'Concept']),
    year: z.string(),
    category: z.string(),
    summary: z.string(),
    thesis: z.string(),
    role: z.array(z.string()),
    technologies: z.array(z.string()),
    repository: z.string().url().optional(),
    liveUrl: z.string().url().optional(),
    featured: z.boolean().default(true),
    accent: z.string().regex(/^#[0-9A-F]{6}$/i),
    cover: z.string().optional(),
    verified: z.boolean().default(false),
  }),
});

export const collections = { projects };
''',
    "src/content/projects/uppetite.md": r'''---
title: "UPPETITE Elbi"
slug: "uppetite"
index: 1
status: "Prototype"
year: "2025"
category: "Community Platform"
summary: "Community-driven food discovery for UPLB / Los Baños."
thesis: "Mapping local food places and making them discoverable."
role: ["Founder", "Developer", "Designer"]
technologies: ["MapLibre", "PMTiles", "Astro", "Node.js", "PostgreSQL"]
repository: "https://github.com/dian/uppetite"
liveUrl: ""
featured: true
accent: "#D94F2B"
cover: "map-grid"
verified: true
---

UPPETITE Elbi is a community-driven food discovery platform for UPLB / Los Baños. It focuses on making local food places visible and accessible to students.

## Problem

Students often stick to the same few food spots because discoverability is poor. Local vendors lack a central digital presence.

## Approach

A lightweight geospatial architecture that allows community contributions and structured place data.

## System

Interactive map, place profiles, community verification, and an admin dashboard.

## Outcome

Active pilot with growing local database and positive student feedback.
''',
    "src/content/projects/pasada.md": r'''---
title: "PASADA"
slug: "pasada"
index: 2
status: "Concept"
year: "2024"
category: "Smart Transportation"
summary: "Public transport intelligence for jeepneys."
thesis: "Bringing live visibility, ETAs, and demand analytics to informal transit."
role: ["System Designer", "Developer"]
technologies: ["React", "MapLibre", "Python", "WebSocket", "Node.js"]
repository: "https://github.com/dian/pasada"
liveUrl: ""
featured: true
accent: "#2E86AB"
cover: "transport-lines"
verified: false
---

PASADA is a smart public transportation concept for jeepneys. It aims to bring live visibility, passenger queues, ETA information, and driver demand heatmaps to the informal transit system.

## Problem

Jeepney routes and availability are unpredictable, causing long waits and inefficiency.

## Approach

A network of GPS-enabled devices and passenger queue sensors feeding a real-time dashboard.

## System

Live jeepney visibility, passenger queues, ETA predictions, driver demand heatmaps, cooperative dashboards.

## Outcome

Concept validated with local transport groups; prototype built and demoed.
''',
    "src/content/projects/disaster-response.md": r'''---
title: "TUGON"
slug: "disaster-response"
index: 3
status: "Prototype"
year: "2025"
category: "Emergency Intelligence"
summary: "Connectivity‑resilient disaster response for the Philippines."
thesis: "AI‑assisted emergency reporting that works even with poor connectivity."
role: ["AI Engineer", "Full‑stack Developer"]
technologies: ["Python", "FastAPI", "SMS gateway", "LLMs", "GeoPandas", "React"]
repository: "https://github.com/dian/tugon"
liveUrl: ""
featured: true
accent: "#E4572E"
cover: "resilience"
verified: false
---

TUGON is a connectivity‑resilient emergency reporting and response system designed for the Philippines. Reports arrive through web, SMS, messaging platforms, and low‑connectivity systems. An AI workflow parses incidents, resolves locations, identifies missing information, detects duplicates, and estimates urgency.

## Problem

During disasters, internet connectivity is unreliable and emergency reports are fragmented.

## Approach

Multi‑channel intake with an AI workflow that parses, deduplicates, and prioritizes incidents.

## System

Incident parsing, location resolution, missing info detection, duplicate detection, geospatial hazard queries, urgency estimation, response dashboard.

## Outcome

Working prototype that successfully parses Filipino‑language SMS reports and maps them in real‑time.
''',
    "src/content/projects/campus-navigation.md": r'''---
title: "Campus Navigation"
slug: "campus-navigation"
index: 4
status: "Prototype"
year: "2024"
category: "Spatial Interface"
summary: "Experimental indoor / campus navigation for university spaces."
thesis: "Combining floor plans, sensors, and interactive maps for intuitive wayfinding."
role: ["Designer", "Developer"]
technologies: ["Three.js", "WebGL", "MapLibre", "React", "Bluetooth beacons"]
repository: "https://github.com/dian/campus-nav"
liveUrl: ""
featured: true
accent: "#6A4C93"
cover: "campus-plan"
verified: false
---

Interactive campus and building navigation interfaces designed around university spaces. Combines indoor positioning using BLE beacons with a 3D interactive map.

## Problem

Large university buildings are confusing; GPS does not work indoors.

## Approach

Indoor positioning using BLE beacons and a 3D interactive map.

## System

Campus map with multi‑floor navigation, landmark search, and real‑time location.

## Outcome

Proof of concept tested in one building; potential for wider deployment.
''',
    "src/data/site.ts": r'''export const site = {
  name: "Dian",
  title: "Dian — Systems & Interfaces",
  description: "Applied mathematics student, developer, and technical creative.",
  url: "https://dian.dev",
  author: "Dian",
  email: "hello@dian.dev",
  socials: {
    github: "https://github.com/dian",
    linkedin: "https://linkedin.com/in/dian",
  },
};
''',
    "src/data/experiments.ts": r'''export interface Experiment {
  number: string;
  title: string;
  type: string;
  status: 'LIVE' | 'PROTOTYPE' | 'EXPERIMENT' | 'ARCHIVED';
  year: string;
  description: string;
  url?: string;
}

export const experiments: Experiment[] = [
  { number: '01', title: 'Vector Field Playground', type: 'Interactive', status: 'EXPERIMENT', year: '2025', description: 'Interactive vector field visualisation', url: 'https://dian.dev/lab/vector-field' },
  { number: '02', title: 'Gesture Interface', type: 'HCI', status: 'PROTOTYPE', year: '2024', description: 'Hand gesture control for spatial UIs', url: 'https://dian.dev/lab/gesture' },
  { number: '03', title: 'Local LLM Experiments', type: 'AI', status: 'EXPERIMENT', year: '2025', description: 'Running small language models locally', url: 'https://dian.dev/lab/local-llm' },
  { number: '04', title: 'Data Sonification', type: 'Audio', status: 'ARCHIVED', year: '2023', description: 'Listening to data patterns' },
  { number: '05', title: 'WebGL Map Experiments', type: 'Visual', status: 'EXPERIMENT', year: '2025', description: 'Rendering maps with custom WebGL', url: 'https://dian.dev/lab/webgl-maps' },
  { number: '06', title: 'Computer Vision Interface', type: 'HCI', status: 'PROTOTYPE', year: '2024', description: 'Camera-based interaction prototypes', url: 'https://dian.dev/lab/cv-interface' },
];
''',
    "src/data/skills.ts": r'''export const skillCategories = [
  { category: 'INTERFACE', items: 'Astro / React / TypeScript' },
  { category: 'COMPUTATION', items: 'Python / NumPy / Pandas' },
  { category: 'MACHINE LEARNING', items: 'scikit-learn / PyTorch' },
  { category: 'SPATIAL', items: 'MapLibre / PMTiles / GIS' },
  { category: 'VISUAL', items: 'Three.js / WebGL / GSAP' },
  { category: 'SYSTEMS', items: 'Node / APIs / Databases' },
];
''',
    "src/layouts/BaseLayout.astro": r'''---
import SEOHead from '../components/global/SEOHead.astro';
import Navigation from '../components/global/Navigation.astro';
import Cursor from '../components/global/Cursor.tsx';
import '../styles/global.css';

interface Props {
  title?: string;
  description?: string;
  canonicalURL?: URL;
  ogImage?: string;
}
const {
  title = "Dian — Systems & Interfaces",
  description = "Applied mathematics student, developer, and technical creative.",
  canonicalURL,
  ogImage = "/og-default.png",
} = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <SEOHead title={title} description={description} canonicalURL={canonicalURL} ogImage={ogImage} />
  </head>
  <body class="bg-paper text-ink font-sans">
    <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:bg-paper focus:p-4">Skip to content</a>
    <Cursor client:load />
    <Navigation />
    <main id="main-content">
      <slot />
    </main>
    <script>
      import { initLenis } from '../scripts/lenis';
      import { initMotion } from '../scripts/motion';
      const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!isReduced) {
        const lenis = initLenis();
        initMotion();
      }
    </script>
  </body>
</html>
''',
    "src/components/global/SEOHead.astro": r'''---
interface Props {
  title: string;
  description: string;
  canonicalURL?: URL;
  ogImage?: string;
}
const { title, description, canonicalURL, ogImage = '/og-default.png' } = Astro.props;
const canonical = canonicalURL ? canonicalURL.href : new URL(Astro.url.pathname, Astro.site ?? 'https://dian.dev').href;
---

<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>{title}</title>
<meta name="description" content={description} />
<link rel="canonical" href={canonical} />
<meta property="og:type" content="website" />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:url" content={canonical} />
<meta property="og:image" content={ogImage} />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={ogImage} />
<meta name="theme-color" content="#F4F2ED" />
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
''',
    "src/components/global/Navigation.astro": r'''---
import { Menu, X } from 'lucide-react';
---

<header class="fixed top-0 left-0 right-0 z-50 mix-blend-difference text-white">
  <nav class="flex items-center justify-between px-[var(--spacing-gutter)] py-4 md:py-5" aria-label="Primary">
    <a href="/" class="text-xl font-bold tracking-tight link-underline" data-cursor="home">DIAN</a>
    <div class="hidden md:flex items-center gap-8">
      <a href="/#work" class="text-sm font-medium link-underline" data-cursor="view">Work</a>
      <a href="/#about" class="text-sm font-medium link-underline" data-cursor="view">About</a>
      <a href="/#now" class="text-sm font-medium link-underline" data-cursor="view">Now</a>
      <a href="/#lab" class="text-sm font-medium link-underline" data-cursor="view">Lab</a>
      <a href="/#contact" class="text-sm font-medium link-underline" data-cursor="view">Contact</a>
      <span class="mono-label !text-white/70">● AVAILABLE / BUILDING THINGS</span>
    </div>
    <button class="md:hidden p-2" aria-label="Open menu" aria-expanded="false" data-mobile-menu-trigger>
      <Menu class="w-6 h-6" />
    </button>
  </nav>
  <dialog class="fixed inset-0 z-50 m-0 h-full w-full max-w-none bg-ink text-paper md:hidden" data-mobile-menu aria-label="Mobile navigation">
    <div class="flex h-full flex-col justify-between p-6 py-8">
      <div class="flex justify-between items-center">
        <span class="text-xl font-bold">DIAN</span>
        <button aria-label="Close menu" data-mobile-menu-close><X class="w-6 h-6" /></button>
      </div>
      <nav class="space-y-6 text-3xl font-semibold">
        <a href="/#work" class="block link-underline" data-cursor="view">Work</a>
        <a href="/#about" class="block link-underline" data-cursor="view">About</a>
        <a href="/#now" class="block link-underline" data-cursor="view">Now</a>
        <a href="/#lab" class="block link-underline" data-cursor="view">Lab</a>
        <a href="/#contact" class="block link-underline" data-cursor="view">Contact</a>
      </nav>
      <span class="mono-label text-paper/60">● AVAILABLE / BUILDING THINGS</span>
    </div>
  </dialog>
</header>

<script>
  const trigger = document.querySelector('[data-mobile-menu-trigger]');
  const closeBtn = document.querySelector('[data-mobile-menu-close]');
  const dialog = document.querySelector('[data-mobile-menu]');
  trigger?.addEventListener('click', () => { dialog?.showModal(); trigger.setAttribute('aria-expanded', 'true'); });
  closeBtn?.addEventListener('click', () => { dialog?.close(); trigger.setAttribute('aria-expanded', 'false'); });
  dialog?.addEventListener('close', () => { trigger.setAttribute('aria-expanded', 'false'); });
  dialog?.querySelectorAll('a').forEach(link => { link.addEventListener('click', () => dialog.close()); });
</script>
''',
    "src/components/global/Cursor.tsx": r'''import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: fine)').matches === false) return;
    const cursor = cursorRef.current!;
    const textEl = textRef.current!;
    let rafId: number;
    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;
    const speed = 0.18;

    const move = (e: MouseEvent) => { mouseX = e.clientX; mouseY = e.clientY; cursor.style.opacity = '1'; };
    const handleHoverTargets = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a, button, [data-cursor]');
      if (target) {
        const cursorType = target.getAttribute('data-cursor') || 'view';
        textEl.textContent = cursorType.toUpperCase();
        gsap.to(cursor, { scale: 1.5, duration: 0.2 });
      } else {
        textEl.textContent = '';
        gsap.to(cursor, { scale: 1, duration: 0.2 });
      }
    };
    const loop = () => {
      currentX += (mouseX - currentX) * speed;
      currentY += (mouseY - currentY) * speed;
      cursor.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;
      rafId = requestAnimationFrame(loop);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', handleHoverTargets);
    loop();
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', handleHoverTargets);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div ref={cursorRef} className="pointer-events-none fixed left-0 top-0 z-[9999] mix-blend-difference text-white opacity-0" aria-hidden="true">
      <span ref={textRef} className="text-xs font-mono"></span>
    </div>
  );
}
''',
    "src/scripts/lenis.ts": r'''import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initLenis(): Lenis | null {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
  });
  lenis.on('scroll', ScrollTrigger.update);
  const tick = (time: number) => lenis.raf(time);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return lenis;
}
''',
    "src/scripts/motion.ts": r'''import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initMotion() {
  const ctx = gsap.context(() => {
    document.querySelectorAll('[data-reveal]').forEach((el) => {
      gsap.fromTo(el,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' } }
      );
    });
    document.querySelectorAll('[data-line-draw]').forEach((el) => {
      gsap.fromTo(el,
        { scaleY: 0 },
        { scaleY: 1, transformOrigin: 'top', duration: 0.6, ease: 'power2.inOut',
          scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none reverse' } }
      );
    });
  });
  document.addEventListener('astro:before-swap', () => ctx.revert());
}
''',
    "src/components/hero/Hero.astro": r'''---
import HeroCanvas from './HeroCanvas.tsx';
import HeroFallback from './HeroFallback.astro';
---

<section id="hero" class="relative h-[100svh] min-h-[600px] w-full overflow-hidden bg-paper" data-hero>
  <div class="absolute inset-0 z-0">
    <HeroCanvas client:load />
    <HeroFallback />
  </div>
  <div class="relative z-10 flex h-full flex-col justify-between p-[var(--spacing-gutter)] pointer-events-none">
    <div class="flex items-start justify-between text-xs mono-label text-ink-faint">
      <span>SYSTEM / ACTIVE</span>
      <span>LOC / 14.165° N, 121.243° E</span>
    </div>
    <div class="mb-8 md:mb-12">
      <h1 class="text-[var(--text-display)] font-bold leading-[0.9] tracking-tight text-ink">
        DIAN<br />
        <span class="text-ink-muted">BUILDS</span> SYSTEMS<br />
        FOR THE PHYSICAL<br />
        AND DIGITAL WORLD.
      </h1>
      <p class="mt-4 max-w-xl text-base md:text-lg text-ink-muted pointer-events-auto">
        Applied mathematics student, developer, and technical creative — working across software, AI, maps, and interfaces.
      </p>
      <a href="#work" class="mt-8 inline-flex items-center gap-2 border-b border-ink pb-1 text-sm font-medium uppercase tracking-widest pointer-events-auto" data-cursor="explore">
        Explore selected work
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 5v14M19 12l-7 7-7-7" stroke-width="2"/></svg>
      </a>
    </div>
  </div>
  <div class="absolute bottom-6 right-6 z-10 text-xs mono-label text-ink-faint hidden md:block">SCROLL TO TRANSFORM</div>
</section>
''',
    "src/components/hero/HeroFallback.astro": r'''<svg class="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 800 800" aria-hidden="true">
  <defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="#DDD8D0" stroke-width="1"/></pattern></defs>
  <rect width="100%" height="100%" fill="url(#grid)" />
  <path d="M0,400 Q200,300 400,400 T800,400" fill="none" stroke="#555" stroke-width="1"/>
  <path d="M200,0 Q300,200 200,400 T200,800" fill="none" stroke="#555" stroke-width="1"/>
</svg>
''',
    "src/components/hero/heroMath.ts": r'''import * as THREE from 'three';

export function vectorField(x: number, y: number, z: number): THREE.Vector3 {
  const v = new THREE.Vector3();
  v.x = -y + x * z;
  v.y = x + y * z;
  v.z = -z + (x * x - y * y);
  return v.normalize();
}

export function integrateStreamline(start: THREE.Vector3, steps: number = 100, stepSize: number = 0.05): THREE.Vector3[] {
  const points: THREE.Vector3[] = [start.clone()];
  const pos = start.clone();
  for (let i = 1; i < steps; i++) {
    const dir = vectorField(pos.x, pos.y, pos.z).multiplyScalar(stepSize);
    pos.add(dir);
    if (pos.length() > 10) break;
    points.push(pos.clone());
  }
  return points;
}

export function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}
''',
    "src/components/hero/Scene.tsx": r'''import { useThree, useFrame } from '@react-three/fiber';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { vectorField, integrateStreamline, seededRandom } from './heroMath';
import CoordinateGrid from './CoordinateGrid';
import Streamlines from './Streamlines';
import ParticleField from './ParticleField';
import PointerProbe from './PointerProbe';
import { PerformanceMonitor } from '@react-three/drei';

export default function Scene() {
  const { camera, pointer } = useThree();
  const [quality, setQuality] = useState<'low'|'medium'|'high'>('medium');
  const pointerUniform = useRef({ value: new THREE.Vector3(0, 0, 0) });

  useFrame((state) => {
    const { x, y } = state.pointer;
    pointerUniform.current.value.set(x * 3, y * 2, 1);
  });

  const streamlines = useMemo(() => {
    const rand = seededRandom(42);
    const lines: THREE.Vector3[][] = [];
    for (let i = 0; i < 12; i++) {
      const start = new THREE.Vector3((rand()-0.5)*4, (rand()-0.5)*4, (rand()-0.5)*4);
      lines.push(integrateStreamline(start, 80, 0.05));
    }
    return lines;
  }, []);

  return (
    <>
      <PerformanceMonitor onDecline={() => setQuality('low')} onIncline={() => setQuality('high')}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5,5,5]} intensity={0.8} />
        <CoordinateGrid />
        <Streamlines streamlines={streamlines} quality={quality} />
        <ParticleField quality={quality} pointerUniform={pointerUniform.current} />
        <PointerProbe pointerUniform={pointerUniform.current} />
      </PerformanceMonitor>
    </>
  );
}
''',
    "src/components/hero/CoordinateGrid.tsx": r'''import { useMemo } from 'react';
import * as THREE from 'three';

export default function CoordinateGrid() {
  const gridGeometry = useMemo(() => {
    const points: number[] = [];
    const size = 8;
    const divisions = 20;
    const step = size / divisions;
    for (let i = -divisions/2; i <= divisions/2; i++) {
      points.push(i*step, 0, -size/2, i*step, 0, size/2);
      points.push(-size/2, 0, i*step, size/2, 0, i*step);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    return geo;
  }, []);
  return <lineSegments geometry={gridGeometry}><lineBasicMaterial color="#DDD8D0" transparent opacity={0.4} /></lineSegments>;
}
''',
    "src/components/hero/Streamlines.tsx": r'''import { useMemo } from 'react';
import * as THREE from 'three';
import { Line } from '@react-three/drei';

interface StreamlinesProps { streamlines: THREE.Vector3[][]; quality: 'low' | 'medium' | 'high'; }

export default function Streamlines({ streamlines, quality }: StreamlinesProps) {
  const visibleCount = quality === 'low' ? 6 : streamlines.length;
  return (
    <group>
      {streamlines.slice(0, visibleCount).map((points, i) => (
        <Line key={i} points={points} color="#555555" lineWidth={0.5} transparent opacity={0.4} />
      ))}
    </group>
  );
}
''',
    "src/components/hero/ParticleField.tsx": r'''import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { vectorField, seededRandom } from './heroMath';

interface ParticleFieldProps { quality: 'low' | 'medium' | 'high'; pointerUniform: { value: THREE.Vector3 }; }

export default function ParticleField({ quality, pointerUniform }: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null!);
  const particles = useMemo(() => {
    const count = quality === 'low' ? 300 : quality === 'medium' ? 800 : 1500;
    const rand = seededRandom(7);
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i*3] = (rand()-0.5)*6;
      positions[i*3+1] = (rand()-0.5)*6;
      positions[i*3+2] = (rand()-0.5)*6;
    }
    return { count, positions };
  }, [quality]);

  useFrame((state, delta) => {
    const { count, positions } = particles;
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;
    for (let i = 0; i < count; i++) {
      let x = positions[i*3], y = positions[i*3+1], z = positions[i*3+2];
      const base = vectorField(x, y, z);
      const pointerInfluence = pointerUniform.value.clone().sub(new THREE.Vector3(x,y,z)).normalize().multiplyScalar(0.3);
      const dir = base.add(pointerInfluence).normalize();
      x += dir.x * delta * 0.3; y += dir.y * delta * 0.3; z += dir.z * delta * 0.3;
      if (Math.abs(x) > 4) x = -x * 0.9;
      if (Math.abs(y) > 4) y = -y * 0.9;
      if (Math.abs(z) > 4) z = -z * 0.9;
      positions[i*3] = x; positions[i*3+1] = y; positions[i*3+2] = z;
      arr[i*3] = x; arr[i*3+1] = y; arr[i*3+2] = z;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry><bufferAttribute attach="attributes-position" count={particles.count} array={particles.positions} itemSize={3} /></bufferGeometry>
      <pointsMaterial size={0.02} color="#555555" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}
''',
    "src/components/hero/PointerProbe.tsx": r'''import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PointerProbeProps { pointerUniform: { value: THREE.Vector3 }; }

export default function PointerProbe({ pointerUniform }: PointerProbeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame(() => { if (meshRef.current) meshRef.current.position.copy(pointerUniform.value); });
  return <mesh ref={meshRef}><sphereGeometry args={[0.03, 8, 8]} /><meshBasicMaterial color="#D94F2B" /></mesh>;
}
''',
    "src/components/hero/HeroCanvas.tsx": r'''import { Canvas } from '@react-three/fiber';
import Scene from './Scene';
import { Suspense } from 'react';

export default function HeroCanvas() {
  return (
    <Canvas camera={{ position: [0,1,5], fov: 45 }} dpr={[1,1.8]} gl={{ antialias: true, alpha: true }} style={{ background: 'transparent' }}>
      <Suspense fallback={null}><Scene /></Suspense>
    </Canvas>
  );
}
''',
    "src/components/work/ProjectIndex.astro": r'''---
import { getCollection } from 'astro:content';
import ProjectRow from './ProjectRow.astro';
import ProjectPreview from './ProjectPreview.tsx';

const projects = await getCollection('projects');
---

<section id="work" class="px-[var(--spacing-gutter)] py-24 md:py-36 border-t border-line">
  <div class="max-w-7xl mx-auto">
    <div class="flex items-baseline justify-between mb-16" data-reveal>
      <h2 class="text-[var(--text-section)] font-bold">SELECTED WORK</h2>
      <span class="mono-label">PROJECTS / {String(projects.length).padStart(3,'0')}</span>
    </div>
    <div class="relative">
      <ProjectPreview client:visible />
      {projects.map((project) => <ProjectRow project={project} />)}
    </div>
  </div>
</section>
''',
    "src/components/work/ProjectRow.astro": r'''---
import type { CollectionEntry } from 'astro:content';
interface Props { project: CollectionEntry<'projects'>; }
const { project } = Astro.props;
const { data } = project;
---

<article class="group relative border-b border-line py-8 md:py-10" data-project-row data-slug={data.slug} data-title={data.title} data-category={data.category} data-year={data.year} data-accent={data.accent}>
  <a href={`/work/${data.slug}`} class="block" data-cursor="view">
    <div class="flex flex-col md:flex-row md:items-start gap-4 md:gap-8">
      <span class="mono-label text-ink-faint">{String(data.index).padStart(2,'0')} / {data.year}</span>
      <div class="flex-1">
        <h3 class="text-[var(--text-title)] font-bold tracking-tight transition-transform duration-300 group-hover:translate-x-2">{data.title}</h3>
        <p class="mt-2 text-ink-muted max-w-xl">{data.summary}</p>
        <div class="mt-3 flex flex-wrap gap-2 text-xs mono-label">
          <span>{data.category}</span><span>●</span><span>{data.technologies.slice(0,3).join(' / ')}</span>
        </div>
      </div>
      <div class="hidden md:block md:w-8 lg:w-12 text-right text-2xl">↗</div>
    </div>
  </a>
</article>
''',
    "src/components/work/ProjectPreview.tsx": r'''import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function ProjectPreview() {
  const [active, setActive] = useState<{ title: string; category: string; year: string; accent: string } | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rows = document.querySelectorAll('[data-project-row]');
    const handleMouseEnter = (e: Event) => {
      const row = e.currentTarget as HTMLElement;
      const title = row.dataset.title || '';
      const category = row.dataset.category || '';
      const year = row.dataset.year || '';
      const accent = row.dataset.accent || '#D94F2B';
      setActive({ title, category, year, accent });
      previewRef.current!.style.opacity = '1';
      const rect = row.getBoundingClientRect();
      gsap.to(previewRef.current, { left: rect.right + 20, top: rect.top, duration: 0.3, ease: 'power2.out' });
    };
    const handleMouseLeave = () => { setActive(null); previewRef.current!.style.opacity = '0'; };
    rows.forEach((row) => {
      row.addEventListener('mouseenter', handleMouseEnter);
      row.addEventListener('mouseleave', handleMouseLeave);
    });
    return () => rows.forEach((row) => {
      row.removeEventListener('mouseenter', handleMouseEnter);
      row.removeEventListener('mouseleave', handleMouseLeave);
    });
  }, []);

  return (
    <div ref={previewRef} className="pointer-events-none fixed z-30 hidden md:block w-64 lg:w-80 h-40 bg-white border border-line p-4 opacity-0" style={{ transition: 'opacity 0.2s' }} aria-hidden="true">
      {active && (
        <div className="flex flex-col justify-between h-full">
          <div>
            <span className="mono-label" style={{ color: active.accent }}>PROJECT</span>
            <h4 className="text-lg font-bold mt-1">{active.title}</h4>
            <p className="text-sm text-ink-muted">{active.category} / {active.year}</p>
          </div>
          <div className="flex gap-2">{[...Array(4)].map((_, i) => <span key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: active.accent }} />)}</div>
        </div>
      )}
    </div>
  );
}
''',
    "src/components/about/About.astro": r'''---
---

<section id="about" class="px-[var(--spacing-gutter)] py-24 md:py-36 bg-paper relative">
  <div class="max-w-7xl mx-auto">
    <div class="grid md:grid-cols-2 gap-12 md:gap-20">
      <div data-reveal>
        <span class="mono-label">ABOUT / PROFILE</span>
        <h2 class="mt-4 text-[var(--text-section)] font-bold leading-tight">I like problems that sit between equations and interfaces.</h2>
      </div>
      <div class="space-y-6 text-lg text-ink-muted" data-reveal>
        <p>I'm Dian — an applied mathematics student building software, AI systems, spatial tools, and experimental interfaces.</p>
        <p>My work often lives at the intersection of data, maps, and human interaction. I care deeply about design that feels precise, not generic.</p>
        <p>Currently exploring how machine learning can augment spatial interfaces and community platforms.</p>
      </div>
    </div>
    <div class="mt-20 relative h-[300px] md:h-[400px]" data-reveal>
      <svg viewBox="0 0 800 400" class="w-full h-full" role="img" aria-label="Disciplinary connections">
        <g stroke="#DDD8D0" stroke-width="1">
          <line x1="100" y1="200" x2="300" y2="100" />
          <line x1="100" y1="200" x2="300" y2="300" />
          <line x1="300" y1="100" x2="500" y2="150" />
          <line x1="300" y1="300" x2="500" y2="250" />
          <line x1="500" y1="150" x2="700" y2="100" />
          <line x1="500" y1="250" x2="700" y2="200" />
          <line x1="300" y1="100" x2="300" y2="300" stroke="#D94F2B" stroke-width="1.5" />
        </g>
        <g font-family="monospace" font-size="12" fill="#555">
          <circle cx="100" cy="200" r="4" fill="#111" /><text x="90" y="220">MATH</text>
          <circle cx="300" cy="100" r="4" fill="#111" /><text x="280" y="85">ENGINEERING</text>
          <circle cx="300" cy="300" r="4" fill="#111" /><text x="270" y="320">DESIGN</text>
          <circle cx="500" cy="150" r="4" fill="#111" /><text x="480" y="140">AI</text>
          <circle cx="500" cy="250" r="4" fill="#111" /><text x="480" y="275">DATA</text>
          <circle cx="700" cy="100" r="4" fill="#111" /><text x="680" y="90">SPACE</text>
        </g>
      </svg>
    </div>
  </div>
</section>
''',
    "src/components/Now.astro": r'''---
---

<section id="now" class="px-[var(--spacing-gutter)] py-24 md:py-36 bg-white border-t border-line">
  <div class="max-w-7xl mx-auto">
    <div class="flex items-baseline justify-between mb-12" data-reveal>
      <h2 class="text-[var(--text-section)] font-bold">NOW</h2>
      <span class="mono-label">CURRENTLY / 2026</span>
    </div>
    <ul class="divide-y divide-line">
      <li class="flex flex-col md:flex-row md:items-baseline gap-2 py-6" data-reveal><span class="mono-label w-32">TRAINING</span><span class="text-lg md:text-xl">machine learning systems</span></li>
      <li class="flex flex-col md:flex-row md:items-baseline gap-2 py-6" data-reveal><span class="mono-label w-32">BUILDING</span><span class="text-lg md:text-xl">community mapping tools</span></li>
      <li class="flex flex-col md:flex-row md:items-baseline gap-2 py-6" data-reveal><span class="mono-label w-32">EXPERIMENTING</span><span class="text-lg md:text-xl">agents + spatial interfaces</span></li>
      <li class="flex flex-col md:flex-row md:items-baseline gap-2 py-6" data-reveal><span class="mono-label w-32">LEARNING</span><span class="text-lg md:text-xl">better computational mathematics</span></li>
    </ul>
  </div>
</section>
''',
    "src/components/Lab.astro": r'''---
import { experiments } from '../data/experiments';
---

<section id="lab" class="px-[var(--spacing-gutter)] py-24 md:py-36 bg-paper border-t border-line">
  <div class="max-w-7xl mx-auto">
    <div class="flex items-baseline justify-between mb-12" data-reveal>
      <h2 class="text-[var(--text-section)] font-bold">LAB</h2>
      <span class="mono-label">EXPERIMENTS / {String(experiments.length).padStart(3,'0')}</span>
    </div>
    <ul class="divide-y divide-line">
      {experiments.map((exp) => (
        <li class="group flex items-baseline justify-between py-5 md:py-7 transition-colors hover:bg-paper/50 px-2 -mx-2" data-reveal>
          <div class="flex items-baseline gap-6">
            <span class="mono-label text-ink-faint">{exp.number}</span>
            <h3 class="text-xl md:text-2xl font-semibold group-hover:translate-x-2 transition-transform">{exp.title}</h3>
          </div>
          <div class="flex items-center gap-4">
            <span class="hidden md:block text-sm text-ink-muted">{exp.description}</span>
            <span class="mono-label text-ink-faint">{exp.status}</span>
          </div>
        </li>
      ))}
    </ul>
  </div>
</section>
''',
    "src/components/Skills.astro": r'''---
import { skillCategories } from '../data/skills';
---

<section class="px-[var(--spacing-gutter)] py-24 md:py-36 bg-white border-t border-line">
  <div class="max-w-7xl mx-auto">
    <h2 class="text-[var(--text-section)] font-bold mb-16" data-reveal>TOOLS I REACH FOR</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8">
      {skillCategories.map((skill) => (
        <div class="border-b border-line pb-6" data-reveal>
          <span class="mono-label text-ink-faint">{skill.category}</span>
          <p class="mt-2 text-lg font-medium">{skill.items}</p>
        </div>
      ))}
    </div>
  </div>
</section>
''',
    "src/components/Contact.astro": r'''---
import { ArrowUpRight } from 'lucide-react';
---

<section id="contact" class="px-[var(--spacing-gutter)] py-24 md:py-40 bg-ink text-paper relative overflow-hidden">
  <div class="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-5">
    <svg viewBox="0 0 800 800" class="w-full h-full" aria-hidden="true">
      <path d="M0,400 Q200,300 400,400 T800,400" fill="none" stroke="white" stroke-width="2"/>
      <path d="M200,0 Q300,200 200,400 T200,800" fill="none" stroke="white" stroke-width="2"/>
      <circle cx="400" cy="400" r="200" fill="none" stroke="white" stroke-width="1"/>
    </svg>
  </div>
  <div class="relative z-10 max-w-7xl mx-auto">
    <h2 class="text-4xl md:text-7xl font-bold leading-tight" data-reveal>HAVE A WEIRD IDEA?</h2>
    <p class="mt-4 text-2xl md:text-4xl font-medium text-paper/80" data-reveal>Let's build it.</p>
    <div class="mt-12 flex flex-col md:flex-row gap-8 md:gap-16 text-lg" data-reveal>
      <a href="mailto:hello@dian.dev" class="link-underline text-paper" data-cursor="contact">hello@dian.dev</a>
      <a href="https://github.com/dian" target="_blank" rel="noopener noreferrer" class="link-underline text-paper flex items-center gap-1" data-cursor="external">GitHub <ArrowUpRight class="w-4 h-4" /></a>
      <a href="https://linkedin.com/in/dian" target="_blank" rel="noopener noreferrer" class="link-underline text-paper flex items-center gap-1" data-cursor="external">LinkedIn <ArrowUpRight class="w-4 h-4" /></a>
    </div>
    <div class="mt-20 flex justify-between text-xs mono-label text-paper/50">
      <span>© 2026 DIAN</span>
      <span>BUILT WITH ASTRO, THREE.JS, AND TOO MUCH COFFEE</span>
    </div>
  </div>
</section>
''',
    "src/pages/index.astro": r'''---
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/hero/Hero.astro';
import ProjectIndex from '../components/work/ProjectIndex.astro';
import About from '../components/about/About.astro';
import Now from '../components/Now.astro';
import Lab from '../components/Lab.astro';
import Skills from '../components/Skills.astro';
import Contact from '../components/Contact.astro';
---

<BaseLayout>
  <Hero />
  <ProjectIndex />
  <About />
  <Now />
  <Lab />
  <Skills />
  <Contact />
</BaseLayout>
''',
    "src/pages/work/[id].astro": r'''---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { getCollection } from 'astro:content';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export async function getStaticPaths() {
  const projects = await getCollection('projects');
  return projects.map((project) => ({
    params: { id: project.data.slug },
    props: { project },
  }));
}

const { project } = Astro.props;
const allProjects = await getCollection('projects');
const currentIndex = allProjects.findIndex(p => p.data.slug === project.data.slug);
const nextProject = allProjects[(currentIndex + 1) % allProjects.length];
const { data, body } = project;
---

<BaseLayout title={`${data.title} — Dian`} description={data.summary}>
  <article class="px-[var(--spacing-gutter)] pt-32 md:pt-40 pb-24">
    <div class="max-w-5xl mx-auto">
      <a href="/#work" class="inline-flex items-center gap-2 mono-label text-ink-faint link-underline" data-cursor="back"><ArrowLeft class="w-4 h-4" /> BACK TO WORK</a>
      <div class="mt-10 md:mt-16">
        <div class="flex flex-wrap items-baseline gap-4">
          <span class="mono-label text-ink-faint">{String(data.index).padStart(2,'0')} / {data.year}</span>
          <span class="mono-label" style={{ color: data.accent }}>{data.category}</span>
          <span class="mono-label text-ink-faint">STATUS / {data.status.toUpperCase()}</span>
        </div>
        <h1 class="mt-4 text-5xl md:text-7xl font-bold tracking-tight leading-none">{data.title}</h1>
        <p class="mt-6 text-xl md:text-2xl text-ink-muted max-w-2xl">{data.thesis}</p>
      </div>
      <div class="mt-12 h-64 md:h-96 bg-line relative overflow-hidden" data-reveal>
        <div class="w-full h-full flex items-center justify-center mono-label" style={{ backgroundColor: data.accent + '10', color: data.accent }}>[ PROJECT VISUAL ]</div>
      </div>
      <div class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8" data-reveal>
        <div><span class="mono-label text-ink-faint">ROLE</span><p class="mt-2 font-medium">{data.role.join(', ')}</p></div>
        <div><span class="mono-label text-ink-faint">TECHNOLOGIES</span><p class="mt-2 font-medium">{data.technologies.join(' / ')}</p></div>
        <div><span class="mono-label text-ink-faint">YEAR</span><p class="mt-2 font-medium">{data.year}</p></div>
      </div>
      <div class="mt-16 prose prose-lg max-w-none">
        <Content />
      </div>
      <div class="mt-24 border-t border-line pt-8 flex justify-between items-center">
        <span class="mono-label text-ink-faint">NEXT PROJECT</span>
        <a href={`/work/${nextProject.data.slug}`} class="text-2xl md:text-4xl font-bold link-underline" data-cursor="view">{nextProject.data.title} <ArrowRight class="inline w-6 h-6" /></a>
      </div>
    </div>
  </article>
</BaseLayout>
''',
    "README.md": r'''# Dian — Portfolio

A creative developer portfolio built with Astro, React, TypeScript, Three.js, GSAP, Lenis, and Tailwind CSS 4.

## Getting Started

1. Install dependencies: `npm install`
2. Run dev server: `npm run dev`
3. Build: `npm run build`
4. Preview: `npm run preview`

## Features

- Vector Atlas WebGL hero with coordinate grid, streamlines, particles, and pointer probe
- Content collections for project case studies
- Client-side routing with shared-element transitions
- Accessible mobile navigation using native dialog
- Custom cursor with contextual labels
- Smooth scrolling with Lenis (respects reduced motion)
- GSAP motion with scoped contexts
- Responsive design for mobile, tablet, and desktop
- Performance adaptive rendering via R3F PerformanceMonitor

## Project Structure

- `src/components/` — UI components, hero WebGL scene, global elements
- `src/content/projects/` — project case studies in Markdown
- `src/data/` — experiments, skills, site config
- `src/layouts/` — base and project layouts
- `src/scripts/` — motion and Lenis initialization
- `src/styles/` — global styles and design tokens

## Notes

- The hero fallback is an SVG that appears if WebGL fails.
- All project claims marked `verified: false` are conceptual and not presented as confirmed achievements.
''',
}

for path, content in FILES.items():
    full_path = os.path.join(BASE, path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, 'w') as f:
        f.write(content.strip() if content else content)

print(f"Project generated in '{BASE}' directory.")
