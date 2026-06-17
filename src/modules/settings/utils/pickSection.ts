import { SETTINGS_DEFAULTS } from '../config/defaults'
import { SECTION_KEYS } from '../config/keys'
import type { SettingsMap, SettingsSection } from '../types'

export function pickSectionValues(section: SettingsSection, map: SettingsMap): SettingsMap {
  const keys = SECTION_KEYS[section]
  const result: SettingsMap = {}
  for (const key of keys) {
    const def = SETTINGS_DEFAULTS.find((d) => d.key === key)
    result[key] = map[key] ?? def?.value ?? ''
  }
  return result
}
