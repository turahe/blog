'use client'

interface AdminUserAvatarProps {
  name: string
  avatar?: string | null
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-9 w-9 text-sm',
  lg: 'h-12 w-12 text-base',
} as const

export function AdminUserAvatar({
  name,
  avatar,
  size = 'md',
  className = '',
}: AdminUserAvatarProps) {
  const sizeClass = sizeClasses[size]

  if (avatar) {
    return (
      <span
        className={`relative inline-flex shrink-0 overflow-hidden rounded-full bg-gray-100 ring-2 ring-white dark:bg-gray-800 dark:ring-gray-900 ${sizeClass} ${className}`}
      >
        <img src={avatar} alt="" className="h-full w-full object-cover" />
      </span>
    )
  }

  return (
    <span
      aria-hidden="true"
      className={`from-brand-500 to-brand-600 inline-flex shrink-0 items-center justify-center rounded-full bg-linear-to-br font-semibold text-white ring-2 ring-white dark:ring-gray-900 ${sizeClass} ${className}`}
    >
      {getInitials(name) || '?'}
    </span>
  )
}
