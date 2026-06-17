'use client'

interface ToggleRowProps {
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export function ToggleRow({ label, description, checked, onChange }: ToggleRowProps) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-gray-200 px-4 py-3 transition hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-white/3">
      <span>
        <span className="text-theme-sm block font-medium text-gray-900 dark:text-white/90">
          {label}
        </span>
        {description && (
          <span className="text-theme-xs mt-0.5 block text-gray-500 dark:text-gray-400">
            {description}
          </span>
        )}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="text-brand-500 focus:ring-brand-500/20 mt-0.5 h-5 w-5 rounded border-gray-300"
      />
    </label>
  )
}
