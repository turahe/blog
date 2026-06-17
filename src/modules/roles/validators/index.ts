import { z } from 'zod'

export const createRoleSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(50)
    .regex(/^[a-z0-9_-]+$/, 'Slug must be lowercase alphanumeric'),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  permissionIds: z.array(z.string()).default([]),
})

export const updateRoleSchema = createRoleSchema.partial()
