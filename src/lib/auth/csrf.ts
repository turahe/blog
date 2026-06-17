import { cookies } from 'next/headers'
import { createHash, randomBytes, timingSafeEqual } from 'crypto'
import { CSRF_COOKIE } from './constants'
import { useSecureCookies } from './cookie-options'

export function generateCsrfToken(): string {
  return randomBytes(32).toString('hex')
}

export async function setCsrfCookie(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(CSRF_COOKIE, token, {
    httpOnly: false,
    secure: useSecureCookies(),
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24,
  })
}

export async function readCsrfToken(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(CSRF_COOKIE)?.value
}

/** @deprecated Use ensureCsrfTokenAction() in Server Actions or client bootstrap */
export async function getCsrfToken(): Promise<string> {
  const token = await readCsrfToken()
  return token ?? ''
}

export async function validateCsrf(headerToken: string | null): Promise<boolean> {
  if (!headerToken) return false
  const cookieStore = await cookies()
  const cookieToken = cookieStore.get(CSRF_COOKIE)?.value
  if (!cookieToken) return false
  try {
    const a = Buffer.from(cookieToken)
    const b = Buffer.from(headerToken)
    if (a.length !== b.length) return false
    return timingSafeEqual(a, b)
  } catch {
    return false
  }
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}
