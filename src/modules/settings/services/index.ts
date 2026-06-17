import { cache } from 'react'
import prisma from '@/lib/db/prisma'
import { settingRepository } from '../repositories'
import type {
  AdvancedSystemInfo,
  RolePermissionMatrix,
  SessionListItem,
  SettingsMap,
} from '../types'

import { SETTINGS_DEFAULTS } from '../config/defaults'

export const getSettingsMap = cache(async (): Promise<SettingsMap> => {
  const map = await settingRepository.findAllMap()
  for (const def of SETTINGS_DEFAULTS) {
    if (!(def.key in map)) map[def.key] = def.value
  }
  return map
})

export const getRolesMatrix = cache(async (): Promise<RolePermissionMatrix[]> => {
  const roles = await prisma.role.findMany({
    include: { rolePermissions: { include: { permission: true } } },
    orderBy: { name: 'asc' },
  })
  return roles.map((role) => ({
    id: role.id,
    slug: role.slug,
    name: role.name,
    permissions: role.rolePermissions.map((rp) => rp.permission.slug),
  }))
})

export async function getUserSessions(
  userId: string,
  currentSessionId?: string
): Promise<SessionListItem[]> {
  const sessions = await prisma.session.findMany({
    where: { userId, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })
  return sessions.map((s) => ({
    id: s.id,
    ip: s.ip,
    userAgent: s.userAgent,
    createdAt: s.createdAt.toISOString(),
    expiresAt: s.expiresAt.toISOString(),
    isCurrent: s.id === currentSessionId,
  }))
}

export const getAdvancedSystemInfo = cache(async (): Promise<AdvancedSystemInfo> => {
  let databaseStatus: AdvancedSystemInfo['databaseStatus'] = 'connected'
  try {
    await prisma.$queryRaw`SELECT 1`
  } catch {
    databaseStatus = 'error'
  }

  const [mediaAgg, settingsCount] = await Promise.all([
    prisma.media.aggregate({ _count: true, _sum: { size: true } }),
    prisma.setting.count(),
  ])

  return {
    nodeEnv: process.env.NODE_ENV ?? 'development',
    nextVersion: process.env.npm_package_dependencies_next?.replace('^', '') ?? '16.x',
    databaseStatus,
    mediaCount: mediaAgg._count,
    mediaBytes: mediaAgg._sum.size ?? 0,
    settingsCount,
  }
})
