'use server'

import prisma from '@/lib/db/prisma'
import { verifyPassword } from '@/lib/auth/password'
import { createSession, destroySession } from '@/lib/auth/session'
import { validateCsrf } from '@/lib/auth/csrf'
import { isLoginRateLimited, recordFailedLogin } from '@/lib/auth/rate-limit'
import { sanitizeEmail } from '@/lib/security/sanitize'
import { loginSchema } from '../validators/login'
import { logAudit } from '@/lib/audit'
import { emitNewLogin } from '@/modules/notifications/events'
import type { CrudActionResult } from '@/lib/crud/types'

export async function loginAction(
  formData: FormData,
  meta: { ip?: string; userAgent?: string; csrfToken?: string }
): Promise<CrudActionResult<{ redirect: string }>> {
  const csrfValid = await validateCsrf(meta.csrfToken ?? null)
  if (!csrfValid) {
    return { success: false, error: 'Invalid CSRF token' }
  }

  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    remember: formData.get('remember') === 'on' || formData.get('remember') === 'true',
  })

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' }
  }

  const email = sanitizeEmail(parsed.data.email)

  if (await isLoginRateLimited(email, meta.ip)) {
    return { success: false, error: 'Too many login attempts. Try again later.' }
  }

  const user = await prisma.user.findFirst({
    where: { email, deletedAt: null },
  })

  if (!user || user.status !== 'ACTIVE') {
    await recordFailedLogin(email, meta.ip, meta.userAgent)
    return { success: false, error: 'Invalid email or password' }
  }

  const valid = await verifyPassword(parsed.data.password, user.passwordHash)
  if (!valid) {
    await recordFailedLogin(email, meta.ip, meta.userAgent, user.id)
    return { success: false, error: 'Invalid email or password' }
  }

  await createSession(user.id, {
    remember: parsed.data.remember,
    ip: meta.ip,
    userAgent: meta.userAgent,
  })

  await logAudit({
    actorId: user.id,
    entity: 'user',
    entityId: user.id,
    action: 'login',
  })

  void emitNewLogin({
    userId: user.id,
    ip: meta.ip,
    userAgent: meta.userAgent,
  }).catch(() => {})

  return { success: true, data: { redirect: '/admin' } }
}

export async function logoutAction(csrfToken?: string): Promise<CrudActionResult> {
  const csrfValid = await validateCsrf(csrfToken ?? null)
  if (!csrfValid) {
    return { success: false, error: 'Invalid CSRF token' }
  }

  const session = await import('@/lib/auth/session').then((m) => m.getSession())
  await destroySession()

  if (session) {
    await logAudit({
      actorId: session.user.id,
      entity: 'user',
      entityId: session.user.id,
      action: 'logout',
    })
  }

  return { success: true, data: { redirect: '/login' } }
}
