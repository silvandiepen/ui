import { describe, expect, it } from 'vitest'

import {
  buildThemeConfig,
  DEFAULT_THEME_COLORS,
  DEFAULT_THEME_FONTS,
  generateThemeStyles,
} from './theme'

describe('theme config', () => {
  it('uses system font stacks by default', () => {
    const theme = buildThemeConfig()

    expect(theme.colors).toMatchObject(DEFAULT_THEME_COLORS)
    expect(theme.fonts).toEqual(DEFAULT_THEME_FONTS)
  })

  it('emits global font and color variables for custom theme values', () => {
    const styles = generateThemeStyles({
      colors: {
        primary: '#123456',
      },
      fonts: {
        body: '"Inter", system-ui, sans-serif',
        heading: '"Manrope", system-ui, sans-serif',
      },
      variables: {
        'border-radius': '0.75rem',
      },
    })

    expect(styles).toContain('--font-family: "Inter", system-ui, sans-serif;')
    expect(styles).toContain('--font-family-heading: "Manrope", system-ui, sans-serif;')
    expect(styles).toContain('--font-family-mono:')
    expect(styles).toContain('--color-primary: #123456;')
    expect(styles).toContain('--color-primary-contrast:')
    expect(styles).toContain('--border-radius: 0.75rem;')
  })
})
