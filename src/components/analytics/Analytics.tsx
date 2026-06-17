import Script from 'next/script'

interface UmamiProps {
  src?: string
  umamiWebsiteId?: string
  umamiHostUrl?: string
  umamiTag?: string
  umamiAutoTrack?: boolean | string
  umamiExcludeSearch?: boolean | string
  umamiDomains?: string
}

export function Umami({
  src = 'https://analytics.umami.is/script.js',
  umamiWebsiteId,
  umamiHostUrl,
  umamiTag,
  umamiAutoTrack,
  umamiExcludeSearch,
  umamiDomains,
}: UmamiProps) {
  const dataAttributes: Record<string, string> = {}

  if (umamiWebsiteId) dataAttributes['data-website-id'] = umamiWebsiteId
  if (umamiHostUrl) dataAttributes['data-host-url'] = umamiHostUrl
  if (umamiTag) dataAttributes['data-tag'] = umamiTag
  if (umamiAutoTrack !== undefined) dataAttributes['data-auto-track'] = String(umamiAutoTrack)
  if (umamiExcludeSearch !== undefined)
    dataAttributes['data-exclude-search'] = String(umamiExcludeSearch)
  if (umamiDomains) dataAttributes['data-domains'] = umamiDomains

  if (!umamiWebsiteId && !src) return null

  return <Script async defer src={src} {...dataAttributes} />
}

interface AnalyticsConfig {
  umamiAnalytics?: UmamiProps
}

export function Analytics({ analyticsConfig }: { analyticsConfig: AnalyticsConfig }) {
  if (process.env.NODE_ENV !== 'production') return null

  if (analyticsConfig.umamiAnalytics) {
    return <Umami {...analyticsConfig.umamiAnalytics} />
  }

  return null
}
