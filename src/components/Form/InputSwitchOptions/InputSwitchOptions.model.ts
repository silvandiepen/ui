import type {
  InputSwitchEmits,
  InputSwitchProps,
  SwitchItem,
} from '../InputSwitch/InputSwitch.model'
import type { TestIdProps } from '../../../types'

export type InputSwitchOption = SwitchItem
export type InputSwitchOptionsProps = InputSwitchProps & {
  testId?: TestIdProps['testId']
}
export type InputSwitchOptionsEmits = InputSwitchEmits
