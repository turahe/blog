export interface ParsedUserAgent {
  device: string
  browser: string
  os: string
}

export function parseUserAgent(userAgent: string | null | undefined): ParsedUserAgent {
  if (!userAgent) {
    return { device: 'Unknown device', browser: 'Unknown browser', os: 'Unknown OS' }
  }

  const ua = userAgent.toLowerCase()

  let os = 'Unknown OS'
  if (ua.includes('windows')) os = 'Windows'
  else if (ua.includes('mac os') || ua.includes('macintosh')) os = 'macOS'
  else if (ua.includes('iphone') || ua.includes('ipad')) os = 'iOS'
  else if (ua.includes('android')) os = 'Android'
  else if (ua.includes('linux')) os = 'Linux'

  let browser = 'Unknown browser'
  if (ua.includes('edg/')) browser = 'Edge'
  else if (ua.includes('chrome/') && !ua.includes('edg/')) browser = 'Chrome'
  else if (ua.includes('firefox/')) browser = 'Firefox'
  else if (ua.includes('safari/') && !ua.includes('chrome/')) browser = 'Safari'
  else if (ua.includes('opr/') || ua.includes('opera')) browser = 'Opera'

  let device = 'Desktop'
  if (ua.includes('mobile') || ua.includes('iphone') || ua.includes('android')) device = 'Mobile'
  else if (ua.includes('ipad') || ua.includes('tablet')) device = 'Tablet'

  return { device, browser, os }
}

export function buildDeviceLabel(parsed: ParsedUserAgent): string {
  return `${parsed.browser} on ${parsed.os}`
}
