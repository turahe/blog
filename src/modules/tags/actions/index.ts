'use server'

import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/auth/session'
import { requirePermission } from '@/lib/rbac'
import { logAudit } from '@/lib/audit'
import { tagAdminRepository } from '../repositories'
import { createTagSchema, updateTagSchema } from '../validators'
import type { CrudActionResult } from '@/lib/crud/types'

export async function createTagAction(input: unknown): Promise<CrudActionResult<{ id: string }>> {
  await requirePermission('tags.create')
  const session = await getSession()
  const parsed = createTagSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message }

  const existing = await tagAdminRepository.findBySlug(parsed.data.slug)
  if (existing) return { success: false, error: 'Slug already exists' }

  const tag = await tagAdminRepository.create({
    slug: parsed.data.slug,
    name: parsed.data.name,
    description: parsed.data.description || null,
  })

  await logAudit({
    actorId: session?.user.id,
    entity: 'tag',
    entityId: tag.id,
    action: 'create',
    after: { slug: tag.slug, name: tag.name },
  })

  revalidatePath('/admin/tags')
  return { success: true, data: { id: tag.id } }
}

export async function updateTagAction(id: string, input: unknown): Promise<CrudActionResult> {
  await requirePermission('tags.update')
  const session = await getSession()
  const parsed = updateTagSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message }

  const before = await tagAdminRepository.findById(id)
  if (!before) return { success: false, error: 'Tag not found' }

  if (parsed.data.slug && parsed.data.slug !== before.slug) {
    const conflict = await tagAdminRepository.findBySlug(parsed.data.slug)
    if (conflict) return { success: false, error: 'Slug already exists' }
  }

  await tagAdminRepository.update(id, {
    slug: parsed.data.slug,
    name: parsed.data.name,
    description:
      parsed.data.description !== undefined ? parsed.data.description || null : undefined,
  })

  await logAudit({
    actorId: session?.user.id,
    entity: 'tag',
    entityId: id,
    action: 'update',
    before: { slug: before.slug, name: before.name },
    after: parsed.data,
  })

  revalidatePath('/admin/tags')
  return { success: true }
}

export async function deleteTagAction(id: string): Promise<CrudActionResult> {
  await requirePermission('tags.delete')
  const session = await getSession()
  const before = await tagAdminRepository.findById(id)
  if (!before) return { success: false, error: 'Tag not found' }

  await tagAdminRepository.delete(id)

  await logAudit({
    actorId: session?.user.id,
    entity: 'tag',
    entityId: id,
    action: 'delete',
    before: { slug: before.slug, name: before.name },
  })

  revalidatePath('/admin/tags')
  return { success: true }
}

export async function bulkDeleteTagsAction(ids: string[]): Promise<CrudActionResult> {
  await requirePermission('tags.delete')
  const session = await getSession()
  await tagAdminRepository.bulkDelete(ids)

  await logAudit({
    actorId: session?.user.id,
    entity: 'tag',
    action: 'bulk_delete',
    after: { ids },
  })

  revalidatePath('/admin/tags')
  return { success: true }
}
