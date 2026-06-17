import { THEME_ATTRIBUTE, THEME_DEFAULT, THEME_MODES, THEME_STORAGE_KEY } from './constants'

function buildThemeScript(defaultTheme: string) {
  const config = JSON.stringify([
    THEME_ATTRIBUTE,
    THEME_STORAGE_KEY,
    defaultTheme,
    null,
    THEME_MODES,
    null,
    true,
    true,
  ]).slice(1, -1)

  return `(${themeInitializer.toString()})(${config})`

  function themeInitializer(
    attribute: string,
    storageKey: string,
    defaultThemeValue: string,
    forcedTheme: string | null,
    themes: string[],
    _value: unknown,
    enableSystem: boolean,
    enableColorScheme: boolean
  ) {
    const root = document.documentElement

    function applyTheme(theme: string) {
      if (attribute === 'class') {
        root.classList.remove(...themes)
        root.classList.add(theme)
      } else {
        root.setAttribute(attribute, theme)
      }

      if (enableColorScheme && themes.includes(theme)) {
        root.style.colorScheme = theme
      }
    }

    function systemTheme() {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }

    if (forcedTheme) {
      applyTheme(forcedTheme)
      return
    }

    try {
      const stored = localStorage.getItem(storageKey) || defaultThemeValue
      const resolved = enableSystem && stored === 'system' ? systemTheme() : stored
      applyTheme(resolved)
    } catch {
      applyTheme(defaultThemeValue === 'system' ? systemTheme() : defaultThemeValue)
    }
  }
}

export function getThemeScript(defaultTheme = THEME_DEFAULT) {
  return buildThemeScript(defaultTheme)
}
