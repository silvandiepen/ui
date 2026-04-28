import type { TestIdProps } from "../../types";

export interface TextareaProps {
  testId?: TestIdProps['testId'];
  modelValue?: string;
  disabled?: boolean;
  id?: string;
  rows?: number;
}
