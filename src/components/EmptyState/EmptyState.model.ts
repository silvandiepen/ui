import type { ButtonProps } from '../Button'

export interface EmptyStateProps {
  icon?: string
  title?: string
  description?: string
  /** Alias for description, for compact usage */
  message?: string
  /** Quick action button — alternative to using the #actions slot */
  action?: Partial<ButtonProps> & { label: string; action: () => void }
}
