import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { fallbackLanguage, translations } from './translations.js'

const LanguageContext = createContext({
  language: fallbackLanguage,
  setLanguage: () => {},
  t: (key) => key,
})

const STORAGE_KEY = 'portal-language'

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    if (typeof window === 'undefined') {
      return fallbackLanguage
    }
    return localStorage.getItem(STORAGE_KEY) || fallbackLanguage
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, language)
    }
  }, [language])

  const t = useCallback(
    (key) => {
      const selected = translations[language] || translations[fallbackLanguage] || {}
      const fallback = translations[fallbackLanguage] || {}
      return selected[key] || fallback[key] || key
    },
    [language],
  )

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
    }),
    [language, setLanguage, t],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useI18n() {
  return useContext(LanguageContext)
}
