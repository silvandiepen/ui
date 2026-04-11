// Export all form components
export * from './TForm'
export * from './TInput'
export * from './TImageInput'
export * from './TColorPicker'
export * from './TColorPickerPopup'
export * from './TNumberPad'
export * from './TPinInput'
export * from './TRichTextEditor'
export * from './TToggle'
export * from './TFormActions'

// Aliases for backward compatibility
export { TInput as Input } from './TInput'
export { TToggle as Toggle } from './TToggle'
export { TInputSelect as Select } from './TForm/inputs/TInputSelect'
export { TInputRadio as RadioGroup } from './TForm/inputs/TInputRadio'
export { TInputCheckbox as Checkbox } from './TForm/inputs/TInputCheckbox'
export { TFormGroup as CheckboxGroup } from './TForm'
export { TInputCheckbox as InputCheckbox } from './TForm/inputs/TInputCheckbox'
export { TToggle as Switch } from './TToggle'
export { TInputSelect as InputSelect } from './TForm/inputs/TInputSelect'
export { TInputNumber as InputNumber } from './TForm/inputs/TInputNumber'

// Preferred UI-prefixed API
export * as UIForms from './TForm'
export { TForm as UIForm } from './TForm'
export { TFormField as UIFormField } from './TForm'
export { TFormGroup as UIFormGroup } from './TForm'
export { TInputBase as UIInputBase } from './TForm'
export { TInput as UIInput } from './TInput'
export { default as UIImageInput } from './TImageInput'
export { default as UIColorPicker } from './TColorPicker'
export { TColorPickerPopup as UIColorPickerPopup } from './TColorPickerPopup'
export { TNumberPad as UINumberPad } from './TNumberPad'
export { TPinInput as UIPinInput } from './TPinInput'
export { TRichTextEditor as UIRichTextEditor } from './TRichTextEditor'
export { TToggle as UIToggle } from './TToggle'
export { TFormActions as UIFormActions } from './TFormActions'
export {
  TInputText as UIInputText,
  TInputNumber as UIInputNumber,
  TInputTextArea as UIInputTextArea,
  TInputCheckbox as UIInputCheckbox,
  TInputSelect as UIInputSelect,
  TInputCustomSelect as UIInputCustomSelect,
  TInputSwitch as UIInputSwitch,
  TInputRadio as UIInputRadio,
  TInputRange as UIInputRange,
  TInputSearch as UIInputSearch,
  TInputPassword as UIInputPassword,
  TInputDate as UIInputDate,
  TInputColor as UIInputColor,
  TInputOptions as UIInputOptions,
  TInputToggle as UIInputToggle,
  TInputSelectColor as UIInputSelectColor,
  TInputSelectIcon as UIInputSelectIcon,
  TInputImage as UIInputImage,
  TInputBirthday as UIInputBirthday,
  TInputCalendar as UIInputCalendar,
  TInputVerificationCode as UIInputVerificationCode,
  TInputEmail as UIInputEmail,
  TDatePicker as UIDatePicker,
} from './TForm'
export { TInputCheckbox as UICheckbox } from './TForm'
export { TInputRadio as UIRadioGroup } from './TForm'
export { TInputSelect as UISelect } from './TForm'
export { TInputSwitch as UISwitch } from './TForm'
