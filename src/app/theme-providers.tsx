'use client'

import type { ReactNode } from 'react'
import { ThemeScript } from '@/components/theme/ThemeScript'
import type { ThemeMode } from '@/lib/theme/constants'
import { ThemeProvider } from '@/lib/theme/theme-provider'

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
