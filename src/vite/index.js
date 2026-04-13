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

const SIL_UI_THEME_ID = 'virtual:sil-ui/theme.scss'
const SIL_UI_THEME_RESOLVED_ID = `\0${SIL_UI_THEME_ID}`
const SIL_UI_MAIN_STYLES_PATH = normalizePath(fileURLToPath(new URL('../styles/main.scss', import.meta.url)))

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

export function ui(options = {}) {
  return {
    name: 'sil-ui-theme',
    resolveId(id) {
      if (id === SIL_UI_THEME_ID) {
        return SIL_UI_THEME_RESOLVED_ID
      }

      return null
    },
    load(id) {
      if (id !== SIL_UI_THEME_RESOLVED_ID) {
        return null
      }

      const sharedStyles = options.injectSharedStyles === false
        ? ''
        : `@use "${SIL_UI_MAIN_STYLES_PATH}" as *;\n\n`

      return `${sharedStyles}${generateThemeStyles(options.theme)}\n`
    },
    transformIndexHtml() {
      return [
        {
          tag: 'script',
          attrs: {
            type: 'module',
          },
          children: `import "${SIL_UI_THEME_ID}";`,
          injectTo: 'head-prepend',
        },
      ]
    },
  }
}

function normalizePath(path) {
  return path.replace(/\\/g, '/')
}
