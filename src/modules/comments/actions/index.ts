'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import prisma from '@/lib/db/prisma'
import { getSession } from '@/lib/auth/session'
import { requirePermission } from '@/lib/rbac'
import { logAudit } from '@/lib/audit'
import { commentRepository } from '../repositories'
import { createCommentSchema, moderateCommentSchema } from '../validators'
import { getCommentSettings, getPostIdBySlug } from '../services'
import { emitCommentModerated, emitNewComment } from '@/modules/notifications/events'
import type { CrudActionResult } from '@/lib/crud/types'

async function getRequestMeta() {
  const headerStore = await headers()
  return {
    ip: headerStore.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null,
    userAgent: headerStore.get('user-agent'),
  }
}

export async function createCommentAction(
  input: unknown
): Promise<CrudActionResult<{ id: string; status: string }>> {
  const parsed = createCommentSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid comment' }
  }

  const settings = await getCommentSettings()
  if (!settings.enabled) {
    return { success: false, error: 'Comments are disabled' }
  }

  const session = await getSession()
  const postId = await getPostIdBySlug(parsed.data.postSlug)
  if (!postId) {
    return { success: false, error: 'Post not found' }
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { title: true },
  })

  if (!session && !settings.guestEnabled) {
    return { success: false, error: 'Sign in to comment' }
  }

  const count = await commentRepository.countByPostId(postId)
  if (count >= settings.limitPerPost) {
    return { success: false, error: 'Comment limit reached for this post' }
  }

  if (parsed.data.parentId) {
    const parent = await commentRepository.findById(parsed.data.parentId)
    if (!parent || parent.postId !== postId || parent.status !== 'APPROVED') {
      return { success: false, error: 'Invalid reply target' }
    }
  }

  const authorName = session?.user.fullName ?? parsed.data.authorName?.trim()
  const authorEmail = session?.user.email ?? (parsed.data.authorEmail?.trim() || null)

  if (!authorName) {
    return { success: false, error: 'Name is required' }
  }

  if (!session && !authorEmail) {
    return { success: false, error: 'Email is required for guest comments' }
  }

  const status = settings.requireApproval ? 'PENDING' : 'APPROVED'
  const meta = await getRequestMeta()

  const comment = await commentRepository.create({
    content: parsed.data.content,
    status,
    authorName,
    authorEmail,
    ip: meta.ip,
    userAgent: meta.userAgent,
    post: { connect: { id: postId } },
    parent: parsed.data.parentId ? { connect: { id: parsed.data.parentId } } : undefined,
    user: session ? { connect: { id: session.user.id } } : undefined,
  })

  revalidatePath(`/blog/${parsed.data.postSlug}`)
  revalidatePath('/admin/comments')

  if (post?.title) {
    void emitNewComment({
      authorName,
      postId,
      postTitle: post.title,
      commentId: comment.id,
    }).catch(() => {})
  }

  return {
    success: true,
    data: {
      id: comment.id,
      status: comment.status,
    },
  }
}

export async function moderateCommentAction(
  input: unknown
): Promise<CrudActionResult<{ id: string }>> {
  await requirePermission('comments.moderate')
  const parsed = moderateCommentSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid request' }
  }

  const existing = await commentRepository.findById(parsed.data.id)
  if (!existing) {
    return { success: false, error: 'Comment not found' }
  }

  const updated = await commentRepository.updateStatus(parsed.data.id, parsed.data.status)
  const session = await getSession()

  await logAudit({
    actorId: session?.user.id,
    entity: 'comment',
    entityId: updated.id,
    action: 'update',
    before: { status: existing.status },
    after: { status: updated.status },
  })

  revalidatePath(`/blog/${existing.post.slug}`)
  revalidatePath('/admin/comments')

  if (existing.userId && existing.status !== updated.status && updated.status !== 'PENDING') {
    void emitCommentModerated({
      userId: existing.userId,
      status: updated.status as 'APPROVED' | 'SPAM' | 'TRASH',
      postTitle: existing.post.title,
      commentId: updated.id,
    }).catch(() => {})
  }

  return { success: true, data: { id: updated.id } }
}

export async function bulkModerateCommentsAction(
  ids: string[],
  status: 'APPROVED' | 'SPAM' | 'TRASH'
): Promise<CrudActionResult<{ count: number }>> {
  await requirePermission('comments.moderate')
  if (ids.length === 0) return { success: false, error: 'No comments selected' }

  const result = await commentRepository.bulkUpdateStatus(ids, status)
  revalidatePath('/admin/comments')

  return { success: true, data: { count: result.count } }
}

export async function bulkApproveCommentsAction(
  ids: string[]
): Promise<CrudActionResult<{ count: number }>> {
  return bulkModerateCommentsAction(ids, 'APPROVED')
}

export async function bulkMarkSpamCommentsAction(
  ids: string[]
): Promise<CrudActionResult<{ count: number }>> {
  return bulkModerateCommentsAction(ids, 'SPAM')
}

export async function bulkDeleteCommentsAction(
  ids: string[]
): Promise<CrudActionResult<{ count: number }>> {
  await requirePermission('comments.delete')
  if (ids.length === 0) return { success: false, error: 'No comments selected' }

  const result = await commentRepository.bulkDelete(ids)
  revalidatePath('/admin/comments')

  return { success: true, data: { count: result.count } }
}
