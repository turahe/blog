import prisma from '@/lib/db/prisma'
import type { Prisma, SecurityEventType } from '@/generated/prisma/client'

interface LogSecurityEventInput {
  userId: string
  eventType: SecurityEventType
  ip?: string | null
  userAgent?: string | null
  metadata?: Prisma.InputJsonValue
}

export async function logSecurityEvent(input: LogSecurityEventInput): Promise<void> {
  await prisma.userSecurityLog.create({
    data: {
      userId: input.userId,
      eventType: input.eventType,
      ip: input.ip ?? undefined,
      userAgent: input.userAgent ?? undefined,
      metadata: input.metadata ?? undefined,
    },
  })
}
