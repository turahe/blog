import prisma from '@/lib/db/prisma'
import { ensureUserPreferences } from '@/modules/account/repositories'
import type { NotificationCategory } from '@/generated/prisma/client'
import { NOTIFICATION_TYPE_CATEGORY } from '../constants'
import { createManyNotificationRecords, createNotificationRecord } from '../repository'
import type {
  BroadcastTarget,
  InAppNotificationPrefs,
  NotificationData,
  NotificationTypeSlug,
} from '../types'
import { DEFAULT_IN_APP_NOTIFICATION_PREFS } from '../types'

function parseInAppPrefs(value: unknown): InAppNotificationPrefs {
  const defaults = DEFAULT_IN_APP_NOTIFICATION_PREFS
  if (!value || typeof value !== 'object') return defaults
  const raw = value as Partial<InAppNotificationPrefs> & {
    systemUpdates?: boolean
  }
  return {
    comments: raw.comments ?? defaults.comments,
    contentUpdates: raw.contentUpdates ?? defaults.contentUpdates,
    mentions: raw.mentions ?? defaults.mentions,
    reviews: raw.reviews ?? defaults.reviews,
    security: raw.security ?? defaults.security,
    system: raw.system ?? raw.systemUpdates ?? defaults.system,
  }
}

function categoryAllowed(prefs: InAppNotificationPrefs, category: NotificationCategory): boolean {
  switch (category) {
    case 'content':
      return prefs.comments || prefs.contentUpdates || prefs.reviews
    case 'user':
      return prefs.mentions
    case 'security':
      return prefs.security
    case 'system':
      return prefs.system
    default:
      return true
  }
}

export async function shouldDeliverInApp(
  userId: string,
  category: NotificationCategory
): Promise<boolean> {
  const prefs = await ensureUserPreferences(userId)
  const inApp = parseInAppPrefs(prefs.inAppNotifications)
  return categoryAllowed(inApp, category)
}

export async function notifyUser(input: {
  userId: string
  type: NotificationTypeSlug
  title: string
  message: string
  data?: NotificationData | null
  force?: boolean
}) {
  const category = NOTIFICATION_TYPE_CATEGORY[input.type]
  if (!input.force && !(await shouldDeliverInApp(input.userId, category))) {
    return null
  }

  return createNotificationRecord({
    userId: input.userId,
    type: input.type,
    category,
    title: input.title,
    message: input.message,
    data: input.data,
  })
}

export async function notifyUsers(
  userIds: string[],
  input: Omit<Parameters<typeof notifyUser>[0], 'userId'>
) {
  const uniqueIds = [...new Set(userIds)]
  const category = NOTIFICATION_TYPE_CATEGORY[input.type]
  const records: Parameters<typeof createManyNotificationRecords>[0] = []

  for (const userId of uniqueIds) {
    if (!input.force && !(await shouldDeliverInApp(userId, category))) continue
    records.push({
      userId,
      type: input.type,
      category,
      title: input.title,
      message: input.message,
      data: input.data,
    })
  }

  return createManyNotificationRecords(records)
}

export async function notifyUsersWithPermission(
  permission: string,
  input: Omit<Parameters<typeof notifyUser>[0], 'userId'>
) {
  const userRoles = await prisma.userRole.findMany({
    where: {
      role: {
        deletedAt: null,
        rolePermissions: { some: { permission: { slug: permission } } },
      },
      user: { deletedAt: null, status: 'ACTIVE' },
    },
    select: { userId: true },
  })
  const userIds = userRoles.map((ur) => ur.userId)
  return notifyUsers(userIds, input)
}

export async function broadcastNotification(input: {
  type: NotificationTypeSlug
  title: string
  message: string
  data?: NotificationData | null
  target: BroadcastTarget
}) {
  let userIds: string[] = []

  if (input.target.mode === 'all') {
    const users = await prisma.user.findMany({
      where: { deletedAt: null, status: 'ACTIVE' },
      select: { id: true },
    })
    userIds = users.map((u) => u.id)
  } else if (input.target.mode === 'roles' && input.target.roleSlugs?.length) {
    const userRoles = await prisma.userRole.findMany({
      where: {
        role: { slug: { in: input.target.roleSlugs }, deletedAt: null },
        user: { deletedAt: null, status: 'ACTIVE' },
      },
      select: { userId: true },
    })
    userIds = userRoles.map((ur) => ur.userId)
  } else if (input.target.mode === 'users' && input.target.userIds?.length) {
    userIds = input.target.userIds
  }

  return notifyUsers(userIds, {
    type: input.type,
    title: input.title,
    message: input.message,
    data: input.data,
    force: true,
  })
}
