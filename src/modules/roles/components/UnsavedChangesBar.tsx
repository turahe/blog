'use client'

interface UnsavedChangesBarProps {
  permissionChanges: number
  hasMetadataChanges?: boolean
  onCancel: () => void
  onPreview: () => void
  onSave: () => void
  saving?: boolean
}

export function UnsavedChangesBar({
  permissionChanges,
  hasMetadataChanges,
  onCancel,
  onPreview,
  onSave,
  saving,
}: UnsavedChangesBarProps) {
  const total = permissionChanges + (hasMetadataChanges ? 1 : 0)
  if (total <= 0) return null

  const message =
    permissionChanges > 0
      ? `${permissionChanges} permission change${permissionChanges === 1 ? '' : 's'} pending${
          hasMetadataChanges ? ' (plus role details)' : ''
        }`
      : 'Unsaved role details'

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-amber-200 bg-amber-50 px-4 py-3 shadow-lg dark:border-amber-900/50 dark:bg-amber-950/90"
      role="status"
      aria-live="polite"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
        <p className="text-theme-sm font-medium text-amber-900 dark:text-amber-100">{message}</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="admin-btn-secondary"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onPreview}
            className="admin-btn-secondary"
            disabled={saving}
          >
            Preview Changes
          </button>
          <button type="button" onClick={onSave} className="admin-btn-primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}
