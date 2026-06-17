import type { ThemeMode } from '@/lib/theme/constants'

export type SiteMetadata = {
  title: string
  author: string
  headerTitle: string
  description: string
  language: string
  theme: ThemeMode
  siteUrl: string
  siteRepo: string
  siteLogo: string
  socialBanner: string
  email: string
  github: string
  twitter: string
  facebook: string
  youtube: string
  linkedin: string
  locale: string
  analytics: {
    umamiAnalytics?: {
      umamiWebsiteId?: string
      src?: string
    }
  }
  newsletter: {
    provider?: string
  }
  comments: {
    enabled: boolean
    requireApproval: boolean
    guestEnabled: boolean
  }
  search: {
    provider?: string
  }
}
