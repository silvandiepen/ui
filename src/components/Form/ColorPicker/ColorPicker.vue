<template>
  <InputBase
    v-model="modelValue"
    :block="block"
    :label="label"
    :disabled="disabled"
    :inline="inline"
    :size="size"
    :description="description"
    :test-id="testId"
    @change="$emit('change', $event)"
    @touched="$emit('touched', $event)"
  >
    <template #control="{ testIdPart }">
      <div
        v-if="colors.length || savedCustomColors.length"
        :class="bemm('grid')"
        :style="gridStyle"
        :data-test-id="testIdPart('grid')"
      >
        <!-- Preset colors -->
        <button
          v-for="color in colors"
          :key="color"
          :class="bemm('color', ['', modelValue === color ? 'selected' : ''])"
          :style="{ backgroundColor: `var(--color-${color})`, color: `var(--color-${color}-text)` }"
          :aria-label="`Select ${color} color`"
          :aria-pressed="modelValue === color"
          type="button"
          :disabled="disabled"
          :data-test-id="testIdPart(`color-${color}`)"
          @click="selectColor(color)"
        >
          <Icon v-if="modelValue === color" :class="bemm('icon')" :name="Icons.UI_CHECK_FAT" size="small" :data-test-id="testIdPart(`color-${color}-icon`)" />
        </button>

        <!-- Saved custom colors -->
        <button
          v-if="allowCustom"
          v-for="hex in savedCustomColors"
          :key="hex"
          :class="bemm('color', ['custom', modelValue === hex ? 'selected' : ''])"
          :style="{ backgroundColor: hex }"
          :aria-label="`Select custom color ${hex}`"
          :aria-pressed="modelValue === hex"
          type="button"
          :disabled="disabled"
          :data-test-id="testIdPart(`custom-color-${hex}`)"
          @click="selectColor(hex)"
        >
          <span :class="bemm('color-delete')" :data-test-id="testIdPart(`custom-color-${hex}-delete`)" @click.stop="removeCustomColor(hex)">
            <Icon :name="Icons.UI_MULTIPLY_M" size="small" :data-test-id="testIdPart(`custom-color-${hex}-delete-icon`)" />
          </span>
          <Icon v-if="modelValue === hex" :class="bemm('icon')" :name="Icons.UI_CHECK_FAT" size="small" :data-test-id="testIdPart(`custom-color-${hex}-icon`)" />
        </button>
      </div>

      <div v-if="allowCustom" :class="bemm('custom')" :data-test-id="testIdPart('custom')">
        <Popover v-model="isCustomPopoverOpen" placement="bottom" :disabled="disabled">
          <template #trigger>
            <button
              type="button"
              :class="bemm('custom-trigger')"
              :disabled="disabled"
              :data-test-id="testIdPart('custom-trigger')"
              aria-label="Choose a custom color"
            >
              <span
                :class="bemm('custom-trigger-swatch')"
                :style="{ backgroundColor: customDraftHex }"
                :data-test-id="testIdPart('custom-trigger-swatch')"
              />
              <span :class="bemm('custom-trigger-value')" :data-test-id="testIdPart('custom-trigger-value')">{{ customDraftHex }}</span>
              <Icon :name="Icons.UI_ADD_M" size="small" :data-test-id="testIdPart('custom-trigger-icon')" />
            </button>
          </template>

          <template #default="{ close }">
            <div :class="bemm('custom-popover')" :data-test-id="testIdPart('custom-popover')">
              <ColorChooser
                v-model="customDraftHex"
                :recent-colors="savedCustomColors"
                :show-hsl-sliders="false"
                output-format="hex"
                :test-id="testIdPart('custom-chooser')"
              />
              <button
                type="button"
                :class="bemm('custom-apply')"
                :disabled="disabled || !isValidHex(customDraftHex)"
                :data-test-id="testIdPart('custom-apply')"
                @click="addCustomColor(close)"
              >
                Add custom color
              </button>
            </div>
          </template>
        </Popover>
      </div>
    </template>
  </InputBase>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useBemm } from 'bemm';
import InputBase from '../Form/InputBase.vue';
import Icon from '../../Icon/Icon.vue';
import { Popover } from '../../Popover';
import { AllColors, BaseColors, Size } from '../../../types';
import { Icons } from 'open-icon';
import { useSettingsStore } from '@/stores/settings';
import type { ColorPickerProps } from './ColorPicker.model';
import { ColorChooser } from '../ColorChooser';

const modelValue = defineModel<string>()

const props = withDefaults(defineProps<ColorPickerProps>(), {
  block: 'color-picker',
  colors: () => Object.values(AllColors) as string[],
  columns: 'auto',
  allowCustom: false,
  size: Size.MEDIUM,
  label: '',
  inline: false,
  disabled: false,
  description: ''
});

const emit = defineEmits<{
  change: [value: string]
  touched: [value: boolean]
}>()

const bemm = useBemm(props.block);
const settings = useSettingsStore();

const CUSTOM_COLORS_KEY = 'color-picker-custom'

const colors = computed(() => props.colors || Object.values(BaseColors));

const savedCustomColors = computed(() => settings.getCustomColors(CUSTOM_COLORS_KEY));
const totalSwatches = computed(() =>
  colors.value.length + (props.allowCustom ? savedCustomColors.value.length : 0)
);

const resolvedColumns = computed(() => {
  if (typeof props.columns === 'number') {
    return Math.max(1, Math.floor(props.columns));
  }

  if (totalSwatches.value <= 0) return 1;
  if (totalSwatches.value <= 2) return totalSwatches.value;

  // Auto mode keeps the palette compact by approximating a square grid.
  return Math.max(2, Math.ceil(Math.sqrt(totalSwatches.value)));
});

const gridStyle = computed(() => ({
  '--color-picker-columns': String(resolvedColumns.value),
}));

const isPresetColor = (val: string) =>
  colors.value.includes(val) || savedCustomColors.value.includes(val);

const isValidHex = (val: string) => /^#[0-9A-Fa-f]{6}$/.test(val);

const customDraftHex = ref(
  modelValue.value && !isPresetColor(modelValue.value) ? modelValue.value : '#000000'
);
const isCustomPopoverOpen = ref(false);

watch(modelValue, (val) => {
  if (val && !isPresetColor(val) && isValidHex(val)) {
    customDraftHex.value = val;
  }
});

watch(isCustomPopoverOpen, (isOpen) => {
  if (!isOpen) return;
  if (modelValue.value && !isPresetColor(modelValue.value) && isValidHex(modelValue.value)) {
    customDraftHex.value = modelValue.value;
  }
});

const selectColor = (color: string) => {
  if (props.disabled) return;
  modelValue.value = color;
  emit('change', color);
};

const addCustomColor = (close?: () => void) => {
  if (!isValidHex(customDraftHex.value)) return;
  settings.addCustomColor(CUSTOM_COLORS_KEY, customDraftHex.value);
  selectColor(customDraftHex.value);
  close?.();
};

const removeCustomColor = (hex: string) => {
  settings.removeCustomColor(CUSTOM_COLORS_KEY, hex);
  if (modelValue.value === hex) {
    modelValue.value = undefined;
  }
};
</script>

<style lang="scss">
@use '../Form/Form.scss' as form;
@use '../../../styles/mixins' as m;

.color-picker {
  --color-size: #{calc(m.p('size', 2em) * var(--sizing, 1))};

  @include form.inputBase();
  @include form.inputColorPicker();

  &--x-small { --color-scale: 0.66; }
  &--small   { --color-scale: 0.75; }
  &--medium  { --color-scale: 1; }
  &--large   { --color-scale: 1.2; }

  &__grid {
    display: grid;
    grid-template-columns: repeat(var(--color-picker-columns, 6), var(--color-size));
    gap: var(--space-xs);
    max-width: 100%;
    width: fit-content;
  }

  &__control-container {
    &::before {
      display: m.p('control-frame-display', block);
    }
  }

  &__color {
    position: relative;
    width: var(--color-size);
    height: var(--color-size);
    border: 2px solid transparent;
    border-radius: var(--border-radius);
    cursor: pointer;
    transition: all 0.2s ease;
    background-color: var(--color-gray);
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-white);
    box-shadow: 0 2px 4px color-mix(in srgb, var(--color-foreground), transparent 90%);

    &:hover {
      transform: scale(1.1);
      border-color: var(--color-foreground);

      .color-picker__color-delete {
        opacity: 1;
      }
    }

    &--selected {
      border-color: var(--color-foreground);
      transform: scale(1.05);

      &:hover { transform: scale(1.1); }
    }
  }

  &__color-delete {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: color-mix(in srgb, #000, transparent 40%);
    opacity: 0;
    transition: opacity 0.15s ease;
    z-index: 1;
    color: #fff;
  }

  &__icon {
    font-size: 1em;
  }

  &__custom {
    margin-top: var(--space-xs);
  }

  &__custom-trigger {
    display: inline-flex;
    align-items: center;
    gap: var(--space-xs);
    min-height: var(--color-size);
    padding: 0 var(--space-xs);
    border: 2px solid color-mix(in srgb, var(--color-foreground), transparent 80%);
    border-radius: var(--border-radius);
    background: var(--color-background);
    color: var(--color-foreground);
    cursor: pointer;
    transition: border-color 0.15s ease, background 0.15s ease;

    &:hover:not(:disabled) {
      border-color: var(--color-primary);
      background: color-mix(in srgb, var(--color-primary), transparent 94%);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  &__custom-trigger-swatch {
    width: calc(var(--color-size) * 0.65);
    height: calc(var(--color-size) * 0.65);
    border-radius: 4px;
    border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 80%);
  }

  &__custom-trigger-value {
    font-size: var(--font-size-s);
    font-family: var(--font-family-mono, monospace);
  }

  &__custom-popover {
    display: grid;
    gap: var(--space-s);
    min-width: min(360px, 80vw);
    margin-top: var(--space-xs);
  }

  &__custom-apply {
    min-height: var(--color-size);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid color-mix(in srgb, var(--color-foreground), transparent 80%);
    border-radius: var(--border-radius);
    background: var(--color-background);
    color: var(--color-foreground);
    cursor: pointer;
    transition: border-color 0.15s ease, background 0.15s ease;

    &:hover:not(:disabled) {
      border-color: var(--color-primary);
      background: color-mix(in srgb, var(--color-primary), transparent 90%);
      color: var(--color-primary);
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }

  @media (max-width: 480px) {
    &__grid {
      grid-template-columns: repeat(auto-fill, 35px);
    }

    &__color {
      width: 35px;
      height: 35px;
    }
  }
}
</style>
