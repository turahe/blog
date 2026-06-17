import prisma from '@/lib/db/prisma'
import type { Prisma } from '@/lib/db/prisma'
import type { ListQueryParams, PaginatedResult } from '@/lib/crud/types'
import { parseListQuery, paginate } from '@/lib/crud/types'

export type PostListItem = {
  id: string
  slug: string
  title: string
  draft: boolean
  date: Date
  category: string | null
  tagCount: number
}

const listInclude = {
  category: { select: { name: true } },
  _count: { select: { tags: true } },
} as const

export const postAdminRepository = {
  async findMany(params: ListQueryParams): Promise<PaginatedResult<PostListItem>> {
    const q = parseListQuery(params, { sortBy: 'date' })
    const where: Prisma.PostWhereInput = {}

    if (q.search) {
      where.OR = [
        { title: { contains: q.search, mode: 'insensitive' } },
        { slug: { contains: q.search, mode: 'insensitive' } },
        { summary: { contains: q.search, mode: 'insensitive' } },
      ]
    }

    if (q.filters?.draft === 'true') where.draft = true
    if (q.filters?.draft === 'false') where.draft = false

    const orderBy: Prisma.PostOrderByWithRelationInput = {}
    if (q.sortBy === 'title' || q.sortBy === 'slug' || q.sortBy === 'date') {
      orderBy[q.sortBy] = q.sortOrder
    } else {
      orderBy.date = 'desc'
    }

    const [rows, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: listInclude,
        orderBy,
        skip: (q.page - 1) * q.pageSize,
        take: q.pageSize,
      }),
      prisma.post.count({ where }),
    ])

    const data = rows.map((row) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      draft: row.draft,
      date: row.date,
      category: row.category?.name ?? null,
      tagCount: row._count.tags,
    }))

    return paginate(data, total, q.page, q.pageSize)
  },

  async findById(id: string) {
    return prisma.post.findUnique({
      where: { id },
      include: {
        category: true,
        tags: { include: { tag: true } },
        authors: { include: { user: { select: { id: true, fullName: true, slug: true } } } },
      },
    })
  },

  async findBySlug(slug: string) {
    return prisma.post.findUnique({ where: { slug } })
  },

  async create(data: Prisma.PostCreateInput) {
    return prisma.post.create({ data })
  },

  async update(id: string, data: Prisma.PostUpdateInput) {
    return prisma.post.update({ where: { id }, data })
  },

  async delete(id: string) {
    return prisma.post.delete({ where: { id } })
  },

  async bulkDelete(ids: string[]) {
    return prisma.post.deleteMany({ where: { id: { in: ids } } })
  },

  async setTags(postId: string, tagIds: string[]) {
    await prisma.postTag.deleteMany({ where: { postId } })
    if (tagIds.length > 0) {
      await prisma.postTag.createMany({
        data: tagIds.map((tagId) => ({ postId, tagId })),
      })
    }
  },

  async setAuthors(postId: string, userIds: string[]) {
    await prisma.postAuthor.deleteMany({ where: { postId } })
    if (userIds.length > 0) {
      await prisma.postAuthor.createMany({
        data: userIds.map((userId) => ({ postId, userId })),
      })
    }
  },
}
