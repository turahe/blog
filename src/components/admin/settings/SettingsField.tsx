interface SettingsFieldProps {
  label: string
  hint?: string
  error?: string
  children: React.ReactNode
  htmlFor?: string
}

export function SettingsField({ label, hint, error, children, htmlFor }: SettingsFieldProps) {
  return (
    <div className="admin-field">
      <label htmlFor={htmlFor} className="admin-label">
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-theme-xs text-gray-500 dark:text-gray-400">{hint}</p>}
      {error && <p className="admin-error">{error}</p>}
    </div>
  )
}
