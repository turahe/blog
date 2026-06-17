export const SETTINGS_SECTIONS = [
  'general',
  'appearance',
  'seo',
  'social',
  'navigation',
  'comments',
  'users',
  'integrations',
  'security',
  'storage',
  'advanced',
] as const

export type SettingsSection = (typeof SETTINGS_SECTIONS)[number]

export type SettingType = 'string' | 'number' | 'boolean' | 'json'

export type SettingRecord = {
  key: string
  value: string
  type: SettingType
  group: string
}

export type SettingsMap = Record<string, string>

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error' | 'dirty'

export type MenuItemType = 'page' | 'category' | 'external'

export type NavigationMenuItem = {
  id: string
  type: MenuItemType
  label: string
  href: string
  categorySlug?: string
}

export type NavigationMenus = {
  header: NavigationMenuItem[]
  footer: NavigationMenuItem[]
}

export type RolePermissionMatrix = {
  id: string
  slug: string
  name: string
  permissions: string[]
}

export type SessionListItem = {
  id: string
  ip: string | null
  userAgent: string | null
  createdAt: string
  expiresAt: string
  isCurrent: boolean
}

export type AdvancedSystemInfo = {
  nodeEnv: string
  nextVersion: string
  databaseStatus: 'connected' | 'error'
  mediaCount: number
  mediaBytes: number
  settingsCount: number
}
