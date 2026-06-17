import type { NotificationCategory } from '@/generated/prisma/client'

export type NotificationTypeSlug =
  | 'new_comment'
  | 'comment_approved'
  | 'comment_rejected'
  | 'post_published'
  | 'post_scheduled'
  | 'draft_reminder'
  | 'new_user_registered'
  | 'new_author_invited'
  | 'role_changed'
  | 'new_login'
  | 'password_changed'
  | 'email_changed'
  | 'two_factor_enabled'
  | 'failed_login'
  | 'backup_completed'
  | 'storage_limit_warning'
  | 'system_update_available'
  | 'maintenance_notice'
  | 'system_announcement'

export interface NotificationData {
  href?: string
  postId?: string
  postTitle?: string
  commentId?: string
  userId?: string
  actorName?: string
  [key: string]: unknown
}

export interface NotificationView {
  id: string
  type: string
  category: NotificationCategory
  title: string
  message: string
  data: NotificationData | null
  href: string | null
  read: boolean
  readAt: string | null
  createdAt: string
}

export interface NotificationListResult {
  items: NotificationView[]
  nextCursor: string | null
  unreadCount: number
}

export type NotificationFilterCategory = 'all' | NotificationCategory
export type NotificationFilterStatus = 'all' | 'read' | 'unread'
export type NotificationDateRange = 'all' | 'today' | '7d' | '30d'

export interface NotificationQuery {
  tab?: 'all' | 'unread'
  category?: NotificationFilterCategory
  status?: NotificationFilterStatus
  range?: NotificationDateRange
  search?: string
  cursor?: string
  limit?: number
}

export interface InAppNotificationPrefs {
  comments: boolean
  contentUpdates: boolean
  mentions: boolean
  reviews: boolean
  security: boolean
  system: boolean
}

export interface EmailNotificationPrefsExtended {
  comments: boolean
  contentUpdates: boolean
  securityAlerts: boolean
  systemAlerts: boolean
}

export const DEFAULT_IN_APP_NOTIFICATION_PREFS: InAppNotificationPrefs = {
  comments: true,
  contentUpdates: true,
  mentions: true,
  reviews: true,
  security: true,
  system: true,
}

export const DEFAULT_EMAIL_NOTIFICATION_PREFS_EXTENDED: EmailNotificationPrefsExtended = {
  comments: true,
  contentUpdates: true,
  securityAlerts: true,
  systemAlerts: true,
}

export interface BroadcastTarget {
  mode: 'all' | 'roles' | 'users'
  roleSlugs?: string[]
  userIds?: string[]
}
