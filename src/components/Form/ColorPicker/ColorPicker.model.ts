import { BaseColors, Size } from '../../../types';

export interface ColorPickerProps {
  block?: string;
  colors?: string[];
  columns?: number | 'auto';
  allowCustom?: boolean;
  size?: Size;
  label?: string;
  inline?: boolean;
  disabled?: boolean;
  description?: string;
}

export interface ColorPickerEmits {
  'update:modelValue': [value: string];
}

export const defaultColors = Object.values(BaseColors);
