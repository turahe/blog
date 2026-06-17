'use client'

import { ReactNode } from 'react'
import { useKBar } from 'kbar'

export function KBarButton({
  children,
  ...rest
}: { children: ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { query } = useKBar()
  return (
    <button type="button" {...rest} onClick={() => query.toggle()}>
      {children}
    </button>
  )
}
