'use server'

import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/auth/session'
import { requirePermission } from '@/lib/rbac'
import { logAudit } from '@/lib/audit'
import { projectRepository } from '../repositories'
import { createProjectSchema, updateProjectSchema } from '../validators'
import type { CrudActionResult } from '@/lib/crud/types'

export async function createProjectAction(
  input: unknown
): Promise<CrudActionResult<{ id: string }>> {
  await requirePermission('projects.create')
  const session = await getSession()
  const parsed = createProjectSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message }

  const project = await projectRepository.create(parsed.data)

  await logAudit({
    actorId: session?.user.id,
    entity: 'project',
    entityId: project.id,
    action: 'create',
    after: { title: project.title },
  })

  revalidatePath('/admin/projects')
  revalidatePath('/projects')
  return { success: true, data: { id: project.id } }
}

export async function updateProjectAction(id: string, input: unknown): Promise<CrudActionResult> {
  await requirePermission('projects.update')
  const session = await getSession()
  const parsed = updateProjectSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message }

  const before = await projectRepository.findById(id)
  if (!before) return { success: false, error: 'Project not found' }

  await projectRepository.update(id, parsed.data)

  await logAudit({
    actorId: session?.user.id,
    entity: 'project',
    entityId: id,
    action: 'update',
    before: { title: before.title },
    after: parsed.data,
  })

  revalidatePath('/admin/projects')
  revalidatePath('/projects')
  return { success: true }
}

export async function deleteProjectAction(id: string): Promise<CrudActionResult> {
  await requirePermission('projects.delete')
  const session = await getSession()
  const before = await projectRepository.findById(id)
  if (!before) return { success: false, error: 'Project not found' }

  await projectRepository.delete(id)

  await logAudit({
    actorId: session?.user.id,
    entity: 'project',
    entityId: id,
    action: 'delete',
    before: { title: before.title },
  })

  revalidatePath('/admin/projects')
  revalidatePath('/projects')
  return { success: true }
}

export async function bulkDeleteProjectsAction(ids: string[]): Promise<CrudActionResult> {
  await requirePermission('projects.delete')
  const session = await getSession()
  await projectRepository.bulkDelete(ids)

  await logAudit({
    actorId: session?.user.id,
    entity: 'project',
    action: 'bulk_delete',
    after: { ids },
  })

  revalidatePath('/admin/projects')
  revalidatePath('/projects')
  return { success: true }
}
