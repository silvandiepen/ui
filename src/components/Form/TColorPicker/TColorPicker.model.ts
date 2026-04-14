import { AllColors, Size } from '../../../types';

export interface TColorPickerProps {
  block?: string;
  colors?: string[];
  allowCustom?: boolean;
  size?: Size;
  label?: string;
  inline?: boolean;
  disabled?: boolean;
  description?: string;
}

export interface TColorPickerEmits {
  'update:modelValue': [value: string];
}

export const defaultColors = Object.values(AllColors);
