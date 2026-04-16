import { ColorType, ComplimentaryType, getComplimentary } from '@sil/color'
import { describe, expect, it } from 'vitest'

import {
  formatColor,
  hslToWheelPoint,
  parseColorString,
  rgbToHsl,
  wheelPointToHsl,
} from './ColorChooser.utils'

describe('ColorChooser utils', () => {
  it('parses supported color strings', () => {
    expect(parseColorString('#00ff00')).toEqual({ r: 0, g: 255, b: 0 })
    expect(parseColorString('rgb(12, 34, 56)')).toEqual({ r: 12, g: 34, b: 56 })
    expect(parseColorString('hsl(120, 100%, 50%)')).toEqual({ r: 0, g: 255, b: 0 })
  })

  it('formats hsl values to all output formats', () => {
    const hsl = { h: 120, s: 100, l: 50 }

    expect(formatColor(hsl, 'hex').toLowerCase()).toBe('#00ff00')
    expect(formatColor(hsl, 'rgb')).toContain('rgb(')
    expect(formatColor(hsl, 'hsl')).toContain('hsl(')
  })

  it('maps between wheel points and hsl', () => {
    const hsl = wheelPointToHsl(90, 0, 180, 50)
    const point = hslToWheelPoint(hsl, 180)

    expect(hsl.s).toBeGreaterThan(90)
    expect(point.x).toBeTypeOf('number')
    expect(point.y).toBeTypeOf('number')
  })

  it('returns complimentary colors from @sil/color', () => {
    const palette = getComplimentary('#ff0000', {
      total: 5,
      type: ComplimentaryType.HUE,
      output: ColorType.HEX,
    }) as string[]

    expect(palette.length).toBe(5)
    expect(palette[0]).toMatch(/^#([0-9a-fA-F]{6})$/)
  })

  it('converts rgb to hsl consistently', () => {
    const hsl = rgbToHsl({ r: 255, g: 0, b: 0 })

    expect(hsl.h).toBe(0)
    expect(hsl.s).toBe(100)
    expect(hsl.l).toBe(50)
  })
})
