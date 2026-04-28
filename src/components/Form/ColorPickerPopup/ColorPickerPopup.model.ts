import type { TestIdProps } from "../../../types";

export interface ColorPickerPopupProps {
  testId?: TestIdProps['testId']
  modelValue?: string
  colors?: string[]
  columns?: number | 'auto'
  placeholder?: string
  size?: 'small' | 'medium' | 'large'
}

export interface ColorPickerPopupEmits {
  'update:modelValue': [value: string]
}
