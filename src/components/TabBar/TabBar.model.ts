export interface Tab {
  value: string
  label: string
  icon?: string
  badge?: string | number
  disabled?: boolean
}

export interface TabBarProps {
  tabs: Tab[]
  modelValue: string
  variant?: 'default' | 'pills' | 'underline'
}

export interface TabBarEmits {
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
}
