import type { ReactNode } from 'react'

interface BlogLayoutProps {
  title?: string
  description?: string
  sidebar?: ReactNode
  children: ReactNode
}

export function BlogLayout({ title, description, sidebar, children }: BlogLayoutProps) {
  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-800">
      {(title || description) && (
        <header className="pt-2 pb-8">
          {title && (
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
              {title}
            </h1>
          )}
          {description && (
            <p className="mt-3 max-w-2xl text-lg text-gray-600 dark:text-gray-400">{description}</p>
          )}
        </header>
      )}
      <div className="grid gap-10 pt-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-12">
        <main className="min-w-0">{children}</main>
        {sidebar && <aside className="lg:sticky lg:top-24 lg:self-start">{sidebar}</aside>}
      </div>
    </div>
  )
}
