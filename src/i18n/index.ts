import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import enUS from './locales/en-US'
import ptBR from './locales/pt-BR'
import esPE from './locales/es-PE'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      'en-US': { translation: enUS },
      'pt-BR': { translation: ptBR },
      'es-PE': { translation: esPE },
    },
    fallbackLng: 'en-US',
    supportedLngs: ['en-US', 'pt-BR', 'es-PE'],
    detection: {
      // Check localStorage first, then browser language
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'brain-upp-lang',
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
