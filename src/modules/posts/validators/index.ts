import { z } from 'zod'

export const createPostSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  title: z.string().min(1).max(500),
  date: z.string().min(1),
  lastmod: z.string().optional().or(z.literal('')),
  draft: z.boolean().default(false),
  summary: z.string().max(2000).optional().or(z.literal('')),
  body: z.string().min(1),
  layout: z.string().optional().or(z.literal('')),
  music: z.string().optional().or(z.literal('')),
  bibliography: z.string().optional().or(z.literal('')),
  canonicalUrl: z.string().url().optional().or(z.literal('')),
  featuredImage: z.string().optional().or(z.literal('')),
  categoryId: z.string().optional().or(z.literal('')),
  tagIds: z.array(z.string()).default([]),
  authorIds: z.array(z.string()).default([]),
})

export const updatePostSchema = createPostSchema.partial().extend({
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
})

export type CreatePostInput = z.infer<typeof createPostSchema>
export type UpdatePostInput = z.infer<typeof updatePostSchema>
