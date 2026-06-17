'use client'

import type { ReactNode } from 'react'
import { ThemeProvider } from '@/lib/theme/theme-provider'
import { ThemeScript } from '@/components/theme/ThemeScript'
import type { ThemeMode } from '@/lib/theme/constants'

export function ThemeProviders({
  children,
  defaultTheme,
}: {
  children: ReactNode
  defaultTheme: ThemeMode
}) {
  return (
    <>
      <ThemeScript defaultTheme={defaultTheme} />
      <ThemeProvider defaultTheme={defaultTheme} enableSystem>
        {children}
      </ThemeProvider>
    </>
  )
}
