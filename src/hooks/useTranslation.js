import { useApp } from '../context/AppContext'
import { translations } from '../translations'

export function useTranslation() {
  const { state } = useApp()
  const currentLanguage = state.language || 'polish'
  
  const t = (key) => {
    const keys = key.split('.')
    let value = translations[currentLanguage]
    
    for (const k of keys) {
      if (value && value[k]) {
        value = value[k]
      } else {
        // Fallback to Polish if translation not found
        value = translations.polish
        for (const fallbackKey of keys) {
          if (value && value[fallbackKey]) {
            value = value[fallbackKey]
          } else {
            return key // Return the key if no translation found
          }
        }
      }
    }
    
    return value || key
  }
  
  return { t, language: currentLanguage }
}
