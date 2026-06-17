export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`admin-skeleton ${className}`} />
}

export function TableSkeleton({ rows = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="admin-table-wrap space-y-0 p-4">
      <Skeleton className="mb-4 h-11 w-full max-w-xs" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="mb-2 h-12 w-full" />
      ))}
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="admin-card p-5 md:p-6">
      <Skeleton className="mb-3 h-4 w-24" />
      <Skeleton className="h-8 w-16" />
    </div>
  )
}
