<template>
  <aside
    :class="[
      bemm(),
      sticky ? bemm('', 'sticky') : '',
    ]"
    :style="{
      '--sidebar-width': width,
    }"
  >
    <header
      v-if="title || subtitle || $slots.header"
      :class="bemm('header')"
    >
      <slot name="header">
        <div :class="bemm('headline')">
          <h2 v-if="title" :class="bemm('title')">{{ title }}</h2>
          <p v-if="subtitle" :class="bemm('subtitle')">{{ subtitle }}</p>
        </div>
      </slot>
    </header>

    <div :class="bemm('content')">
      <slot />
    </div>

    <footer v-if="$slots.footer" :class="bemm('footer')">
      <slot name="footer" />
    </footer>
  </aside>
</template>

<script lang="ts" setup>
import { useBemm } from 'bemm'

import type { SidebarProps } from './Sidebar.model'

defineOptions({
  name: 'Sidebar',
})

withDefaults(defineProps<SidebarProps>(), {
  sticky: true,
  subtitle: '',
  title: '',
  width: '100%',
})

const bemm = useBemm('sidebar', {
  includeBaseClass: true,
})
</script>

<style lang="scss">
.sidebar {
  display: grid;
  align-content: start;
  gap: var(--space);
  width: min(100%, var(--sidebar-width, 100%));
  padding: var(--space);
  border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 90%);
  border-radius: calc(var(--border-radius, 1rem) * 1.2);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--color-background), white 24%), color-mix(in srgb, var(--color-background), var(--color-primary) 3%));
  box-shadow: 0 1.2rem 3rem color-mix(in srgb, var(--color-foreground), transparent 93%);

  &--sticky {
    position: sticky;
    top: var(--space);
  }

  &__header,
  &__footer {
    display: grid;
    gap: calc(var(--space) * 0.45);
  }

  &__headline {
    display: grid;
    gap: calc(var(--space) * 0.25);
  }

  &__title {
    margin: 0;
    font-size: 1rem;
    font-weight: var(--font-weight-bold);
  }

  &__subtitle {
    margin: 0;
    color: color-mix(in srgb, var(--color-foreground), transparent 34%);
    line-height: 1.5;
    font-size: var(--font-size-s);
  }

  &__content {
    display: grid;
    gap: calc(var(--space) * 0.75);
    min-width: 0;
  }
}
</style>
