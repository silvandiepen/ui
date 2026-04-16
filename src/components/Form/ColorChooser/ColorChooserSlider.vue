<template>
  <div :class="bemm()">
    <span :class="bemm('label')">{{ label }}</span>

    <div :class="bemm('track')" :style="{ '--color-chooser-slider-gradient': gradient }">
      <input
        :class="bemm('input')"
        type="range"
        :min="min"
        :max="max"
        :step="step"
        :value="modelValue"
        :disabled="disabled"
        @input="onInput"
        @change="onChange"
      >
    </div>

    <InputNumber
      :model-value="modelValue"
      :min="min"
      :max="max"
      :step="step"
      :size="Size.SMALL"
      :disabled="disabled"
      :label="''"
      @update:model-value="onNumberInput"
    />
  </div>
</template>

<script setup lang="ts">
import { useBemm } from 'bemm'

import { InputNumber } from '../InputNumber'
import { Size } from '../../../types';

const props = withDefaults(defineProps<{
  modelValue: number
  label: string
  min: number
  max: number
  step?: number
  disabled?: boolean
  gradient: string
}>(), {
  step: 1,
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
  change: [value: number]
}>()

const bemm = useBemm('color-chooser-slider', { includeBaseClass: true })

const onInput = (event: Event) => {
  const value = Number((event.target as HTMLInputElement).value)
  emit('update:modelValue', value)
}

const onChange = (event: Event) => {
  const value = Number((event.target as HTMLInputElement).value)
  emit('change', value)
}

const onNumberInput = (value: unknown) => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return
  }

  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<style lang="scss">
.color-chooser-slider {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) 5.5rem;
  gap: var(--space-s);
  align-items: center;

  &__label {
    min-width: 1.2rem;
    font-size: var(--font-size-xs);
    color: color-mix(in srgb, var(--color-foreground), transparent 38%);
    font-weight: 600;
  }

  &__track {
    position: relative;
    height: var(--space-l);
    border-radius: var(--border-radius);
    // border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 80%);
    background: var(--color-chooser-slider-gradient);
    overflow: hidden;
  }

  &__input {
    appearance: none;
    width: 100%;
    height: 100%;
    margin: 0;
    background: transparent;
    cursor: pointer;

    &::-webkit-slider-thumb {
      appearance: none;
      width: var(--space);
      height: var(--space);
      border-radius: 50%;
      border: 2px solid #fff;
      box-shadow: 0 0 0 1px color-mix(in srgb, var(--color-foreground), transparent 70%);
      background: transparent;
    }

    &::-moz-range-thumb {
      width: 0.9rem;
      height: 0.9rem;
      border-radius: 50%;
      border: 2px solid #fff;
      box-shadow: 0 0 0 1px color-mix(in srgb, var(--color-foreground), transparent 70%);
      background: transparent;
    }
  }

  .input-number {
    width: 100%;
  }
}
</style>
