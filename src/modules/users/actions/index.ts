'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/db/prisma'
import { hashPassword } from '@/lib/auth/password'
import { getSession } from '@/lib/auth/session'
import { requirePermission } from '@/lib/rbac'
import { invalidatePermissionCache } from '@/lib/rbac/cache'
import { logAudit } from '@/lib/audit'
import { emitNewUserRegistered, emitRoleChanged } from '@/modules/notifications/events'
import { sanitizeEmail, sanitizeString } from '@/lib/security/sanitize'
import { userRepository } from '../repositories'
import { createUserSchema, updateUserSchema } from '../validators'
import type { CrudActionResult } from '@/lib/crud/types'

export async function createUserAction(input: unknown): Promise<CrudActionResult<{ id: string }>> {
  await requirePermission('users.create')
  const session = await getSession()
  const parsed = createUserSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message }
  }

  const email = sanitizeEmail(parsed.data.email)
  const existing = await userRepository.findByEmail(email)
  if (existing) {
    return { success: false, error: 'Email already in use' }
  }

  const passwordHash = await hashPassword(parsed.data.password)
  const user = await userRepository.create({
    email,
    passwordHash,
    fullName: sanitizeString(parsed.data.fullName, 255),
    avatar: parsed.data.avatar || null,
    status: parsed.data.status,
    createdBy: session?.user.id ? { connect: { id: session.user.id } } : undefined,
  })

  if (parsed.data.roleIds.length > 0) {
    await userRepository.setRoles(user.id, parsed.data.roleIds)
  }

  await logAudit({
    actorId: session?.user.id,
    entity: 'user',
    entityId: user.id,
    action: 'create',
    after: { email, fullName: user.fullName, status: user.status },
  })

  revalidatePath('/admin/users')

  void emitNewUserRegistered({
    userId: user.id,
    fullName: user.fullName,
    email,
  }).catch(() => {})

  return { success: true, data: { id: user.id } }
}

export async function updateUserAction(id: string, input: unknown): Promise<CrudActionResult> {
  await requirePermission('users.update')
  const session = await getSession()
  const parsed = updateUserSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message }
  }

  const before = await userRepository.findById(id)
  if (!before) return { success: false, error: 'User not found' }

  const data: Record<string, unknown> = {
    updatedBy: session?.user.id ? { connect: { id: session.user.id } } : undefined,
  }

  if (parsed.data.email) data.email = sanitizeEmail(parsed.data.email)
  if (parsed.data.fullName) data.fullName = sanitizeString(parsed.data.fullName, 255)
  if (parsed.data.avatar !== undefined) data.avatar = parsed.data.avatar || null
  if (parsed.data.status) data.status = parsed.data.status
  if (parsed.data.password) data.passwordHash = await hashPassword(parsed.data.password)

  await userRepository.update(id, data)

  if (parsed.data.roleIds) {
    await userRepository.setRoles(id, parsed.data.roleIds)
    invalidatePermissionCache(id)

    const primaryRole = await prisma.role.findFirst({
      where: { id: { in: parsed.data.roleIds }, deletedAt: null },
      select: { name: true },
      orderBy: { name: 'asc' },
    })
    if (primaryRole) {
      void emitRoleChanged({ userId: id, roleName: primaryRole.name }).catch(() => {})
    }
  }

  await logAudit({
    actorId: session?.user.id,
    entity: 'user',
    entityId: id,
    action: 'update',
    before: { email: before.email, status: before.status },
    after: parsed.data,
  })

  revalidatePath('/admin/users')
  revalidatePath(`/admin/users/${id}`)
  return { success: true }
}

export async function deleteUserAction(id: string): Promise<CrudActionResult> {
  await requirePermission('users.delete')
  const session = await getSession()

  if (session?.user.id === id) {
    return { success: false, error: 'Cannot delete your own account' }
  }

  const before = await userRepository.findById(id)
  if (!before) return { success: false, error: 'User not found' }

  await userRepository.softDelete(id, session?.user.id)
  invalidatePermissionCache(id)

  await logAudit({
    actorId: session?.user.id,
    entity: 'user',
    entityId: id,
    action: 'delete',
    before: { email: before.email },
  })

  revalidatePath('/admin/users')
  return { success: true }
}

export async function bulkDeleteUsersAction(ids: string[]): Promise<CrudActionResult> {
  await requirePermission('users.delete')
  const session = await getSession()
  const filtered = ids.filter((id) => id !== session?.user.id)

  await userRepository.bulkSoftDelete(filtered, session?.user.id)
  filtered.forEach(invalidatePermissionCache)

  await logAudit({
    actorId: session?.user.id,
    entity: 'user',
    action: 'bulk_delete',
    after: { ids: filtered },
  })

  revalidatePath('/admin/users')
  return { success: true }
}
