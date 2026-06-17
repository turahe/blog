import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@/generated/prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required for database operations')
  }

  const adapter = new PrismaPg({ connectionString: databaseUrl })
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma

export type { Prisma } from '@/generated/prisma/client'
export type {
  User,
  UserStatus,
  Post,
  Tag,
  Category,
  Project,
  Experience,
  Role,
  Permission,
  Session,
  AuditLog,
  Setting,
} from '@/generated/prisma/client'
