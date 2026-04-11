import { onMounted, ref } from 'vue'

export type DocsColorMode = 'dark' | 'light'

export const DOCS_COLOR_MODE_STORAGE_KEY = 'ui-docs-color-mode'

export function resolveSystemColorMode(): DocsColorMode {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'light'
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function normalizeColorMode(value?: string | null): DocsColorMode | null {
  if (value === 'dark' || value === 'light') {
    return value
  }

  return null
}

export function applyColorMode(mode: DocsColorMode) {
  if (typeof document === 'undefined') {
    return
  }

  document.documentElement.dataset.colorMode = mode
}

export function getInitialColorMode(): DocsColorMode {
  if (typeof document !== 'undefined') {
    const documentMode = normalizeColorMode(document.documentElement.dataset.colorMode)

    if (documentMode) {
      return documentMode
    }
  }

  if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
    const storedMode = normalizeColorMode(window.localStorage.getItem(DOCS_COLOR_MODE_STORAGE_KEY))

    if (storedMode) {
      return storedMode
    }
  }

  return resolveSystemColorMode()
}

export function useColorMode() {
  const colorMode = ref<DocsColorMode>('light')

  const setColorMode = (mode: DocsColorMode) => {
    colorMode.value = mode
    applyColorMode(mode)

    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      window.localStorage.setItem(DOCS_COLOR_MODE_STORAGE_KEY, mode)
    }
  }

  const toggleColorMode = () => {
    setColorMode(colorMode.value === 'dark' ? 'light' : 'dark')
  }

  onMounted(() => {
    setColorMode(getInitialColorMode())
  })

  return {
    colorMode,
    setColorMode,
    toggleColorMode,
  }
}
