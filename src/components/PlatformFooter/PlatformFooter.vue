<template>
  <footer
    ref="footerElement"
    :class="[
      bemm(),
      compact ? bemm('', 'compact') : ''
    ]"
  >
    <div :class="bemm('inner')" :style="{ '--platform-footer-max-width': maxWidth }">
      <div v-if="$slots.brand" :class="bemm('brand')">
        <slot name="brand" />
      </div>

      <div v-if="$slots.nav" :class="bemm('nav')">
        <slot name="nav" />
      </div>

      <div v-if="$slots.meta" :class="bemm('meta')">
        <slot name="meta" />
      </div>
    </div>

    <div
      v-if="$slots.secondary || $slots.default"
      :class="bemm('secondary')"
      :style="{ '--platform-footer-max-width': maxWidth }"
    >
      <slot name="secondary">
        <slot />
      </slot>
    </div>
  </footer>
</template>

<script lang="ts" setup>
import { useBemm } from "bemm";
import { ref } from "vue";

import type { PlatformFooterProps } from "./PlatformFooter.model";

defineOptions({
  name: "PlatformFooter"
});

withDefaults(defineProps<PlatformFooterProps>(), {
  compact: false,
  maxWidth: "88rem"
});

const footerElement = ref<HTMLElement | null>(null);
const bemm = useBemm("platform-footer", {
  includeBaseClass: true
});

defineExpose({
  element: footerElement
});
</script>

<style lang="scss">
.platform-footer {
  padding: calc(var(--space) * 1.1) var(--spacing);
  border-top: 1px solid color-mix(in srgb, var(--color-foreground), transparent 90%);
  background:
    linear-gradient(
      180deg,
      color-mix(in srgb, var(--color-background), transparent 0%),
      color-mix(in srgb, var(--color-background), var(--color-primary) 4%)
    );

  &--compact {
    padding: var(--space-s) var(--spacing);
  }

  &__inner,
  &__secondary {
    width: 100%;
    max-width: var(--platform-footer-max-width, 88rem);
    margin: 0 auto;
  }

  &__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space);
    min-width: 0;
  }

  &__brand,
  &__meta {
    display: flex;
    align-items: center;
    gap: var(--space-s);
    flex-wrap: wrap;
  }

  &__brand {
    min-width: 0;
  }

  &__nav {
    flex: 1 1 auto;
    display: flex;
    justify-content: center;
    min-width: 0;
  }

  &__meta {
    justify-content: flex-end;
    text-align: right;
  }

  &__secondary {
    display: grid;
    gap: calc(var(--space) * 0.45);
    margin-top: calc(var(--space) * 0.8);
    color: color-mix(in srgb, var(--color-foreground), transparent 32%);
    font-size: var(--font-size-s);
    line-height: 1.55;
  }

  @media (max-width: 700px) {
    padding: var(--space) var(--spacing);

    &__inner {
      display: grid;
      grid-template-columns: 1fr;
      justify-items: start;
      gap: var(--space-s);
    }

    &__nav,
    &__meta {
      justify-content: flex-start;
      text-align: left;
    }
  }
}
</style>
