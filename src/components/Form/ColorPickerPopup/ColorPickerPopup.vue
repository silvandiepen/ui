<template>
  <div :class="bemm()">
    <Popover
      placement="bottom"
      width="fit-content"
    >
      <template #trigger>
        <button
          type="button"
          :class="bemm('trigger')"
          :aria-label="selectColorLabel"
        >
          <span
            :class="bemm('selected', ['',modelValue ? 'has-color' : 'no-color'])"
            :style="modelValue ? { backgroundColor: currentColor } : {}"
          >
            <span v-if="!modelValue" :class="bemm('placeholder')">
              {{ selectColorLabel }}
            </span>
          </span>

          <Icon
            :name="Icons.CHEVRON_DOWN"
            size="small"
            :class="bemm('icon')"
          />
        </button>
      </template>

      <template #default="{ close }">
        <ColorPicker
          :model-value="props.modelValue"
          :colors="availableColors"
          :columns="props.columns ?? 'auto'"
          :label="''"
          inline
          :style="{ '--color-picker-control-frame-display': 'none' }"
          @update:model-value="(color) => handleColorUpdate(color, close)"
        />
      </template>
    </Popover>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useBemm } from 'bemm'
import { Icons } from 'open-icon'
import { Icon } from '../../Icon'
import { Popover } from '../../Popover'
import ColorPicker from '../ColorPicker/ColorPicker.vue'
import { useI18n } from '../../../composables/useI18n';
import { AllColors } from '../../../types'

const props = defineProps<{
  modelValue?: string
  colors?: string[]
  columns?: number | 'auto'
  placeholder?: string
  size?: 'small' | 'medium' | 'large',
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const bemm = useBemm('t-color-picker-popup')
const { t } = useI18n()
const translatedSelectColor = computed(() => t('common.selectColor'))
const selectColorLabel = computed(() =>
  props.placeholder
  || (translatedSelectColor.value !== 'common.selectColor' ? translatedSelectColor.value : 'Select color')
)

const availableColors = computed(() =>
  props.colors?.length ? props.colors : Object.values(AllColors) as string[]
)
const currentColor = computed(() => {
  if (!props.modelValue) return ''
  return `var(--color-${props.modelValue})`
})

const handleColorUpdate = (color: string, close: () => void) => {
  emit('update:modelValue', color)
  close()
}
</script>

<style lang="scss">
@use '../../../styles/mixins' as m;

.t-color-picker-popup {
  @include m.component-props((
    'trigger-gap': '0.5rem',
    'trigger-padding': '0.5rem',
    'trigger-border-radius': '0.375rem',
    'trigger-min-width': '75px',
    'selected-height': '2rem',
    'selected-border-radius': '0.25rem',
    'placeholder-font-size': '0.875rem',
    'small-trigger-padding': '0.375rem',
    'small-trigger-min-width': '80px',
    'small-selected-height': '1.5rem',
    'large-trigger-padding': '0.75rem',
    'large-trigger-min-width': '160px',
    'large-selected-height': '2.5rem',
  ), 't-color-picker-popup');

  display: inline-flex;
  align-items: center;

  &__trigger {
    all: unset;
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    gap: var(--int-t-color-picker-popup-trigger-gap);
    padding: var(--int-t-color-picker-popup-trigger-padding);
    background: var(--color-background);
    border: 1px solid var(--color-accent);
    border-radius: var(--int-t-color-picker-popup-trigger-border-radius);
    cursor: pointer;
    transition: all 0.2s ease;
    min-width: var(--int-t-color-picker-popup-trigger-min-width);

    &:hover {
      border-color: var(--color-primary);
    }

    &:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }
  }

  &__selected {
    flex: 1;
    height: var(--int-t-color-picker-popup-selected-height);
    border-radius: var(--int-t-color-picker-popup-selected-border-radius);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 90%);
    position: relative;
    overflow: hidden;

    &--has-color {
      // When a color is selected, add a subtle inner shadow for depth
      box-shadow: inset 0 1px 2px color-mix(in srgb, var(--color-foreground), transparent 90%);
    }

    &--no-color {
      background: var(--color-gray-light);
    }
  }

  &__placeholder {
    color: var(--color-text-secondary);
    font-size: var(--int-t-color-picker-popup-placeholder-font-size);
  }

  &__icon {
    color: var(--color-text-secondary);
  }

  // Size variants
  &--small {
    .t-color-picker-popup__trigger {
      padding: var(--int-t-color-picker-popup-small-trigger-padding);
      min-width: var(--int-t-color-picker-popup-small-trigger-min-width);
    }

    .t-color-picker-popup__selected { height: var(--int-t-color-picker-popup-small-selected-height); }
  }

  &--large {
    .t-color-picker-popup__trigger {
      padding: var(--int-t-color-picker-popup-large-trigger-padding);
      min-width: var(--int-t-color-picker-popup-large-trigger-min-width);
    }

    .t-color-picker-popup__selected { height: var(--int-t-color-picker-popup-large-selected-height); }
  }
}
</style>
