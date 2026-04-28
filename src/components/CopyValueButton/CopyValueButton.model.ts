import type { TestIdProps } from "../../types";

export interface CopyValueButtonProps {
  testId?: TestIdProps['testId'];
  value: string;
  label?: string;
  successTitle?: string;
}
