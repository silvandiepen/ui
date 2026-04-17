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
@use '../../styles/mixins' as m;

.kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: m.p('min-size', calc(var(--space) * 1.75));
  min-height: m.p('min-size', calc(var(--space) * 1.75));
  padding: m.p('padding', var(--space-xs) calc(var(--space-xs) * 1.75));
  border: 1px solid m.p('border-color', color-mix(in srgb, var(--color-foreground), transparent 84%));
  border-bottom-width: 2px;
  border-radius: m.p('border-radius', calc(var(--border-radius, 1rem) * 0.55));
  background: m.p('background', linear-gradient(180deg, color-mix(in srgb, var(--color-background), white 28%) 0%, color-mix(in srgb, var(--color-background), var(--color-foreground) 4%) 100%));
  box-shadow: m.p('box-shadow', inset 0 1px 0 color-mix(in srgb, white, transparent 30%));
  color: m.p('color', color-mix(in srgb, var(--color-foreground), transparent 12%));
  font-family: m.p('font-family', var(--font-family-mono, ui-monospace, SFMono-Regular, Menlo, monospace));
  font-size: m.p('font-size', var(--font-size-s));
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
}

.kbd--small {
  min-width: m.p('min-size', calc(var(--space) * 1.45));
  min-height: m.p('min-size', calc(var(--space) * 1.45));
  padding: m.p('padding', calc(var(--space-xs) * 0.5) calc(var(--space-xs) * 1.2));
  font-size: m.p('font-size', var(--font-size-xs));
}

.kbd--subtle {
  background: color-mix(in srgb, var(--color-foreground), transparent 97%);
  color: color-mix(in srgb, var(--color-foreground), transparent 28%);
  box-shadow: none;
}
</style>
