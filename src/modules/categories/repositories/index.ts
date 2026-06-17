import prisma from '@/lib/db/prisma'
import type { Prisma } from '@/lib/db/prisma'
import type { ListQueryParams, PaginatedResult } from '@/lib/crud/types'
import { parseListQuery, paginate } from '@/lib/crud/types'

export type CategoryListItem = {
  id: string
  slug: string
  name: string
  postCount: number
}

export const categoryRepository = {
  async findMany(params: ListQueryParams): Promise<PaginatedResult<CategoryListItem>> {
    const q = parseListQuery(params, { sortBy: 'name' })
    const where: Prisma.CategoryWhereInput = {}

    if (q.search) {
      where.OR = [
        { name: { contains: q.search, mode: 'insensitive' } },
        { slug: { contains: q.search, mode: 'insensitive' } },
      ]
    }

    const orderBy: Prisma.CategoryOrderByWithRelationInput =
      q.sortBy === 'slug' ? { slug: q.sortOrder } : { name: q.sortOrder }

    const [rows, total] = await Promise.all([
      prisma.category.findMany({
        where,
        include: { _count: { select: { posts: true } } },
        orderBy,
        skip: (q.page - 1) * q.pageSize,
        take: q.pageSize,
      }),
      prisma.category.count({ where }),
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
    return prisma.category.findUnique({ where: { id } })
  },

  async findBySlug(slug: string) {
    return prisma.category.findUnique({ where: { slug } })
  },

  async create(data: Prisma.CategoryCreateInput) {
    return prisma.category.create({ data })
  },

  async update(id: string, data: Prisma.CategoryUpdateInput) {
    return prisma.category.update({ where: { id }, data })
  },

  async delete(id: string) {
    return prisma.category.delete({ where: { id } })
  },

  async bulkDelete(ids: string[]) {
    return prisma.category.deleteMany({ where: { id: { in: ids } } })
  },
}
