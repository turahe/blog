'use client'

import type { PermissionChangePreview } from '../types'

interface PreviewChangesModalProps {
  open: boolean
  preview: PermissionChangePreview | null
  onClose: () => void
  onConfirm?: () => void
  confirmLabel?: string
}

export function PreviewChangesModal({
  open,
  preview,
  onClose,
  onConfirm,
  confirmLabel = 'Save Changes',
}: PreviewChangesModalProps) {
  if (!open || !preview) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-changes-title"
    >
      <div className="max-h-[85vh] w-full max-w-lg overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900">
        <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-800">
          <h3
            id="preview-changes-title"
            className="text-lg font-semibold text-gray-900 dark:text-white"
          >
            Permission changes preview
          </h3>
          <p className="text-theme-sm mt-1 text-gray-500">
            {preview.totalChanges} total change{preview.totalChanges === 1 ? '' : 's'}
          </p>
        </div>

        <div className="max-h-96 space-y-4 overflow-y-auto px-5 py-4">
          {preview.added.length > 0 && (
            <section aria-label="Added permissions">
              <h4 className="text-theme-sm text-success-600 dark:text-success-400 mb-2 font-medium">
                Added ({preview.added.length})
              </h4>
              <ul className="space-y-1">
                {preview.added.map((p) => (
                  <li key={p.id} className="text-theme-sm text-gray-700 dark:text-gray-300">
                    <span className="text-success-600 dark:text-success-400 font-mono">+</span>{' '}
                    {p.name} <span className="text-gray-400">({p.slug})</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {preview.removed.length > 0 && (
            <section aria-label="Removed permissions">
              <h4 className="text-theme-sm text-error-600 dark:text-error-400 mb-2 font-medium">
                Removed ({preview.removed.length})
              </h4>
              <ul className="space-y-1">
                {preview.removed.map((p) => (
                  <li key={p.id} className="text-theme-sm text-gray-700 dark:text-gray-300">
                    <span className="text-error-600 dark:text-error-400 font-mono">−</span> {p.name}{' '}
                    <span className="text-gray-400">({p.slug})</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {preview.totalChanges === 0 && (
            <p className="text-theme-sm text-gray-500">No permission changes to preview.</p>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-gray-200 px-5 py-4 dark:border-gray-800">
          <button type="button" onClick={onClose} className="admin-btn-secondary">
            Close
          </button>
          {onConfirm && (
            <button type="button" onClick={onConfirm} className="admin-btn-primary">
              {confirmLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
