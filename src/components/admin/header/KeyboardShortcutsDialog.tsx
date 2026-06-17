'use client'

import { useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

const SHORTCUTS = [
  { keys: ['⌘', 'K'], label: 'Open command palette', note: 'Coming soon' },
  { keys: ['?'], label: 'Show keyboard shortcuts' },
  { keys: ['Esc'], label: 'Close dialogs and menus' },
  { keys: ['G', 'D'], label: 'Go to dashboard' },
  { keys: ['G', 'P'], label: 'Go to posts' },
] as const

interface KeyboardShortcutsDialogProps {
  open: boolean
  onClose: () => void
}

export function KeyboardShortcutsDialog({ open, onClose }: KeyboardShortcutsDialogProps) {
  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose, open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-[2px] dark:bg-black/60"
        aria-label="Close keyboard shortcuts"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="keyboard-shortcuts-title"
        className="relative w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-900"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2
              id="keyboard-shortcuts-title"
              className="text-lg font-semibold text-gray-900 dark:text-white"
            >
              Keyboard shortcuts
            </h2>
            <p className="text-theme-sm mt-1 text-gray-500 dark:text-gray-400">
              Navigate the admin dashboard faster.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/10 dark:hover:text-gray-300"
            aria-label="Close"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <ul className="space-y-2">
          {SHORTCUTS.map((shortcut) => (
            <li
              key={shortcut.label}
              className="text-theme-sm flex items-center justify-between gap-4 rounded-lg px-2 py-2"
            >
              <span className="text-gray-700 dark:text-gray-300">{shortcut.label}</span>
              <span className="flex items-center gap-1">
                {shortcut.keys.map((key) => (
                  <kbd
                    key={key}
                    className="inline-flex min-w-6 items-center justify-center rounded-md border border-gray-200 bg-gray-50 px-1.5 py-0.5 font-mono text-xs text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  >
                    {key}
                  </kbd>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
