'use client'

import type { ComponentType, ReactNode } from 'react'
import Link from 'next/link'

interface AdminMenuItemProps {
  icon: ComponentType<{ className?: string }>
  label: string
  href?: string
  onClick?: () => void
  destructive?: boolean
}

export function AdminMenuItem({
  icon: Icon,
  label,
  href,
  onClick,
  destructive = false,
}: AdminMenuItemProps) {
  const className = `flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-theme-sm font-medium transition-colors ${
    destructive
      ? 'text-error-600 hover:bg-error-50 focus-visible:bg-error-50 dark:text-error-400 dark:hover:bg-error-500/10 dark:focus-visible:bg-error-500/10'
      : 'text-gray-700 hover:bg-gray-50 focus-visible:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5 dark:focus-visible:bg-white/5'
  }`

  const content = (
    <>
      <Icon className="h-4 w-4 shrink-0 opacity-70" aria-hidden="true" />
      <span>{label}</span>
    </>
  )

  if (href) {
    return (
      <Link href={href} role="menuitem" className={className} onClick={onClick}>
        {content}
      </Link>
    )
  }

  return (
    <button type="button" role="menuitem" className={className} onClick={onClick}>
      {content}
    </button>
  )
}

export function AdminMenuDivider() {
  return <div role="separator" className="my-1.5 border-t border-gray-200 dark:border-gray-800" />
}

export function AdminMenuSection({ children }: { children: ReactNode }) {
  return <div className="px-1 py-0.5">{children}</div>
}
