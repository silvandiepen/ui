<template>
  <InputBase
    v-model="model"
    :class="[bemm(), size ? bemm('', String(size)) : '']"
    :block="block"
    :label="label"
    :disabled="disabled"
    :error="error"
    @touched="$emit('touched', $event)"
  >
    <template #control="{ disabled: controlDisabled }">
      <div
        :class="bemm('track')"
        :style="trackStyle"
        role="radiogroup"
      >
        <button
          v-for="item in normalizedItems"
          :key="String(item.value)"
          type="button"
          :class="bemm('item', {
            active: model === item.value,
            disabled: controlDisabled || item.disabled,
          })"
          :disabled="controlDisabled || item.disabled"
          @click="handleSelect(item.value)"
        >
          <Icon
            v-if="item.icon"
            :name="item.icon"
            :class="bemm('item-icon')"
          />
          <span v-if="item.label" :class="bemm('item-label')">{{ item.label }}</span>
        </button>
      </div>
    </template>
  </InputBase>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useBemm } from 'bemm'
import Icon from '../../Icon/Icon.vue'
import InputBase from '../Form/InputBase.vue'
import type { InputSwitchProps, SwitchItem, SwitchValue } from './InputSwitch.model'

const model = defineModel<SwitchValue>({ default: undefined })

const props = withDefaults(defineProps<InputSwitchProps>(), {
  label: '',
  items: () => [],
  size: 'medium',
  color: 'primary',
  disabled: false,
  error: () => [],
  required: false,
})

defineEmits<{
  'update:modelValue': [value: SwitchValue]
  change: [value: SwitchValue]
  touched: [value: boolean]
}>()

const block = 'input-switch'
const bemm = useBemm(block, { includeBaseClass: true })

const normalizedItems = computed<SwitchItem[]>(() =>
  props.items.map((item) => {
    if (typeof item === 'string') {
      return { label: item, value: item, icon: null, disabled: false }
    }
    return { ...item, disabled: item.disabled ?? false }
  }),
)

const trackStyle = computed(() => ({
  '--input-switch-color': `var(--color-${props.color})`,
}))

function handleSelect(value: SwitchValue) {
  if (props.disabled) return
  model.value = value
}
</script>

<style lang="scss">
@use '../../../styles/mixins' as m;

.input-switch {
  --input-switch-color: var(--color-primary);

  &--small {
    --input-switch-item-padding: m.p('item-padding', calc(var(--space-xs) * 1.2) calc(var(--space-s) * 1.2));
  }

  &--large {
    --input-switch-item-padding: m.p('item-padding', calc(var(--space-s) * 1.2) calc(var(--space) * 1.1));
  }

  &__track {
    display: inline-flex;
    gap: m.p('track-gap', 2px);
    padding: m.p('track-padding', 3px);
    border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 86%);
    border-radius: var(--border-radius);
    background: color-mix(in srgb, var(--color-background), var(--color-foreground) 3%);
  }

  &__item {
    display: inline-flex;
    align-items: center;
    gap: m.p('item-gap', calc(var(--space-xs) * 1.5));
    padding: var(--input-switch-item-padding, m.p('item-padding', calc(var(--space-xs) * 1.75) calc(var(--space) * 0.85)));
    border: none;
    border-radius: var(--input-switch-item-radius, m.p('item-radius', calc(var(--border-radius) * 0.7)));
    background: transparent;
    color: color-mix(in srgb, var(--color-foreground), transparent 30%);
    font-size: m.p('item-font-size', var(--font-size-s));
    font-weight: m.p('item-font-weight', 600);
    cursor: pointer;
    transition:
      background-color 160ms ease,
      color 160ms ease,
      transform 160ms ease;
    white-space: nowrap;

    &:hover:not(&--disabled) {
      background: color-mix(in srgb, var(--color-foreground), transparent 95%);
      color: color-mix(in srgb, var(--color-foreground), transparent 10%);
    }

    &:focus-visible {
      outline: 2px solid var(--input-switch-color);
      outline-offset: -2px;
    }

    &--active {
      background: color-mix(in srgb, var(--input-switch-color), transparent 88%);
      color: var(--input-switch-color);
    }

    &--disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  &__item-icon {
    width: m.p('icon-size', var(--space));
    height: m.p('icon-size', var(--space));
  }
}
</style>
