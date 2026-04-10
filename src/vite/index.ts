import { fileURLToPath } from 'node:url'

import { defineTheme, generateThemeStyles, type UIThemeConfig } from './theme'

const SIL_UI_THEME_ID = 'virtual:sil-ui/theme.scss'
const SIL_UI_THEME_RESOLVED_ID = `\0${SIL_UI_THEME_ID}`
const SIL_UI_MAIN_STYLES_PATH = normalizePath(fileURLToPath(new URL('../styles/main.scss', import.meta.url)))
const SIL_UI_SOURCE_PATH = normalizePath(fileURLToPath(new URL('..', import.meta.url)))
const SIL_UI_COMPONENTS_PATH = normalizePath(fileURLToPath(new URL('../components', import.meta.url)))

export interface UIPluginOptions {
  injectSharedStyles?: boolean
  theme?: UIThemeConfig
}

export { defineTheme, type UIThemeConfig }

export function getUIAliases() {
  return {
    '@/components/ui': SIL_UI_COMPONENTS_PATH,
    '@': SIL_UI_SOURCE_PATH,
  }
}

export function ui(options: UIPluginOptions = {}) {
  return {
    name: 'sil-ui-theme',
    resolveId(id: string) {
      if (id === SIL_UI_THEME_ID) {
        return SIL_UI_THEME_RESOLVED_ID
      }

      return null
    },
    load(id: string) {
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
          injectTo: 'head-prepend' as const,
        },
      ]
    },
  }
}

function normalizePath(path: string): string {
  return path.replace(/\\/g, '/')
}
