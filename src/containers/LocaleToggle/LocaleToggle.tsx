import React from 'react'
import { useLanguageStore } from '../../store'
import { appLocales } from '../../i18n'

function LocaleToggle() {
  const { locale: currentLocale, changeLocale } = useLanguageStore()

  const handleLocaleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    changeLocale(event.target.value as 'en' | 'de' | 'ko')
  }

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="locale-select" className="text-sm text-gray-600">
        Language:
      </label>
      <select
        id="locale-select"
        value={currentLocale}
        onChange={handleLocaleChange}
        className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {appLocales.map((locale) => (
          <option key={locale.code} value={locale.code}>
            {locale.name}
          </option>
        ))}
      </select>
    </div>
  )
}

export default LocaleToggle
