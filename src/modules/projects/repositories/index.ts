import prisma from '@/lib/db/prisma'
import type { Prisma } from '@/lib/db/prisma'
import type { ListQueryParams, PaginatedResult } from '@/lib/crud/types'
import { parseListQuery, paginate } from '@/lib/crud/types'

export const projectRepository = {
  async findMany(
    params: ListQueryParams
  ): Promise<PaginatedResult<Prisma.ProjectGetPayload<object>>> {
    const q = parseListQuery(params, { sortBy: 'sortOrder', pageSize: 50 })
    const where: Prisma.ProjectWhereInput = {}

    if (q.search) {
      where.OR = [
        { title: { contains: q.search, mode: 'insensitive' } },
        { description: { contains: q.search, mode: 'insensitive' } },
      ]
    }

    const orderBy: Prisma.ProjectOrderByWithRelationInput =
      q.sortBy === 'title' ? { title: q.sortOrder } : { sortOrder: q.sortOrder }

    const [data, total] = await Promise.all([
      prisma.project.findMany({
        where,
        orderBy,
        skip: (q.page - 1) * q.pageSize,
        take: q.pageSize,
      }),
      prisma.project.count({ where }),
    ])

    return paginate(data, total, q.page, q.pageSize)
  },

  async findById(id: string) {
    return prisma.project.findUnique({ where: { id } })
  },

  async create(data: Prisma.ProjectCreateInput) {
    return prisma.project.create({ data })
  },

  async update(id: string, data: Prisma.ProjectUpdateInput) {
    return prisma.project.update({ where: { id }, data })
  },

  async delete(id: string) {
    return prisma.project.delete({ where: { id } })
  },

  async bulkDelete(ids: string[]) {
    return prisma.project.deleteMany({ where: { id: { in: ids } } })
  },
}
