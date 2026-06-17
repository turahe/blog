import { cache } from 'react'
import prisma from '@/lib/db/prisma'

const settingsCache = new Map<string, { value: string; expires: number }>()
const CACHE_TTL_MS = 60 * 1000

export const getSetting = cache(async (key: string): Promise<string | null> => {
  const cached = settingsCache.get(key)
  if (cached && cached.expires > Date.now()) return cached.value

  const setting = await prisma.setting.findUnique({ where: { key } })
  if (!setting) return null

  settingsCache.set(key, { value: setting.value, expires: Date.now() + CACHE_TTL_MS })
  return setting.value
})

export async function getSettingsByGroup(group: string) {
  return prisma.setting.findMany({ where: { group }, orderBy: { key: 'asc' } })
}

export function invalidateSettingsCache(key?: string): void {
  if (key) {
    settingsCache.delete(key)
  } else {
    settingsCache.clear()
  }
}
