export const THEME_STORAGE_KEY = 'theme'
export const THEME_ATTRIBUTE = 'class'
export const THEME_DEFAULT = 'system'
export const THEME_MODES = ['light', 'dark'] as const

export type ThemeMode = (typeof THEME_MODES)[number] | 'system'
