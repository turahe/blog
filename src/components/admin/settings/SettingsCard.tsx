interface SettingsCardProps {
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function SettingsCard({ title, description, children, className = '' }: SettingsCardProps) {
  return (
    <section className={`admin-card overflow-hidden ${className}`}>
      {(title || description) && (
        <div className="border-b border-gray-100 px-5 py-4 md:px-6 dark:border-gray-800">
          {title && (
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white/90">{title}</h3>
          )}
          {description && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{description}</p>
          )}
        </div>
      )}
      <div className="space-y-5 p-5 md:p-6">{children}</div>
    </section>
  )
}
