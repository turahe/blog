'use client'

import { useState } from 'react'
import { ComputerDesktopIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline'
import { useTheme } from '@/lib/theme/theme-provider'
import type { ThemeMode } from '@/lib/theme/constants'

const APPEARANCE_OPTIONS: {
  value: ThemeMode
  label: string
  icon: typeof SunIcon
}[] = [
  { value: 'light', label: 'Light', icon: SunIcon },
  { value: 'dark', label: 'Dark', icon: MoonIcon },
  { value: 'system', label: 'System', icon: ComputerDesktopIcon },
]

interface AppearanceSubmenuProps {
  onSelect?: () => void
}

export function AppearanceSubmenu({ onSelect }: AppearanceSubmenuProps) {
  const { theme, setTheme } = useTheme()
  const [expanded, setExpanded] = useState(false)

  return (
    <div>
      <button
        type="button"
        role="menuitem"
        aria-expanded={expanded}
        onClick={() => setExpanded((prev) => !prev)}
        className="text-theme-sm flex w-full items-center justify-between gap-2.5 rounded-lg px-2.5 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50 focus-visible:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5 dark:focus-visible:bg-white/5"
      >
        <span className="flex items-center gap-2.5">
          <SunIcon className="h-4 w-4 shrink-0 opacity-70" aria-hidden="true" />
          Appearance
        </span>
        <span className="text-xs text-gray-400">{expanded ? '−' : '+'}</span>
      </button>

      {expanded && (
        <div className="mt-1 space-y-0.5 px-1 pb-1">
          {APPEARANCE_OPTIONS.map((option) => {
            const Icon = option.icon
            const active = theme === option.value
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setTheme(option.value)
                  onSelect?.()
                }}
                className={`text-theme-sm flex w-full items-center gap-2 rounded-lg px-2.5 py-2 transition-colors ${
                  active
                    ? 'bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400'
                    : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-white/5'
                }`}
              >
                <Icon className="h-4 w-4 opacity-70" aria-hidden="true" />
                {option.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
