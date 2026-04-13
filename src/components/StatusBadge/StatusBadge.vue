<template>
  <span :class="bemm()" :style="badgeStyle">
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import { useBemm } from "bemm";
import { computed } from "vue";

import type { StatusBadgeProps } from "./StatusBadge.model";

const props = withDefaults(defineProps<StatusBadgeProps>(), {
  tone: "default"
});

const bemm = useBemm("status-badge", {
  includeBaseClass: true
});

const badgeStyle = computed(() => {
  if(props.tone ==  'default'){
    return {
      "--status-badge-color": `var(--color-foreground)`,
      "--status-badge-border-color": `color-mix(in srgb, var(--color-foreground), transparent 75%)`,
      "--status-badge-text": `var(--color-foreground)`,
      "--status-badge-background-opacity": "100%",
    };
  }

  return {
    "--status-badge-color": `var(--color-${props.tone})`,
    "--status-badge-border-color":`var(--color-${props.tone})`,
    "--status-badge-text": `var(--color-${props.tone}-contrast)`,
    "--status-badge-background-opacity": "50%",
  };
});
</script>

<style lang="scss">
.status-badge {
  display: inline-flex;
  align-items: center;
  flex-grow: 0;
  height: fit-content;
  padding: var(--space-xs) var(--space-s);
  border-radius: var(--status-badge-border-radius, var(--border-radius-l));
  font-size: var(--font-size-s);
  font-weight: var(--font-weight-medium);
  border: var(--status-badge-border, var(--status-badge-border-color, transparent) solid 1px);
  letter-spacing: 0.04em;
  background: color-mix(in srgb, var(--status-badge-color), transparent var(--status-badge-background-opacity));
  color: var(--status-badge-text);
  width: var(--status-badge-width, fit-content);
}
</style>
