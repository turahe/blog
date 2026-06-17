import { cache } from 'react'
import { getSettingsMap } from '@/modules/settings/services'
import { buildStorageConfig } from './config'

export const getResolvedStorageConfig = cache(async () => {
  try {
    const settings = await getSettingsMap()
    return buildStorageConfig(settings)
  } catch {
    return buildStorageConfig()
  }
})
