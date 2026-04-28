<template>
  <div
    :class="bemm()"
    :data-test-id="testId"
  >
    <div
      :class="bemm('display')"
      :data-test-id="getTestId(props.testId, 'display')"
    >
      <div
        v-for="(_, index) in length"
        :key="index"
        :class="
          bemm('dot', {
            filled: index < modelValue.length,
            active: index === modelValue.length && !disabled,
            error: !!error
          })
        "
        :data-test-id="getTestId(props.testId, `dot-${index}`)"
      >
        <span
          v-if="showValue && modelValue[index]"
          :class="bemm('value')"
          :data-test-id="getTestId(props.testId, `dot-${index}-value`)"
        >
          {{ mask ? maskCharacter : modelValue[index] }}
        </span>
      </div>
    </div>

    <!-- Hidden input for actual value -->
    <input
      ref="inputRef"
      :value="modelValue"
      type="text"
      inputmode="numeric"
      autocomplete="one-time-code"
      pattern="[0-9]*"
      :maxlength="length"
      :disabled="disabled"
      :class="bemm('input')"
      :data-test-id="getTestId(props.testId, 'input')"
      @input="handleInput"
      @keydown="handleKeydown"
      @focus="handleFocus"
      @blur="handleBlur"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useBemm } from 'bemm'
import type { PinInputProps, PinInputEmits } from './PinInput.model'
import { getTestId } from '../../../utils/testId'

const props = withDefaults(defineProps<PinInputProps>(), {
  modelValue: '',
  length: 4,
  showValue: false,
  mask: false,
  maskCharacter: '•',
  disabled: false,
  autoFocus: false,
  autoSubmit: false
})

const emit = defineEmits<PinInputEmits>()

const bemm = useBemm('pin-input', {
includeBaseClass : true
})

// Refs
const inputRef = ref<HTMLInputElement | null>(null)
const isFocused = ref(false)

// Methods
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  let value = target.value.replace(/\D/g, '')

  if (value.length > props.length) {
    value = value.slice(0, props.length)
  }

  target.value = value

  emit('update:modelValue', value)
  emit('change', value)

  if (props.autoSubmit && value.length === props.length) {
    emit('complete', value)
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  // Allow backspace, delete, tab, escape, enter
  if ([8, 9, 27, 13, 46].includes(event.keyCode)) {
    if (event.keyCode === 13 && props.modelValue.length === props.length) {
      emit('complete', props.modelValue)
    }
    return
  }

  // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
  if (event.ctrlKey === true && [65, 67, 86, 88].includes(event.keyCode)) {
    return
  }

  // Ensure that it is a number and stop the keypress
  if (
    (event.shiftKey || event.keyCode < 48 || event.keyCode > 57) &&
    (event.keyCode < 96 || event.keyCode > 105)
  ) {
    event.preventDefault()
  }
}

const handleFocus = () => {
  isFocused.value = true
  emit('focus')
}

const handleBlur = () => {
  isFocused.value = false
  emit('blur')
}

// Public methods
const focus = () => {
  inputRef.value?.focus()
}

const blur = () => {
  inputRef.value?.blur()
}

const clear = () => {
  emit('update:modelValue', '')
  emit('change', '')
}

// Auto-focus on mount
watch(inputRef, (input) => {
  if (input && props.autoFocus) {
    nextTick(() => {
      input.focus()
    })
  }
}, { immediate: true })

// Expose public methods
defineExpose({
  focus,
  blur,
  clear
})
</script>

<style lang="scss">
@use '../../../styles/mixins' as m;

.pin-input {
  position: relative;
  display: inline-block;
  cursor: text;

  &__display {
    display: flex;
    gap: var(--space-s);
  }

  &__dot {
    width: var(--space-xl);
    height: var(--space-xl);
    border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 75%);
    border-radius: var(--border-radius);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: m.p('dot-font-size', 1.125em);
    font-weight: m.p('dot-font-weight', 600);
    transition: all 0.2s ease;
    background: var(--color-background);
    position: relative;
    overflow: hidden;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: var(--color-primary);
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    &--filled {    border-color:  color-mix(in srgb, var(--color-foreground), transparent 50%);


      &:not(:has(.pin-input__value)) {
        &::before {
          content: '•';
          font-size: 1.5em;
          color: var(--color-foreground);
          position: relative;
          z-index: 1;
        }
      }
    }

    &--active {
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary), transparent 85%);
    }

    &--error {
      border-color: var(--color-error);

      &.pin-input__dot--active {
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-error), transparent 85%);
      }
    }
  }

  &__value {
    position: relative;
    z-index: 1;
    color: var(--color-foreground);
  }

  &__input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    z-index: 2;
    cursor: text;
    pointer-events: auto;
    border: none;
    outline: none;
    background: transparent;
  }

  // Size variants
  &--small {
    .pin-input__dot {
      width: var(--space-l);
      height: var(--space-l);
      font-size: m.p('dot-font-size', 0.875em);

      &--filled:not(:has(.pin-input__value)) {
        &::before {
          font-size: 1.25em;
        }
      }
    }
  }

  &--large {
    .pin-input__dot {
      width: calc(var(--space-xl) * 1.33);
      height: calc(var(--space-xl) * 1.33);
      font-size: m.p('dot-font-size', 1.25em);

      &--filled:not(:has(.pin-input__value)) {
        &::before {
          font-size: 2em;
        }
      }
    }
  }
}
</style>
