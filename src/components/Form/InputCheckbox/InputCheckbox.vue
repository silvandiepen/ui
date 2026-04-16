<template>
  <InputBase
    v-model="model"
    :class="[bemm(), size ? bemm('', String(size)) : '']"
    :block="block"
    :label="''"
    :disabled="disabled"
    :error="error"
    @touched="$emit('touched', $event)"
  >
    <template #control="{ id, disabled: controlDisabled }">
      <label
        :class="bemm('control-container', {
          active: isActive,
          disabled: controlDisabled,
          indeterminate,
        })"
        :for="id"
        :style="controlStyle"
      >
        <input
          :id="id"
          ref="inputElement"
          v-model="model"
          :class="bemm('control')"
          :disabled="controlDisabled"
          :name="name"
          type="checkbox"
          @change="handleInputChange"
        />

        <span :class="bemm('check-control')">
          <span
            :class="[
              bemm('check-control-dot'),
              bemm('check-control-dot', indicator),
            ]"
          >
            <span
              v-if="indicator === 'dot'"
              :class="bemm('indicator-dot')"
            />

            <span
              v-else-if="indicator === 'check'"
              :class="bemm('indicator-check')"
            />

            <span
              v-else
              :class="bemm('indicator-x')"
            >
              <span :class="bemm('indicator-x-line')" />
              <span :class="bemm('indicator-x-line')" />
            </span>
          </span>
        </span>

        <span
          v-if="label"
          :class="[
            bemm('label'),
            bemm('label', labelPosition),
          ]"
        >
          {{ label }}
        </span>
      </label>
    </template>
  </InputBase>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useBemm } from 'bemm'
import InputBase from '../Form/InputBase.vue'
import type { InputCheckboxProps, InputCheckboxEmits } from './InputCheckbox.model'

const model = defineModel<boolean>({ default: false })

const props = withDefaults(defineProps<InputCheckboxProps>(), {
  label: '',
  disabled: false,
  error: () => [],
  indicator: 'dot',
  color: 'primary',
  indeterminate: false,
  labelPosition: 'right',
})

const emit = defineEmits<InputCheckboxEmits>()

const block = 'input-checkbox'
const bemm = useBemm(block, {
  includeBaseClass: true,
})
const inputElement = ref<HTMLInputElement | null>(null)

const isActive = computed(() => Boolean(model.value) || Boolean(props.indeterminate))
const controlStyle = computed(() => ({
  '--input-checkbox-active-color': `var(--color-${props.color ?? 'primary'})`,
}))

const handleInputChange = (e: Event) => {
  const checked = (e.target as HTMLInputElement).checked
  model.value = checked
  emit('change', checked)
}

watch(
  () => props.indeterminate,
  (value) => {
    if (inputElement.value) {
      inputElement.value.indeterminate = Boolean(value)
    }
  },
  { immediate: true },
)
</script>

<style lang="scss">
@use '../../../styles/mixins' as m;

.input-checkbox {
  @include m.component-props((
    'size': '1.5rem',
    'space': '0.18rem',
    'size-small': '1.2rem',
    'size-large': '1.8rem',
    'label-font-size': '0.95em',
    'label-line-height': '1.2',
    'disabled-opacity': '0.65',
    'dot-size': '0.72rem',
  ), 'input-checkbox');

  --input-checkbox-size: var(--int-input-checkbox-size);
  --input-checkbox-space: var(--int-input-checkbox-space);
  --input-checkbox-dot-size: calc(var(--input-checkbox-size) - (var(--input-checkbox-space) * 2));
  gap: var(--space-s);
  display: flex;

  &--small {
    --input-checkbox-size: var(--int-input-checkbox-size-small);
  }

  &--large {
    --input-checkbox-size: var(--int-input-checkbox-size-large);
  }

  &__control-container {
    display: inline-flex;
    align-items: center;
    gap: calc(var(--space) * 0.5);
    cursor: pointer;

    &--disabled {
      cursor: not-allowed;
      opacity: var(--int-input-checkbox-disabled-opacity);
    }
  }

  &__label {
    font-size: var(--int-input-checkbox-label-font-size);
    line-height: var(--int-input-checkbox-label-line-height);

    &--left {
      order: -1;
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
  }

  &__check-control {
    pointer-events: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--input-checkbox-size);
    height: var(--input-checkbox-size);
    padding: var(--input-checkbox-space);
    border-radius: calc(var(--border-radius) * 0.75);
    border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 78%);
    background: var(--color-background);
    transition:
      border-color 180ms ease,
      background-color 180ms ease,
      box-shadow 180ms ease,
      transform 180ms ease;
  }

  &__control:focus-visible + .input-checkbox__check-control {
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--input-checkbox-active-color), transparent 78%);
  }

  &__control-container--active .input-checkbox__check-control,
  &__control-container--indeterminate .input-checkbox__check-control {
    border-color: color-mix(in srgb, var(--input-checkbox-active-color), transparent 30%);
    background: color-mix(in srgb, var(--input-checkbox-active-color), transparent 90%);
  }

  &__check-control-dot {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--input-checkbox-dot-size);
    height: var(--input-checkbox-dot-size);
    color: var(--input-checkbox-active-color);
    transition:
      transform 200ms ease,
      opacity 200ms ease,
      color 180ms ease;
  }

  &__indicator-dot,
  &__indicator-check,
  &__indicator-x {
    opacity: 0;
    transform: scale(0.4);
    transition:
      transform 200ms ease,
      opacity 200ms ease;
  }

  &__control-container--active .input-checkbox__indicator-dot,
  &__control-container--active .input-checkbox__indicator-check,
  &__control-container--active .input-checkbox__indicator-x,
  &__control-container--indeterminate .input-checkbox__indicator-dot {
    opacity: 1;
    transform: scale(1);
  }

  &__indicator-dot {
    width: var(--int-input-checkbox-dot-size, 0.72rem);
    height: var(--int-input-checkbox-dot-size, 0.72rem);
    border-radius: calc(var(--border-radius) * 0.45);
    background: currentColor;
  }

  &__indicator-check {
    width: 0.35rem;
    height: 0.62rem;
    border-right: 2px solid currentColor;
    border-bottom: 2px solid currentColor;
    transform: translateY(-0.06rem) rotate(45deg) scale(0.4);
  }

  &__control-container--active .input-checkbox__indicator-check {
    transform: translateY(-0.06rem) rotate(45deg) scale(1);
  }

  &__indicator-x {
    position: relative;
    width: var(--int-input-checkbox-dot-size, 0.72rem);
    height: var(--int-input-checkbox-dot-size, 0.72rem);
  }

  &__indicator-x-line {
    position: absolute;
    left: 50%;
    top: 50%;
    width: var(--int-input-checkbox-dot-size, 0.72rem);
    height: 2px;
    border-radius: 999px;
    background: currentColor;

    &:first-child {
      transform: translate(-50%, -50%) rotate(45deg);
    }

    &:last-child {
      transform: translate(-50%, -50%) rotate(-45deg);
    }
  }
}
</style>
