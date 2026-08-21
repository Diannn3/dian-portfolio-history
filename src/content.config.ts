import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const workCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
    status: z.enum(['active', 'prototype', 'case-study', 'live']),
    year: z.union([z.number(), z.literal('Needs Aedrian confirmation')]),
    role: z.string(),
    summary: z.string(),
    stack: z.array(z.string()),
    repository: z.string().url(),
    liveUrl: z.string().url().optional(),
    visual: z.object({
      kind: z.enum(['system-study', 'approved-screenshot']),
      asset: z.string(),
      alt: z.string(),
      caption: z.string(),
      evidenceState: z.enum(['verified', 'conceptual', 'needs-confirmation'])
    })
  })
});

export const collections = {
  work: workCollection
};
