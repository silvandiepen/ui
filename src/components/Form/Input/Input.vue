<template>
  <div
    :class="inputClasses"
    :data-test-id="props.testId"
  >
    <label
      v-if="label"
      :for="inputId"
      :class="bemm('label')"
      :data-test-id="getTestId(props.testId, 'label')"
    >
      {{ label }}
      <span
        v-if="required"
        :class="bemm('required')"
        :data-test-id="getTestId(props.testId, 'required')"
      >*</span>
    </label>

    <div
      :class="bemm('wrapper')"
      :data-test-id="getTestId(props.testId, 'wrapper')"
    >
      <Icon
        v-if="prefixIcon"
        :name="prefixIcon"
        :class="bemm('icon', ['prefix'])"
        :data-test-id="getTestId(props.testId, 'prefix-icon')"
      />

      <input
        :id="inputId"
        :class="bemm('field')"
        :data-test-id="getTestId(props.testId, 'control')"
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
        :data-test-id="getTestId(props.testId, 'suffix-icon')"
      />

      <div
        v-if="type === 'number' && showSpinners"
        :class="bemm('spinners')"
        :data-test-id="getTestId(props.testId, 'spinners')"
      >
        <button
          type="button"
          :class="bemm('spinner', ['up'])"
          :data-test-id="getTestId(props.testId, 'increment')"
          @click="increment"
          :disabled="disabled || (max !== undefined && Number(modelValue) >= max)"
          aria-label="Increase value"
        >
          <Icon
            name="chevron-up"
            size="small"
            :data-test-id="getTestId(props.testId, 'increment-icon')"
          />
        </button>

        <button
          type="button"
          :class="bemm('spinner', ['down'])"
          :data-test-id="getTestId(props.testId, 'decrement')"
          @click="decrement"
          :disabled="disabled || (min !== undefined && Number(modelValue) <= min)"
          aria-label="Decrease value"
        >
          <Icon
            name="chevron-down"
            size="small"
            :data-test-id="getTestId(props.testId, 'decrement-icon')"
          />
        </button>
      </div>
    </div>

    <div
      v-if="description || hasError"
      :id="descriptionId"
      :class="bemm('description')"
      :data-test-id="getTestId(props.testId, 'description')"
    >
      <span
        v-if="hasError"
        :class="bemm('error')"
        :data-test-id="getTestId(props.testId, 'error')"
      >{{ error }}</span>
      <span
        v-else-if="description"
        :class="bemm('help')"
        :data-test-id="getTestId(props.testId, 'help')"
      >{{ description }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useBemm } from 'bemm'
import Icon from '../../Icon/Icon.vue'
import type { InputProps, InputEmits } from './Input.model'
import { getTestId } from '../../../utils/testId'

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
  display: flex;
  flex-direction: column;
  gap: m.p('gap', var(--space-s));

  &__label {
    font-weight: m.p('label-font-weight', 500);
    color: var(--text-primary);
    font-size: m.p('label-font-size', var(--font-size-s));
  }

  &__required {
    color: var(--color-error);
    margin-left: m.p('required-margin', var(--space-xs));
  }

  &__wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  &__field {
    width: 100%;
    padding: m.p('field-padding', calc(var(--space) * 0.75) var(--space));
    border: 1px solid var(--color-accent);
    border-radius: var(--border-radius);
    font-family: inherit;
    font-size: m.p('field-font-size', var(--font-size));
    line-height: m.p('line-height', 1.5);
    transition: all 0.2s ease;
    background: var(--color-background);
    color: var(--color-background-text);

    &:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 m.p('focus-ring-width', 3px) color-mix(in srgb, var(--color-primary), transparent 90%);
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
      left: m.p('icon-offset', calc(var(--space) * 0.75));
    }

    &--suffix {
      right: m.p('icon-offset', calc(var(--space) * 0.75));
    }
  }

  &__spinners {
    position: absolute;
    right: m.p('spinners-offset', var(--space-xs));
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
    width: m.p('spinner-width', calc(var(--space) * 1.5));
    height: m.p('spinner-height', var(--space));
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
    font-size: m.p('description-font-size', var(--font-size-s));
    line-height: m.p('description-line-height', 1.4);
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
      padding: m.p('padding', var(--space-s) calc(var(--space) * 0.75));
      font-size: m.p('font-size', var(--font-size-s));
    }

    .input__icon--prefix {
      left: m.p('icon-offset', var(--space-s));
    }

    .input__icon--suffix {
      right: m.p('icon-offset', var(--space-s));
    }
  }

  &--large {
    .input__field {
      padding: m.p('padding', var(--space) calc(var(--space) * 1.25));
      font-size: m.p('font-size', calc(var(--font-size) * 1.125));
    }

    .input__icon--prefix {
      left: m.p('icon-offset', var(--space));
    }

    .input__icon--suffix {
      right: m.p('icon-offset', var(--space));
    }
  }

  // States
  &--has-prefix {
    .input__field {
      padding-left: m.p('has-icon-padding', calc(var(--space) * 2.5));
    }
  }

  &--has-suffix:not(.input--has-spinners) {
    .input__field {
      padding-right: m.p('has-icon-padding', calc(var(--space) * 2.5));
    }
  }

  &--has-spinners {
    .input__field {
      padding-right: m.p('has-icon-padding', calc(var(--space) * 2.5));
    }
  }

  &--error {
    .input__field {
      border-color: var(--color-error);

      &:focus {
        border-color: var(--color-error);
        box-shadow: 0 0 0 m.p('focus-ring-width', 3px) color-mix(in srgb, var(--color-error), transparent 90%);
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
