'use server'

import { revalidatePath } from 'next/cache'
import { requireSession } from '@/lib/auth/session'
import { can } from '@/lib/rbac'
import type { CrudActionResult } from '@/lib/crud/types'
import {
  broadcastNotificationSchema,
  notificationQuerySchema,
  notificationPrefsSchema,
} from '../validators'
import { broadcastNotification, notifyUser } from '../services/notify'
import {
  deleteNotification,
  getNotificationList,
  getUnreadCount,
  markAllNotificationsRead,
  markNotificationRead,
} from '../services/query'
import { ensureUserPreferences } from '@/modules/account/repositories'
import prisma from '@/lib/db/prisma'
import type { NotificationListResult, NotificationQuery } from '../types'

const PATHS = ['/notifications', '/admin', '/account/notifications']

function revalidateNotifications() {
  for (const path of PATHS) {
    revalidatePath(path)
  }
}

export async function fetchNotificationsAction(
  input: unknown
): Promise<CrudActionResult<NotificationListResult>> {
  const session = await requireSession()
  const parsed = notificationQuerySchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message }

  const data = await getNotificationList(session.user.id, parsed.data as NotificationQuery)
  return { success: true, data }
}

export async function fetchUnreadCountAction(): Promise<CrudActionResult<{ count: number }>> {
  const session = await requireSession()
  const count = await getUnreadCount(session.user.id)
  return { success: true, data: { count } }
}

export async function markNotificationReadAction(id: string): Promise<CrudActionResult> {
  const session = await requireSession()
  const ok = await markNotificationRead(session.user.id, id)
  if (!ok) return { success: false, error: 'Notification not found' }
  revalidateNotifications()
  return { success: true }
}

export async function markAllNotificationsReadAction(): Promise<
  CrudActionResult<{ count: number }>
> {
  const session = await requireSession()
  const count = await markAllNotificationsRead(session.user.id)
  revalidateNotifications()
  return { success: true, data: { count } }
}

export async function deleteNotificationAction(id: string): Promise<CrudActionResult> {
  const session = await requireSession()
  const ok = await deleteNotification(session.user.id, id)
  if (!ok) return { success: false, error: 'Notification not found' }
  revalidateNotifications()
  return { success: true }
}

export async function updateNotificationPrefsAction(
  input: unknown,
  csrfToken?: string
): Promise<CrudActionResult> {
  const { validateCsrf } = await import('@/lib/auth/csrf')
  const csrfValid = await validateCsrf(csrfToken ?? null)
  if (!csrfValid) return { success: false, error: 'Invalid CSRF token' }

  const session = await requireSession()
  const parsed = notificationPrefsSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message }

  await ensureUserPreferences(session.user.id)
  await prisma.userPreference.update({
    where: { userId: session.user.id },
    data: {
      emailNotifications: parsed.data.email,
      inAppNotifications: parsed.data.inApp,
    },
  })

  revalidatePath('/account/notifications')
  return { success: true }
}

export async function broadcastNotificationAction(
  input: unknown,
  csrfToken?: string
): Promise<CrudActionResult<{ count: number }>> {
  const { validateCsrf } = await import('@/lib/auth/csrf')
  const csrfValid = await validateCsrf(csrfToken ?? null)
  if (!csrfValid) return { success: false, error: 'Invalid CSRF token' }

  const session = await requireSession()
  const allowed = await can('settings.update', session.user.id)
  if (!allowed) return { success: false, error: 'Forbidden' }

  const parsed = broadcastNotificationSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message }

  const result = await broadcastNotification({
    type: parsed.data.type,
    title: parsed.data.title,
    message: parsed.data.message,
    target: parsed.data.target,
    data: { href: '/notifications' },
  })

  revalidateNotifications()
  return { success: true, data: { count: result.count } }
}

export async function sendTestNotificationAction(): Promise<CrudActionResult> {
  const session = await requireSession()
  await notifyUser({
    userId: session.user.id,
    type: 'system_announcement',
    title: 'Notifications are working',
    message: 'Your notification system is connected and delivering in-app alerts.',
    data: { href: '/notifications' },
    force: true,
  })
  revalidateNotifications()
  return { success: true }
}
