import { z } from 'zod'

export const createCommentSchema = z.object({
  postSlug: z.string().min(1),
  content: z.string().trim().min(1, 'Comment cannot be empty').max(5000),
  parentId: z.string().optional(),
  authorName: z.string().trim().max(120).optional(),
  authorEmail: z.string().trim().email('Invalid email').max(200).optional().or(z.literal('')),
})

export const moderateCommentSchema = z.object({
  id: z.string().min(1),
  status: z.enum(['PENDING', 'APPROVED', 'SPAM', 'TRASH']),
})
