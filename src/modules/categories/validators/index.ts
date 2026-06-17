import { z } from 'zod'

export const createCategorySchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/),
  name: z.string().min(1).max(100),
  description: z.string().max(2000).optional().or(z.literal('')),
  imageUrl: z.string().optional().or(z.literal('')),
})

export const updateCategorySchema = createCategorySchema.partial()
