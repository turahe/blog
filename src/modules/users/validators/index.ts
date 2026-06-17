import { z } from 'zod'

export const userStatusEnum = z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING'])

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().min(1).max(255),
  avatar: z.string().url().optional().or(z.literal('')),
  status: userStatusEnum.default('ACTIVE'),
  roleIds: z.array(z.string()).default([]),
})

export const updateUserSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(8).optional().or(z.literal('')),
  fullName: z.string().min(1).max(255).optional(),
  avatar: z.string().url().optional().or(z.literal('')),
  status: userStatusEnum.optional(),
  roleIds: z.array(z.string()).optional(),
})

export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
