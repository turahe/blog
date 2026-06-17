import prisma from '@/lib/db/prisma'
import type { Prisma } from '@/lib/db/prisma'
import type { ListQueryParams, PaginatedResult } from '@/lib/crud/types'
import { parseListQuery, paginate } from '@/lib/crud/types'
import type { CommentListItem, CommentStatus } from '../types'

const commentInclude = {
  user: { select: { id: true, fullName: true, email: true, avatar: true } },
  post: { select: { id: true, slug: true, title: true } },
} satisfies Prisma.CommentInclude

export const commentRepository = {
  async findApprovedByPostSlug(postSlug: string) {
    return prisma.comment.findMany({
      where: {
        status: 'APPROVED',
        parentId: null,
        post: { slug: postSlug },
      },
      include: {
        ...commentInclude,
        replies: {
          where: { status: 'APPROVED' },
          include: commentInclude,
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'asc' },
    })
  },

  async countByPostId(postId: string) {
    return prisma.comment.count({
      where: { postId, status: { in: ['PENDING', 'APPROVED'] } },
    })
  },

  async findById(id: string) {
    return prisma.comment.findUnique({
      where: { id },
      include: commentInclude,
    })
  },

  async findManyAdmin(params: ListQueryParams): Promise<PaginatedResult<CommentListItem>> {
    const q = parseListQuery(params, { sortBy: 'createdAt' })
    const where: Prisma.CommentWhereInput = {}

    if (q.search) {
      where.OR = [
        { content: { contains: q.search, mode: 'insensitive' } },
        { authorName: { contains: q.search, mode: 'insensitive' } },
        { authorEmail: { contains: q.search, mode: 'insensitive' } },
        { post: { title: { contains: q.search, mode: 'insensitive' } } },
      ]
    }

    if (q.filters?.status) {
      where.status = q.filters.status as CommentStatus
    }

    const orderBy: Prisma.CommentOrderByWithRelationInput =
      q.sortBy === 'authorName'
        ? { authorName: q.sortOrder }
        : q.sortBy === 'status'
          ? { status: q.sortOrder }
          : { createdAt: q.sortOrder }

    const [rows, total] = await Promise.all([
      prisma.comment.findMany({
        where,
        include: { post: { select: { slug: true, title: true } } },
        orderBy,
        skip: (q.page - 1) * q.pageSize,
        take: q.pageSize,
      }),
      prisma.comment.count({ where }),
    ])

    const data: CommentListItem[] = rows.map((row) => ({
      id: row.id,
      postId: row.postId,
      postSlug: row.post.slug,
      postTitle: row.post.title,
      authorName: row.authorName,
      authorEmail: row.authorEmail,
      content: row.content,
      status: row.status,
      createdAt: row.createdAt.toISOString(),
    }))

    return paginate(data, total, q.page, q.pageSize)
  },

  async create(data: Prisma.CommentCreateInput) {
    return prisma.comment.create({ data, include: commentInclude })
  },

  async updateStatus(id: string, status: CommentStatus) {
    return prisma.comment.update({
      where: { id },
      data: { status },
    })
  },

  async delete(id: string) {
    return prisma.comment.delete({ where: { id } })
  },

  async bulkUpdateStatus(ids: string[], status: CommentStatus) {
    return prisma.comment.updateMany({
      where: { id: { in: ids } },
      data: { status },
    })
  },

  async bulkDelete(ids: string[]) {
    return prisma.comment.deleteMany({ where: { id: { in: ids } } })
  },
}
