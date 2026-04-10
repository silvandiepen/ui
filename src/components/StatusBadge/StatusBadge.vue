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
  tone: "neutral"
});

const bemm = useBemm("status-badge", {
  includeBaseClass: true
});

const badgeStyle = computed(() => {
  const toneToken = (() => {
    switch (props.tone) {
      case "success":
        return "success";
      case "warning":
        return "warning";
      case "danger":
        return "danger";
      case "accent":
        return "primary";
      default:
        return "foreground";
    }
  })();

  return {
    "--status-badge-color": `var(--color-${toneToken})`,
    "--status-badge-text": `var(--color-${toneToken}-contrast)`,
    "--status-badge-background-opacity": props.tone === "neutral" ? "10%" : "15%"
  };
});
</script>

<style lang="scss">
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: var(--space-xs) var(--space-s);
  border-radius: var(--border-radius);
  font-size: var(--font-size-s);
  font-weight: var(--font-weight-medium);
  letter-spacing: 0.04em;
  background: color-mix(in srgb, var(--status-badge-color), transparent var(--status-badge-background-opacity));
  color: var(--status-badge-text);
}
</style>
