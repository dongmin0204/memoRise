import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { LanguageState } from '../types'

type Locale = 'en' | 'de' | 'ko'

interface LanguageStore extends LanguageState {
  changeLocale: (locale: Locale) => void
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      locale: 'en',
      changeLocale: (locale: Locale) => set({ locale }),
    }),
    {
      name: 'language-storage',
      partialize: (state) => ({ locale: state.locale }),
    }
  )
)
