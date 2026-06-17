'use server'

import { revalidatePath } from 'next/cache'
import { requirePermission } from '@/lib/rbac'
import { invalidateAllPermissionCache } from '@/lib/rbac/cache'
import { sanitizeString } from '@/lib/security/sanitize'
import { roleRepository } from '../repositories'
import { createRoleSchema, updateRoleSchema } from '../validators'
import type { CrudActionResult } from '@/lib/crud/types'

export async function createRoleAction(input: unknown): Promise<CrudActionResult<{ id: string }>> {
  await requirePermission('roles.create')
  const parsed = createRoleSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message }

  const role = await roleRepository.create({
    slug: parsed.data.slug,
    name: sanitizeString(parsed.data.name, 100),
    description: parsed.data.description ? sanitizeString(parsed.data.description, 500) : null,
  })

  if (parsed.data.permissionIds.length > 0) {
    await roleRepository.setPermissions(role.id, parsed.data.permissionIds)
  }

  invalidateAllPermissionCache()
  revalidatePath('/admin/roles')
  return { success: true, data: { id: role.id } }
}

export async function updateRoleAction(id: string, input: unknown): Promise<CrudActionResult> {
  await requirePermission('roles.update')
  const parsed = updateRoleSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message }

  const data: Record<string, unknown> = {}
  if (parsed.data.slug) data.slug = parsed.data.slug
  if (parsed.data.name) data.name = sanitizeString(parsed.data.name, 100)
  if (parsed.data.description !== undefined) {
    data.description = parsed.data.description ? sanitizeString(parsed.data.description, 500) : null
  }

  await roleRepository.update(id, data)

  if (parsed.data.permissionIds) {
    await roleRepository.setPermissions(id, parsed.data.permissionIds)
  }

  invalidateAllPermissionCache()
  revalidatePath('/admin/roles')
  return { success: true }
}

export async function deleteRoleAction(id: string): Promise<CrudActionResult> {
  await requirePermission('roles.delete')
  const role = await roleRepository.findById(id)
  if (!role) return { success: false, error: 'Role not found' }
  if (['superadmin', 'admin', 'operator', 'user'].includes(role.slug)) {
    return { success: false, error: 'Cannot delete system role' }
  }

  await roleRepository.softDelete(id)
  invalidateAllPermissionCache()
  revalidatePath('/admin/roles')
  return { success: true }
}
