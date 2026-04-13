<template>
  <InputBase
    v-model="modelValue"
    :block="block"
    :label="label"
    :disabled="disabled"
    :inline="inline"
    :size="size"
    :description="description"
    @change="$emit('change', $event)"
    @touched="$emit('touched', $event)"
  >
    <template #control>
      <div v-if="colors.length || savedCustomColors.length" :class="bemm('grid')">
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
          @click="selectColor(color)"
        >
          <Icon v-if="modelValue === color" :class="bemm('icon')" :name="Icons.CHECK_FAT" size="small" />
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
          @click="selectColor(hex)"
        >
          <span :class="bemm('color-delete')" @click.stop="removeCustomColor(hex)">
            <Icon :name="Icons.CLOSE" size="small" />
          </span>
          <Icon v-if="modelValue === hex" :class="bemm('icon')" :name="Icons.CHECK_FAT" size="small" />
        </button>
      </div>

      <div v-if="allowCustom" :class="bemm('custom')">
        <input
          type="color"
          :value="customHex"
          :disabled="disabled"
          :class="bemm('custom-swatch')"
          @input="onNativeInput"
        />
        <input
          type="text"
          :value="customHex"
          :disabled="disabled"
          :class="bemm('custom-hex')"
          placeholder="#000000"
          @input="onHexInput"
          @blur="onHexBlur"
          @keydown.enter="onHexBlur"
        />
        <button
          type="button"
          :class="bemm('custom-add')"
          :disabled="disabled || !isValidHex(customHex)"
          @click="addCustomColor"
        >
          <Icon :name="Icons.PLUS" size="small" />
        </button>
      </div>
    </template>
  </InputBase>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useBemm } from 'bemm';
import InputBase from '../Form/InputBase.vue';
import Icon from '../../Icon/Icon.vue';
import { AllColors, BaseColors, Size } from '../../../types';
import { Icons } from 'open-icon';
import { useSettingsStore } from '@/stores/settings';
import type { ColorPickerProps } from './ColorPicker.model';

const modelValue = defineModel<string>()

const props = withDefaults(defineProps<ColorPickerProps>(), {
  block: 'color-picker',
  colors: () => Object.values(AllColors) as string[],
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

const isPresetColor = (val: string) =>
  colors.value.includes(val) || savedCustomColors.value.includes(val);

const isValidHex = (val: string) => /^#[0-9A-Fa-f]{6}$/.test(val);

// customHex tracks the custom input field value
const customHex = ref(
  modelValue.value && !isPresetColor(modelValue.value) ? modelValue.value : '#000000'
);

watch(modelValue, (val) => {
  if (val && !isPresetColor(val) && isValidHex(val)) {
    customHex.value = val;
  }
});

const selectColor = (color: string) => {
  if (props.disabled) return;
  modelValue.value = color;
  emit('change', color);
};

const applyCustom = (hex: string) => {
  if (props.disabled || !isValidHex(hex)) return;
  customHex.value = hex;
  modelValue.value = hex;
  emit('change', hex);
};

const addCustomColor = () => {
  if (!isValidHex(customHex.value)) return;
  settings.addCustomColor(CUSTOM_COLORS_KEY, customHex.value);
  selectColor(customHex.value);
};

const removeCustomColor = (hex: string) => {
  settings.removeCustomColor(CUSTOM_COLORS_KEY, hex);
  if (modelValue.value === hex) {
    modelValue.value = undefined;
  }
};

const onNativeInput = (e: Event) => {
  applyCustom((e.target as HTMLInputElement).value);
};

const onHexInput = (e: Event) => {
  customHex.value = (e.target as HTMLInputElement).value;
};

const onHexBlur = (e: Event) => {
  applyCustom((e.target as HTMLInputElement).value);
};
</script>

<style lang="scss">
@use '../Form/Form.scss' as form;

.color-picker {
  --color-size: calc(2em * var(--sizing, 1));

  @include form.inputBase();
  @include form.inputColorPicker();

  &--x-small { --color-scale: 0.66; }
  &--small   { --color-scale: 0.75; }
  &--medium  { --color-scale: 1; }
  &--large   { --color-scale: 1.2; }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, var(--color-size));
    gap: var(--space-xs);
    max-width: 100%;
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
    display: grid;
    grid-template-columns: var(--color-size) minmax(0, 1fr) var(--color-size);
    gap: var(--space-xs);
    align-items: center;
    margin-top: var(--space-xs);
  }

  &__custom-swatch {
    width: var(--color-size);
    height: var(--color-size);
    padding: 2px;
    border: 2px solid color-mix(in srgb, var(--color-foreground), transparent 80%);
    border-radius: var(--border-radius);
    cursor: pointer;
    background: none;
    box-sizing: border-box;

    &:hover { border-color: var(--color-foreground); }
  }

  &__custom-hex {
    width: 100%;
    height: var(--color-size);
    padding: 0 var(--space-xs);
    border: 2px solid color-mix(in srgb, var(--color-foreground), transparent 80%);
    border-radius: var(--border-radius);
    background: var(--color-background);
    color: var(--color-foreground);
    font: inherit;
    font-size: var(--font-size-s);
    font-family: var(--font-family-mono, monospace);
    box-sizing: border-box;

    &:focus {
      outline: none;
      border-color: var(--color-primary);
    }
  }

  &__custom-add {
    width: var(--color-size);
    height: var(--color-size);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid color-mix(in srgb, var(--color-foreground), transparent 80%);
    border-radius: var(--border-radius);
    background: transparent;
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
