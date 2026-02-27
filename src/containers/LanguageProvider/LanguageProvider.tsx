import React from 'react'
import { IntlProvider } from 'react-intl'
import { useLanguageStore } from '../../store'
import { appLocales } from '../../i18n'

function LanguageProvider({ children }: { children: React.ReactNode }) {
  const locale = useLanguageStore((state) => state.locale)
  
  const currentLocale = appLocales.find(lang => lang.code === locale) || appLocales[0]

  return (
    <IntlProvider
      locale={locale}
      key={locale}
      messages={currentLocale.messages}
    >
      {children}
    </IntlProvider>
  )
}

export default LanguageProvider
