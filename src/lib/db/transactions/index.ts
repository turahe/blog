import prisma from '@/lib/db/prisma'
import type { Prisma } from '@/lib/db/prisma'

type TransactionClient = Prisma.TransactionClient

export async function withTransaction<T>(fn: (tx: TransactionClient) => Promise<T>): Promise<T> {
  return prisma.$transaction(fn)
}
