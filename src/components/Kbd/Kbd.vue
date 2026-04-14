<template>
  <kbd :class="blockClasses">
    <slot />
  </kbd>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useBemm } from 'bemm'

import type { KbdProps } from './Kbd.model'

defineOptions({
  name: 'Kbd',
})

const props = withDefaults(defineProps<KbdProps>(), {
  size: 'medium',
  variant: 'default',
})

const bemm = useBemm('kbd')

const blockClasses = computed(() => [
  bemm(),
  bemm('', props.size),
  props.variant !== 'default' ? bemm('', props.variant) : '',
])
</script>

<style lang="scss">
.kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.75rem;
  min-height: 1.75rem;
  padding: 0.2rem 0.45rem;
  border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 84%);
  border-bottom-width: 2px;
  border-radius: calc(var(--border-radius, 1rem) * 0.55);
  background:
    linear-gradient(
      180deg,
      color-mix(in srgb, var(--color-background), white 28%) 0%,
      color-mix(in srgb, var(--color-background), var(--color-foreground) 4%) 100%
    );
  box-shadow: inset 0 1px 0 color-mix(in srgb, white, transparent 30%);
  color: color-mix(in srgb, var(--color-foreground), transparent 12%);
  font-family: var(--font-family-mono, ui-monospace, SFMono-Regular, Menlo, monospace);
  font-size: 0.78rem;
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
}

.kbd--small {
  min-width: 1.45rem;
  min-height: 1.45rem;
  padding: 0.12rem 0.32rem;
  font-size: 0.68rem;
}

.kbd--subtle {
  background: color-mix(in srgb, var(--color-foreground), transparent 97%);
  color: color-mix(in srgb, var(--color-foreground), transparent 28%);
  box-shadow: none;
}
</style>
