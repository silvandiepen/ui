import { Icons } from "open-icon"
import type { TestIdProps } from "../../types"

export interface KbdProps {
  testId?: TestIdProps['testId']
  size?: 'small' | 'medium'
  variant?: 'default' | 'subtle'
  icon?: Icons | null
}
