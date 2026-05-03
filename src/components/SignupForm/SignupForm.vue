<template>
  <section :class="[bemm(), color ? bemm('', 'has-color') : '']" :style="blockStyle" :data-test-id="testId">
    <div v-if="$slots.brand" :class="bemm('brand')" :data-test-id="getTestId(testId, 'brand')">
      <slot name="brand" />
    </div>

    <slot name="header">
      <header :class="bemm('header')" :data-test-id="getTestId(testId, 'header')">
        <p v-if="eyebrow" :class="bemm('eyebrow')" :data-test-id="getTestId(testId, 'eyebrow')">{{ eyebrow }}</p>
        <h2 :class="bemm('title')" :data-test-id="getTestId(testId, 'title')">{{ title }}</h2>
        <p v-if="description" :class="bemm('description')" :data-test-id="getTestId(testId, 'description')">{{ description }}</p>
      </header>
    </slot>

    <div v-if="successMessage || errorMessage" :class="bemm('messages')" :data-test-id="getTestId(testId, 'messages')">
      <Notification
        v-if="successMessage"
        :message="successMessage"
        type="success"
        :test-id="getTestId(testId, 'success-message')"
      />
      <Notification
        v-if="errorMessage"
        :message="errorMessage"
        type="error"
        :test-id="getTestId(testId, 'error-message')"
      />
    </div>

    <div v-if="providers.length" :class="bemm('providers')" :data-test-id="getTestId(testId, 'providers')">
      <p v-if="providersLabel" :class="bemm('providers-label')" :data-test-id="getTestId(testId, 'providers-label')">{{ providersLabel }}</p>

      <div :class="bemm('providers-grid')" :data-test-id="getTestId(testId, 'providers-grid')">
        <Button
          v-for="provider in providers"
          :key="provider.id"
          block
          :color="provider.color"
          :disabled="disabled || provider.disabled"
          :href="provider.href"
          :icon="provider.icon"
          :variant="provider.variant ?? 'outline'"
          :test-id="getTestId(testId, `provider-${provider.id}`)"
          @click="handleProviderClick(provider, $event)"
        >
          {{ provider.label }}
        </Button>
      </div>

      <div :class="bemm('divider')" :data-test-id="getTestId(testId, 'divider')">
        <span :class="bemm('divider-line')" :data-test-id="getTestId(testId, 'divider-line-start')" />
        <span :class="bemm('divider-label')" :data-test-id="getTestId(testId, 'divider-label')">{{ dividerLabel }}</span>
        <span :class="bemm('divider-line')" :data-test-id="getTestId(testId, 'divider-line-end')" />
      </div>
    </div>

    <form :class="bemm('form')" :data-test-id="getTestId(testId, 'form')" @submit.prevent="handleSubmit">
      <slot name="before-fields" />

      <div v-if="showName" :class="bemm('field')" :data-test-id="getTestId(testId, 'name-field')">
        <label :class="bemm('field-label')" :for="nameFieldId" :data-test-id="getTestId(testId, 'name-label')">{{ nameLabel }}</label>
        <input
          :id="nameFieldId"
          v-model="formState.name"
          :class="bemm('field-control')"
          :data-test-id="getTestId(testId, 'name-control')"
          :disabled="disabled"
          :placeholder="namePlaceholder"
          autocomplete="name"
          required
          type="text"
        >
      </div>

      <div :class="bemm('field')" :data-test-id="getTestId(testId, 'email-field')">
        <label :class="bemm('field-label')" :for="emailFieldId" :data-test-id="getTestId(testId, 'email-label')">{{ emailLabel }}</label>
        <input
          :id="emailFieldId"
          v-model="formState.email"
          :autocomplete="emailAutoComplete"
          :class="bemm('field-control')"
          :data-test-id="getTestId(testId, 'email-control')"
          :disabled="disabled"
          :placeholder="emailPlaceholder"
          required
          type="email"
        >
      </div>

      <div :class="bemm('field')" :data-test-id="getTestId(testId, 'password-field')">
        <label :class="bemm('field-label')" :for="passwordFieldId" :data-test-id="getTestId(testId, 'password-label')">{{ passwordLabel }}</label>

        <div :class="bemm('field-shell')" :data-test-id="getTestId(testId, 'password-shell')">
          <input
            :id="passwordFieldId"
            v-model="formState.password"
            :autocomplete="passwordAutoComplete"
            :class="[bemm('field-control'), showPasswordToggle ? bemm('field-control', 'has-toggle') : '']"
            :data-test-id="getTestId(testId, 'password-control')"
            :disabled="disabled"
            :placeholder="passwordPlaceholder"
            required
            :type="resolvedPasswordType"
          >

          <button
            v-if="showPasswordToggle"
            :class="bemm('toggle-password')"
            :data-test-id="getTestId(testId, 'password-toggle')"
            type="button"
            @click="isPasswordVisible = !isPasswordVisible"
          >
            <Icon :name="isPasswordVisible ? Icons.UI_INVISIBLE_M : Icons.UI_VISIBLE_M" :data-test-id="getTestId(testId, 'password-toggle-icon')" />
            <span :class="bemm('sr-only')" :data-test-id="getTestId(testId, 'password-toggle-label')">
              {{ isPasswordVisible ? 'Hide password' : 'Show password' }}
            </span>
          </button>
        </div>
      </div>

      <div v-if="showConfirmPassword" :class="bemm('field')" :data-test-id="getTestId(testId, 'confirm-password-field')">
        <label :class="bemm('field-label')" :for="confirmPasswordFieldId" :data-test-id="getTestId(testId, 'confirm-password-label')">{{ confirmPasswordLabel }}</label>

        <div :class="bemm('field-shell')" :data-test-id="getTestId(testId, 'confirm-password-shell')">
          <input
            :id="confirmPasswordFieldId"
            v-model="formState.confirmPassword"
            :autocomplete="confirmPasswordAutoComplete"
            :class="[bemm('field-control'), showPasswordToggle ? bemm('field-control', 'has-toggle') : '']"
            :data-test-id="getTestId(testId, 'confirm-password-control')"
            :disabled="disabled"
            :placeholder="confirmPasswordPlaceholder"
            required
            :type="resolvedConfirmPasswordType"
          >

          <button
            v-if="showPasswordToggle"
            :class="bemm('toggle-password')"
            :data-test-id="getTestId(testId, 'confirm-password-toggle')"
            type="button"
            @click="isConfirmPasswordVisible = !isConfirmPasswordVisible"
          >
            <Icon :name="isConfirmPasswordVisible ? Icons.UI_INVISIBLE_M : Icons.UI_VISIBLE_M" :data-test-id="getTestId(testId, 'confirm-password-toggle-icon')" />
            <span :class="bemm('sr-only')" :data-test-id="getTestId(testId, 'confirm-password-toggle-label')">
              {{ isConfirmPasswordVisible ? 'Hide password' : 'Show password' }}
            </span>
          </button>
        </div>

        <p v-if="passwordsMismatch" :class="bemm('field-error')" :data-test-id="getTestId(testId, 'password-mismatch')">{{ passwordMismatchMessage }}</p>
      </div>

      <slot name="after-fields" />

      <div v-if="showTerms || showMarketingOptIn" :class="bemm('options')" :data-test-id="getTestId(testId, 'options')">
        <div v-if="showTerms" :class="bemm('checkbox')" :data-test-id="getTestId(testId, 'terms-field')">
          <slot name="terms">
            <InputCheckbox
              v-model="formState.acceptTerms"
              indicator="check"
              :disabled="disabled"
              :label="termsLabel"
              size="small"
              :test-id="getTestId(testId, 'terms')"
            />
          </slot>
        </div>

        <div v-if="showMarketingOptIn" :class="bemm('checkbox')" :data-test-id="getTestId(testId, 'marketing-field')">
          <InputCheckbox
            v-model="formState.marketingOptIn"
            indicator="check"
            :disabled="disabled"
            :label="marketingLabel"
            size="small"
            :test-id="getTestId(testId, 'marketing')"
          />
        </div>
      </div>

      <p v-if="legalNote" :class="bemm('legal-note')" :data-test-id="getTestId(testId, 'legal-note')">{{ legalNote }}</p>

      <Button
        block
        :class="bemm('submit')"
        :color="color"
        :disabled="isSubmitDisabled"
        :loading="loading"
        type="submit"
        :test-id="getTestId(testId, 'submit')"
      >
        {{ submitLabel }}
      </Button>

      <slot name="after-submit" />
    </form>

    <footer v-if="alternateLabel || $slots.footer" :class="bemm('footer')" :data-test-id="getTestId(testId, 'footer')">
      <p v-if="alternateLabel" :class="bemm('alternate')" :data-test-id="getTestId(testId, 'alternate')">
        <span :data-test-id="getTestId(testId, 'alternate-prompt')">{{ alternatePrompt }}</span>
        <a
          v-if="alternateHref"
          :class="bemm('alternate-link')"
          :href="alternateHref"
          :data-test-id="getTestId(testId, 'alternate-link')"
          @click="emit('alternate-click', $event)"
        >
          {{ alternateLabel }}
        </a>
        <button
          v-else
          :class="[bemm('alternate-link'), bemm('alternate-link', 'button')]"
          :data-test-id="getTestId(testId, 'alternate-button')"
          type="button"
          @click="emit('alternate-click', $event)"
        >
          {{ alternateLabel }}
        </button>
      </p>

      <slot name="footer" />
    </footer>
  </section>
</template>

<script lang="ts" setup>
import { useBemm } from 'bemm'
import { Icons } from 'open-icon'
import { computed, reactive, ref, watch } from 'vue'

import { Button } from '../Button'
import { Icon } from '../Icon'
import { Notification } from '../Notification'
import { InputCheckbox } from '../Form'
import type { SignupFormEmits, SignupFormProps, SignupFormValue, SignupProviderAction } from './SignupForm.model'
import { getTestId } from '../../utils'

defineOptions({
  name: 'SignupForm'
})

const props = withDefaults(defineProps<SignupFormProps>(), {
  modelValue: () => ({}),
  eyebrow: '',
  title: 'Create your account',
  description: 'Start with a fresh workspace and invite your team when you are ready.',
  submitLabel: 'Create account',
  loading: false,
  disabled: false,
  color: undefined,
  showName: true,
  nameLabel: 'Full name',
  namePlaceholder: 'Your full name',
  emailLabel: 'Email address',
  emailPlaceholder: 'you@example.com',
  emailAutoComplete: 'email',
  passwordLabel: 'Password',
  passwordPlaceholder: 'Create a password',
  passwordAutoComplete: 'new-password',
  showPasswordToggle: true,
  showConfirmPassword: true,
  confirmPasswordLabel: 'Confirm password',
  confirmPasswordPlaceholder: 'Repeat your password',
  confirmPasswordAutoComplete: 'new-password',
  passwordMismatchMessage: 'Passwords must match.',
  showTerms: true,
  requireTermsAcceptance: true,
  termsLabel: 'I agree to the terms and privacy policy',
  showMarketingOptIn: false,
  marketingLabel: 'Keep me updated with product news',
  legalNote: '',
  successMessage: '',
  errorMessage: '',
  providers: () => [],
  providersLabel: 'Continue with',
  dividerLabel: 'or',
  alternatePrompt: 'Already have an account?',
  alternateLabel: 'Sign in',
  alternateHref: undefined,
})

const slots = defineSlots<{
  brand?: () => any
  header?: () => any
  terms?: () => any
  'before-fields'?: () => any
  'after-fields'?: () => any
  'after-submit'?: () => any
  footer?: () => any
}>()

const emit = defineEmits<SignupFormEmits>()
const bemm = useBemm('signup-form')

const nameFieldId = `signup-name-${Math.random().toString(36).slice(2, 9)}`
const emailFieldId = `signup-email-${Math.random().toString(36).slice(2, 9)}`
const passwordFieldId = `signup-password-${Math.random().toString(36).slice(2, 9)}`
const confirmPasswordFieldId = `signup-confirm-password-${Math.random().toString(36).slice(2, 9)}`

const formState = reactive<SignupFormValue>({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false,
  marketingOptIn: false,
})

const isPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)
const isSyncingFromProps = ref(false)

const resolvedPasswordType = computed(() => {
  if (!props.showPasswordToggle) {
    return 'password'
  }

  return isPasswordVisible.value ? 'text' : 'password'
})

const resolvedConfirmPasswordType = computed(() => {
  if (!props.showPasswordToggle) {
    return 'password'
  }

  return isConfirmPasswordVisible.value ? 'text' : 'password'
})

const passwordsMismatch = computed(() => (
  props.showConfirmPassword
  && Boolean(formState.password)
  && Boolean(formState.confirmPassword)
  && formState.password !== formState.confirmPassword
))

const isSubmitDisabled = computed(() => {
  if (props.disabled) {
    return true
  }

  if (passwordsMismatch.value) {
    return true
  }

  if (props.showTerms && props.requireTermsAcceptance && !formState.acceptTerms && !slots.terms) {
    return true
  }

  return false
})

const blockStyle = computed(() => {
  if (!props.color) {
    return {}
  }

  return {
    '--signup-form-accent': `var(--color-${props.color})`
  }
})

watch(
  () => props.modelValue,
  (value) => {
    isSyncingFromProps.value = true
    Object.assign(formState, defaultState(), value ?? {})
    isSyncingFromProps.value = false
  },
  { deep: true, immediate: true }
)

watch(
  formState,
  (value) => {
    if (isSyncingFromProps.value) {
      return
    }

    emit('update:modelValue', { ...value })
  },
  { deep: true }
)

function handleSubmit(event: SubmitEvent) {
  if (isSubmitDisabled.value) {
    return
  }

  emit('submit', { ...formState }, event)
}

function handleProviderClick(provider: SignupProviderAction, event: MouseEvent) {
  emit('provider-click', provider, event)
}

function defaultState(): SignupFormValue {
  return {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    marketingOptIn: false,
  }
}
</script>

<style lang="scss">
.signup-form {
  --signup-form-accent: var(--color-primary);

  width: min(100%, 34rem);
  display: grid;
  gap: 1.35rem;
  padding: clamp(1.3rem, 3vw, 2.1rem);
  border-radius: var(--border-radius-l);
  border: 1px solid color-mix(in srgb, var(--signup-form-accent), transparent 76%);
  background:
    radial-gradient(circle at top right, color-mix(in srgb, var(--signup-form-accent), transparent 84%), transparent 42%),
    linear-gradient(180deg, color-mix(in srgb, var(--color-background), transparent 0%), color-mix(in srgb, var(--color-background), var(--signup-form-accent) 4%));
  box-shadow:
    inset 0 1px 0 color-mix(in srgb, white, transparent 84%),
    0 1.4rem 3rem color-mix(in srgb, var(--color-foreground), transparent 92%);

  &__brand {
    display: flex;
    align-items: center;
    min-height: 1.5rem;
  }

  &__header,
  &__form,
  &__footer,
  &__providers,
  &__options {
    display: grid;
    gap: 0.95rem;
  }

  &__eyebrow {
    margin: 0;
    color: var(--signup-form-accent);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  &__title {
    margin: 0;
    font-size: clamp(1.7rem, 3vw, 2.25rem);
    line-height: 1.05;
    letter-spacing: -0.04em;
  }

  &__description {
    margin: 0;
    color: color-mix(in srgb, var(--color-foreground), transparent 34%);
    line-height: 1.55;
  }

  &__providers-label,
  &__field-label {
    margin: 0;
    font-size: 0.88rem;
    font-weight: 600;
    color: color-mix(in srgb, var(--color-foreground), transparent 20%);
  }

  &__providers-grid {
    display: grid;
    gap: 0.75rem;
  }

  &__divider {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 0.85rem;
    color: color-mix(in srgb, var(--color-foreground), transparent 48%);
    font-size: 0.85rem;
  }

  &__divider-line {
    height: 1px;
    background: color-mix(in srgb, var(--color-foreground), transparent 88%);
  }

  &__field {
    display: grid;
    gap: 0.5rem;
  }

  &__field-shell {
    position: relative;
  }

  &__field-control {
    width: 100%;
    min-height: 3.25rem;
    padding: 0.9rem 1rem;
    border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 84%);
    border-radius: calc(var(--border-radius, 0.8rem) * 1.1);
    background: color-mix(in srgb, var(--color-background), white 4%);
    color: var(--color-foreground);
    font: inherit;
    transition:
      border-color 180ms ease,
      box-shadow 180ms ease,
      background-color 180ms ease;

    &::placeholder {
      color: color-mix(in srgb, var(--color-foreground), transparent 56%);
    }

    &:focus {
      outline: none;
      border-color: color-mix(in srgb, var(--signup-form-accent), transparent 26%);
      box-shadow: 0 0 0 4px color-mix(in srgb, var(--signup-form-accent), transparent 84%);
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.7;
    }

    &--has-toggle {
      padding-right: 3.3rem;
    }
  }

  &__toggle-password {
    position: absolute;
    right: 0.55rem;
    top: 50%;
    transform: translateY(-50%);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.3rem;
    height: 2.3rem;
    border: none;
    border-radius: 999px;
    background: transparent;
    color: color-mix(in srgb, var(--color-foreground), transparent 28%);
    cursor: pointer;
    transition:
      color 160ms ease,
      background-color 160ms ease;

    &:hover {
      color: var(--color-foreground);
      background: color-mix(in srgb, var(--signup-form-accent), transparent 90%);
    }
  }

  &__field-error {
    margin: 0;
    color: var(--color-error);
    font-size: 0.88rem;
  }

  &__checkbox {
    min-width: 0;
  }

  &__legal-note {
    margin: 0;
    color: color-mix(in srgb, var(--color-foreground), transparent 38%);
    font-size: 0.9rem;
    line-height: 1.5;
  }

  &__footer {
    gap: 0.7rem;
  }

  &__alternate {
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.45rem;
    flex-wrap: wrap;
    color: color-mix(in srgb, var(--color-foreground), transparent 34%);
    text-align: center;
  }

  &__alternate-link {
    color: var(--signup-form-accent);
    font-weight: 600;
    text-decoration: none;

    &--button {
      padding: 0;
      border: none;
      background: none;
      font: inherit;
      cursor: pointer;
    }
  }

  &__sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  :deep(.input-checkbox) {
    gap: 0;
  }

  :deep(.input-checkbox__label) {
    font-size: 0.92rem;
    line-height: 1.4;
  }

  @media (max-width: 560px) {
    width: 100%;
    border-radius: var(--border-radius-l);
  }
}
</style>
