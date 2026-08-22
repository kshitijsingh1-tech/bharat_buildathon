'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export type AppLanguage = 'en' | 'hi'
type Theme = 'light' | 'dark'

type Preferences = {
  language: AppLanguage
  setLanguage: (language: AppLanguage) => void
  theme: Theme
  toggleTheme: () => void
}

const PreferencesContext = createContext<Preferences | null>(null)

export function UiPreferencesProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<AppLanguage>('en')
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    const storedLanguage = window.localStorage.getItem('sarthi-language')
    const storedTheme = window.localStorage.getItem('sarthi-theme')
    if (storedLanguage === 'en' || storedLanguage === 'hi') setLanguage(storedLanguage)
    if (storedTheme === 'light' || storedTheme === 'dark') {
      setTheme(storedTheme)
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark')
    }
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.style.colorScheme = theme
    window.localStorage.setItem('sarthi-theme', theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.lang = language === 'hi' ? 'hi' : 'en'
    window.localStorage.setItem('sarthi-language', language)
  }, [language])

  return (
    <PreferencesContext.Provider
      value={{
        language,
        setLanguage,
        theme,
        toggleTheme: () => setTheme((current) => (current === 'light' ? 'dark' : 'light')),
      }}
    >
      {children}
    </PreferencesContext.Provider>
  )
}

export function useUiPreferences() {
  const preferences = useContext(PreferencesContext)
  if (!preferences) throw new Error('useUiPreferences must be used within UiPreferencesProvider')
  return preferences
}
