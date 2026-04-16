export type ColorChooserFormat = 'hex' | 'rgb' | 'hsl'
export type ColorChooserInputMode = 'hex' | 'rgb' | 'hsl'
export type ColorChooserComplimentaryType = 'shade' | 'tint' | 'tone' | 'hue'

export interface ColorChooserComplimentaryConfig {
  total?: number
  type?: ColorChooserComplimentaryType
}

export interface ColorChooserHsl {
  h: number
  s: number
  l: number
}

export interface ColorChooserRgb {
  r: number
  g: number
  b: number
}

export interface ColorChooserProps {
  modelValue?: string
  label?: string
  description?: string
  disabled?: boolean
  wheel?: boolean
  wheelSize?: number
  showHexInput?: boolean
  showRgbInputs?: boolean
  showHslInputs?: boolean
  inputMode?: ColorChooserInputMode
  showInputModeTabs?: boolean
  showHslSliders?: boolean
  complimentary?: boolean | number | ColorChooserComplimentaryConfig
  recentColors?: string[]
  palletteColors?: string[]
  paletteColors?: string[]
  outputFormat?: ColorChooserFormat
}

export interface ColorChooserEmits {
  'update:modelValue': [value: string]
  change: [value: string]
}
