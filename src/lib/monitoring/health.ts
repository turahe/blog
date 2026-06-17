import prisma from '@/lib/db/prisma'

export interface HealthStatus {
  status: 'ok' | 'degraded' | 'error'
  db: 'connected' | 'disconnected'
  memory: { heapUsedMb: number; heapTotalMb: number; rssMb: number }
  uptime: number
  timestamp: string
}

export async function getHealthStatus(): Promise<HealthStatus> {
  const mem = process.memoryUsage()
  let dbStatus: 'connected' | 'disconnected' = 'disconnected'

  try {
    await prisma.$queryRaw`SELECT 1`
    dbStatus = 'connected'
  } catch {
    dbStatus = 'disconnected'
  }

  return {
    status: dbStatus === 'connected' ? 'ok' : 'error',
    db: dbStatus,
    memory: {
      heapUsedMb: Math.round(mem.heapUsed / 1024 / 1024),
      heapTotalMb: Math.round(mem.heapTotal / 1024 / 1024),
      rssMb: Math.round(mem.rss / 1024 / 1024),
    },
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  }
}

export async function logRequest(
  method: string,
  path: string,
  statusCode: number,
  durationMs: number,
  ip?: string,
  userAgent?: string
): Promise<void> {
  try {
    await prisma.requestLog.create({
      data: { method, path, statusCode, durationMs, ip, userAgent },
    })
  } catch {
    // non-blocking
  }
}

export async function getRequestCountSince(since: Date): Promise<number> {
  return prisma.requestLog.count({ where: { createdAt: { gte: since } } })
}

export async function getDailyActiveUsers(): Promise<number> {
  const since = new Date()
  since.setHours(0, 0, 0, 0)
  const sessions = await prisma.session.findMany({
    where: { createdAt: { gte: since } },
    select: { userId: true },
    distinct: ['userId'],
  })
  return sessions.length
}
