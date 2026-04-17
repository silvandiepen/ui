export const SidebarVariant = {
  DEFAULT: 'default',
  FLOAT: 'float',
}
export type SidebarVariant = (typeof SidebarVariant)[keyof typeof SidebarVariant]

export interface SidebarProps {
  mobileCloseLabel?: string
  mobileDefaultOpen?: boolean
  mobileEnabled?: boolean
  mobileOpenLabel?: string
  mobileBreakpoint?: string
  sticky?: boolean
  title?: string
  subtitle?: string
  width?: string
  variant?: SidebarVariant
}
