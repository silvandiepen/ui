/**
 * Theme configuration for @sil/ui.
 *
 * Pass a `UIThemeConfig` to `defineTheme()` in your Vite plugin setup or
 * call `generateThemeStyles()` to produce a `:root { … }` CSS block you can
 * inject anywhere.
 *
 * @example Vite plugin usage
 * ```ts
 * // vite.config.ts
 * import { UIPlugin } from '@sil/ui/vite'
 *
 * export default defineConfig({
 *   plugins: [
 *     UIPlugin({
 *       theme: defineTheme({
 *         colors: {
 *           dark: '#0d1117',
 *           light: '#ffffff',
 *           primary: '#6366f1',
 *           secondary: '#8b5cf6',
 *         },
 *         fonts: {
 *           body: '"Inter", system-ui, sans-serif',
 *           heading: '"Manrope", "Inter", sans-serif',
 *         },
 *         variables: {
 *           '--border-radius': '0.75rem',
 *           '--space': '1rem',
 *         },
 *       }),
 *     }),
 *   ],
 * })
 * ```
 */

/**
 * Full theme configuration object accepted by `defineTheme()`,
 * `buildThemeConfig()`, and `generateThemeStyles()`.
 *
 * All fields are optional — any value you omit falls back to the library
 * defaults defined in `DEFAULT_THEME_COLORS`, `DEFAULT_THEME_FONTS`, and the
 * base stylesheet.
 */
export interface UIThemeConfig {
  /**
   * Named colour tokens used throughout the component library.
   *
   * For every key you provide, the following CSS custom properties are
   * automatically generated and available globally:
   *
   * ```
   * --color-{token}          The raw colour value you supplied.
   * --color-{token}-text     A legible contrast colour (dark or light).
   * --color-{token}-contrast Alias of -text.
   * --color-{token}-light    A 35 % tint toward white.
   * --color-{token}-dark     A 32 % shade toward black.
   * ```
   *
   * ### Semantic tokens understood by the component library
   *
   * | Token          | Role                                                  |
   * |----------------|-------------------------------------------------------|
   * | `dark`         | Darkest background / base dark-mode colour            |
   * | `light`        | Lightest background / base light-mode colour          |
   * | `accent-dark`  | Accent used in dark contexts (defaults to black)      |
   * | `accent-light` | Accent used in light contexts (defaults to warm off-white) |
   * | `primary`      | Main brand / action colour                            |
   * | `secondary`    | Supporting brand colour                               |
   * | `tertiary`     | Third brand colour                                    |
   * | `quaternary`   | Fourth brand colour                                   |
   * | `quinary`      | Fifth brand colour                                    |
   * | `success`      | Positive feedback (green by default)                  |
   * | `warning`      | Cautionary feedback (amber by default)                |
   * | `error`        | Error / destructive feedback (red by default)         |
   * | `info`         | Informational feedback (blue by default)              |
   * | `border`       | Default border / divider colour                       |
   *
   * In addition to the tokens above, the library derives:
   * - `--color-background` and `--color-foreground` from the active
   *   light/dark mode state.
   * - `--color-accent` from `accent-dark` / `accent-light` based on mode.
   *
   * @example
   * ```ts
   * colors: {
   *   dark: '#0d1117',
   *   light: '#f6f8fa',
   *   primary: '#6366f1',
   *   secondary: '#8b5cf6',
   *   tertiary: '#06b6d4',
   *   success: '#22c55e',
   *   warning: '#f59e0b',
   *   error: '#ef4444',
   * }
   * ```
   */
  colors?: Record<string, string>

  /**
   * Font-family stacks applied via CSS custom properties.
   *
   * Generated custom properties:
   * ```
   * --font-family         Same as body (default font).
   * --font-family-body    Body / prose text.
   * --font-family-heading Headings (h1–h6).
   * --font-family-mono    Code, kbd, pre elements.
   * --font-family-monospace  Alias of --font-family-mono.
   * ```
   *
   * @example System fonts (zero download, best performance)
   * ```ts
   * fonts: {
   *   body: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
   *   heading: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
   *   mono: '"SF Mono", Consolas, "Liberation Mono", Menlo, Courier, monospace',
   * }
   * ```
   *
   * @example Google Fonts (load them separately in your HTML/CSS)
   * ```ts
   * fonts: {
   *   body: '"Inter", system-ui, sans-serif',
   *   heading: '"Manrope", "Inter", system-ui, sans-serif',
   *   mono: '"JetBrains Mono", "Fira Code", monospace',
   * }
   * ```
   */
  fonts?: UIThemeFonts

  /**
   * Arbitrary CSS custom properties injected into `:root`.
   *
   * Keys may include or omit the leading `--` — both forms work:
   * `{ 'border-radius': '0.5rem' }` and `{ '--border-radius': '0.5rem' }`.
   *
   * ### Commonly overridden variables
   *
   * | Variable              | Default    | Description                              |
   * |-----------------------|------------|------------------------------------------|
   * | `--border-radius`     | `0.25em`   | Base corner radius used by all components|
   * | `--border-radius-s`   | `0.15em`   | Small corner radius                      |
   * | `--border-radius-l`   | `0.5em`    | Large corner radius                      |
   * | `--border-radius-xl`  | `0.75em`   | Extra-large corner radius                |
   * | `--border-radius-xxl` | `1rem`     | Extra-extra-large corner radius          |
   * | `--space`             | `1rem`     | Base spacing unit                        |
   * | `--space-xs`          | `0.25rem`  | Extra-small spacing                      |
   * | `--space-s`           | `0.5rem`   | Small spacing                            |
   * | `--space-m`           | `1rem`     | Medium spacing (alias of --space)        |
   * | `--space-l`           | `1.5rem`   | Large spacing                            |
   * | `--space-xl`          | `2rem`     | Extra-large spacing                      |
   * | `--space-xxl`         | `3rem`     | Extra-extra-large spacing                |
   * | `--font-size`         | `1rem`     | Base font size                           |
   * | `--font-size-xs`      | `0.7rem`   | Extra-small font size                    |
   * | `--font-size-s`       | `0.85rem`  | Small font size                          |
   * | `--font-size-m`       | `1rem`     | Medium font size                         |
   * | `--font-size-l`       | `1.15rem`  | Large font size                          |
   * | `--font-size-xl`      | `1.5rem`   | Extra-large font size                    |
   * | `--font-size-xxl`     | `2rem`     | Extra-extra-large font size              |
   * | `--transition`        | `0.2s ease`| Default transition timing                |
   *
   * @example
   * ```ts
   * variables: {
   *   '--border-radius': '0.75rem',
   *   '--space': '1rem',
   *   '--font-size': '16px',
   * }
   * ```
   */
  variables?: Record<string, string | number>
}

/**
 * Font-family stacks for the three typographic roles used by the library.
 * All fields are optional; omitted values fall back to `DEFAULT_THEME_FONTS`.
 */
export interface UIThemeFonts {
  /**
   * Font stack for body text, paragraphs, and UI labels.
   * Sets `--font-family` and `--font-family-body`.
   */
  body?: string
  /**
   * Font stack for headings (h1–h6) and display text.
   * Sets `--font-family-heading`.
   */
  heading?: string
  /**
   * Font stack for code blocks, `<kbd>`, `<pre>`, and monospace contexts.
   * Sets `--font-family-mono` and `--font-family-monospace`.
   */
  mono?: string
}

/**
 * Fully-resolved theme with all defaults applied.
 * Returned by `buildThemeConfig()` — useful when you need a guaranteed
 * non-optional shape (e.g. when writing a custom style generator).
 */
export interface ResolvedUIThemeConfig {
  colors: Record<string, string>
  fonts: Required<UIThemeFonts>
  variables: Record<string, string | number>
}

/** @internal */
export const SYSTEM_SANS_STACK =
  'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'

/** @internal */
export const SYSTEM_MONO_STACK =
  '"SF Mono", Consolas, "Liberation Mono", Menlo, Courier, monospace'

/**
 * Default colour tokens shipped with the library.
 * These are merged with (and overridden by) any `colors` you provide in your
 * `UIThemeConfig`.
 */
export const DEFAULT_THEME_COLORS: Record<string, string> = {
  dark: '#020b22',
  light: '#ffffff',
  'accent-dark': '#000000',
  'accent-light': '#f0d8bc',
  primary: '#55c267',
  secondary: '#2dcfdc',
  tertiary: '#2376d3',
  quaternary: '#a9e14b',
  quinary: '#f96459',
  success: '#55c267',
  warning: '#ff8d22',
  error: '#f40935',
  info: '#3bb6f1',
  border: '#d7d2d9',
}

/**
 * Default font stacks used when no `fonts` config is provided.
 * All three stacks default to the OS system sans-serif or monospace.
 */
export const DEFAULT_THEME_FONTS: Required<UIThemeFonts> = {
  body: SYSTEM_SANS_STACK,
  heading: SYSTEM_SANS_STACK,
  mono: SYSTEM_MONO_STACK,
}

/**
 * Ready-made font-stack presets you can reference in `UIThemeFonts`.
 *
 * | Preset       | Body                  | Heading              |
 * |--------------|-----------------------|----------------------|
 * | `system`     | System sans-serif     | System sans-serif    |
 * | `product`    | Inter                 | Manrope              |
 * | `friendly`   | Nunito Sans           | Avenir Next          |
 * | `editorial`  | Newsreader (serif)    | Fraunces (serif)     |
 *
 * @example
 * ```ts
 * import { UI_THEME_FONT_PRESETS } from '@sil/ui/vite'
 *
 * defineTheme({
 *   fonts: UI_THEME_FONT_PRESETS.product,
 * })
 * ```
 */
export const UI_THEME_FONT_PRESETS: Record<string, Required<UIThemeFonts>> = {
  system: {
    body: SYSTEM_SANS_STACK,
    heading: SYSTEM_SANS_STACK,
    mono: SYSTEM_MONO_STACK,
  },
  product: {
    body: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    heading: '"Manrope", "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    mono: SYSTEM_MONO_STACK,
  },
  friendly: {
    body: '"Nunito Sans", "Avenir Next", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    heading: '"Avenir Next", "Nunito Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    mono: SYSTEM_MONO_STACK,
  },
  editorial: {
    body: '"Newsreader", "Iowan Old Style", Georgia, serif',
    heading: '"Fraunces", "Newsreader", Georgia, serif',
    mono: SYSTEM_MONO_STACK,
  },
}

/** @internal */
interface RgbColor {
  r: number
  g: number
  b: number
}

/**
 * Type-safe helper for authoring a `UIThemeConfig`.
 *
 * This function is a pass-through — it returns its argument unchanged — but
 * it gives TypeScript (and AI tools) enough context to provide accurate
 * auto-complete and validation for every field.
 *
 * @param theme - Your theme configuration.
 * @returns The same object, typed as `UIThemeConfig`.
 *
 * @example Minimal custom theme
 * ```ts
 * import { defineTheme } from '@sil/ui/vite'
 *
 * export default defineTheme({
 *   colors: {
 *     primary: '#6366f1',
 *     secondary: '#8b5cf6',
 *   },
 *   fonts: {
 *     body: '"Inter", system-ui, sans-serif',
 *   },
 * })
 * ```
 *
 * @example Full theme with variables override
 * ```ts
 * import { defineTheme } from '@sil/ui/vite'
 *
 * export default defineTheme({
 *   colors: {
 *     dark: '#0d1117',
 *     light: '#f6f8fa',
 *     primary: '#6366f1',
 *     secondary: '#8b5cf6',
 *     tertiary: '#06b6d4',
 *     success: '#22c55e',
 *     warning: '#f59e0b',
 *     error: '#ef4444',
 *     info: '#3b82f6',
 *     border: '#e2e8f0',
 *   },
 *   fonts: {
 *     body: '"Inter", system-ui, sans-serif',
 *     heading: '"Manrope", "Inter", system-ui, sans-serif',
 *     mono: '"JetBrains Mono", monospace',
 *   },
 *   variables: {
 *     '--border-radius': '0.75rem',
 *     '--space': '1rem',
 *   },
 * })
 * ```
 */
export function defineTheme(theme: UIThemeConfig): UIThemeConfig {
  return theme
}

/**
 * Merges a partial `UIThemeConfig` with all library defaults, producing a
 * fully-resolved config with no optional fields.
 *
 * @param theme - Partial theme config (defaults to `{}`).
 * @returns A `ResolvedUIThemeConfig` with defaults filled in.
 */
export function buildThemeConfig(theme: UIThemeConfig = {}): ResolvedUIThemeConfig {
  return {
    colors: {
      ...DEFAULT_THEME_COLORS,
      ...theme.colors,
    },
    fonts: {
      ...DEFAULT_THEME_FONTS,
      ...theme.fonts,
    },
    variables: {
      ...theme.variables,
    },
  }
}

/**
 * Alias for `buildThemeConfig`.
 * @see buildThemeConfig
 */
export const resolveTheme = buildThemeConfig

/**
 * Generates a complete `:root { … }` CSS block from a `UIThemeConfig`.
 *
 * The output includes:
 * - `--font-family[-body|-heading|-mono|-monospace]`
 * - `--color-{token}` plus `-text`, `-contrast`, `-light`, `-dark` variants
 *   for every colour token
 * - Any extra entries from `variables`
 *
 * Inject the result into a `<style>` tag or write it to a `.css` file.
 *
 * @param theme - Partial theme config (defaults to `{}`).
 * @returns A CSS string starting with `:root {` and ending with `}`.
 *
 * @example
 * ```ts
 * import { generateThemeStyles } from '@sil/ui/vite'
 *
 * const css = generateThemeStyles({
 *   colors: { primary: '#6366f1' },
 * })
 * // → ":root {\n  --font-family: system-ui…\n  --color-primary: #6366f1;\n  …\n}"
 * ```
 */
export function generateThemeStyles(theme: UIThemeConfig = {}): string {
  const resolvedTheme = buildThemeConfig(theme)
  const lines = [':root {']

  lines.push(`  --font-family: ${resolvedTheme.fonts.body};`)
  lines.push(`  --font-family-body: ${resolvedTheme.fonts.body};`)
  lines.push(`  --font-family-heading: ${resolvedTheme.fonts.heading};`)
  lines.push(`  --font-family-mono: ${resolvedTheme.fonts.mono};`)
  lines.push(`  --font-family-monospace: ${resolvedTheme.fonts.mono};`)

  for (const [token, value] of Object.entries(resolvedTheme.colors)) {
    const parsed = parseColor(value)

    lines.push(`  --color-${token}: ${value};`)

    if (!parsed) {
      continue
    }

    const contrast = formatColor(getContrastColor(parsed))
    const light = formatColor(mix(parsed, { r: 255, g: 255, b: 255 }, 0.35))
    const dark = formatColor(mix(parsed, { r: 0, g: 0, b: 0 }, 0.32))

    lines.push(`  --color-${token}-text: ${contrast};`)
    lines.push(`  --color-${token}-contrast: ${contrast};`)
    lines.push(`  --color-${token}-light: ${light};`)
    lines.push(`  --color-${token}-dark: ${dark};`)
  }

  for (const [name, value] of Object.entries(resolvedTheme.variables)) {
    const variableName = name.startsWith('--') ? name : `--${name}`
    lines.push(`  ${variableName}: ${String(value)};`)
  }

  lines.push('}')

  return lines.join('\n')
}

function parseColor(value: string): RgbColor | null {
  const normalizedValue = value.trim()

  if (normalizedValue.startsWith('#')) {
    return parseHexColor(normalizedValue)
  }

  const rgbMatch = normalizedValue.match(/^rgba?\(([^)]+)\)$/i)
  if (!rgbMatch) {
    return null
  }

  const channels = rgbMatch[1]
    .split(',')
    .slice(0, 3)
    .map((channel) => Number.parseFloat(channel.trim()))

  if (channels.length !== 3 || channels.some((channel) => Number.isNaN(channel))) {
    return null
  }

  return {
    r: clamp(channels[0]),
    g: clamp(channels[1]),
    b: clamp(channels[2]),
  }
}

function parseHexColor(value: string): RgbColor | null {
  const hex = value.replace('#', '')

  if (hex.length === 3 || hex.length === 4) {
    const [r, g, b] = hex.slice(0, 3).split('').map((part) => Number.parseInt(part.repeat(2), 16))
    return { r, g, b }
  }

  if (hex.length === 6 || hex.length === 8) {
    return {
      r: Number.parseInt(hex.slice(0, 2), 16),
      g: Number.parseInt(hex.slice(2, 4), 16),
      b: Number.parseInt(hex.slice(4, 6), 16),
    }
  }

  return null
}

function mix(a: RgbColor, b: RgbColor, weight: number): RgbColor {
  return {
    r: clamp(a.r + (b.r - a.r) * weight),
    g: clamp(a.g + (b.g - a.g) * weight),
    b: clamp(a.b + (b.b - a.b) * weight),
  }
}

function getContrastColor(color: RgbColor): RgbColor {
  return getLuminance(color) > 0.42
    ? { r: 19, g: 18, b: 22 }
    : { r: 248, g: 244, b: 236 }
}

function getLuminance(color: RgbColor): number {
  const channels = [color.r, color.g, color.b].map((channel) => {
    const normalizedChannel = channel / 255
    return normalizedChannel <= 0.03928
      ? normalizedChannel / 12.92
      : ((normalizedChannel + 0.055) / 1.055) ** 2.4
  })

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
}

function formatColor(color: RgbColor): string {
  return `rgb(${color.r}, ${color.g}, ${color.b})`
}

function clamp(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)))
}
