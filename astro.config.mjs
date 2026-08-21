import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://aedrianponce.dev',
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
    server: {
      host: '127.0.0.1',
      port: 4399
    }
  }
});
