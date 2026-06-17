import prisma from '@/lib/db/prisma'
import type { Prisma } from '@/lib/db/prisma'
import type { ListQueryParams, PaginatedResult } from '@/lib/crud/types'
import { parseListQuery, paginate } from '@/lib/crud/types'

export const permissionRepository = {
  async findMany(params: ListQueryParams): Promise<
    PaginatedResult<{
      id: string
      slug: string
      name: string
      description: string | null
      group: string
      roleCount: number
    }>
  > {
    const q = parseListQuery(params, { sortBy: 'slug' })
    const where: Prisma.PermissionWhereInput = {}

    if (q.search) {
      where.OR = [{ slug: { contains: q.search } }, { name: { contains: q.search } }]
    }

    if (q.filters?.group) {
      where.group = q.filters.group
    }

    const [rows, total] = await Promise.all([
      prisma.permission.findMany({
        where,
        orderBy: { slug: q.sortOrder },
        skip: (q.page - 1) * q.pageSize,
        take: q.pageSize,
        include: { _count: { select: { rolePermissions: true } } },
      }),
      prisma.permission.count({ where }),
    ])

    const data = rows.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      description: p.description,
      group: p.group,
      roleCount: p._count.rolePermissions,
    }))

    return paginate(data, total, q.page, q.pageSize)
  },

  async findAll() {
    return prisma.permission.findMany({ orderBy: [{ group: 'asc' }, { slug: 'asc' }] })
  },

  async findById(id: string) {
    return prisma.permission.findUnique({ where: { id } })
  },
}
