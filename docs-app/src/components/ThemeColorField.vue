<template>
  <div :class="bemm()">
    <span :class="bemm('label')">{{ label }}</span>
    <div :class="bemm('control')" @click="openPicker">
      <div
        :class="bemm('swatch', ['', modelValue ? 'has-color' : 'no-color'])"
        :style="modelValue ? { backgroundColor: modelValue } : {}"
      >
        <span v-if="!modelValue" :class="bemm('placeholder')">—</span>
      </div>
      <Icon :name="Icons.CHEVRON_DOWN" size="small" :class="bemm('icon')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { useBemm } from 'bemm'
import { Icons } from 'open-icon'
import { Icon } from '@ui-lib/components/Icon'
import { h } from 'vue'

const modelValue = defineModel<string>({ required: true })

const props = defineProps<{
  label: string
}>()

const bemm = useBemm('theme-color-field')
const popupService = inject<any>('popupService')

function openPicker() {
  const colorRef = { value: modelValue.value }

  popupService.open({
    id: `theme-color-${props.label}`,
    title: props.label,
    component: () => h('div', {
      style: {
        padding: '1rem',
        display: 'grid',
        gap: '0.75rem',
        minWidth: '240px',
      },
    }, [
      h('input', {
        type: 'color',
        value: modelValue.value,
        style: {
          width: '100%',
          height: '3rem',
          border: 'none',
          cursor: 'pointer',
          borderRadius: '0.375rem',
        },
        onInput: (e: Event) => {
          colorRef.value = (e.target as HTMLInputElement).value
          modelValue.value = colorRef.value
        },
      }),
      h('input', {
        type: 'text',
        value: modelValue.value,
        style: {
          width: '100%',
          padding: '0.5rem 0.65rem',
          border: '1px solid color-mix(in srgb, var(--color-foreground), transparent 84%)',
          borderRadius: '0.375rem',
          background: 'color-mix(in srgb, var(--color-background), var(--color-foreground) 2%)',
          color: 'var(--color-foreground)',
          fontFamily: 'var(--font-family-mono, monospace)',
          fontSize: '0.85rem',
          boxSizing: 'border-box',
        },
        onInput: (e: Event) => {
          const val = (e.target as HTMLInputElement).value.trim()
          if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
            colorRef.value = val
            modelValue.value = val
          }
        },
      }),
    ]),
    config: {
      width: '280px',
    },
  })
}
</script>

<style lang="scss">
.theme-color-field {
  display: grid;
  gap: 0.35rem;

  &__label {
    font-size: var(--font-size-s, 0.85rem);
    color: color-mix(in srgb, var(--color-foreground), transparent 30%);
    text-transform: capitalize;
  }

  &__control {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.35rem 0.5rem;
    background: var(--color-background);
    border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 78%);
    border-radius: var(--border-radius, 0.375rem);
    cursor: pointer;
    transition: border-color 0.15s ease;

    &:hover {
      border-color: var(--color-foreground);
    }
  }

  &__swatch {
    flex: 1;
    height: 1.75rem;
    min-width: 3rem;
    border-radius: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 90%);

    &--has-color {
      box-shadow: inset 0 1px 2px color-mix(in srgb, var(--color-foreground), transparent 90%);
    }

    &--no-color {
      background: color-mix(in srgb, var(--color-foreground), transparent 92%);
    }
  }

  &__placeholder {
    color: color-mix(in srgb, var(--color-foreground), transparent 50%);
    font-size: 0.75rem;
  }

  &__icon {
    color: color-mix(in srgb, var(--color-foreground), transparent 40%);
  }
}
</style>
