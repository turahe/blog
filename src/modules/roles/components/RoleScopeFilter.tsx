'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTransition } from 'react'

export function RoleScopeFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const scope = searchParams.get('scope') ?? 'all'

  const setScope = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'all') params.delete('scope')
    else params.set('scope', value)
    params.set('page', '1')
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  return (
    <select
      value={scope}
      onChange={(e) => setScope(e.target.value)}
      className="admin-select"
      aria-label="Filter roles by scope"
      disabled={isPending}
    >
      <option value="all">All roles</option>
      <option value="system">System</option>
      <option value="custom">Custom</option>
    </select>
  )
}
