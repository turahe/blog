'use client'

import { useServerInsertedHTML } from 'next/navigation'
import type { ThemeMode } from '@/lib/theme/constants'
import { getThemeScript } from '@/lib/theme/script'

interface ThemeScriptProps {
  defaultTheme: ThemeMode
}

export function ThemeScript({ defaultTheme }: ThemeScriptProps) {
  useServerInsertedHTML(() => (
    <script id="theme-init" dangerouslySetInnerHTML={{ __html: getThemeScript(defaultTheme) }} />
  ))

  return null
}
