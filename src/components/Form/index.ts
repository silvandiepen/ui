// Export all form components
export * from './Form'
export * from './Input'
export * from './ImageInput'
export * from './ColorPicker'
export * from './ColorPickerPopup'
export * from './NumberPad'
export * from './PinInput'
export * from './RichTextEditor'
export * from './Toggle'
export * from './FormActions'

// Alternate aliases used by existing imports
export { Input as Input } from './Input'
export { Toggle as Toggle } from './Toggle'
export { InputSelect as Select } from './Form/inputs/InputSelect'
export { InputRadio as RadioGroup } from './Form/inputs/InputRadio'
export { InputCheckbox as Checkbox } from './Form/inputs/InputCheckbox'
export { FormGroup as CheckboxGroup } from './Form'
export { InputCheckbox as InputCheckbox } from './Form/inputs/InputCheckbox'
export { Toggle as Switch } from './Toggle'
export { InputSelect as InputSelect } from './Form/inputs/InputSelect'
export { InputNumber as InputNumber } from './Form/inputs/InputNumber'

// Preferred UI-prefixed API
export * as UIForms from './Form'
export { Form as UIForm } from './Form'
export { FormField as UIFormField } from './Form'
export { FormGroup as UIFormGroup } from './Form'
export { InputBase as UIInputBase } from './Form'
export { Input as UIInput } from './Input'
export { default as UIImageInput } from './ImageInput'
export { default as UIColorPicker } from './ColorPicker'
export { ColorPickerPopup as UIColorPickerPopup } from './ColorPickerPopup'
export { NumberPad as UINumberPad } from './NumberPad'
export { PinInput as UIInputPin } from './PinInput'
export { PinInput as UIPinInput } from './PinInput'
export { RichTextEditor as UIRichTextEditor } from './RichTextEditor'
export { Toggle as UIToggle } from './Toggle'
export { FormActions as UIFormActions } from './FormActions'
export {
  InputCascader as UIInputCascader,
  InputText as UIInputText,
  InputNumber as UIInputNumber,
  InputTextArea as UIInputTextArea,
  InputCheckbox as UIInputCheckbox,
  InputSelect as UIInputSelect,
  InputCustomSelect as UIInputCustomSelect,
  InputSwitch as UIInputSwitch,
  InputSwitchOptions as UIInputSwitchOptions,
  InputRadio as UIInputRadio,
  InputRange as UIInputRange,
  InputSearch as UIInputSearch,
  InputPassword as UIInputPassword,
  InputDate as UIInputDate,
  InputColor as UIInputColor,
  InputOptions as UIInputOptions,
  InputToggle as UIInputToggle,
  InputSelectColor as UIInputSelectColor,
  InputSelectIcon as UIInputSelectIcon,
  InputImage as UIInputImage,
  InputBirthday as UIInputBirthday,
  InputCalendar as UIInputCalendar,
  InputVerificationCode as UIInputVerificationCode,
  InputEmail as UIInputEmail,
  DatePicker as UIDatePicker,
} from './Form'
export { InputCheckbox as UICheckbox } from './Form'
export { InputRadio as UIRadioGroup } from './Form'
export { InputSelect as UISelect } from './Form'
export { InputSwitch as UISwitch } from './Form'
export { InputSwitchOptions as UISwitchOptions } from './Form'
