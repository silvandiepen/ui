export const SYSTEM_SANS_STACK =
  'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'

export const SYSTEM_MONO_STACK =
  '"SF Mono", Consolas, "Liberation Mono", Menlo, Courier, monospace'

export const DEFAULT_THEME_COLORS = {
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

export const DEFAULT_THEME_FONTS = {
  body: SYSTEM_SANS_STACK,
  heading: SYSTEM_SANS_STACK,
  mono: SYSTEM_MONO_STACK,
}

export const UI_THEME_FONT_PRESETS = {
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

export function defineTheme(theme) {
  return theme
}

export function buildThemeConfig(theme = {}) {
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

export const resolveTheme = buildThemeConfig

export function generateThemeStyles(theme = {}) {
  const resolvedTheme = buildThemeConfig(theme)
  const lines = [':root {']

  lines.push(`  --font-family: ${resolvedTheme.fonts.body};`)
  lines.push(`  --font-family-body: ${resolvedTheme.fonts.body};`)
  lines.push(`  --font-family-heading: ${resolvedTheme.fonts.heading};`)
  lines.push(`  --font-family-mono: ${resolvedTheme.fonts.mono};`)
  lines.push(`  --font-family-monospace: ${resolvedTheme.fonts.mono};`)

  const paletteByName = new Map((theme.palette ?? []).map(c => [c.name, c]))
  const hasPalette = paletteByName.size > 0

  if (hasPalette) {
    for (const color of theme.palette) {
      const parsed = parseColor(color.hex)
      lines.push(`  --color-${color.name}: ${color.hex};`)

      if (parsed) {
        const contrast = formatColor(getContrastColor(parsed))
        const light = formatColor(mix(parsed, { r: 255, g: 255, b: 255 }, 0.35))
        const dark = formatColor(mix(parsed, { r: 0, g: 0, b: 0 }, 0.32))
        lines.push(`  --color-${color.name}-text: ${contrast};`)
        lines.push(`  --color-${color.name}-contrast: ${contrast};`)
        lines.push(`  --color-${color.name}-light: ${light};`)
        lines.push(`  --color-${color.name}-dark: ${dark};`)
      }
    }
  }

  for (const [token, value] of Object.entries(resolvedTheme.colors)) {
    if (hasPalette && paletteByName.has(value)) {
      lines.push(`  --color-${token}: var(--color-${value});`)
      lines.push(`  --color-${token}-text: var(--color-${value}-text);`)
      lines.push(`  --color-${token}-contrast: var(--color-${value}-contrast);`)
      lines.push(`  --color-${token}-light: var(--color-${value}-light);`)
      lines.push(`  --color-${token}-dark: var(--color-${value}-dark);`)
    } else {
      const parsed = parseColor(value)
      lines.push(`  --color-${token}: ${value};`)

      if (parsed) {
        const contrast = formatColor(getContrastColor(parsed))
        const light = formatColor(mix(parsed, { r: 255, g: 255, b: 255 }, 0.35))
        const dark = formatColor(mix(parsed, { r: 0, g: 0, b: 0 }, 0.32))
        lines.push(`  --color-${token}-text: ${contrast};`)
        lines.push(`  --color-${token}-contrast: ${contrast};`)
        lines.push(`  --color-${token}-light: ${light};`)
        lines.push(`  --color-${token}-dark: ${dark};`)
      }
    }
  }

  for (const [name, value] of Object.entries(resolvedTheme.variables)) {
    const variableName = name.startsWith('--') ? name : `--${name}`
    lines.push(`  ${variableName}: ${String(value)};`)
  }

  lines.push('}')

  return lines.join('\n')
}

function parseColor(value) {
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

function parseHexColor(value) {
  const hex = value.replace('#', '')

  if (hex.length === 3 || hex.length === 4) {
    const [r, g, b] = hex
      .slice(0, 3)
      .split('')
      .map((part) => Number.parseInt(part.repeat(2), 16))
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

function mix(a, b, weight) {
  return {
    r: clamp(a.r + (b.r - a.r) * weight),
    g: clamp(a.g + (b.g - a.g) * weight),
    b: clamp(a.b + (b.b - a.b) * weight),
  }
}

function getContrastColor(color) {
  return getLuminance(color) > 0.42
    ? { r: 19, g: 18, b: 22 }
    : { r: 248, g: 244, b: 236 }
}

function getLuminance(color) {
  const channels = [color.r, color.g, color.b].map((channel) => {
    const normalizedChannel = channel / 255
    return normalizedChannel <= 0.03928
      ? normalizedChannel / 12.92
      : ((normalizedChannel + 0.055) / 1.055) ** 2.4
  })

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
}

function formatColor(color) {
  return `rgb(${color.r}, ${color.g}, ${color.b})`
}

function clamp(value) {
  return Math.max(0, Math.min(255, Math.round(value)))
}
