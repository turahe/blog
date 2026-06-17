'use client'

import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { useSearch } from './SearchContext'

export function SearchTrigger({
  children,
  ...rest
}: { children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>) {
  const { toggle } = useSearch()

  return (
    <button type="button" {...rest} onClick={toggle}>
      {children}
    </button>
  )
}
