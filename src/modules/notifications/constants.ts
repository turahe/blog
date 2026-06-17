import type { NotificationCategory } from '@/generated/prisma/client'
import type { NotificationData, NotificationTypeSlug } from './types'

export const NOTIFICATION_TYPE_CATEGORY: Record<NotificationTypeSlug, NotificationCategory> = {
  new_comment: 'content',
  comment_approved: 'content',
  comment_rejected: 'content',
  post_published: 'content',
  post_scheduled: 'content',
  draft_reminder: 'content',
  new_user_registered: 'user',
  new_author_invited: 'user',
  role_changed: 'user',
  new_login: 'security',
  password_changed: 'security',
  email_changed: 'security',
  two_factor_enabled: 'security',
  failed_login: 'security',
  backup_completed: 'system',
  storage_limit_warning: 'system',
  system_update_available: 'system',
  maintenance_notice: 'system',
  system_announcement: 'system',
}

export const NOTIFICATION_TYPE_LABELS: Record<NotificationTypeSlug, string> = {
  new_comment: 'New Comment',
  comment_approved: 'Comment Approved',
  comment_rejected: 'Comment Rejected',
  post_published: 'Post Published',
  post_scheduled: 'Post Scheduled',
  draft_reminder: 'Draft Reminder',
  new_user_registered: 'New User',
  new_author_invited: 'Author Invited',
  role_changed: 'Role Changed',
  new_login: 'New Login',
  password_changed: 'Password Changed',
  email_changed: 'Email Changed',
  two_factor_enabled: '2FA Enabled',
  failed_login: 'Failed Login',
  backup_completed: 'Backup Completed',
  storage_limit_warning: 'Storage Warning',
  system_update_available: 'System Update',
  maintenance_notice: 'Maintenance',
  system_announcement: 'Announcement',
}

export function resolveNotificationHref(
  type: string,
  data: NotificationData | null
): string | null {
  if (data?.href && typeof data.href === 'string') return data.href

  switch (type) {
    case 'new_comment':
    case 'comment_approved':
    case 'comment_rejected':
      return data?.commentId ? `/admin/comments?status=PENDING` : '/admin/comments'
    case 'post_published':
    case 'post_scheduled':
    case 'draft_reminder':
      return data?.postId ? `/admin/posts/${data.postId}` : '/admin/posts'
    case 'new_user_registered':
    case 'new_author_invited':
    case 'role_changed':
      return data?.userId ? `/admin/users/${data.userId}` : '/admin/users'
    case 'new_login':
    case 'password_changed':
    case 'email_changed':
    case 'two_factor_enabled':
    case 'failed_login':
      return '/account/security'
    case 'backup_completed':
    case 'storage_limit_warning':
    case 'system_update_available':
    case 'maintenance_notice':
    case 'system_announcement':
      return '/notifications'
    default:
      return '/notifications'
  }
}

export function getDateRangeStart(range: 'all' | 'today' | '7d' | '30d'): Date | null {
  if (range === 'all') return null
  const now = new Date()
  if (range === 'today') {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate())
  }
  if (range === '7d') {
    return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  }
  return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
}
