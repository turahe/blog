import type { AdminTagSize } from './types'

interface TagSkeletonProps {
  count?: number
  size?: AdminTagSize
}

const sizeWidths: Record<AdminTagSize, string> = {
  sm: 'w-10',
  compact: 'w-14',
  lg: 'w-20',
}

export function TagSkeleton({ count = 3, size = 'compact' }: TagSkeletonProps) {
  return (
    <div className="flex flex-wrap gap-1" aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={`admin-skeleton inline-block h-5 rounded-md ${sizeWidths[size]}`}
        />
      ))}
      <span className="sr-only">Loading tags</span>
    </div>
  )
}
