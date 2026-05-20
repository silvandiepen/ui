<script setup lang="ts">
import { onUnmounted, watch } from 'vue'
import { IkkiHeader } from '../IkkiHeader'
import type { IkkiAppShellProps } from './IkkiAppShell.model'

const props = withDefaults(defineProps<IkkiAppShellProps>(), {
  icon: 'check',
  label: 'Open sidebar',
  title: '',
  scrolled: false,
  sidebarOpen: false,
  showChrome: true,
  mainLabel: '',
  maxWidth: '60rem',
  sidebarShift: '30%',
})

const emit = defineEmits<{
  'update:sidebarOpen': [open: boolean]
  brandClick: []
  brandPointerdown: [event: PointerEvent]
}>()

function handleBrandClick() {
  emit('brandClick')
}

function handleBrandPointerdown(event: PointerEvent) {
  emit('brandPointerdown', event)
}

watch(
  () => [props.sidebarOpen, props.showChrome] as const,
  ([open, chrome]) => {
    document.body.classList.toggle('sidebar-is-open', open && chrome)
  },
  { immediate: true },
)

onUnmounted(() => {
  document.body.classList.remove('sidebar-is-open')
})
</script>

<template>
  <div
    class="ikki-app-shell"
    :class="{ 'ikki-app-shell--sidebar-open': sidebarOpen && showChrome }"
    :style="{
      '--ikki-app-shell-max-width': maxWidth,
      '--ikki-app-shell-sidebar-shift': sidebarShift,
    }"
  >
    <template v-if="showChrome">
      <IkkiHeader
        :product-name="productName"
        :hover-label="hoverLabel"
        :title="title"
        :scrolled="scrolled"
        :icon="icon"
        :label="label"
        @click="handleBrandClick"
        @pointerdown="handleBrandPointerdown"
      >
        <template v-if="$slots.actions" #actions>
          <slot name="actions" />
        </template>
      </IkkiHeader>

      <slot name="sidebar" />
    </template>

    <main class="ikki-app-shell__main" :aria-label="mainLabel || undefined">
      <slot />
    </main>

    <footer v-if="showChrome && $slots.footer" class="ikki-app-shell__footer">
      <slot name="footer" />
    </footer>
  </div>
</template>

<style lang="scss">
.ikki-app-shell {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background: var(--color-background);
  color: var(--color-foreground);
  transition: transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);

  &--sidebar-open {
    transform: translateX(var(--ikki-app-shell-sidebar-shift, 30%));
  }

  > .ikki-header {
    width: min(100% - 2rem, var(--ikki-app-shell-max-width, 60rem));
    margin: 0 auto;
  }

  &__main {
    flex: 1;
    min-width: 0;
  }

  &__footer {
    width: min(100% - 2rem, var(--ikki-app-shell-max-width, 60rem));
    margin: 0 auto;
    padding: calc(var(--space) * 2) 0 calc(var(--space) * 3);
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 0;
    font-size: 0.8rem;
    color: color-mix(in srgb, var(--color-foreground), transparent 50%);
  }

  &__footer-note,
  &__footer-copy {
    opacity: 0.7;
  }

  &__footer-sep {
    opacity: 0.35;
    margin: 0 0.4rem;
  }

  &__footer-link {
    color: inherit;
    text-decoration: none;
    opacity: 0.7;
    transition: opacity 0.2s;

    &:hover {
      opacity: 1;
    }
  }
}
</style>
