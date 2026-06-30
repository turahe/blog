'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  deleteRoleAction,
  duplicateRoleAction,
  exportRoleAction,
  previewRolePermissionChangesAction,
  updateRoleAction,
} from '../actions'
import { RoleInfoPanel } from './RoleInfoPanel'
import { PermissionManager } from './PermissionManager'
import { UnsavedChangesBar } from './UnsavedChangesBar'
import { PreviewChangesModal } from './PreviewChangesModal'
import { RbacAuditTimeline } from './RbacAuditTimeline'
import { diffPermissionIds } from '../utils/permissions'
import type { PermissionItem, RbacAuditEntry } from '../types'

interface RoleEditorProps {
  role: {
    id: string
    slug: string
    name: string
    description: string | null
    isSystem: boolean
    userCount: number
    permissionIds: string[]
    updatedAt: string
  }
  catalog: PermissionItem[]
  auditEntries: RbacAuditEntry[]
  canDelete: boolean
}

export function RoleEditor({ role, catalog, auditEntries, canDelete }: RoleEditorProps) {
  const router = useRouter()
  const [name, setName] = useState(role.name)
  const [slug, setSlug] = useState(role.slug)
  const [description, setDescription] = useState(role.description ?? '')
  const [permissionIds, setPermissionIds] = useState(role.permissionIds)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [preview, setPreview] = useState<ReturnType<typeof diffPermissionIds> | null>(null)

  const metadataDirty =
    name !== role.name || slug !== role.slug || description !== (role.description ?? '')

  const permissionPreview = useMemo(
    () => diffPermissionIds(role.permissionIds, permissionIds, catalog),
    [role.permissionIds, permissionIds, catalog]
  )

  const isDirty = metadataDirty || permissionPreview.totalChanges > 0

  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [isDirty])

  const resetState = useCallback(() => {
    setName(role.name)
    setSlug(role.slug)
    setDescription(role.description ?? '')
    setPermissionIds(role.permissionIds)
    setError(null)
  }, [role])

  const handlePreview = async () => {
    const result = await previewRolePermissionChangesAction(role.permissionIds, permissionIds)
    if (result.success && result.data) {
      setPreview(result.data)
      setPreviewOpen(true)
    }
  }

  const handleSave = async () => {
    if (!confirm('Save changes to this role?')) return
    setSaving(true)
    setError(null)

    const result = await updateRoleAction(role.id, {
      name,
      slug: role.isSystem ? undefined : slug,
      description,
      permissionIds,
    })

    setSaving(false)
    if (!result.success) {
      setError(result.error ?? 'Failed to save role')
      return
    }

    router.refresh()
  }

  const handleDelete = async () => {
    if (!confirm('Delete this role? Users assigned to it will lose this role.')) return
    const result = await deleteRoleAction(role.id)
    if (!result.success) {
      setError(result.error ?? 'Failed to delete role')
      return
    }
    router.push('/admin/roles')
    router.refresh()
  }

  const handleDuplicate = async () => {
    const result = await duplicateRoleAction(role.id)
    if (!result.success || !result.data) {
      setError(result.error ?? 'Failed to duplicate role')
      return
    }
    router.push(`/admin/roles/${result.data.id}`)
    router.refresh()
  }

  const handleExport = async () => {
    const result = await exportRoleAction(role.id)
    if (!result.success || !result.data) {
      setError(result.error ?? 'Failed to export role')
      return
    }
    const blob = new Blob([result.data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${role.slug}-role.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => void handleDuplicate()}
          className="admin-btn-secondary"
        >
          Duplicate
        </button>
        <button type="button" onClick={() => void handleExport()} className="admin-btn-secondary">
          Export JSON
        </button>
        {canDelete && !role.isSystem && (
          <button type="button" onClick={() => void handleDelete()} className="admin-btn-danger">
            Delete Role
          </button>
        )}
      </div>

      {error && <p className="admin-error mb-4">{error}</p>}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,30%)_minmax(0,70%)]">
        <RoleInfoPanel
          name={name}
          slug={slug}
          description={description}
          isSystem={role.isSystem}
          userCount={role.userCount}
          updatedAt={role.updatedAt}
          onNameChange={setName}
          onDescriptionChange={setDescription}
          onSlugChange={setSlug}
          slugDisabled={role.isSystem}
          metadataDirty={metadataDirty}
        />

        <PermissionManager
          catalog={catalog}
          selectedIds={permissionIds}
          originalIds={role.permissionIds}
          onChange={setPermissionIds}
        />
      </div>

      <div className="mt-8">
        <RbacAuditTimeline entries={auditEntries} />
      </div>

      <UnsavedChangesBar
        permissionChanges={permissionPreview.totalChanges}
        hasMetadataChanges={metadataDirty}
        onCancel={resetState}
        onPreview={() => void handlePreview()}
        onSave={() => void handleSave()}
        saving={saving}
      />

      <PreviewChangesModal
        open={previewOpen}
        preview={preview}
        onClose={() => setPreviewOpen(false)}
        onConfirm={() => {
          setPreviewOpen(false)
          void handleSave()
        }}
      />

      {isDirty && <div className="h-20" aria-hidden />}
    </>
  )
}
