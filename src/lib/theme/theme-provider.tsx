'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  THEME_ATTRIBUTE,
  THEME_DEFAULT,
  THEME_MODES,
  THEME_STORAGE_KEY,
  type ThemeMode,
} from './constants'

interface ThemeContextValue {
  theme: ThemeMode
  setTheme: (theme: ThemeMode) => void
  resolvedTheme: 'light' | 'dark' | undefined
  systemTheme: 'light' | 'dark' | undefined
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyThemeClass(resolved: 'light' | 'dark') {
  const root = document.documentElement
  root.classList.remove(...THEME_MODES)
  root.classList.add(resolved)
  root.style.colorScheme = resolved
}

function readStoredTheme(): ThemeMode {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored
    }
  } catch {
    // ignore
  }
  return THEME_DEFAULT
}

export function ThemeProvider({
  children,
  defaultTheme = THEME_DEFAULT,
  enableSystem = true,
}: {
  children: ReactNode
  defaultTheme?: ThemeMode
  enableSystem?: boolean
}) {
  const [theme, setThemeState] = useState<ThemeMode>(defaultTheme)
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>()
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>()

  const setTheme = useCallback((next: ThemeMode) => {
    setThemeState(next)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    setThemeState(readStoredTheme())
    setSystemTheme(getSystemTheme())
  }, [])

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => setSystemTheme(getSystemTheme())

    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const nextResolved = theme === 'system' ? (systemTheme ?? getSystemTheme()) : theme
    if (nextResolved !== 'light' && nextResolved !== 'dark') return

    setResolvedTheme(nextResolved)
    if (THEME_ATTRIBUTE === 'class') {
      applyThemeClass(nextResolved)
    }
  }, [theme, systemTheme])

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== THEME_STORAGE_KEY) return
      setThemeState((event.newValue as ThemeMode | null) ?? defaultTheme)
    }

    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [defaultTheme])

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      resolvedTheme,
      systemTheme: enableSystem ? systemTheme : undefined,
    }),
    [theme, setTheme, resolvedTheme, systemTheme, enableSystem]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    return {
      theme: THEME_DEFAULT,
      setTheme: () => {},
      resolvedTheme: undefined,
      systemTheme: undefined,
    }
  }
  return context
}
