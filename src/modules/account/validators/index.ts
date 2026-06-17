import { z } from 'zod'

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export const profileSchema = z.object({
  fullName: z.string().trim().min(2, 'Name must be at least 2 characters').max(120),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(slugRegex, 'Username must be lowercase letters, numbers, and hyphens')
    .max(80)
    .optional()
    .or(z.literal('')),
  bio: z.string().max(500).optional().or(z.literal('')),
  website: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  location: z.string().max(120).optional().or(z.literal('')),
  avatar: z.string().optional().nullable(),
})

export const changeEmailSchema = z.object({
  email: z.string().trim().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(128)
      .regex(/[A-Z]/, 'Include at least one uppercase letter')
      .regex(/[a-z]/, 'Include at least one lowercase letter')
      .regex(/[0-9]/, 'Include at least one number'),
    confirmPassword: z.string().min(1, 'Confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const mfaVerifySchema = z.object({
  code: z.string().trim().min(6).max(8),
})

export const mfaDisableSchema = z.object({
  password: z.string().min(1, 'Password is required'),
  code: z.string().trim().optional(),
})

export const preferencesSchema = z.object({
  appearance: z.enum(['light', 'dark', 'system']),
  editorMode: z.enum(['markdown', 'rich-text']),
  defaultLandingPage: z.string().min(1).max(200),
  sidebarCollapsed: z.boolean(),
  autosaveInterval: z.number().int().min(15).max(600),
  defaultPostStatus: z.enum(['draft', 'published']),
})

export const notificationsSchema = z.object({
  email: z.object({
    newComment: z.boolean(),
    newUser: z.boolean(),
    newPostReview: z.boolean(),
    securityAlerts: z.boolean(),
  }),
  inApp: z.object({
    mentions: z.boolean(),
    comments: z.boolean(),
    systemUpdates: z.boolean(),
  }),
})

export const deleteAccountSchema = z.object({
  password: z.string().min(1, 'Password is required'),
  confirmation: z.literal('DELETE', { message: 'Type DELETE to confirm' }),
})

export const sensitiveActionSchema = z.object({
  password: z.string().min(1, 'Password is required'),
})
