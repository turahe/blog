import prisma from '@/lib/db/prisma'
import type { Prisma } from '@/lib/db/prisma'
import type { ListQueryParams, PaginatedResult } from '@/lib/crud/types'
import { parseListQuery, paginate } from '@/lib/crud/types'
import type { SettingRecord } from '../types'

export const settingRepository = {
  async findMany(params: ListQueryParams): Promise<
    PaginatedResult<{
      id: string
      key: string
      value: string
      type: string
      group: string
      updatedAt: Date
    }>
  > {
    const q = parseListQuery(params, { sortBy: 'key' })
    const where: Prisma.SettingWhereInput = {}

    if (q.search) {
      where.OR = [{ key: { contains: q.search } }, { value: { contains: q.search } }]
    }
    if (q.filters?.group) where.group = q.filters.group

    const [rows, total] = await Promise.all([
      prisma.setting.findMany({
        where,
        orderBy: { key: q.sortOrder },
        skip: (q.page - 1) * q.pageSize,
        take: q.pageSize,
      }),
      prisma.setting.count({ where }),
    ])

    return paginate(rows, total, q.page, q.pageSize)
  },

  async findByKey(key: string) {
    return prisma.setting.findUnique({ where: { key } })
  },

  async findAllMap(): Promise<Record<string, string>> {
    const rows = await prisma.setting.findMany({ orderBy: { key: 'asc' } })
    return Object.fromEntries(rows.map((row) => [row.key, row.value]))
  },

  async findByKeys(keys: string[]) {
    const rows = await prisma.setting.findMany({ where: { key: { in: keys } } })
    return Object.fromEntries(rows.map((row) => [row.key, row]))
  },

  async upsert(key: string, value: string, type: string, group: string) {
    return prisma.setting.upsert({
      where: { key },
      create: { key, value, type, group },
      update: { value, type, group },
    })
  },

  async bulkUpsert(items: SettingRecord[]) {
    await prisma.$transaction(
      items.map((item) =>
        prisma.setting.upsert({
          where: { key: item.key },
          create: item,
          update: { value: item.value, type: item.type, group: item.group },
        })
      )
    )
  },

  async delete(key: string) {
    return prisma.setting.delete({ where: { key } })
  },
}
