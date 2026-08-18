import { defineConfig } from 'astro/config';
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
