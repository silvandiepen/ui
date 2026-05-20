export interface IkkiSidebarItem {
  id: string
  title: string
  icon?: string
  meta?: string
  progress?: string
  active?: boolean
  done?: boolean
  locked?: boolean
}

export interface IkkiSidebarFooterItem {
  id: string
  label: string
  icon?: string
  badge?: boolean
  href?: string
  target?: string
  rel?: string
  visible?: boolean
}
