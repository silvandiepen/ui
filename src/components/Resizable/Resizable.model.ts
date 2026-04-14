export type ResizableDirection = 'horizontal' | 'vertical'

export type ResizableSource = 'keyboard' | 'pointer' | 'programmatic'

export interface ResizableEventContext {
  event?: Event
  size: number
  source: ResizableSource
}

export interface ResizableProps {
  ariaLabel?: string
  defaultSize?: number
  direction?: ResizableDirection
  disabled?: boolean
  handleLabel?: string
  keyboardStep?: number
  maxSize?: number
  minSecondarySize?: number
  minSize?: number
  modelValue?: number
  settingsKey?: string
}
