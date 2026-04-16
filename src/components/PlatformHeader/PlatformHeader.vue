<template>
  <header
    ref="headerElement"
    :class="[
      bemm(),
      compact ? bemm('', 'compact') : '',
      mobileOpen ? bemm('', 'mobile-open') : ''
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

import type { PlatformHeaderProps } from "./PlatformHeader.model";

defineOptions({
  name: "PlatformHeader"
});

withDefaults(defineProps<PlatformHeaderProps>(), {
  compact: false,
  mobileOpen: false,
  maxWidth: "88rem"
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
  @include m.component-props((
    'background':       'color-mix(in srgb, var(--color-accent), transparent 50%)',
    'border-color':     'color-mix(in srgb, var(--color-foreground), transparent 90%)',
    'blur':             'blur(18px) saturate(135%)',
    'z-index':          '120',
    'padding':          'var(--space) var(--spacing)',
    'padding-compact':  'var(--space-s) var(--spacing)',
    'actions-flex':     '0 0 auto',
    'mobile-columns':   'minmax(0, 1fr) auto',
  ), 'platform-header');

  position: sticky;
  top: 0;
  z-index: var(--int-platform-header-z-index);
  padding: var(--int-platform-header-padding);
  border-bottom: 1px solid var(--int-platform-header-border-color);
  background: var(--int-platform-header-background);
  backdrop-filter: var(--int-platform-header-blur);

  &--compact {
    padding: var(--int-platform-header-padding-compact);
  }

  &__inner,
  &__secondary {
    width: 100%;
    max-width: var(--int-platform-header-max-width, 88rem);
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
    flex: var(--int-platform-header-actions-flex);
    min-width: 0;
  }

  &__secondary {
    margin-top: calc(var(--space) * 0.7);
  }

  @media (max-width: 700px) {
    padding: var(--int-platform-header-padding-compact);

    &__inner {
      display: grid;
      grid-template-columns: var(--int-platform-header-mobile-columns);
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
}
</style>
