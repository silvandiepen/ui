export interface DraggableProps {
  modelValue: unknown[]
  itemKey?: string | ((item: unknown, index: number) => string | number)
  itemClass?: string | ((item: unknown, index: number) => string | string[] | undefined)
  disabled?: boolean
}
