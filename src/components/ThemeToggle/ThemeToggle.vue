<template>
  <button
    :class="bemm()"
    :aria-label="ariaLabel"
    type="button"
    :data-test-id="testId"
    @click="$emit('toggle')"
  >
    <Icon
      :name="iconName"
      :data-test-id="getTestId(props.testId, 'icon')"
    />
  </button>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useBemm } from 'bemm'
import { Icons } from 'open-icon'

import { Icon } from '../Icon'

import type { ThemeToggleProps } from './ThemeToggle.model'
import { getTestId } from '../../utils/testId'

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
    return Icons.MEDIA_DESKTOP
  }

  return props.theme === 'dark' ? Icons.WEATHER_SUN : Icons.WEATHER_MOON
})
</script>

<style lang="scss">
@use '../../styles/mixins' as m;

.theme-toggle {
  --icon-fill: color-mix(in srgb, currentColor, transparent 25%);
  --icon-fill-opacity: 1;
  --icon-stroke-color: currentColor;
  --icon-stroke-color-secondary: currentColor;

  display: flex;
  align-items: center;
  justify-content: center;
  width: m.p('size', calc(var(--space) * 2.5));
  height: m.p('size', calc(var(--space) * 2.5));
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
