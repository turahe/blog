'use client'

interface ColorPickerProps {
  label: string
  value: string
  onChange: (value: string) => void
}

export function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  return (
    <div className="admin-field">
      <label className="admin-label">{label}</label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-14 cursor-pointer rounded-lg border border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-900"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="admin-input max-w-[8rem] font-mono text-sm uppercase"
          pattern="^#[0-9a-fA-F]{6}$"
        />
        <span
          className="h-10 flex-1 rounded-lg border border-gray-200 dark:border-gray-700"
          style={{ backgroundColor: value }}
        />
      </div>
    </div>
  )
}
