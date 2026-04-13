import type { ButtonVariant } from '../Button'
import type { Colors, IconNameOrString } from '../../types'

export interface SignupProviderAction {
  id: string
  label: string
  icon?: IconNameOrString
  href?: string
  disabled?: boolean
  variant?: ButtonVariant
  color?: Colors
}

export interface SignupFormValue {
  name: string
  email: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
  marketingOptIn: boolean
}

export interface SignupFormProps {
  modelValue?: Partial<SignupFormValue>
  eyebrow?: string
  title?: string
  description?: string
  submitLabel?: string
  loading?: boolean
  disabled?: boolean
  color?: Colors
  showName?: boolean
  nameLabel?: string
  namePlaceholder?: string
  emailLabel?: string
  emailPlaceholder?: string
  emailAutoComplete?: string
  passwordLabel?: string
  passwordPlaceholder?: string
  passwordAutoComplete?: string
  showPasswordToggle?: boolean
  showConfirmPassword?: boolean
  confirmPasswordLabel?: string
  confirmPasswordPlaceholder?: string
  confirmPasswordAutoComplete?: string
  passwordMismatchMessage?: string
  showTerms?: boolean
  requireTermsAcceptance?: boolean
  termsLabel?: string
  showMarketingOptIn?: boolean
  marketingLabel?: string
  legalNote?: string
  successMessage?: string
  errorMessage?: string
  providers?: SignupProviderAction[]
  providersLabel?: string
  dividerLabel?: string
  alternatePrompt?: string
  alternateLabel?: string
  alternateHref?: string
}

export interface SignupFormEmits {
  'update:modelValue': [value: SignupFormValue]
  submit: [value: SignupFormValue, event: SubmitEvent]
  'provider-click': [provider: SignupProviderAction, event: MouseEvent]
  'alternate-click': [event: MouseEvent]
}
