'use client'

import * as React from 'react'
 
type Theme = 'light' | 'dark' | 'system'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
  enableSystem?: boolean
  attribute?: 'class'
}

type ThemeContextValue = {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: 'light' | 'dark'
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined)

function getSystemTheme() {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyThemeClass(theme: Theme, enableSystem: boolean) {
  const root = document.documentElement
  const resolved =
    theme === 'system' && enableSystem ? getSystemTheme() : (theme as 'light' | 'dark')

  root.classList.remove('light', 'dark')
  root.classList.add(resolved)
  root.style.colorScheme = resolved
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'theme',
  enableSystem = true,
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme)
  const [resolvedTheme, setResolvedTheme] = React.useState<'light' | 'dark'>('light')

  React.useEffect(() => {
    const stored = window.localStorage.getItem(storageKey) as Theme | null
    const initialTheme = stored ?? defaultTheme
    setThemeState(initialTheme)
    applyThemeClass(initialTheme, enableSystem)
    setResolvedTheme(
      initialTheme === 'system' && enableSystem ? getSystemTheme() : (initialTheme as 'light' | 'dark')
    )

    if (!enableSystem) return

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onMediaChange = () => {
      const currentTheme =
        (window.localStorage.getItem(storageKey) as Theme | null) ?? defaultTheme
      if (currentTheme === 'system') {
        applyThemeClass('system', true)
        setResolvedTheme(getSystemTheme())
      }
    }

    media.addEventListener('change', onMediaChange)
    return () => media.removeEventListener('change', onMediaChange)
  }, [defaultTheme, enableSystem, storageKey])

  const setTheme = React.useCallback(
    (nextTheme: Theme) => {
      setThemeState(nextTheme)
      window.localStorage.setItem(storageKey, nextTheme)
      applyThemeClass(nextTheme, enableSystem)
      setResolvedTheme(
        nextTheme === 'system' && enableSystem ? getSystemTheme() : (nextTheme as 'light' | 'dark')
      )
    },
    [enableSystem, storageKey]
  )

  const value = React.useMemo(
    () => ({ theme, setTheme, resolvedTheme }),
    [theme, setTheme, resolvedTheme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = React.useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
