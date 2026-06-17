import type { ReactNode } from 'react'

interface AccountCardProps {
  title: string
  description?: string
  children: ReactNode
  className?: string
}

export function AccountCard({ title, description, children, className = '' }: AccountCardProps) {
  return (
    <section
      className={`shadow-theme-xs rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-gray-900/60 ${className}`}
    >
      <div className="mb-5 border-b border-gray-100 pb-4 dark:border-gray-800">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white/90">{title}</h3>
        {description && (
          <p className="text-theme-sm mt-1 text-gray-500 dark:text-gray-400">{description}</p>
        )}
      </div>
      {children}
    </section>
  )
}
