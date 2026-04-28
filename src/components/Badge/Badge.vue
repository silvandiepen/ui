<template>
  <span
    :class="blockClasses"
    :data-variant="variant"
    :data-size="size"
    :style="blockStyles"
    :data-test-id="testId"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
import { useBemm } from 'bemm'
import type { BadgeProps } from './Badge.model'
import { computed } from 'vue';

const props = withDefaults(defineProps<BadgeProps>(), {
  variant: 'default',
  size: 'medium',
  color: null
})

const bemm = useBemm('badge')
const blockClasses=computed(()=>{
  return [
    bemm(),
    props.variant && bemm('',props.variant),
    props.size && bemm('',props.size),
    props.color && bemm('','has-color')
  ].filter(Boolean);
})
const blockStyles = computed(()=>{
  if(props.color){
    return {
        '--badge-color': `var(--color-${props.color})`,
        '--badge-text-color':  `var(--color-${props.color})-text`
     }
  }
  return {}
})
</script>

<style lang="scss">
.badge {

  --badge-background-color: color-mix(in srgb, var(--badge-color, var(--color-primary)), transparent 75%);
  --badge-text-color: var(--color-foreground);


  background: var(--badge-background-color);
  color: var(--badge-text-color);
  display: inline-flex;
  align-items: center;
  padding: var(--badge-padding, var(--space-xs) var(--space-s));
  border-radius: var(--badge-radius, var(--border-radius-l));
  font-size: var(--badge-font-size, var(--font-size-m, 0.875rem));
  font-weight: 600;
  line-height: 1.2;
  white-space: nowrap;

  &:empty{
    height: 1.5em; width: 1.5em;
    padding: 0;
  }



  &[data-variant="outline"] {
    background: transparent;
    border: 1px solid currentColor;
  }

  &[data-size="small"] {
    --badge-padding: var(--space-xs) var(--space-s);
    --badge-font-size: var(--font-size-xs, 0.75rem);
  }

  &[data-size="large"] {
    --badge-padding: var(--space-xs) var(--space-m);
    --badge-font-size: var(--font-size-base, 1rem);
  }
}
</style>
