import type { TestIdProps } from "../../types";

export interface SectionProps {
  testId?: TestIdProps['testId']
  variant?: 'default' | 'hero' | 'cta' | 'alternate'
  centered?: boolean
  noContainer?: boolean
  // Container props pass-through
  maxWidth?: string
  padding?: string
  fluid?: boolean
}
