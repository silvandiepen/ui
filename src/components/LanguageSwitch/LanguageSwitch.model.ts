import type { ButtonSize, ButtonVariant } from '../Button'
import type { ContextPanelClickMode, ContextPanelPosition } from '../ContextMenu'
import type { PopoverPlacement } from '../Popover'

export type LanguageSwitchSurface = 'context-panel' | 'inline' | 'popover'
export type LanguageSwitchDisplayMode = 'code' | 'label' | 'label-code'
export type LanguageSwitchMode = 'default' | 'simple'

export interface LanguageSwitchOption {
  children?: LanguageSwitchOption[]
  code?: string
  description?: string
  disabled?: boolean
  flagEmoji?: string
  flagSrc?: string
  label: string
  regionCode?: string
  value?: string
}

export interface LanguageSwitchProps {
  closeOnSelect?: boolean
  contextPanelClickMode?: ContextPanelClickMode
  contextPanelPosition?: ContextPanelPosition
  displayMode?: LanguageSwitchDisplayMode
  modelValue?: string
  mode?: LanguageSwitchMode
  options: LanguageSwitchOption[]
  placeholder?: string
  popoverPlacement?: PopoverPlacement
  popoverWidth?: number | string
  showDescriptions?: boolean
  showFlags?: boolean
  showSelectionIndicator?: boolean
  surface?: LanguageSwitchSurface
  title?: string
  triggerLabel?: string
  triggerSize?: ButtonSize
  triggerVariant?: ButtonVariant
}
