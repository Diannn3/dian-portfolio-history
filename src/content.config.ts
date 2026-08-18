import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/projects',
  }),
  schema: z.object({
    title: z.string(),
    index: z.number(),
    status: z.enum(['CONCEPT', 'PROTOTYPE', 'EXPERIMENT', 'IN DEVELOPMENT', 'LIVE', 'TO VERIFY']),
    year: z.coerce.string().optional(),
    category: z.string(),
    summary: z.string(),
    thesis: z.string(),
    role: z.string().optional(),
    technologies: z.array(z.string()).default([]),
    repository: z.string().url().optional(),
    liveUrl: z.string().url().optional(),
    featured: z.boolean().default(false),
    accent: z.string().default('#D94F2B'),
  }),
});

export const collections = { projects };
