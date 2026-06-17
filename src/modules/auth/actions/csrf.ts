'use server'

import { cookies } from 'next/headers'
import { CSRF_COOKIE } from '@/lib/auth/constants'
import { generateCsrfToken, setCsrfCookie } from '@/lib/auth/csrf'

export async function ensureCsrfTokenAction(): Promise<string> {
  const cookieStore = await cookies()
  const existing = cookieStore.get(CSRF_COOKIE)?.value
  if (existing) return existing

  const token = generateCsrfToken()
  await setCsrfCookie(token)
  return token
}
