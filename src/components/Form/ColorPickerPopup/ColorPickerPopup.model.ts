import type { Colors } from '../../../types/color'

export interface ColorPickerPopupProps {
  modelValue?: Colors
  colors?: Colors[]
  placeholder?: string
  size?: 'small' | 'medium' | 'large'
}

export interface ColorPickerPopupEmits {
  'update:modelValue': [value: Colors]
}
