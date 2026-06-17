export function useSecureCookies(): boolean {
  return process.env.NODE_ENV === 'production' && process.env.AUTH_COOKIE_SECURE !== 'false'
}
