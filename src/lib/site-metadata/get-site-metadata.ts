import { cache } from 'react'
import { getSettingsMap } from '@/modules/settings/services'
import type { ThemeMode } from '@/lib/theme/constants'
import type { SiteMetadata } from './types'

function pick(settings: Record<string, string>, key: string, fallback: string): string {
  const value = settings[key]
  return value !== undefined && value !== '' ? value : fallback
}

function asBool(settings: Record<string, string>, key: string, fallback: boolean): boolean {
  const value = settings[key]
  if (value === undefined || value === '') return fallback
  return value === 'true'
}

function asTheme(settings: Record<string, string>, key: string, fallback: ThemeMode): ThemeMode {
  const value = pick(settings, key, fallback)
  return (['light', 'dark', 'system'].includes(value) ? value : fallback) as ThemeMode
}

export const getSiteMetadata = cache(async (): Promise<SiteMetadata> => {
  const settings = await getSettingsMap()

  const title = pick(settings, 'site.name', 'Wach Blog')
  const commentsEnabled = asBool(settings, 'comments.enabled', true)
  const searchProvider = pick(settings, 'integrations.search_provider', 'cmdk')
  const normalizedProvider = searchProvider === 'kbar' ? 'cmdk' : searchProvider

  return {
    title,
    author: pick(settings, 'site.author', 'Author'),
    headerTitle: pick(settings, 'site.header_title', title),
    description: pick(settings, 'site.description', ''),
    language: pick(settings, 'site.language', 'en'),
    theme: asTheme(settings, 'appearance.theme', 'system'),
    siteUrl: pick(settings, 'site.url', 'https://example.com'),
    siteRepo: pick(settings, 'site.repo', ''),
    siteLogo: pick(settings, 'appearance.logo', '/static/images/logo.png'),
    socialBanner: pick(settings, 'seo.og_image', '/static/images/logo.png'),
    email: pick(settings, 'site.admin_email', 'admin@example.com'),
    github: pick(settings, 'social.github', ''),
    twitter: pick(settings, 'social.twitter', ''),
    facebook: pick(settings, 'social.facebook', ''),
    youtube: pick(settings, 'social.youtube', ''),
    linkedin: pick(settings, 'social.linkedin', ''),
    locale: pick(settings, 'site.locale', 'en-US'),
    analytics: {
      umamiAnalytics: {
        umamiWebsiteId: process.env.NEXT_UMAMI_ID,
        src: process.env.NEXT_UMAMI_SRC,
      },
    },
    newsletter: {
      provider: pick(settings, 'integrations.newsletter_provider', ''),
    },
    comments: {
      enabled: commentsEnabled,
      requireApproval: asBool(settings, 'comments.require_approval', true),
      guestEnabled: asBool(settings, 'comments.guest_enabled', false),
    },
    search:
      normalizedProvider === 'cmdk'
        ? {
            provider: 'cmdk',
            searchConfig: { searchDocumentsPath: 'search.json' },
          }
        : { provider: normalizedProvider },
  }
})
