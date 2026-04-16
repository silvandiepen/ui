<template>
  <div :class="inputClasses">
    <label v-if="label" :for="inputId" :class="bemm('label')">
      {{ label }}
      <span v-if="required" :class="bemm('required')">*</span>
    </label>

    <div :class="bemm('wrapper')">
      <Icon
        v-if="prefixIcon"
        :name="prefixIcon"
        :class="bemm('icon', ['prefix'])"
      />

      <input
        :id="inputId"
        :class="bemm('field')"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :min="min"
        :max="max"
        :step="step"
        :aria-label="ariaLabel || label"
        :aria-describedby="descriptionId"
        :aria-invalid="hasError"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeydown"
      />

      <Icon
        v-if="suffixIcon"
        :name="suffixIcon"
        :class="bemm('icon', ['suffix'])"
      />

      <div v-if="type === 'number' && showSpinners" :class="bemm('spinners')">
        <button
          type="button"
          :class="bemm('spinner', ['up'])"
          @click="increment"
          :disabled="disabled || (max !== undefined && Number(modelValue) >= max)"
          aria-label="Increase value"
        >
          <Icon name="chevron-up" size="small" />
        </button>

        <button
          type="button"
          :class="bemm('spinner', ['down'])"
          @click="decrement"
          :disabled="disabled || (min !== undefined && Number(modelValue) <= min)"
          aria-label="Decrease value"
        >
          <Icon name="chevron-down" size="small" />
        </button>
      </div>
    </div>

    <div v-if="description || hasError" :id="descriptionId" :class="bemm('description')">
      <span v-if="hasError" :class="bemm('error')">{{ error }}</span>
      <span v-else-if="description" :class="bemm('help')">{{ description }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useBemm } from 'bemm'
import Icon from '../../Icon/Icon.vue'
import type { InputProps, InputEmits } from './Input.model'

const props = withDefaults(defineProps<InputProps>(), {
  type: 'text',
  size: 'medium',
  showSpinners: true
})

const emit = defineEmits<InputEmits>()

// BEM classes
const bemm = useBemm('input')

// Generate unique ID
const inputId = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`)
const descriptionId = computed(() => `${inputId.value}-description`)

// State
const isFocused = ref(false)

// Computed
const hasError = computed(() => Boolean(props.error))

const inputClasses = computed(() => {
  return bemm('', {
    [props.size]: true,
    focused: isFocused.value,
    disabled: props.disabled,
    readonly: props.readonly,
    error: hasError.value,
    'has-prefix': Boolean(props.prefixIcon),
    'has-suffix': Boolean(props.suffixIcon),
    'has-spinners': props.type === 'number' && props.showSpinners
  })
})

// Methods
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  let value: string | number = target.value

  if (props.type === 'number') {
    value = target.value === '' ? '' : Number(target.value)
  }

  emit('update:modelValue', value)
}

const handleFocus = (event: FocusEvent) => {
  isFocused.value = true
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  isFocused.value = false
  emit('blur', event)
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    emit('enter', event)
  }
}

const increment = () => {
  if (props.disabled || props.readonly) return

  const currentValue = Number(props.modelValue) || 0
  const step = props.step || 1
  const newValue = currentValue + step

  if (props.max === undefined || newValue <= props.max) {
    emit('update:modelValue', newValue)
  }
}

const decrement = () => {
  if (props.disabled || props.readonly) return

  const currentValue = Number(props.modelValue) || 0
  const step = props.step || 1
  const newValue = currentValue - step

  if (props.min === undefined || newValue >= props.min) {
    emit('update:modelValue', newValue)
  }
}
</script>

<style lang="scss">
@use '../../../styles/mixins' as m;

.input {
  @include m.component-props((
    'gap': '0.5rem',
    'label-font-size': '0.875rem',
    'label-font-weight': '500',
    'required-margin': '0.25rem',
    'field-padding': '0.75rem 1rem',
    'field-font-size': '1rem',
    'line-height': '1.5',
    'focus-ring-width': '3px',
    'icon-offset': '0.75rem',
    'spinner-width': '1.5rem',
    'spinner-height': '1rem',
    'spinners-offset': '0.25rem',
    'has-icon-padding': '2.5rem',
    'small-padding': '0.5rem 0.75rem',
    'small-font-size': '0.875rem',
    'small-icon-offset': '0.5rem',
    'large-padding': '1rem 1.25rem',
    'large-font-size': '1.125rem',
    'large-icon-offset': '1rem',
    'description-font-size': '0.875rem',
    'description-line-height': '1.4',
  ), 'input');

  display: flex;
  flex-direction: column;
  gap: var(--int-input-gap);

  &__label {
    font-weight: var(--int-input-label-font-weight);
    color: var(--text-primary);
    font-size: var(--int-input-label-font-size);
  }

  &__required {
    color: var(--color-error);
    margin-left: var(--int-input-required-margin);
  }

  &__wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  &__field {
    width: 100%;
    padding: var(--int-input-field-padding);
    border: 1px solid var(--color-accent);
    border-radius: var(--border-radius);
    font-family: inherit;
    font-size: var(--int-input-field-font-size);
    line-height: var(--int-input-line-height);
    transition: all 0.2s ease;
    background: var(--color-background);
    color: var(--color-background-text);

    &:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 var(--int-input-focus-ring-width) color-mix(in srgb, var(--color-primary), transparent 90%);
    }

    &::placeholder {
      color: var(--text-tertiary);
    }

    &:disabled {
      background: var(--bg-tertiary);
      color: var(--text-tertiary);
      cursor: not-allowed;
    }

    &:readonly {
      background: var(--bg-secondary);
    }
  }

  &__icon {
    position: absolute;
    color: var(--text-secondary);
    pointer-events: none;

    &--prefix {
      left: var(--int-input-icon-offset);
    }

    &--suffix {
      right: var(--int-input-icon-offset);
    }
  }

  &__spinners {
    position: absolute;
    right: var(--int-input-spinners-offset);
    display: flex;
    flex-direction: column;
    border-radius: var(--border-radius);
    overflow: hidden;
    border: 1px solid var(--border-primary);
  }

  &__spinner {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--int-input-spinner-width);
    height: var(--int-input-spinner-height);
    background: var(--bg-secondary);
    border: none;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover:not(:disabled) {
      background: var(--bg-tertiary);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &--up {
      border-bottom: 1px solid var(--border-primary);
    }
  }

  &__description {
    font-size: var(--int-input-description-font-size);
    line-height: var(--int-input-description-line-height);
    opacity: .5;
  }

  &__error {
    color: var(--color-error);
  }

  &__help {
    color: var(--text-secondary);
  }

  // Size variants
  &--small {
    .input__field {
      padding: var(--int-input-small-padding);
      font-size: var(--int-input-small-font-size);
    }

    .input__icon--prefix {
      left: var(--int-input-small-icon-offset);
    }

    .input__icon--suffix {
      right: var(--int-input-small-icon-offset);
    }
  }

  &--large {
    .input__field {
      padding: var(--int-input-large-padding);
      font-size: var(--int-input-large-font-size);
    }

    .input__icon--prefix {
      left: var(--int-input-large-icon-offset);
    }

    .input__icon--suffix {
      right: var(--int-input-large-icon-offset);
    }
  }

  // States
  &--has-prefix {
    .input__field {
      padding-left: var(--int-input-has-icon-padding);
    }
  }

  &--has-suffix:not(.input--has-spinners) {
    .input__field {
      padding-right: var(--int-input-has-icon-padding);
    }
  }

  &--has-spinners {
    .input__field {
      padding-right: var(--int-input-has-icon-padding);
    }
  }

  &--error {
    .input__field {
      border-color: var(--color-error);

      &:focus {
        border-color: var(--color-error);
        box-shadow: 0 0 0 var(--int-input-focus-ring-width) color-mix(in srgb, var(--color-error), transparent 90%);
      }
    }
  }

  &--focused {
    .input__icon {
      color: var(--color-primary);
    }
  }
}

// High contrast mode support
@media (prefers-contrast: high) {
  .input {
    &__field {
      border-width: 2px;
    }
  }
}

// Reduced motion support
@media (prefers-reduced-motion: reduce) {
  .input {
    &__field {
      transition: none;
    }
  }
}
</style>
