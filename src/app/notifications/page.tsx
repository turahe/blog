import { Suspense } from 'react'
import { NotificationCenter } from '@/components/notifications'

export default function NotificationsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-4">
          <div className="h-10 w-48 animate-pulse rounded-lg bg-gray-100 dark:bg-white/5" />
          <div className="h-32 animate-pulse rounded-2xl bg-gray-100 dark:bg-white/5" />
          <div className="h-96 animate-pulse rounded-2xl bg-gray-100 dark:bg-white/5" />
        </div>
      }
    >
      <NotificationCenter />
    </Suspense>
  )
}
