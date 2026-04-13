import type { ButtonVariant } from '../Button'
import type { Colors, IconNameOrString } from '../../types'

export interface AuthProviderAction {
  id: string
  label: string
  icon?: IconNameOrString
  href?: string
  disabled?: boolean
  variant?: ButtonVariant
  color?: Colors
}

export interface SigninFormValue {
  email: string
  password: string
  rememberMe: boolean
}

export interface SigninFormProps {
  modelValue?: Partial<SigninFormValue>
  eyebrow?: string
  title?: string
  description?: string
  submitLabel?: string
  loading?: boolean
  disabled?: boolean
  color?: Colors
  emailLabel?: string
  emailPlaceholder?: string
  emailAutoComplete?: string
  passwordLabel?: string
  passwordPlaceholder?: string
  passwordAutoComplete?: string
  showPasswordToggle?: boolean
  showRememberMe?: boolean
  rememberMeLabel?: string
  showForgotPassword?: boolean
  forgotPasswordLabel?: string
  forgotPasswordHref?: string
  successMessage?: string
  errorMessage?: string
  providers?: AuthProviderAction[]
  providersLabel?: string
  dividerLabel?: string
  alternatePrompt?: string
  alternateLabel?: string
  alternateHref?: string
}

export interface SigninFormEmits {
  'update:modelValue': [value: SigninFormValue]
  submit: [value: SigninFormValue, event: SubmitEvent]
  'forgot-password': [event: MouseEvent]
  'provider-click': [provider: AuthProviderAction, event: MouseEvent]
  'alternate-click': [event: MouseEvent]
}
