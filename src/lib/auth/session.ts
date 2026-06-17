import { cookies } from 'next/headers'
import { randomBytes } from 'crypto'
import prisma from '@/lib/db/prisma'
import { hashToken } from './csrf'
import { buildDeviceLabel, parseUserAgent } from './user-agent'
import {
  SESSION_COOKIE,
  SESSION_TTL_MS,
  REMEMBER_TTL_MS,
  SESSION_REFRESH_THRESHOLD_MS,
} from './constants'
import { useSecureCookies } from './cookie-options'
import type { User, UserStatus } from '@/lib/db/prisma'

export type SessionUser = Pick<User, 'id' | 'email' | 'fullName' | 'avatar' | 'status'>

export interface AuthSession {
  user: SessionUser
  sessionId: string
  expiresAt: Date
}

function generateSessionToken(): string {
  return randomBytes(48).toString('base64url')
}

export async function createSession(
  userId: string,
  options: { remember?: boolean; ip?: string; userAgent?: string } = {}
): Promise<string> {
  const token = generateSessionToken()
  const ttl = options.remember ? REMEMBER_TTL_MS : SESSION_TTL_MS
  const expiresAt = new Date(Date.now() + ttl)
  const parsedUa = parseUserAgent(options.userAgent)

  await prisma.session.create({
    data: {
      userId,
      tokenHash: hashToken(token),
      expiresAt,
      remember: options.remember ?? false,
      ip: options.ip,
      userAgent: options.userAgent,
      deviceLabel: buildDeviceLabel(parsedUa),
      browser: parsedUa.browser,
      os: parsedUa.os,
      lastActiveAt: new Date(),
    },
  })

  await prisma.user.update({
    where: { id: userId },
    data: { lastLoginAt: new Date() },
  })

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: useSecureCookies(),
    sameSite: 'lax',
    path: '/',
    maxAge: Math.floor(ttl / 1000),
  })

  return token
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value

  if (token) {
    await prisma.session.deleteMany({ where: { tokenHash: hashToken(token) } })
    cookieStore.delete(SESSION_COOKIE)
  }
}

async function findSessionByToken(token: string): Promise<AuthSession | null> {
  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          fullName: true,
          avatar: true,
          status: true,
          deletedAt: true,
        },
      },
    },
  })

  if (!session || session.expiresAt < new Date()) {
    if (session) {
      await prisma.session.delete({ where: { id: session.id } }).catch(() => {})
    }
    return null
  }

  if (session.user.deletedAt || session.user.status !== 'ACTIVE') {
    return null
  }

  return {
    user: {
      id: session.user.id,
      email: session.user.email,
      fullName: session.user.fullName,
      avatar: session.user.avatar,
      status: session.user.status,
    },
    sessionId: session.id,
    expiresAt: session.expiresAt,
  }
}

export async function refreshSessionIfNeeded(session: AuthSession, token: string): Promise<void> {
  const remaining = session.expiresAt.getTime() - Date.now()
  if (remaining > SESSION_REFRESH_THRESHOLD_MS) return

  const newExpiresAt = new Date(Date.now() + SESSION_TTL_MS)

  await prisma.session.update({
    where: { id: session.sessionId },
    data: { expiresAt: newExpiresAt },
  })

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: useSecureCookies(),
    sameSite: 'lax',
    path: '/',
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  })
}

export async function getSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) return null

  const session = await findSessionByToken(token)
  if (session) {
    await refreshSessionIfNeeded(session, token)
    await touchSessionActivity(session.sessionId)
  }
  return session
}

async function touchSessionActivity(sessionId: string): Promise<void> {
  const fiveMinutes = 5 * 60 * 1000
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    select: { lastActiveAt: true },
  })
  if (!session) return
  if (Date.now() - session.lastActiveAt.getTime() < fiveMinutes) return

  await prisma.session.update({
    where: { id: sessionId },
    data: { lastActiveAt: new Date() },
  })
}

export async function requireSession(): Promise<AuthSession> {
  const session = await getSession()
  if (!session) {
    throw new Error('UNAUTHORIZED')
  }
  return session
}

export function isActiveUser(status: UserStatus): boolean {
  return status === 'ACTIVE'
}
