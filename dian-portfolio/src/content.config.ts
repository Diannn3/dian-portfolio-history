import { defineCollection, z } from 'astro:content';

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
