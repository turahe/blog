'use client'

interface ToggleSwitchProps {
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export function ToggleSwitch({ label, description, checked, onChange }: ToggleSwitchProps) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50/60 p-4 dark:border-gray-800 dark:bg-gray-900/40">
      <span>
        <span className="block text-sm font-medium text-gray-800 dark:text-gray-200">{label}</span>
        {description && (
          <span className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">
            {description}
          </span>
        )}
      </span>
      <span className="relative inline-flex shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span className="peer-checked:bg-brand-500 h-6 w-11 rounded-full bg-gray-300 transition dark:bg-gray-700" />
        <span className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
      </span>
    </label>
  )
}
