import prisma from '@/lib/db/prisma'
import type { Prisma } from '@/lib/db/prisma'

export interface AuditEntry {
  actorId?: string
  entity: string
  entityId?: string
  action: string
  before?: Prisma.InputJsonValue
  after?: Prisma.InputJsonValue
}

export async function logAudit(entry: AuditEntry): Promise<void> {
  await prisma.auditLog.create({
    data: {
      actorId: entry.actorId,
      entity: entry.entity,
      entityId: entry.entityId,
      action: entry.action,
      before: entry.before ?? undefined,
      after: entry.after ?? undefined,
    },
  })
}
