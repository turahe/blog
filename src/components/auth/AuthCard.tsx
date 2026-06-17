import type { ReactNode } from 'react'

interface AuthCardProps {
  children: ReactNode
  className?: string
}

export function AuthCard({ children, className = '' }: AuthCardProps) {
  return (
    <div
      className={`rounded-2xl border border-gray-200/80 bg-white/80 p-8 shadow-sm shadow-gray-900/5 backdrop-blur-sm transition-shadow duration-200 sm:p-10 dark:border-gray-800/80 dark:bg-gray-900/70 dark:shadow-black/20 ${className}`}
    >
      {children}
    </div>
  )
}
