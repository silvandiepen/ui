<template>
  <button
    :class="bemm()"
    :aria-label="ariaLabel"
    type="button"
    @click="$emit('toggle')"
  >
    <Icon :name="iconName" />
  </button>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useBemm } from 'bemm'
import { Icons } from 'open-icon'

import { Icon } from '../Icon'

import type { ThemeToggleProps } from './ThemeToggle.model'

defineOptions({
  name: 'ThemeToggle',
})

const props = withDefaults(defineProps<ThemeToggleProps>(), {
  theme: 'light',
})

defineEmits<{
  toggle: []
}>()

const { bemm } = useBemm('theme-toggle')

const ariaLabel = computed(() => {
  if (props.theme === 'system') {
    return 'Switch color theme'
  }

  return props.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
})

const iconName = computed(() => {
  if (props.theme === 'system') {
    return Icons.DESKTOP
  }

  return props.theme === 'dark' ? Icons.SUN : Icons.MOON01
})
</script>

<style lang="scss">
@use '../../styles/mixins' as m;

.theme-toggle {
  @include m.component-props((
    'size': '2.5rem',
  ), 'theme-toggle');

  --icon-fill: color-mix(in srgb, currentColor, transparent 25%);
  --icon-fill-opacity: 1;
  --icon-stroke-color: currentColor;
  --icon-stroke-color-secondary: currentColor;

  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--int-theme-toggle-size);
  height: var(--int-theme-toggle-size);
  border: 1px solid var(--border-color, var(--color-accent));
  border-radius: var(--border-radius);
  background: color-mix(in srgb, var(--color-foreground), transparent 97%);
  color: var(--color-foreground);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: color-mix(in srgb, var(--color-primary), transparent 88%);
    border-color: color-mix(in srgb, var(--color-primary), transparent 35%);
    color: var(--color-foreground);
  }

  &:focus {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
}
</style>
