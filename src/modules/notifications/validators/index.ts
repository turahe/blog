import { z } from 'zod'

export const notificationQuerySchema = z.object({
  tab: z.enum(['all', 'unread']).optional(),
  category: z.enum(['all', 'content', 'user', 'security', 'system']).optional(),
  status: z.enum(['all', 'read', 'unread']).optional(),
  range: z.enum(['all', 'today', '7d', '30d']).optional(),
  search: z.string().max(200).optional(),
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(50).optional(),
})

export const broadcastNotificationSchema = z.object({
  title: z.string().trim().min(1).max(200),
  message: z.string().trim().min(1).max(2000),
  type: z.enum(['system_announcement', 'maintenance_notice']),
  target: z.object({
    mode: z.enum(['all', 'roles', 'users']),
    roleSlugs: z.array(z.string()).optional(),
    userIds: z.array(z.string()).optional(),
  }),
})

export const notificationPrefsSchema = z.object({
  email: z.object({
    comments: z.boolean(),
    contentUpdates: z.boolean(),
    securityAlerts: z.boolean(),
    systemAlerts: z.boolean(),
  }),
  inApp: z.object({
    comments: z.boolean(),
    contentUpdates: z.boolean(),
    mentions: z.boolean(),
    reviews: z.boolean(),
    security: z.boolean(),
    system: z.boolean(),
  }),
})
