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
          @update:model-value="(color) => handleColorUpdate(color ?? '', close)"
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
  display: inline-flex;
  align-items: center;

  &__trigger {
    all: unset;
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    gap: m.p('trigger-gap', var(--space-s));
    padding: m.p('trigger-padding', var(--space-s));
    background: var(--color-background);
    border: 1px solid var(--color-accent);
    border-radius: m.p('trigger-border-radius', var(--border-radius));
    cursor: pointer;
    transition: all 0.2s ease;
    min-width: m.p('trigger-min-width', 75px);

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
    height: m.p('selected-height', calc(var(--space) * 2));
    border-radius: m.p('selected-border-radius', var(--border-radius-s));
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
    font-size: m.p('placeholder-font-size', var(--font-size-s));
  }

  &__icon {
    color: var(--color-text-secondary);
  }

  // Size variants
  &--small {
    .t-color-picker-popup__trigger {
      padding: m.p('trigger-padding', calc(var(--space-s) * 0.75));
      min-width: m.p('trigger-min-width', 80px);
    }

    .t-color-picker-popup__selected { height: m.p('selected-height', calc(var(--space) * 1.5)); }
  }

  &--large {
    .t-color-picker-popup__trigger {
      padding: m.p('trigger-padding', calc(var(--space) * 0.75));
      min-width: m.p('trigger-min-width', 160px);
    }

    .t-color-picker-popup__selected { height: m.p('selected-height', calc(var(--space) * 2.5)); }
  }
}
</style>
