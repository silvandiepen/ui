import { fileURLToPath } from 'node:url'

import {
  buildThemeConfig,
  DEFAULT_THEME_COLORS,
  DEFAULT_THEME_FONTS,
  defineTheme,
  generateThemeStyles,
  resolveTheme,
  SYSTEM_MONO_STACK,
  SYSTEM_SANS_STACK,
  UI_THEME_FONT_PRESETS,
} from './theme.js'

const SIL_UI_MAIN_STYLES_PATH = normalizePath(fileURLToPath(new URL('../styles/main.scss', import.meta.url)))
const SIL_UI_SRC_PATH = normalizePath(fileURLToPath(new URL('..', import.meta.url)))
const SIL_UI_COMPONENTS_PATH = normalizePath(fileURLToPath(new URL('../components', import.meta.url)))

/**
 * @typedef {object} UIPluginOptions
 * @property {object} [theme] - @deprecated Theme is now configured via SCSS.
 * @property {boolean} [injectSharedStyles] - @deprecated Base styles are always available via @sil/ui/styles.
 */

// Re-export theme utilities for optional use
export {
  buildThemeConfig,
  DEFAULT_THEME_COLORS,
  DEFAULT_THEME_FONTS,
  defineTheme,
  generateThemeStyles,
  resolveTheme,
  SYSTEM_MONO_STACK,
  SYSTEM_SANS_STACK,
  UI_THEME_FONT_PRESETS,
}

/**
 * @sil/ui Vite plugin.
 *
 * Resolves internal `@/` aliases so source-shipped components can find
 * their dependencies. Also resolves `'@sil/ui/styles'` to the main SCSS
 * entry point.
 *
 * Theming is done via plain SCSS — import `@sil/ui/styles` in your main.ts
 * (or `@sil/ui/defaults` in your global SCSS) and override `:root` CSS custom
 * properties as needed.
 *
 * @param {UIPluginOptions} [options]
 */
export function ui(_options = {}) {
  return {
    name: 'sil-ui',
    enforce: 'pre',

    // Inject sil-ui internal path aliases into the consumer's resolve config
    config(config) {
      const silUiAliases = [
        { find: '@/components/ui', replacement: `${SIL_UI_SRC_PATH}/components` },
        { find: '@/common', replacement: `${SIL_UI_SRC_PATH}/common` },
        { find: '@/composables', replacement: `${SIL_UI_SRC_PATH}/composables` },
        { find: '@/constants', replacement: `${SIL_UI_SRC_PATH}/constants` },
        { find: '@/mixins', replacement: `${SIL_UI_SRC_PATH}/mixins` },
        { find: '@/stores', replacement: `${SIL_UI_SRC_PATH}/stores` },
        { find: '@/types', replacement: `${SIL_UI_SRC_PATH}/types` },
        { find: '@/utils', replacement: `${SIL_UI_SRC_PATH}/utils` },
        { find: '@components', replacement: `${SIL_UI_SRC_PATH}/components` },
        { find: '@composables', replacement: `${SIL_UI_SRC_PATH}/composables` },
        { find: '@utils', replacement: `${SIL_UI_SRC_PATH}/utils` },
        { find: '@stores', replacement: `${SIL_UI_SRC_PATH}/stores` },
        { find: '@types', replacement: `${SIL_UI_SRC_PATH}/types` },
      ]

      const existing = config.resolve?.alias || []
      const aliases = Array.isArray(existing)
        ? [...existing]
        : Object.entries(existing).map(([find, replacement]) => ({ find, replacement }))

      config.resolve = config.resolve || {}
      config.resolve.alias = [...silUiAliases, ...aliases]
    },

    // Resolve '@sil/ui/styles' to the actual main.scss path
    resolveId(id) {
      if (id === '@sil/ui/styles' || id === 'virtual:sil-ui/theme' || id === 'virtual:sil-ui/styles.css') {
        return SIL_UI_MAIN_STYLES_PATH
      }
      return null
    },
  }
}

function normalizePath(filePath) {
  return filePath.replace(/\\/g, '/')
}
