<template>
  <InputBase
    v-model="model"
    :block="block ? 'full' : ''"
    :label="label"
    :placeholder="placeholder"
    :description="description"
    :instructions="instructions"
    :disabled="disabled"
    :error="Array.isArray(error) ? error : error ? [error] : []"
    :maxErrors="maxErrors"
    :size="size"
    :status="status"
    type="text"
    :maxlength="maxlength"
    :minlength="minlength"
    :autoComplete="autoComplete"
    :autofocus="autofocus"
    inputmode="search"
    :reset="false"
    :controls="controls"
    :autoFocusNext="autoFocusNext"
    :class="bemm()"
    @change="handleChange"
    @touched="handleTouched"
    @focus="handleFocus"
    @blur="handleBlur"
    @reset="handleReset"
  >
    <template #control="{ id, value, disabled, handleInput, handleTouch, handleFocus, handleBlur, placeholder }">
      <div :class="bemm('wrapper')">
        <Icon 
          name="search" 
          :class="bemm('icon', ['left'])" 
        />
        <input
          :id="id"
          :value="value"
          :class="bemm('control')"
          :placeholder="placeholder"
          type="search"
          :disabled="disabled"
          @input="handleInput"
          @click="handleTouch"
          @focus="handleFocus"
          @blur="handleBlur"
        />
        <Icon 
          v-if="clearable && value"
          name="close"
          :class="bemm('icon', ['right', 'clickable'])"
          @click="handleClear"
        />
      </div>
    </template>
  </InputBase>
</template>

<script setup lang="ts">
import { useBemm } from 'bemm'
import InputBase from '../../InputBase.vue'
import Icon from '../../../../Icon/Icon.vue'
import type { InputSearchProps } from './InputSearch.model'
import { Size, Status } from '../../../../../types'

const { bemm } = useBemm('t-input-search')
const model = defineModel<string>()

withDefaults(defineProps<InputSearchProps>(), {
  label: '',
  placeholder: 'Search...',
  description: '',
  instructions: '',
  disabled: false,
  error: () => [],
  maxErrors: 1,
  size: Size.MEDIUM,
  status: Status.IDLE,
  minlength: undefined,
  maxlength: undefined,
  autoComplete: 'off',
  autofocus: false,
  clearable: true,
  controls: false,
  autoFocusNext: false,
  block: false
})

const emit = defineEmits<{
  change: [value: string]
  touched: []
  focus: []
  blur: []
  reset: []
  clear: []
}>()

const handleChange = (value: string) => emit('change', value)
const handleTouched = () => emit('touched')
const handleFocus = () => emit('focus')
const handleBlur = () => emit('blur')
const handleReset = () => emit('reset')

const handleClear = () => {
  model.value = ''
  emit('clear')
  emit('change', '')
}
</script>

<style lang="scss">
.t-input-search {
  &__wrapper {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
  }

  &__control {
    width: 100%;
    padding: var(--space-m) var(--space-m) var(--space-m) calc(var(--space-m) * 3);
    background: var(--color-background);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-s);
    color: var(--color-foreground);
    font-size: var(--font-size-m);
    transition: all var(--transition-fast);
    
    // Remove default search input styling
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    
    &::-webkit-search-cancel-button,
    &::-webkit-search-decoration {
      display: none;
    }
    
    &:focus {
      outline: none;
      border-color: var(--color-primary);
      background: var(--color-background);
    }
    
    &::placeholder {
      color: var(--color-gray);
    }
    
    // Add padding for clear icon when present
    &:has(~ .t-input-search__icon--right) {
      padding-right: calc(var(--space-m) * 3);
    }
  }

  // Wrapper has clear icon
  &__wrapper:has(.t-input-search__icon--right) {
    .t-input-search__control {
      padding-right: calc(var(--space-m) * 3);
    }
  }

  &__icon {
    position: absolute;
    color: var(--color-gray);
    pointer-events: none;
    font-size: 1.2em;

    &--left {
      left: var(--space-m);
    }

    &--right {
      right: var(--space-m);
    }

    &--clickable {
      pointer-events: auto;
      cursor: pointer;
      transition: all var(--transition-fast);

      &:hover {
        color: var(--color-foreground);
      }
    }
  }
}
</style>