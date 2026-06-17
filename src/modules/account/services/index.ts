import prisma from '@/lib/db/prisma'
import { getSiteMetadata } from '@/lib/site-metadata/get-site-metadata'
import { formatDateUtc } from '@/lib/formatDate'
import { ensureUserPreferences, getPrimaryRoleName, mapPreferences } from '../repositories'
import type {
  AccountHeaderData,
  AccountPreferencesData,
  AccountProfileData,
  AccountSecurityOverview,
  AccountSessionView,
} from '../types'

export async function getAccountHeader(userId: string): Promise<AccountHeaderData | null> {
  const user = await prisma.user.findFirst({
    where: { id: userId, deletedAt: null },
    select: {
      id: true,
      fullName: true,
      email: true,
      avatar: true,
      createdAt: true,
    },
  })
  if (!user) return null

  const primaryRole = await getPrimaryRoleName(userId)
  const memberSince = user.createdAt.toISOString()

  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    avatar: user.avatar,
    primaryRole,
    memberSince,
    memberSinceLabel: formatDateUtc(memberSince),
  }
}

export async function getAccountProfile(userId: string): Promise<AccountProfileData | null> {
  const [user, site] = await Promise.all([
    prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
      select: {
        id: true,
        fullName: true,
        slug: true,
        email: true,
        bio: true,
        website: true,
        location: true,
        avatar: true,
      },
    }),
    getSiteMetadata(),
  ])

  if (!user) return null

  const authorSlug = user.slug ?? 'author'
  const baseUrl = site.siteUrl.replace(/\/$/, '')

  return {
    ...user,
    authorUrl: `${baseUrl}/author/${authorSlug}`,
  }
}

export async function getAccountSecurityOverview(
  userId: string
): Promise<AccountSecurityOverview | null> {
  const user = await prisma.user.findFirst({
    where: { id: userId, deletedAt: null },
    select: {
      passwordChangedAt: true,
      lastLoginAt: true,
      mfaEnabled: true,
    },
  })
  if (!user) return null

  const lastFailed = await prisma.failedLogin.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: { createdAt: true },
  })

  return {
    lastPasswordChange: user.passwordChangedAt?.toISOString() ?? null,
    lastLogin: user.lastLoginAt?.toISOString() ?? null,
    lastFailedLogin: lastFailed?.createdAt.toISOString() ?? null,
    mfaEnabled: user.mfaEnabled,
  }
}

export async function getAccountSessions(
  userId: string,
  currentSessionId: string
): Promise<AccountSessionView[]> {
  const sessions = await prisma.session.findMany({
    where: { userId, expiresAt: { gt: new Date() } },
    orderBy: { lastActiveAt: 'desc' },
  })

  return sessions.map((session) => ({
    id: session.id,
    device: session.deviceLabel ?? 'Unknown device',
    browser: session.browser ?? 'Unknown browser',
    os: session.os ?? 'Unknown OS',
    ip: session.ip,
    location: session.location,
    lastActiveAt: session.lastActiveAt.toISOString(),
    createdAt: session.createdAt.toISOString(),
    isCurrent: session.id === currentSessionId,
  }))
}

export async function getAccountPreferences(userId: string): Promise<AccountPreferencesData> {
  const prefs = await ensureUserPreferences(userId)
  return mapPreferences(prefs)
}

export async function getAccountNotifications(userId: string) {
  const prefs = await ensureUserPreferences(userId)
  const { mapLegacyNotificationPrefs } = await import('@/modules/notifications/utils/prefs')
  return mapLegacyNotificationPrefs(prefs.emailNotifications, prefs.inAppNotifications)
}

export async function exportAccountData(userId: string) {
  const user = await prisma.user.findFirst({
    where: { id: userId, deletedAt: null },
    include: {
      userRoles: { include: { role: { select: { slug: true, name: true } } } },
      preferences: true,
      securityLogs: { orderBy: { createdAt: 'desc' }, take: 100 },
      sessions: {
        where: { expiresAt: { gt: new Date() } },
        select: {
          id: true,
          browser: true,
          os: true,
          ip: true,
          lastActiveAt: true,
          createdAt: true,
        },
      },
    },
  })

  if (!user) return null

  const {
    passwordHash: _passwordHash,
    mfaSecret: _mfaSecret,
    mfaRecoveryCodes: _mfaRecoveryCodes,
    ...safeUser
  } = user
  void _passwordHash
  void _mfaSecret
  void _mfaRecoveryCodes
  return {
    exportedAt: new Date().toISOString(),
    user: safeUser,
  }
}
