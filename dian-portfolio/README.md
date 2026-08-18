# Dian — Portfolio

A creative developer portfolio built with Astro, React, TypeScript, Three.js, GSAP, Lenis, and Tailwind CSS 4.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

4. Preview production build:
   ```bash
   npm run preview
   ```

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
