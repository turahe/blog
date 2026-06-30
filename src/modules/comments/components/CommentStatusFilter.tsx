'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'
import { AdminTag } from '@/components/admin/tags'

const STATUSES = [
  { value: '', label: 'All' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'SPAM', label: 'Spam' },
] as const

export function CommentStatusFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const active = searchParams.get('status') ?? ''

  const setStatus = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (!value) params.delete('status')
    else params.set('status', value)
    params.set('page', '1')
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  return (
    <div
      className="mb-4 flex flex-wrap items-center gap-1.5"
      role="group"
      aria-label="Filter by status"
    >
      {STATUSES.map((status) => (
        <AdminTag
          key={status.value || 'all'}
          label={status.label}
          variant="status"
          tone={
            status.value === 'APPROVED'
              ? 'success'
              : status.value === 'SPAM'
                ? 'critical'
                : status.value === 'PENDING'
                  ? 'warning'
                  : 'neutral'
          }
          size="compact"
          selected={active === status.value}
          interactive
          onClick={() => setStatus(status.value)}
          className={isPending ? 'opacity-60' : ''}
        />
      ))}
    </div>
  )
}
