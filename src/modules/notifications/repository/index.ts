import prisma from '@/lib/db/prisma'
import type { NotificationCategory, Prisma } from '@/generated/prisma/client'
import { resolveNotificationHref } from '../constants'
import type { NotificationData, NotificationQuery, NotificationView } from '../types'

function mapRow(row: {
  id: string
  type: string
  category: NotificationCategory
  title: string
  message: string
  data: unknown
  readAt: Date | null
  createdAt: Date
}): NotificationView {
  const data = (row.data as NotificationData | null) ?? null
  return {
    id: row.id,
    type: row.type,
    category: row.category,
    title: row.title,
    message: row.message,
    data,
    href: resolveNotificationHref(row.type, data),
    read: row.readAt !== null,
    readAt: row.readAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
  }
}

export async function countUnread(userId: string): Promise<number> {
  return prisma.notification.count({
    where: { userId, readAt: null },
  })
}

export async function findNotifications(
  userId: string,
  query: NotificationQuery
): Promise<{ items: NotificationView[]; nextCursor: string | null }> {
  const limit = query.limit ?? 20
  const where: Prisma.NotificationWhereInput = { userId }

  if (query.tab === 'unread' || query.status === 'unread') {
    where.readAt = null
  } else if (query.status === 'read') {
    where.readAt = { not: null }
  }

  if (query.category && query.category !== 'all') {
    where.category = query.category
  }

  if (query.range && query.range !== 'all') {
    const { getDateRangeStart } = await import('../constants')
    const start = getDateRangeStart(query.range)
    if (start) where.createdAt = { gte: start }
  }

  if (query.search?.trim()) {
    where.OR = [
      { title: { contains: query.search.trim(), mode: 'insensitive' } },
      { message: { contains: query.search.trim(), mode: 'insensitive' } },
    ]
  }

  if (query.cursor) {
    where.createdAt = {
      ...(where.createdAt as Prisma.DateTimeFilter | undefined),
      lt: new Date(query.cursor),
    }
  }

  const rows = await prisma.notification.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: limit + 1,
  })

  const hasMore = rows.length > limit
  const items = rows.slice(0, limit).map(mapRow)
  const nextCursor = hasMore ? (items[items.length - 1]?.createdAt ?? null) : null

  return { items, nextCursor }
}

export async function findNotificationsSince(
  userId: string,
  since: Date
): Promise<NotificationView[]> {
  const rows = await prisma.notification.findMany({
    where: { userId, createdAt: { gt: since } },
    orderBy: { createdAt: 'asc' },
    take: 20,
  })
  return rows.map(mapRow)
}

export async function markNotificationRead(userId: string, id: string): Promise<boolean> {
  const result = await prisma.notification.updateMany({
    where: { id, userId, readAt: null },
    data: { readAt: new Date() },
  })
  return result.count > 0
}

export async function markAllNotificationsRead(userId: string): Promise<number> {
  const result = await prisma.notification.updateMany({
    where: { userId, readAt: null },
    data: { readAt: new Date() },
  })
  return result.count
}

export async function deleteNotification(userId: string, id: string): Promise<boolean> {
  const result = await prisma.notification.deleteMany({
    where: { id, userId },
  })
  return result.count > 0
}

export async function createNotificationRecord(input: {
  userId: string
  type: string
  category: NotificationCategory
  title: string
  message: string
  data?: NotificationData | null
}) {
  return prisma.notification.create({
    data: {
      userId: input.userId,
      type: input.type,
      category: input.category,
      title: input.title,
      message: input.message,
      data: (input.data ?? undefined) as Prisma.InputJsonValue | undefined,
    },
  })
}

export async function createManyNotificationRecords(
  inputs: {
    userId: string
    type: string
    category: NotificationCategory
    title: string
    message: string
    data?: NotificationData | null
  }[]
) {
  if (inputs.length === 0) return { count: 0 }
  return prisma.notification.createMany({
    data: inputs.map((input) => ({
      userId: input.userId,
      type: input.type,
      category: input.category,
      title: input.title,
      message: input.message,
      data: (input.data ?? undefined) as Prisma.InputJsonValue | undefined,
    })),
  })
}
