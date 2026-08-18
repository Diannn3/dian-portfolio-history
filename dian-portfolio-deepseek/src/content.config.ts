import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    index: z.string(),
    year: z.string(),
    status: z.enum(['Live', 'In development', 'Prototype', 'Concept']),
    category: z.string(),
    summary: z.string(),
    thesis: z.string(),
    role: z.array(z.string()),
    technologies: z.array(z.string()),
    featured: z.boolean().default(true),
    accent: z.string(),
    visual: z.enum(['uppetite', 'pasada', 'tugon', 'campus']),
    repository: z.string().optional(),
    liveUrl: z.string().optional(),
    factsVerified: z.boolean().default(false),
  }),
});

export const collections = { projects };
