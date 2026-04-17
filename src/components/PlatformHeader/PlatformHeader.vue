<template>
  <header
    ref="headerElement"
    :class="[
      bemm(),
      compact ? bemm('', 'compact') : '',
      mobileOpen ? bemm('', 'mobile-open') : '',
      variant ? bemm('', variant) : '',
    ]"
  >
    <div :class="bemm('inner')" :style="{ '--platform-header-max-width': maxWidth }">
      <div v-if="$slots.brand" :class="bemm('brand')">
        <slot name="brand" />
      </div>

      <div v-if="$slots.nav" :class="bemm('nav')">
        <slot name="nav" />
      </div>

      <div v-if="$slots.actions" :class="bemm('actions')">
        <slot name="actions" />
      </div>
    </div>

    <div v-if="$slots.secondary" :class="bemm('secondary')" :style="{ '--platform-header-max-width': maxWidth }">
      <slot name="secondary" />
    </div>
  </header>
</template>

<script lang="ts" setup>
import { useBemm } from "bemm";
import { ref } from "vue";

import { PlatformHeaderVariant, type PlatformHeaderProps } from "./PlatformHeader.model";

defineOptions({
  name: "PlatformHeader"
});

withDefaults(defineProps<PlatformHeaderProps>(), {
  compact: false,
  mobileOpen: false,
  maxWidth: "88rem",
  variant: PlatformHeaderVariant.DEFAULT,
});

const headerElement = ref<HTMLElement | null>(null);
const bemm = useBemm("platform-header", {
  includeBaseClass: true
});

defineExpose({
  element: headerElement
});
</script>

<style lang="scss">
@use '../../styles/mixins' as m;

.platform-header {
  position: sticky;
  top: 0;
  z-index: m.p('z-index', 120);
  padding: m.p('padding', var(--space) var(--spacing));
  border-bottom: 1px solid m.p('border-color', color-mix(in srgb, var(--color-foreground), transparent 90%));
  background: m.p('background', color-mix(in srgb, var(--color-background), transparent 50%));
  backdrop-filter: m.p('blur', blur(18px) saturate(135%));

  &--compact {
    padding: m.p('padding-compact', var(--space-s) var(--spacing));
  }

  &__inner,
  &__secondary {
    width: 100%;
    max-width: var(--platform-header-max-width, 88rem);
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
  &__actions {
    display: flex;
    align-items: center;
    gap: var(--space);
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

  &__actions {
    justify-content: flex-end;
    flex: m.p('actions-flex', 0 0 auto);
    min-width: 0;
  }

  &__secondary {
    margin-top: calc(var(--space) * 0.7);
  }

  @media (max-width: 700px) {
    padding: m.p('padding-compact', var(--space-s) var(--spacing));

    &__inner {
      display: grid;
      grid-template-columns: m.p('mobile-columns', minmax(0, 1fr) auto);
      align-items: center;
      gap: var(--space-s);
    }

    &__nav {
      grid-column: 1 / -1;
      justify-content: flex-start;
    }

    &__actions {
      justify-content: flex-end;
    }
  }

  &--float {
    padding: var(--space-s) var(--space);
    border-bottom: none;
    background: transparent;
    backdrop-filter: none;

    .platform-header__inner {
      background: color-mix(in srgb, var(--color-background), transparent 50%);
      backdrop-filter: blur(18px) saturate(135%);
      -webkit-backdrop-filter: blur(18px) saturate(135%);
      border-radius: var(--border-radius-xl);
      padding: var(--space-s) var(--space);
      border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 90%);
      box-shadow: 0 0.5rem 2rem color-mix(in srgb, var(--color-foreground), transparent 88%);
    }
  }
}
</style>
