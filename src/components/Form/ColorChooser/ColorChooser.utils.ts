import { isCOLOR, toHSL, toHex, toRGB, toString } from '@sil/color'

import type {
  ColorChooserFormat,
  ColorChooserHsl,
  ColorChooserRgb,
} from './ColorChooser.model'

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function normalizeHue(hue: number): number {
  const normalized = hue % 360
  return normalized < 0 ? normalized + 360 : normalized
}

export function sanitizeHsl(hsl: ColorChooserHsl): ColorChooserHsl {
  return {
    h: Math.round(normalizeHue(hsl.h)),
    s: Math.round(clamp(hsl.s, 0, 100)),
    l: Math.round(clamp(hsl.l, 0, 100)),
  }
}

function sanitizeRgb(rgb: ColorChooserRgb): ColorChooserRgb {
  return {
    r: Math.round(clamp(rgb.r, 0, 255)),
    g: Math.round(clamp(rgb.g, 0, 255)),
    b: Math.round(clamp(rgb.b, 0, 255)),
  }
}

function normalizeColorInput(input: string): string {
  const trimmed = input.trim()

  if (/^[0-9a-fA-F]{3}$/.test(trimmed) || /^[0-9a-fA-F]{6}$/.test(trimmed)) {
    return `#${trimmed}`
  }

  return trimmed
}

export function parseColorString(input: string): ColorChooserRgb | null {
  const normalized = normalizeColorInput(input)

  if (!normalized || !isCOLOR(normalized)) {
    return null
  }

  const rgb = toRGB(normalized)
  return sanitizeRgb({ r: rgb.r, g: rgb.g, b: rgb.b })
}

export function rgbToHsl(rgb: ColorChooserRgb): ColorChooserHsl {
  const hsl = toHSL(sanitizeRgb(rgb) as any)
  return sanitizeHsl({ h: hsl.h, s: hsl.s, l: hsl.l })
}

export function hslToRgb(hsl: ColorChooserHsl): ColorChooserRgb {
  const rgb = toRGB(sanitizeHsl(hsl) as any)
  return sanitizeRgb({ r: rgb.r, g: rgb.g, b: rgb.b })
}

export function formatColor(hsl: ColorChooserHsl, format: ColorChooserFormat): string {
  const safe = sanitizeHsl(hsl)

  if (format === 'rgb') {
    return toString(toRGB(safe as any))
  }

  if (format === 'hsl') {
    return toString(safe as any)
  }

  return toHex(safe as any)
}

export function wheelPointToHsl(
  x: number,
  y: number,
  wheelSize: number,
  currentLightness: number,
): ColorChooserHsl {
  const radius = wheelSize / 2
  const centerX = radius
  const centerY = radius

  const dx = x - centerX
  const dy = y - centerY
  const distance = Math.sqrt((dx * dx) + (dy * dy))
  const limitedDistance = clamp(distance, 0, radius)

  const hue = normalizeHue((Math.atan2(dy, dx) * 180) / Math.PI)
  const saturation = radius === 0 ? 0 : Math.round((limitedDistance / radius) * 100)

  return sanitizeHsl({
    h: hue,
    s: saturation,
    l: currentLightness,
  })
}

export function hslToWheelPoint(hsl: ColorChooserHsl, wheelSize: number): { x: number; y: number } {
  const radius = wheelSize / 2
  const angle = (normalizeHue(hsl.h) * Math.PI) / 180
  const distance = (clamp(hsl.s, 0, 100) / 100) * radius

  return {
    x: radius + (Math.cos(angle) * distance),
    y: radius + (Math.sin(angle) * distance),
  }
}
