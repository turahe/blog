'use client'

interface NotificationBadgeProps {
  count: number
  className?: string
}

export function NotificationBadge({ count, className = '' }: NotificationBadgeProps) {
  if (count <= 0) return null

  return (
    <span
      className={`bg-brand-500 absolute top-1.5 right-1.5 flex h-4 min-w-4 animate-pulse items-center justify-center rounded-full px-1 text-[10px] font-semibold text-white ring-2 ring-white dark:ring-gray-900 ${className}`}
      aria-hidden="true"
    >
      {count > 9 ? '9+' : count}
    </span>
  )
}
