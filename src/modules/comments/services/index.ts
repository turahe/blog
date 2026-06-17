import { cache } from 'react'
import { getSettingsMap } from '@/modules/settings/services'
import prisma from '@/lib/db/prisma'
import { commentRepository } from '../repositories'
import type { CommentItem, CommentSettings } from '../types'
import type { ListQueryParams } from '@/lib/crud/types'

function mapComment(row: {
  id: string
  postId: string
  parentId: string | null
  content: string
  status: string
  authorName: string
  authorEmail: string | null
  createdAt: Date
  user: { id: string; fullName: string; email: string; avatar: string | null } | null
  post: { slug: string; title: string }
  replies?: Array<{
    id: string
    postId: string
    parentId: string | null
    content: string
    status: string
    authorName: string
    authorEmail: string | null
    createdAt: Date
    user: { id: string; fullName: string; email: string; avatar: string | null } | null
    post: { slug: string; title: string }
  }>
}): CommentItem {
  return {
    id: row.id,
    postId: row.postId,
    postSlug: row.post.slug,
    postTitle: row.post.title,
    parentId: row.parentId,
    content: row.content,
    status: row.status as CommentItem['status'],
    author: {
      name: row.user?.fullName ?? row.authorName,
      email: row.user?.email ?? row.authorEmail,
      avatar: row.user?.avatar ?? null,
      userId: row.user?.id ?? null,
    },
    createdAt: row.createdAt.toISOString(),
    replies: (row.replies ?? []).map((reply) => mapComment({ ...reply, replies: [] })),
  }
}

export const getCommentSettings = cache(async (): Promise<CommentSettings> => {
  const settings = await getSettingsMap()
  const limit = Number.parseInt(settings['comments.limit_per_post'] ?? '100', 10)

  return {
    enabled: settings['comments.enabled'] !== 'false',
    requireApproval: settings['comments.require_approval'] !== 'false',
    guestEnabled: settings['comments.guest_enabled'] === 'true',
    limitPerPost: Number.isFinite(limit) && limit > 0 ? limit : 100,
  }
})

export const listApprovedCommentsForPost = cache(
  async (postSlug: string): Promise<CommentItem[]> => {
    const rows = await commentRepository.findApprovedByPostSlug(postSlug)
    return rows.map((row) => mapComment(row))
  }
)

export const listCommentsAdmin = cache(async (params: ListQueryParams) => {
  return commentRepository.findManyAdmin(params)
})

export async function getPostIdBySlug(slug: string) {
  const post = await prisma.post.findUnique({
    where: { slug },
    select: { id: true },
  })
  return post?.id ?? null
}
