import { z } from 'zod'

export const createProjectSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1),
  imgSrc: z.string().min(1),
  href: z.string().min(1),
  sortOrder: z.coerce.number().int().min(0).default(0),
})

export const updateProjectSchema = createProjectSchema.partial()
