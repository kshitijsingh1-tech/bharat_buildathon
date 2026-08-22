'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    googleTranslateElementInit?: () => void
    google?: any
  }
}

export function GoogleTranslate() {
  useEffect(() => {
    // Add Google Translate script if not already added
    const scriptId = 'google-translate-script'
    if (!document.getElementById(scriptId)) {
      window.googleTranslateElementInit = () => {
        if (window.google?.translate?.TranslateElement) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              includedLanguages: 'en,hi,pa,bn,mr,gu,ta,te,kn,ml,or,as,ur',
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false,
            },
            'google_translate_element'
          )
        }
      }

      const script = document.createElement('script')
      script.id = scriptId
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
      script.async = true
      document.body.appendChild(script)
    }
  }, [])

  return (
    <div className="flex items-center gap-1.5 rounded-lg bg-secondary/80 px-2 py-1 ring-1 ring-border/50 text-xs">
      <span className="text-[0.7rem] font-bold text-saffron uppercase tracking-wider hidden sm:inline">Translate:</span>
      <div id="google_translate_element" className="google-translate-container" />
    </div>
  )
}
