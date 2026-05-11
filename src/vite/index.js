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
const SIL_UI_SRC_PATH = normalizePath(fileURLToPath(new URL('../../src', import.meta.url)))

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
 * @param {object} options
 * @param {object} [options.theme] - Theme config from defineTheme()
 * @param {boolean} [options.injectSharedStyles=true] - Whether to include main.scss
 * @param {string[]} [options.icons] - Specific icon names to include (optional)
 */
export function ui(options = {}) {
  const resolvedTheme = buildThemeConfig(options.theme)
  const themeCss = generateThemeStyles(resolvedTheme)

  const THEME_ID = '\0virtual:sil-ui/theme'
  const STYLES_ID = '\0virtual:sil-ui/styles.css'

  return {
    name: 'sil-ui-theme',
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
      const aliases = Array.isArray(existing) ? [...existing] : Object.entries(existing).map(([find, replacement]) => ({ find, replacement }))

      config.resolve = config.resolve || {}
      config.resolve.alias = [...silUiAliases, ...aliases]
    },

    resolveId(id) {
      if (id === 'virtual:sil-ui/theme') return THEME_ID
      if (id === 'virtual:sil-ui/styles.css' || id === 'virtual:sil-ui/styles') return STYLES_ID
      return null
    },

    load(id) {
      // Virtual JS module: imports the SCSS styles and CSS theme overrides
      if (id === THEME_ID) {
        return [
          `// @sil/ui theme — base styles + theme overrides`,
          `import "${SIL_UI_MAIN_STYLES_PATH}";`,
          `import "virtual:sil-ui/styles.css";`,
        ].join('\n')
      }

      // Virtual CSS module: theme CSS custom properties generated from defineTheme()
      if (id === STYLES_ID) {
        return themeCss
      }

      return null
    },

    // Auto-import theme styles in the consuming app's entry module
    transformIndexHtml: {
      order: 'pre',
      handler() {
        return [
          {
            tag: 'script',
            attrs: { type: 'module' },
            children: `import "virtual:sil-ui/theme";`,
            injectTo: 'head-prepend',
          },
        ]
      },
    },
  }
}

function normalizePath(filePath) {
  return filePath.replace(/\\/g, '/')
}
