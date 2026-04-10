export interface SectionProps {
  variant?: 'default' | 'hero' | 'cta' | 'alternate'
  centered?: boolean
  noContainer?: boolean
  // Container props pass-through
  maxWidth?: string
  padding?: string
  fluid?: boolean
}