import { computed, ref, watch } from 'vue'

import {
  buildThemeConfig,
  DEFAULT_THEME_COLORS,
  DEFAULT_THEME_FONTS,
  generateThemeStyles,
  UI_THEME_FONT_PRESETS,
  type UIThemeConfig,
} from '@ui-lib/vite/theme'

const DOCS_THEME_STORAGE_KEY = 'ui-docs-theme-config'
const DOCS_THEME_STYLE_ID = 'ui-docs-theme-overrides'

const DOCS_THEME_PRESETS = {
  library: {
    label: 'Library',
    theme: {},
  },
  meadow: {
    label: 'Meadow',
    theme: {
      colors: {
        primary: '#4fb36e',
        secondary: '#0ea5a4',
        tertiary: '#2563eb',
        quaternary: '#94c11f',
        quinary: '#f97316',
        border: '#cbd8cf',
      },
      fonts: UI_THEME_FONT_PRESETS.product,
    },
  },
  slate: {
    label: 'Slate',
    theme: {
      colors: {
        dark: '#101826',
        light: '#f8fafc',
        primary: '#2563eb',
        secondary: '#7c3aed',
        tertiary: '#0f766e',
        border: '#cbd5e1',
      },
      fonts: UI_THEME_FONT_PRESETS.system,
    },
  },
  editorial: {
    label: 'Editorial',
    theme: {
      colors: {
        dark: '#1a1715',
        light: '#fffaf5',
        primary: '#8b5cf6',
        secondary: '#d97706',
        tertiary: '#4d7c0f',
        border: '#e8ddd1',
      },
      fonts: UI_THEME_FONT_PRESETS.editorial,
    },
  },
} as const

type DocsThemePresetId = keyof typeof DOCS_THEME_PRESETS

type DocsThemeState = {
  colors: Record<string, string>
  fonts: {
    body: string
    heading: string
    mono: string
  }
  presetId: DocsThemePresetId
}

const colorKeys = Object.keys(DEFAULT_THEME_COLORS)
const initialState = ref<DocsThemeState>(loadInitialState())

let watcherInstalled = false

export function useDocsTheme() {
  if (!watcherInstalled && typeof window !== 'undefined') {
    watcherInstalled = true

    watch(
      initialState,
      (state) => {
        applyDocsTheme(state)
        window.localStorage.setItem(DOCS_THEME_STORAGE_KEY, JSON.stringify(state))
      },
      {
        deep: true,
        immediate: true,
      }
    )
  }

  const themeConfig = computed<UIThemeConfig>(() => ({
    colors: initialState.value.colors,
    fonts: initialState.value.fonts,
  }))

  function setPreset(presetId: DocsThemePresetId) {
    const preset = DOCS_THEME_PRESETS[presetId]
    const resolved = buildThemeConfig(preset.theme)

    initialState.value = {
      presetId,
      colors: resolved.colors,
      fonts: resolved.fonts,
    }
  }

  function resetTheme() {
    setPreset('library')
  }

  function updateColor(token: string, value: string) {
    initialState.value = {
      ...initialState.value,
      colors: {
        ...initialState.value.colors,
        [token]: value,
      },
      presetId: 'library',
    }
  }

  function updateFont(token: 'body' | 'heading' | 'mono', value: string) {
    initialState.value = {
      ...initialState.value,
      fonts: {
        ...initialState.value.fonts,
        [token]: value,
      },
      presetId: 'library',
    }
  }

  return {
    colorKeys,
    docsThemePresets: DOCS_THEME_PRESETS,
    fontPresets: UI_THEME_FONT_PRESETS,
    resetTheme,
    setPreset,
    themeConfig,
    themeState: initialState,
    updateColor,
    updateFont,
  }
}

function loadInitialState(): DocsThemeState {
  const fallback = createStateFromTheme('library', DOCS_THEME_PRESETS.library.theme)

  if (typeof window === 'undefined') {
    return fallback
  }

  const stored = window.localStorage.getItem(DOCS_THEME_STORAGE_KEY)

  if (!stored) {
    return fallback
  }

  try {
    const parsed = JSON.parse(stored) as Partial<DocsThemeState>

    return {
      colors: {
        ...DEFAULT_THEME_COLORS,
        ...parsed.colors,
      },
      fonts: {
        ...DEFAULT_THEME_FONTS,
        ...parsed.fonts,
      },
      presetId: parsed.presetId && parsed.presetId in DOCS_THEME_PRESETS
        ? parsed.presetId
        : 'library',
    }
  } catch {
    return fallback
  }
}

function createStateFromTheme(
  presetId: DocsThemePresetId,
  theme: UIThemeConfig
): DocsThemeState {
  const resolved = buildThemeConfig(theme)

  return {
    colors: resolved.colors,
    fonts: resolved.fonts,
    presetId,
  }
}

function applyDocsTheme(state: DocsThemeState) {
  const themeStyles = generateThemeStyles({
    colors: state.colors,
    fonts: state.fonts,
  })

  const styleElement = getThemeStyleElement()
  styleElement.textContent = themeStyles
}

function getThemeStyleElement(): HTMLStyleElement {
  const existing = document.getElementById(DOCS_THEME_STYLE_ID)

  if (existing instanceof HTMLStyleElement) {
    return existing
  }

  const styleElement = document.createElement('style')
  styleElement.id = DOCS_THEME_STYLE_ID
  document.head.appendChild(styleElement)

  return styleElement
}
