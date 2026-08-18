import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    index: z.number(),
    status: z.string(),
    year: z.coerce.string().optional(),
    category: z.string(),
    summary: z.string(),
    thesis: z.string(),
    role: z.string().optional(),
    technologies: z.array(z.string()),
    repository: z.string().url().optional(),
    liveUrl: z.string().url().optional(),
    featured: z.boolean().default(false),
    accent: z.string().default('#D94F2B'),
    cover: z.string().optional(),
  }),
});

export const collections = { projects };