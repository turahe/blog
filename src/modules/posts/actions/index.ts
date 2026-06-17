'use server'

import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/auth/session'
import { requirePermission } from '@/lib/rbac'
import { logAudit } from '@/lib/audit'
import { computePostMeta } from '@/lib/content/post-meta'
import { emitPostPublished } from '@/modules/notifications/events'
import { postAdminRepository } from '../repositories'
import { createPostSchema, updatePostSchema } from '../validators'
import type { CrudActionResult } from '@/lib/crud/types'

function buildPostPath(slug: string) {
  return `blog/${slug}`
}

export async function createPostAction(input: unknown): Promise<CrudActionResult<{ id: string }>> {
  await requirePermission('posts.create')
  const session = await getSession()
  const parsed = createPostSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message }
  }

  const existing = await postAdminRepository.findBySlug(parsed.data.slug)
  if (existing) return { success: false, error: 'Slug already exists' }

  const meta = await computePostMeta(parsed.data.body)
  const images = parsed.data.featuredImage?.trim() ? [parsed.data.featuredImage.trim()] : undefined

  const post = await postAdminRepository.create({
    slug: parsed.data.slug,
    title: parsed.data.title,
    date: new Date(parsed.data.date),
    lastmod: parsed.data.lastmod ? new Date(parsed.data.lastmod) : null,
    draft: parsed.data.draft,
    summary: parsed.data.summary || null,
    body: parsed.data.body,
    layout: parsed.data.layout || 'PostLayout',
    music: parsed.data.music || null,
    bibliography: parsed.data.bibliography || null,
    canonicalUrl: parsed.data.canonicalUrl || null,
    images,
    path: buildPostPath(parsed.data.slug),
    ...meta,
    category: parsed.data.categoryId ? { connect: { id: parsed.data.categoryId } } : undefined,
  })

  await postAdminRepository.setTags(post.id, parsed.data.tagIds)
  await postAdminRepository.setAuthors(post.id, parsed.data.authorIds)

  await logAudit({
    actorId: session?.user.id,
    entity: 'post',
    entityId: post.id,
    action: 'create',
    after: { slug: post.slug, title: post.title },
  })

  revalidatePath('/admin/posts')
  revalidatePath('/blog')
  return { success: true, data: { id: post.id } }
}

export async function updatePostAction(id: string, input: unknown): Promise<CrudActionResult> {
  await requirePermission('posts.update')
  const session = await getSession()
  const parsed = updatePostSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message }
  }

  const before = await postAdminRepository.findById(id)
  if (!before) return { success: false, error: 'Post not found' }

  if (parsed.data.slug && parsed.data.slug !== before.slug) {
    const conflict = await postAdminRepository.findBySlug(parsed.data.slug)
    if (conflict) return { success: false, error: 'Slug already exists' }
  }

  const data: Record<string, unknown> = {}
  if (parsed.data.slug) {
    data.slug = parsed.data.slug
    data.path = buildPostPath(parsed.data.slug)
  }
  if (parsed.data.title) data.title = parsed.data.title
  if (parsed.data.date) data.date = new Date(parsed.data.date)
  if (parsed.data.lastmod !== undefined) {
    data.lastmod = parsed.data.lastmod ? new Date(parsed.data.lastmod) : null
  }
  if (parsed.data.draft !== undefined) data.draft = parsed.data.draft
  if (parsed.data.summary !== undefined) data.summary = parsed.data.summary || null
  if (parsed.data.body) {
    data.body = parsed.data.body
    Object.assign(data, await computePostMeta(parsed.data.body))
  }
  if (parsed.data.layout !== undefined) data.layout = parsed.data.layout || 'PostLayout'
  if (parsed.data.music !== undefined) data.music = parsed.data.music || null
  if (parsed.data.bibliography !== undefined) data.bibliography = parsed.data.bibliography || null
  if (parsed.data.canonicalUrl !== undefined) data.canonicalUrl = parsed.data.canonicalUrl || null
  if (parsed.data.featuredImage !== undefined) {
    data.images = parsed.data.featuredImage?.trim() ? [parsed.data.featuredImage.trim()] : null
  }
  if (parsed.data.categoryId !== undefined) {
    data.category = parsed.data.categoryId
      ? { connect: { id: parsed.data.categoryId } }
      : { disconnect: true }
  }

  await postAdminRepository.update(id, data)
  if (parsed.data.tagIds) await postAdminRepository.setTags(id, parsed.data.tagIds)
  if (parsed.data.authorIds) await postAdminRepository.setAuthors(id, parsed.data.authorIds)

  await logAudit({
    actorId: session?.user.id,
    entity: 'post',
    entityId: id,
    action: 'update',
    before: { slug: before.slug, title: before.title },
    after: parsed.data,
  })

  revalidatePath('/admin/posts')
  revalidatePath(`/admin/posts/${id}`)
  revalidatePath('/blog')

  if (before.draft && parsed.data.draft === false) {
    const sessionUser = session?.user.fullName
    void emitPostPublished({
      postId: id,
      postTitle: (parsed.data.title as string | undefined) ?? before.title,
      actorName: sessionUser,
    }).catch(() => {})
  }

  return { success: true }
}

export async function deletePostAction(id: string): Promise<CrudActionResult> {
  await requirePermission('posts.delete')
  const session = await getSession()
  const before = await postAdminRepository.findById(id)
  if (!before) return { success: false, error: 'Post not found' }

  await postAdminRepository.delete(id)

  await logAudit({
    actorId: session?.user.id,
    entity: 'post',
    entityId: id,
    action: 'delete',
    before: { slug: before.slug, title: before.title },
  })

  revalidatePath('/admin/posts')
  revalidatePath('/blog')
  return { success: true }
}

export async function bulkDeletePostsAction(ids: string[]): Promise<CrudActionResult> {
  await requirePermission('posts.delete')
  const session = await getSession()
  await postAdminRepository.bulkDelete(ids)

  await logAudit({
    actorId: session?.user.id,
    entity: 'post',
    action: 'bulk_delete',
    after: { ids },
  })

  revalidatePath('/admin/posts')
  revalidatePath('/blog')
  return { success: true }
}
