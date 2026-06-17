import prisma from '@/lib/db/prisma'
import {
  DEFAULT_EMAIL_NOTIFICATIONS,
  DEFAULT_IN_APP_NOTIFICATIONS,
  type AccountNotificationsData,
  type AccountPreferencesData,
  type EmailNotificationPrefs,
  type InAppNotificationPrefs,
} from '../types'

function parseJsonPrefs<T>(value: unknown, defaults: T): T {
  if (!value || typeof value !== 'object') return defaults
  return { ...defaults, ...(value as Partial<T>) }
}

export async function ensureUserPreferences(userId: string) {
  return prisma.userPreference.upsert({
    where: { userId },
    create: { userId },
    update: {},
  })
}

export function mapPreferences(record: {
  appearance: string
  editorMode: string
  defaultLandingPage: string
  sidebarCollapsed: boolean
  autosaveInterval: number
  defaultPostStatus: string
}): AccountPreferencesData {
  return {
    appearance: (record.appearance as AccountPreferencesData['appearance']) || 'system',
    editorMode: (record.editorMode as AccountPreferencesData['editorMode']) || 'markdown',
    defaultLandingPage: record.defaultLandingPage,
    sidebarCollapsed: record.sidebarCollapsed,
    autosaveInterval: record.autosaveInterval,
    defaultPostStatus:
      (record.defaultPostStatus as AccountPreferencesData['defaultPostStatus']) || 'draft',
  }
}

export function mapNotifications(record: {
  emailNotifications: unknown
  inAppNotifications: unknown
}): AccountNotificationsData {
  return {
    email: parseJsonPrefs<EmailNotificationPrefs>(
      record.emailNotifications,
      DEFAULT_EMAIL_NOTIFICATIONS
    ),
    inApp: parseJsonPrefs<InAppNotificationPrefs>(
      record.inAppNotifications,
      DEFAULT_IN_APP_NOTIFICATIONS
    ),
  }
}

export async function getPrimaryRoleName(userId: string): Promise<string> {
  const role = await prisma.userRole.findFirst({
    where: { userId, role: { deletedAt: null } },
    include: { role: { select: { name: true } } },
    orderBy: { role: { name: 'asc' } },
  })
  return role?.role.name ?? 'Member'
}
