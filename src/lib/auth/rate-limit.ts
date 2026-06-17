import prisma from '@/lib/db/prisma'
import { LOGIN_RATE_LIMIT } from './constants'
import { emitFailedLoginAttempt } from '@/modules/notifications/events'

export async function isLoginRateLimited(email: string, ip?: string): Promise<boolean> {
  if (process.env.AUTH_DISABLE_RATE_LIMIT === 'true') {
    return false
  }

  const since = new Date(Date.now() - LOGIN_RATE_LIMIT.windowMs)

  const [emailCount, ipCount] = await Promise.all([
    prisma.failedLogin.count({
      where: { email: email.toLowerCase(), createdAt: { gte: since } },
    }),
    ip
      ? prisma.failedLogin.count({
          where: { ip, createdAt: { gte: since } },
        })
      : Promise.resolve(0),
  ])

  return emailCount >= LOGIN_RATE_LIMIT.maxAttempts || ipCount >= LOGIN_RATE_LIMIT.maxAttempts
}

export async function recordFailedLogin(
  email: string,
  ip?: string,
  userAgent?: string,
  userId?: string
): Promise<void> {
  await prisma.failedLogin.create({
    data: {
      email: email.toLowerCase(),
      ip,
      userAgent,
      userId,
    },
  })

  if (userId) {
    void emitFailedLoginAttempt({ userId, ip }).catch(() => {})
  }
}
