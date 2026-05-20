export type IkkiHeaderIcon = 'check' | 'document' | 'grid'

export interface IkkiAppShellProps {
  productName: string
  hoverLabel: string
  icon?: IkkiHeaderIcon
  label?: string
  title?: string
  scrolled?: boolean
  sidebarOpen?: boolean
  showChrome?: boolean
  mainLabel?: string
  maxWidth?: string
  sidebarShift?: string
}
