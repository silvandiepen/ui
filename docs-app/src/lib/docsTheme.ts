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
const DOCS_THEME_PALETTE_KEY = 'ui-docs-theme-palette'
const DOCS_THEME_STYLE_ID = 'ui-docs-theme-overrides'

export interface PaletteColor {
  name: string
  hex: string
}

const DEFAULT_PALETTE: PaletteColor[] = [
  { name: 'red', hex: '#f40935' },
  { name: 'orange', hex: '#ff8d22' },
  { name: 'yellow', hex: '#fbbf24' },
  { name: 'green', hex: '#55c267' },
  { name: 'teal', hex: '#2dcfdc' },
  { name: 'blue', hex: '#2563eb' },
  { name: 'indigo', hex: '#6366f1' },
  { name: 'purple', hex: '#8b5cf6' },
  { name: 'pink', hex: '#ec4899' },
  { name: 'gray', hex: '#6b7280' },
  { name: 'white', hex: '#ffffff' },
  { name: 'black', hex: '#020b22' },
]

const DOCS_THEME_PRESETS = {
  library: {
    label: 'Library',
    theme: {},
  },
  meadow: {
    label: 'Meadow',
    theme: {
      colors: {
        primary: 'green',
        secondary: 'teal',
        tertiary: 'blue',
        quaternary: 'green',
        quinary: 'orange',
        border: 'gray',
      },
      fonts: UI_THEME_FONT_PRESETS.product,
    },
  },
  slate: {
    label: 'Slate',
    theme: {
      colors: {
        dark: 'black',
        light: 'white',
        primary: 'blue',
        secondary: 'purple',
        tertiary: 'teal',
        border: 'gray',
      },
      fonts: UI_THEME_FONT_PRESETS.system,
    },
  },
  editorial: {
    label: 'Editorial',
    theme: {
      colors: {
        dark: 'black',
        light: 'white',
        primary: 'purple',
        secondary: 'orange',
        tertiary: 'green',
        border: 'gray',
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

const DEFAULT_TOKEN_TO_PALETTE: Record<string, string> = {
  dark: 'black',
  light: 'white',
  'accent-dark': 'black',
  'accent-light': 'white',
  primary: 'green',
  secondary: 'teal',
  tertiary: 'blue',
  quaternary: 'green',
  quinary: 'red',
  success: 'green',
  warning: 'orange',
  error: 'red',
  info: 'blue',
  border: 'gray',
}

const colorKeys = Object.keys(DEFAULT_THEME_COLORS)
const initialState = ref<DocsThemeState>(loadInitialState())
const palette = ref<PaletteColor[]>(loadInitialPalette())

let watcherInstalled = false

export function useDocsTheme() {
  if (!watcherInstalled && typeof window !== 'undefined') {
    watcherInstalled = true

    watch(
      [initialState, palette],
      ([state]) => {
        applyDocsTheme(state)
        window.localStorage.setItem(DOCS_THEME_STORAGE_KEY, JSON.stringify(state))
        window.localStorage.setItem(DOCS_THEME_PALETTE_KEY, JSON.stringify(palette.value))
      },
      {
        deep: true,
        immediate: true,
      },
    )
  }

  const themeConfig = computed<UIThemeConfig>(() => ({
    colors: initialState.value.colors,
    fonts: initialState.value.fonts,
    palette: paletteToRecord(palette.value),
  }))

  function setPreset(presetId: DocsThemePresetId) {
    const preset = DOCS_THEME_PRESETS[presetId]
    const resolved = buildThemeConfig(preset.theme)

    initialState.value = {
      presetId,
      colors: {
        ...DEFAULT_TOKEN_TO_PALETTE,
        ...resolved.colors,
      },
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

  function addPaletteColor(name: string, hex: string) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    if (!slug || palette.value.some((c) => c.name === slug)) return
    palette.value = [...palette.value, { name: slug, hex }]
  }

  function removePaletteColor(name: string) {
    palette.value = palette.value.filter((c) => c.name !== name)
  }

  function updatePaletteColor(name: string, hex: string) {
    palette.value = palette.value.map((c) =>
      c.name === name ? { ...c, hex } : c,
    )
  }

  function resetPalette() {
    palette.value = [...DEFAULT_PALETTE]
  }

  return {
    colorKeys,
    docsThemePresets: DOCS_THEME_PRESETS,
    fontPresets: UI_THEME_FONT_PRESETS,
    palette,
    addPaletteColor,
    removePaletteColor,
    updatePaletteColor,
    resetPalette,
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
        ...DEFAULT_TOKEN_TO_PALETTE,
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
    colors: {
      ...DEFAULT_TOKEN_TO_PALETTE,
      ...resolved.colors,
    },
    fonts: resolved.fonts,
    presetId,
  }
}

function applyDocsTheme(state: DocsThemeState) {
  const themeStyles = generateThemeStyles({
    colors: state.colors,
    fonts: state.fonts,
    palette: paletteToRecord(palette.value),
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

function loadInitialPalette(): PaletteColor[] {
  if (typeof window === 'undefined') {
    return [...DEFAULT_PALETTE]
  }

  const stored = window.localStorage.getItem(DOCS_THEME_PALETTE_KEY)
  if (!stored) return [...DEFAULT_PALETTE]

  try {
    const parsed = JSON.parse(stored)
    if (Array.isArray(parsed) && parsed.length > 0) return parsed
  } catch { /* ignore */ }

  return [...DEFAULT_PALETTE]
}

function paletteToRecord(colors: PaletteColor[]): Record<string, string> {
  const record: Record<string, string> = {}
  for (const c of colors) {
    record[c.name] = c.hex
  }
  return record
}
