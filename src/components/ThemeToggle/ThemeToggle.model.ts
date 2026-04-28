import type { TestIdProps } from "../../types";

export interface ThemeToggleProps {
  testId?: TestIdProps['testId']
  theme?: 'light' | 'dark' | 'system'
}
