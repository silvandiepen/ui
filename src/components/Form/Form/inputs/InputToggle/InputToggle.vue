<template>
  <InputBase
    v-model="model"
    :class="[
      bemm(),
      size ? bemm('', String(size)) : '',
      isOptionMode ? bemm('', 'option-mode') : '',
    ]"
    :block="block"
    :label="label"
    :description="description"
    :disabled="disabled"
    :error="error"
    @touched="$emit('touched', $event)"
  >
    <template #control="{ id, disabled: controlDisabled }">
      <div
        v-if="isOptionMode"
        :class="bemm('options')"
        :style="controlStyle"
        role="group"
      >
        <button
          v-for="option in normalizedOptions"
          :key="String(option.value)"
          type="button"
          :class="bemm('option', {
            active: isSelected(option.value),
            disabled: controlDisabled || option.disabled,
          })"
          :disabled="controlDisabled || option.disabled"
          @click="handleOptionSelect(option.value)"
        >
          <Icon
            v-if="showIcon && option.icon"
            :class="bemm('option-icon')"
            :name="option.icon"
            size="small"
          />
          <span :class="bemm('option-label')">{{ option.label }}</span>
        </button>
      </div>

      <label
        v-else
        :class="bemm('control-container', { disabled: controlDisabled })"
        :for="id"
        :style="controlStyle"
      >
        <input
          :id="id"
          :checked="booleanModel"
          :class="bemm('control')"
          :disabled="controlDisabled"
          :name="name"
          type="checkbox"
          @change="handleBooleanChange"
        />

        <span :class="bemm('control-switch')">
          <span :class="bemm('control-thumb')">
            <Icon
              v-if="resolvedBooleanIcon"
              :class="bemm('control-icon')"
              :name="resolvedBooleanIcon"
              size="small"
            />
            <span
              v-else-if="showIcon"
              :class="bemm('control-check')"
            />
          </span>
        </span>

        <span
          v-if="resolvedBooleanLabel"
          :class="bemm('state-label')"
        >
          {{ resolvedBooleanLabel }}
        </span>
      </label>
    </template>
  </InputBase>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useBemm } from 'bemm'

import Icon from '../../../../Icon/Icon.vue'
import InputBase from '../../InputBase.vue'

import type { InputToggleEmits, InputToggleOption, InputToggleProps, InputToggleValue } from './InputToggle.model'

const model = defineModel<InputToggleValue>({
  default: false,
})

const props = withDefaults(defineProps<InputToggleProps>(), {
  label: '',
  description: '',
  error: () => [],
  showIcon: true,
  disabled: false,
  required: false,
  color: 'primary',
  options: undefined,
})

const emit = defineEmits<InputToggleEmits>()

const block = 'input-toggle'
const bemm = useBemm(block,{
  includeBaseClass: true,
})

const normalizedOptions = computed<InputToggleOption[]>(() =>
  (props.options ?? []).map((option) => {
    if (typeof option === 'string') {
      return {
        label: option,
        value: option,
      }
    }

    return option
  }),
)

const isOptionMode = computed(() => normalizedOptions.value.length > 0)
const booleanModel = computed(() => Boolean(model.value))
const controlStyle = computed(() => ({
  '--input-toggle-active-color': `var(--color-${props.color ?? 'primary'})`,
}))

const resolvedBooleanLabel = computed(() => {
  if (!props.labels) {
    return ''
  }

  return booleanModel.value
    ? props.labels.on ?? ''
    : props.labels.off ?? ''
})

const resolvedBooleanIcon = computed(() => {
  if (!props.showIcon || !props.icons) {
    return ''
  }

  return booleanModel.value
    ? props.icons.on ?? ''
    : props.icons.off ?? ''
})

function isSelected(value: InputToggleValue) {
  return model.value === value
}

function emitChange(value: InputToggleValue) {
  model.value = value
  emit('change', value)
  emit('touched', true)
}

function handleBooleanChange(event: Event) {
  emitChange((event.target as HTMLInputElement).checked)
}

function handleOptionSelect(value: InputToggleValue) {
  if (props.disabled) {
    return
  }

  emitChange(value)
}
</script>

<style lang="scss">
.input-toggle {
  --input-toggle-height: 1.5rem;
  --input-toggle-width: 2.55rem;
  --input-toggle-padding: 0.18rem;
  --input-toggle-thumb-size: calc(var(--input-toggle-height) - (var(--input-toggle-padding) * 2));

  &--small {
    --input-toggle-height: 1.25rem;
    --input-toggle-width: 2.2rem;
  }

  &--large {
    --input-toggle-height: 1.8rem;
    --input-toggle-width: 3rem;
  }

  &__control-container {
    display: inline-flex;
    align-items: center;
    gap: 0.7rem;
    cursor: pointer;

    &--disabled {
      cursor: not-allowed;
      opacity: 0.65;
    }
  }

  &__control {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;

    &:focus-visible + .input-toggle__control-switch {
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--input-toggle-active-color), transparent 75%);
    }

    &:checked + .input-toggle__control-switch {
      background: color-mix(in srgb, var(--input-toggle-active-color), var(--color-background) 12%);
      border-color: color-mix(in srgb, var(--input-toggle-active-color), transparent 45%);
    }

    &:checked + .input-toggle__control-switch .input-toggle__control-thumb {
      transform: translateX(calc(var(--input-toggle-width) - var(--input-toggle-thumb-size) - (var(--input-toggle-padding) * 2)));
      color: var(--input-toggle-active-color);
    }

    &:checked + .input-toggle__control-switch .input-toggle__control-check {
      opacity: 1;
      transform: translate(-50%, -55%) rotate(45deg) scale(1);
    }
  }

  &__control-switch {
    position: relative;
    display: inline-flex;
    align-items: center;
    width: var(--input-toggle-width);
    height: var(--input-toggle-height);
    padding: var(--input-toggle-padding);
    border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 82%);
    border-radius: 999px;
    background: color-mix(in srgb, var(--color-foreground), transparent 93%);
    transition:
      background-color 180ms ease,
      border-color 180ms ease,
      box-shadow 180ms ease;
  }

  &__control-thumb {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--input-toggle-thumb-size);
    height: var(--input-toggle-thumb-size);
    border-radius: 999px;
    background: var(--color-background);
    color: color-mix(in srgb, var(--color-foreground), transparent 30%);
    box-shadow: 0 0.18rem 0.6rem color-mix(in srgb, var(--color-foreground), transparent 84%);
    transition:
      transform 180ms ease,
      color 180ms ease;
  }

  &__control-check {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 0.34rem;
    height: 0.58rem;
    border-right: 2px solid currentColor;
    border-bottom: 2px solid currentColor;
    opacity: 0;
    transform: translate(-50%, -55%) rotate(45deg) scale(0.5);
    transition:
      opacity 180ms ease,
      transform 180ms ease;
  }

  &__control-icon {
    width: 0.9rem;
    height: 0.9rem;
  }

  &__state-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-foreground);
  }

  &__options {
    display: inline-flex;
    flex-wrap: wrap;
    gap: 0.18rem;
    padding: 0.18rem;
    border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 86%);
    border-radius: calc(var(--border-radius) * 0.95);
    background: color-mix(in srgb, var(--color-background), var(--color-foreground) 2%);
  }

  &__option {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    min-height: 2.2rem;
    padding: 0.45rem 0.8rem;
    border: 0;
    border-radius: calc(var(--border-radius) * 0.75);
    background: transparent;
    color: color-mix(in srgb, var(--color-foreground), transparent 18%);
    cursor: pointer;
    transition:
      background-color 160ms ease,
      color 160ms ease,
      transform 160ms ease;

    &:hover:not(&--disabled) {
      background: color-mix(in srgb, var(--color-foreground), transparent 95%);
    }

    &--active {
      background: color-mix(in srgb, var(--input-toggle-active-color), transparent 88%);
      color: var(--input-toggle-active-color);
    }

    &--disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  &__option-icon {
    width: 1rem;
    height: 1rem;
  }

  &__option-label {
    white-space: nowrap;
    font-size: 0.9rem;
    font-weight: 600;
  }
}
</style>
