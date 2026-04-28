import type { TestIdProps } from "../../types";

export interface DraggableProps {
  testId?: TestIdProps['testId']
  modelValue: unknown[]
  itemKey?: string | ((item: unknown, index: number) => string | number)
  itemClass?: string | ((item: unknown, index: number) => string | string[] | undefined)
  disabled?: boolean
}
