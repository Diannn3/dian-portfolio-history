import { defineCollection, z } from "astro:content"
import { glob } from "astro/loaders"

const projects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    shortTitle: z.string(),
    index: z.number().int().positive(),
    status: z.enum(["CONCEPT", "PROTOTYPE", "IN DEVELOPMENT", "EXPERIMENT"]),
    year: z.number().int().optional(),
    category: z.string(),
    summary: z.string(),
    thesis: z.string(),
    role: z.string().optional(),
    technologies: z.array(z.string()).default([]),
    themes: z.array(z.string()).default([]),
    repository: z.string().url().optional(),
    liveUrl: z.string().url().optional(),
    featured: z.boolean().default(true),
    accent: z.string().default("#d9482b"),
    visual: z.enum(["uppetite", "pasada", "disaster", "campus"]),
  }),
})

export const collections = { projects }
