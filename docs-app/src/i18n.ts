import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    common: {
      actions: {
        resetToDefault: 'Reset to default',
      },
      labels: {
        actions: 'Actions',
      },
      table: {
        clearSelection: 'Clear selection',
        moreSelected: 'more selected',
        noData: 'No data available',
        selectAllPage: 'Select all on this page',
        selectedCount: '{count} selected',
        selectedItems: 'Selected items',
      },
    },
  },
}

export const i18n = createI18n({
  fallbackLocale: 'en',
  legacy: false,
  locale: 'en',
  messages,
  missing: (_locale, key) => key,
})
