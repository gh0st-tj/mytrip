import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { LanguageCode } from '../types'
import i18n from '../i18n'

type Theme = 'light' | 'dark' | 'system'

interface SettingsContextValue {
  language: LanguageCode
  setLanguage: (l: LanguageCode) => void
  theme: Theme
  setTheme: (t: Theme) => void
  isRTL: boolean
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>((localStorage.getItem('lang') as LanguageCode) || 'en')
  const [theme, setThemeState] = useState<Theme>((localStorage.getItem('theme') as Theme) || 'system')

  useEffect(() => {
    i18n.changeLanguage(language)
    localStorage.setItem('lang', language)
    document.documentElement.lang = language
    document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr'
  }, [language])

  useEffect(() => {
    localStorage.setItem('theme', theme)
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    document.documentElement.classList.toggle('dark', isDark)
  }, [theme])

  const value = useMemo<SettingsContextValue>(() => ({
    language,
    setLanguage: setLanguageState,
    theme,
    setTheme: setThemeState,
    isRTL: language === 'he',
  }), [language, theme])

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}



