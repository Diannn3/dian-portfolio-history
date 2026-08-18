import { defineConfig } from "astro/config"
import react from "@astrojs/react"
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"
import tailwindcss from "@tailwindcss/vite"

const site = process.env.SITE_URL

export default defineConfig({
  site,
  integrations: [react(), mdx(), ...(site ? [sitemap()] : [])],
  vite: {
    plugins: [tailwindcss()],
  },
  server: {
    host: true,
    port: 3000,
  },
})
