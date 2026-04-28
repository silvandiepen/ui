import type { TestIdProps } from "../../types";

export interface ReferenceBadgeProps {
  testId?: TestIdProps['testId'];
  label: string;
  tooltipText?: string;
  href?: string;
  copyValue?: string;
  copyLabel?: string;
}
