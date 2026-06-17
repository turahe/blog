import prisma from '@/lib/db/prisma'
import type { Prisma } from '@/lib/db/prisma'
import type { ListQueryParams, PaginatedResult } from '@/lib/crud/types'
import { parseListQuery, paginate } from '@/lib/crud/types'

export type TagListItem = {
  id: string
  slug: string
  name: string
  postCount: number
}

export const tagAdminRepository = {
  async findMany(params: ListQueryParams): Promise<PaginatedResult<TagListItem>> {
    const q = parseListQuery(params, { sortBy: 'name' })
    const where: Prisma.TagWhereInput = {}

    if (q.search) {
      where.OR = [
        { name: { contains: q.search, mode: 'insensitive' } },
        { slug: { contains: q.search, mode: 'insensitive' } },
      ]
    }

    const orderBy: Prisma.TagOrderByWithRelationInput =
      q.sortBy === 'slug' ? { slug: q.sortOrder } : { name: q.sortOrder }

    const [rows, total] = await Promise.all([
      prisma.tag.findMany({
        where,
        include: { _count: { select: { posts: true } } },
        orderBy,
        skip: (q.page - 1) * q.pageSize,
        take: q.pageSize,
      }),
      prisma.tag.count({ where }),
    ])

    const data = rows.map((row) => ({
      id: row.id,
      slug: row.slug,
      name: row.name,
      postCount: row._count.posts,
    }))

    return paginate(data, total, q.page, q.pageSize)
  },

  async findById(id: string) {
    return prisma.tag.findUnique({ where: { id } })
  },

  async findBySlug(slug: string) {
    return prisma.tag.findUnique({ where: { slug } })
  },

  async create(data: Prisma.TagCreateInput) {
    return prisma.tag.create({ data })
  },

  async update(id: string, data: Prisma.TagUpdateInput) {
    return prisma.tag.update({ where: { id }, data })
  },

  async delete(id: string) {
    return prisma.tag.delete({ where: { id } })
  },

  async bulkDelete(ids: string[]) {
    return prisma.tag.deleteMany({ where: { id: { in: ids } } })
  },
}
