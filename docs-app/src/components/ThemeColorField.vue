<template>
  <div :class="bemm()">
    <span :class="bemm('label')">{{ label }}</span>
    <div :class="bemm('control')" @click="openPicker">
      <div
        :class="bemm('swatch', ['', resolvedHex ? 'has-color' : 'no-color'])"
        :style="resolvedHex ? { backgroundColor: resolvedHex } : {}"
      >
        <span v-if="!resolvedHex" :class="bemm('placeholder')">—</span>
      </div>
      <span v-if="modelValue" :class="bemm('value')">{{ modelValue }}</span>
      <Icon :name="Icons.CHEVRON_DOWN" size="small" :class="bemm('icon')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { useBemm } from 'bemm'
import { Icons } from 'open-icon'
import { Icon } from '@ui-lib/components/Icon'
import { h } from 'vue'
import type { PaletteColor } from '@ui-docs/lib/docsTheme'

const modelValue = defineModel<string>({ required: true })

const props = defineProps<{
  label: string
  palette?: PaletteColor[]
}>()

const bemm = useBemm('theme-color-field', { includeBaseClass: true })
const popupService = inject<any>('popupService')

const paletteByName = computed(() => {
  const map = new Map<string, PaletteColor>()
  for (const c of (props.palette ?? [])) {
    map.set(c.name, c)
  }
  return map
})

const resolvedHex = computed(() => {
  const entry = paletteByName.value.get(modelValue.value)
  return entry?.hex ?? (modelValue.value?.startsWith('#') ? modelValue.value : '')
})

function openPicker() {
  const colors = props.palette ?? []

  const swatches = colors.map((c) =>
    h('button', {
      key: c.name,
      style: {
        width: '2rem',
        height: '2rem',
        borderRadius: '0.375rem',
        border: modelValue.value === c.name
          ? '2px solid var(--color-foreground)'
          : '2px solid transparent',
        backgroundColor: c.hex,
        cursor: 'pointer',
        transition: 'transform 0.1s ease, border-color 0.1s ease',
        position: 'relative' as const,
      },
      title: `${c.name} (${c.hex})`,
      onClick: () => {
        modelValue.value = c.name
        popupService.close(`theme-color-${props.label}`)
      },
      onMouseenter: (e: MouseEvent) => {
        ;(e.target as HTMLElement).style.transform = 'scale(1.15)'
      },
      onMouseleave: (e: MouseEvent) => {
        ;(e.target as HTMLElement).style.transform = 'scale(1)'
      },
    })
  )

  popupService.open({
    id: `theme-color-${props.label}`,
    title: props.label,
    component: () => h('div', {
      style: {
        padding: '0.75rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(2rem, 1fr))',
        gap: '0.4rem',
        minWidth: '200px',
      },
    }, swatches),
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
    font-size: var(--font-size-s);
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
    border-radius: var(--border-radius);
    cursor: pointer;
    transition: border-color 0.15s ease;

    &:hover {
      border-color: var(--color-foreground);
    }
  }

  &__swatch {
    width: 1.75rem;
    height: 1.75rem;
    min-width: 1.75rem;
    border-radius: var(--border-radius-s);
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

  &__value {
    font-family: var(--font-family-mono, monospace);
    font-size: 0.75rem;
    color: color-mix(in srgb, var(--color-foreground), transparent 40%);
  }

  &__placeholder {
    color: color-mix(in srgb, var(--color-foreground), transparent 50%);
    font-size: 0.75rem;
  }

  &__icon {
    color: color-mix(in srgb, var(--color-foreground), transparent 40%);
    margin-left: auto;
  }
}
</style>
