'use server'

import { revalidatePath } from 'next/cache'
import { verify } from 'otplib'
import prisma from '@/lib/db/prisma'
import { Prisma } from '@/generated/prisma/client'
import { verifyPassword, hashPassword } from '@/lib/auth/password'
import { validateCsrf } from '@/lib/auth/csrf'
import { requireSession, destroySession } from '@/lib/auth/session'
import {
  createMfaSecret,
  buildOtpAuthUrl,
  generateRecoveryCodes,
  hashRecoveryCodes,
} from '@/lib/auth/mfa'
import { logSecurityEvent } from '@/lib/auth/security-log'
import { logAudit } from '@/lib/audit'
import { emitPasswordChanged, emitTwoFactorEnabled } from '@/modules/notifications/events'
import type { CrudActionResult } from '@/lib/crud/types'
import { ensureUserPreferences } from '../repositories'
import {
  changePasswordSchema,
  deleteAccountSchema,
  mfaDisableSchema,
  mfaVerifySchema,
  notificationsSchema,
  preferencesSchema,
  profileSchema,
  sensitiveActionSchema,
} from '../validators'
import { exportAccountData } from '../services'
import type { AccountNotificationsData, AccountPreferencesData, MfaSetupData } from '../types'

const ACCOUNT_PATHS = [
  '/account/profile',
  '/account/security',
  '/account/sessions',
  '/account/preferences',
  '/account/notifications',
]

function revalidateAccount() {
  for (const path of ACCOUNT_PATHS) {
    revalidatePath(path)
  }
}

async function requireAccountSession() {
  const session = await requireSession()
  return session
}

async function verifyUserPassword(userId: string, password: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { passwordHash: true },
  })
  if (!user) return false
  return verifyPassword(password, user.passwordHash)
}

export async function updateProfileAction(
  input: unknown,
  csrfToken?: string
): Promise<CrudActionResult> {
  const csrfValid = await validateCsrf(csrfToken ?? null)
  if (!csrfValid) return { success: false, error: 'Invalid CSRF token' }

  const session = await requireAccountSession()
  const parsed = profileSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message }

  const slug = parsed.data.slug?.trim() || null
  if (slug) {
    const existing = await prisma.user.findFirst({
      where: { slug, id: { not: session.user.id } },
      select: { id: true },
    })
    if (existing) return { success: false, error: 'Username is already taken' }
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      fullName: parsed.data.fullName,
      slug,
      bio: parsed.data.bio?.trim() || null,
      website: parsed.data.website?.trim() || null,
      location: parsed.data.location?.trim() || null,
      avatar: parsed.data.avatar ?? null,
    },
  })

  await logAudit({
    actorId: session.user.id,
    entity: 'user',
    entityId: session.user.id,
    action: 'update_profile',
  })

  revalidateAccount()
  return { success: true }
}

export async function removeAvatarAction(csrfToken?: string): Promise<CrudActionResult> {
  const csrfValid = await validateCsrf(csrfToken ?? null)
  if (!csrfValid) return { success: false, error: 'Invalid CSRF token' }

  const session = await requireAccountSession()
  await prisma.user.update({
    where: { id: session.user.id },
    data: { avatar: null },
  })

  revalidateAccount()
  return { success: true }
}

export async function changePasswordAction(
  input: unknown,
  csrfToken?: string
): Promise<CrudActionResult> {
  const csrfValid = await validateCsrf(csrfToken ?? null)
  if (!csrfValid) return { success: false, error: 'Invalid CSRF token' }

  const session = await requireAccountSession()
  const parsed = changePasswordSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { passwordHash: true, mfaEnabled: true },
  })
  if (!user) return { success: false, error: 'User not found' }

  const valid = await verifyPassword(parsed.data.currentPassword, user.passwordHash)
  if (!valid) return { success: false, error: 'Current password is incorrect' }

  const passwordHash = await hashPassword(parsed.data.newPassword)
  await prisma.user.update({
    where: { id: session.user.id },
    data: { passwordHash, passwordChangedAt: new Date() },
  })

  await logSecurityEvent({
    userId: session.user.id,
    eventType: 'PASSWORD_CHANGE',
  })

  void emitPasswordChanged(session.user.id).catch(() => {})

  revalidateAccount()
  return { success: true }
}

export async function startMfaSetupAction(
  csrfToken?: string
): Promise<CrudActionResult<MfaSetupData>> {
  const csrfValid = await validateCsrf(csrfToken ?? null)
  if (!csrfValid) return { success: false, error: 'Invalid CSRF token' }

  const session = await requireAccountSession()
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { email: true, mfaEnabled: true },
  })
  if (!user) return { success: false, error: 'User not found' }
  if (user.mfaEnabled) return { success: false, error: '2FA is already enabled' }

  const secret = createMfaSecret()
  const recoveryCodes = generateRecoveryCodes()
  const otpAuthUrl = buildOtpAuthUrl(user.email, secret)

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      mfaSecret: secret,
      mfaRecoveryCodes: hashRecoveryCodes(recoveryCodes),
    },
  })

  return {
    success: true,
    data: { secret, otpAuthUrl, recoveryCodes },
  }
}

export async function confirmMfaSetupAction(
  input: unknown,
  csrfToken?: string
): Promise<CrudActionResult> {
  const csrfValid = await validateCsrf(csrfToken ?? null)
  if (!csrfValid) return { success: false, error: 'Invalid CSRF token' }

  const session = await requireAccountSession()
  const parsed = mfaVerifySchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { mfaSecret: true, mfaEnabled: true },
  })
  if (!user?.mfaSecret) return { success: false, error: 'Start 2FA setup first' }

  const result = await verify({ token: parsed.data.code, secret: user.mfaSecret })
  if (!result.valid) return { success: false, error: 'Invalid verification code' }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { mfaEnabled: true },
  })

  await logSecurityEvent({ userId: session.user.id, eventType: 'MFA_ENABLED' })
  void emitTwoFactorEnabled(session.user.id).catch(() => {})
  revalidateAccount()
  return { success: true }
}

export async function disableMfaAction(
  input: unknown,
  csrfToken?: string
): Promise<CrudActionResult> {
  const csrfValid = await validateCsrf(csrfToken ?? null)
  if (!csrfValid) return { success: false, error: 'Invalid CSRF token' }

  const session = await requireAccountSession()
  const parsed = mfaDisableSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message }

  const validPassword = await verifyUserPassword(session.user.id, parsed.data.password)
  if (!validPassword) return { success: false, error: 'Password is incorrect' }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { mfaEnabled: true, mfaSecret: true },
  })
  if (!user?.mfaEnabled) return { success: false, error: '2FA is not enabled' }

  if (parsed.data.code && user.mfaSecret) {
    const result = await verify({ token: parsed.data.code, secret: user.mfaSecret })
    if (!result.valid) return { success: false, error: 'Invalid 2FA code' }
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { mfaEnabled: false, mfaSecret: null, mfaRecoveryCodes: Prisma.JsonNull },
  })

  await logSecurityEvent({ userId: session.user.id, eventType: 'MFA_DISABLED' })
  revalidateAccount()
  return { success: true }
}

export async function revokeSessionAction(
  sessionId: string,
  csrfToken?: string
): Promise<CrudActionResult> {
  const csrfValid = await validateCsrf(csrfToken ?? null)
  if (!csrfValid) return { success: false, error: 'Invalid CSRF token' }

  const session = await requireAccountSession()
  const target = await prisma.session.findFirst({
    where: { id: sessionId, userId: session.user.id },
  })
  if (!target) return { success: false, error: 'Session not found' }

  await prisma.session.delete({ where: { id: sessionId } })

  await logSecurityEvent({
    userId: session.user.id,
    eventType: 'SESSION_REVOKED',
    metadata: { sessionId },
  })

  revalidateAccount()
  return { success: true }
}

export async function revokeOtherSessionsAction(csrfToken?: string): Promise<CrudActionResult> {
  const csrfValid = await validateCsrf(csrfToken ?? null)
  if (!csrfValid) return { success: false, error: 'Invalid CSRF token' }

  const session = await requireAccountSession()
  await prisma.session.deleteMany({
    where: { userId: session.user.id, id: { not: session.sessionId } },
  })

  await logSecurityEvent({
    userId: session.user.id,
    eventType: 'SESSION_REVOKED',
    metadata: { allOthers: true },
  })

  revalidateAccount()
  return { success: true }
}

export async function updatePreferencesAction(
  input: unknown,
  csrfToken?: string
): Promise<CrudActionResult<AccountPreferencesData>> {
  const csrfValid = await validateCsrf(csrfToken ?? null)
  if (!csrfValid) return { success: false, error: 'Invalid CSRF token' }

  const session = await requireAccountSession()
  const parsed = preferencesSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message }

  await ensureUserPreferences(session.user.id)
  const updated = await prisma.userPreference.update({
    where: { userId: session.user.id },
    data: parsed.data,
  })

  revalidateAccount()
  return {
    success: true,
    data: {
      appearance: updated.appearance as AccountPreferencesData['appearance'],
      editorMode: updated.editorMode as AccountPreferencesData['editorMode'],
      defaultLandingPage: updated.defaultLandingPage,
      sidebarCollapsed: updated.sidebarCollapsed,
      autosaveInterval: updated.autosaveInterval,
      defaultPostStatus: updated.defaultPostStatus as AccountPreferencesData['defaultPostStatus'],
    },
  }
}

export async function updateNotificationsAction(
  input: unknown,
  csrfToken?: string
): Promise<CrudActionResult<AccountNotificationsData>> {
  const csrfValid = await validateCsrf(csrfToken ?? null)
  if (!csrfValid) return { success: false, error: 'Invalid CSRF token' }

  const session = await requireAccountSession()
  const parsed = notificationsSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message }

  await ensureUserPreferences(session.user.id)
  await prisma.userPreference.update({
    where: { userId: session.user.id },
    data: {
      emailNotifications: parsed.data.email,
      inAppNotifications: parsed.data.inApp,
    },
  })

  revalidateAccount()
  return {
    success: true,
    data: {
      email: parsed.data.email,
      inApp: parsed.data.inApp,
    },
  }
}

export async function exportAccountDataAction(
  input: unknown,
  csrfToken?: string
): Promise<CrudActionResult<{ json: string }>> {
  const csrfValid = await validateCsrf(csrfToken ?? null)
  if (!csrfValid) return { success: false, error: 'Invalid CSRF token' }

  const session = await requireAccountSession()
  const parsed = sensitiveActionSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message }

  const valid = await verifyUserPassword(session.user.id, parsed.data.password)
  if (!valid) return { success: false, error: 'Password is incorrect' }

  const data = await exportAccountData(session.user.id)
  if (!data) return { success: false, error: 'Account not found' }

  await logSecurityEvent({ userId: session.user.id, eventType: 'ACCOUNT_EXPORT' })

  return { success: true, data: { json: JSON.stringify(data, null, 2) } }
}

export async function deleteAccountAction(
  input: unknown,
  csrfToken?: string
): Promise<CrudActionResult<{ redirect: string }>> {
  const csrfValid = await validateCsrf(csrfToken ?? null)
  if (!csrfValid) return { success: false, error: 'Invalid CSRF token' }

  const session = await requireAccountSession()
  const parsed = deleteAccountSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message }

  const valid = await verifyUserPassword(session.user.id, parsed.data.password)
  if (!valid) return { success: false, error: 'Password is incorrect' }

  await logSecurityEvent({ userId: session.user.id, eventType: 'ACCOUNT_DELETE' })

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      deletedAt: new Date(),
      status: 'INACTIVE',
      email: `deleted+${session.user.id}@local.invalid`,
    },
  })

  await prisma.session.deleteMany({ where: { userId: session.user.id } })
  await destroySession()

  return { success: true, data: { redirect: '/login' } }
}
