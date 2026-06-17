export const SESSION_COOKIE = 'blog_session'
export const CSRF_COOKIE = 'blog_csrf'
export const CSRF_HEADER = 'x-csrf-token'

export const SESSION_TTL_MS = 24 * 60 * 60 * 1000 // 24 hours
export const REMEMBER_TTL_MS = 30 * 24 * 60 * 60 * 1000 // 30 days
export const SESSION_REFRESH_THRESHOLD_MS = 60 * 60 * 1000 // refresh if < 1h left

export const PROTECTED_PREFIXES = ['/admin', '/dashboard', '/settings'] as const

export const LOGIN_RATE_LIMIT = {
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000,
} as const
