import { computed, getCurrentInstance } from 'vue'

function interpolate(key: string, params?: Record<string, any>) {
  if (!params) {
    return key
  }

  let result = key
  Object.entries(params).forEach(([paramKey, value]) => {
    result = result.split(`{${paramKey}}`).join(String(value))
  })
  return result
}

export function useI18n() {
  const instance = getCurrentInstance()
  const proxy = instance?.proxy as {
    $t?: (key: string, params?: Record<string, any>) => string
    $i18n?: { locale?: string | { value?: string } }
  } | null

  const t = (key: string, params?: Record<string, any>) => {
    if (typeof proxy?.$t === 'function') {
      return proxy.$t(key, params)
    }

    return interpolate(key, params)
  }

  const locale = computed(() => {
    const appLocale = proxy?.$i18n?.locale

    if (typeof appLocale === 'string') {
      return appLocale
    }

    return appLocale?.value || 'en'
  })

  return {
    t,
    locale,
  }
}
