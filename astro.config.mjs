import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://dian.dev',
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    mdx(),
    sitemap(),
  ],
  output: 'static',
  vite: {
    ssr: {
      noExternal: ['three', '@react-three/fiber', '@react-three/drei', '@splinetool/react-spline'],
    },
  },
});