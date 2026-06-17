'use client'

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

interface MediaSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function MediaSearch({ value, onChange, placeholder = 'Search images…' }: MediaSearchProps) {
  return (
    <div className="relative">
      <MagnifyingGlassIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="admin-input w-full !pl-9"
        aria-label="Search media"
      />
    </div>
  )
}
