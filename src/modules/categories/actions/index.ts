'use server'

import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/auth/session'
import { requirePermission } from '@/lib/rbac'
import { logAudit } from '@/lib/audit'
import { categoryRepository } from '../repositories'
import { createCategorySchema, updateCategorySchema } from '../validators'
import type { CrudActionResult } from '@/lib/crud/types'

export async function createCategoryAction(
  input: unknown
): Promise<CrudActionResult<{ id: string }>> {
  await requirePermission('categories.create')
  const session = await getSession()
  const parsed = createCategorySchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message }

  const existing = await categoryRepository.findBySlug(parsed.data.slug)
  if (existing) return { success: false, error: 'Slug already exists' }

  const category = await categoryRepository.create({
    slug: parsed.data.slug,
    name: parsed.data.name,
    description: parsed.data.description || null,
    imageUrl: parsed.data.imageUrl?.trim() || null,
  })

  await logAudit({
    actorId: session?.user.id,
    entity: 'category',
    entityId: category.id,
    action: 'create',
    after: { slug: category.slug, name: category.name },
  })

  revalidatePath('/admin/categories')
  return { success: true, data: { id: category.id } }
}

export async function updateCategoryAction(id: string, input: unknown): Promise<CrudActionResult> {
  await requirePermission('categories.update')
  const session = await getSession()
  const parsed = updateCategorySchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message }

  const before = await categoryRepository.findById(id)
  if (!before) return { success: false, error: 'Category not found' }

  if (parsed.data.slug && parsed.data.slug !== before.slug) {
    const conflict = await categoryRepository.findBySlug(parsed.data.slug)
    if (conflict) return { success: false, error: 'Slug already exists' }
  }

  await categoryRepository.update(id, {
    slug: parsed.data.slug,
    name: parsed.data.name,
    description:
      parsed.data.description !== undefined ? parsed.data.description || null : undefined,
    imageUrl: parsed.data.imageUrl !== undefined ? parsed.data.imageUrl?.trim() || null : undefined,
  })

  await logAudit({
    actorId: session?.user.id,
    entity: 'category',
    entityId: id,
    action: 'update',
    before: { slug: before.slug, name: before.name },
    after: parsed.data,
  })

  revalidatePath('/admin/categories')
  return { success: true }
}

export async function deleteCategoryAction(id: string): Promise<CrudActionResult> {
  await requirePermission('categories.delete')
  const session = await getSession()
  const before = await categoryRepository.findById(id)
  if (!before) return { success: false, error: 'Category not found' }

  await categoryRepository.delete(id)

  await logAudit({
    actorId: session?.user.id,
    entity: 'category',
    entityId: id,
    action: 'delete',
    before: { slug: before.slug, name: before.name },
  })

  revalidatePath('/admin/categories')
  return { success: true }
}

export async function bulkDeleteCategoriesAction(ids: string[]): Promise<CrudActionResult> {
  await requirePermission('categories.delete')
  const session = await getSession()
  await categoryRepository.bulkDelete(ids)

  await logAudit({
    actorId: session?.user.id,
    entity: 'category',
    action: 'bulk_delete',
    after: { ids },
  })

  revalidatePath('/admin/categories')
  return { success: true }
}
