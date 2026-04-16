<template>
  <aside
    :class="[
      bemm(),
      showMobileTrigger ? bemm('', 'mobile') : '',
      showMobileTrigger && mobileOpen ? bemm('', 'mobile-open') : '',
      props.sticky ? bemm('', 'sticky') : '',
    ]"
    :style="{
      '--sidebar-width': props.width,
    }"
  >
    <button
      v-if="showMobileTrigger"
      type="button"
      :class="bemm('mobile-trigger')"
      :aria-label="mobileOpen ? props.mobileCloseLabel : props.mobileOpenLabel"
      :aria-expanded="`${mobileOpen}`"
      :aria-controls="mobilePanelId"
      @click="toggleMobile"
    >
      <span :class="bemm('mobile-trigger-arrow')" aria-hidden="true">
        {{ mobileOpen ? '←' : '→' }}
      </span>
    </button>

    <div v-show="panelVisible" :id="mobilePanelId" :class="bemm('panel')">
      <header
        v-if="props.title || props.subtitle || $slots.header"
        :class="bemm('header')"
      >
        <slot name="header">
          <div :class="bemm('headline')">
            <h2 v-if="props.title" :class="bemm('title')">{{ props.title }}</h2>
            <p v-if="props.subtitle" :class="bemm('subtitle')">{{ props.subtitle }}</p>
          </div>
        </slot>
      </header>

      <div :class="bemm('content')">
        <slot />
      </div>

      <footer v-if="$slots.footer" :class="bemm('footer')">
        <slot name="footer" />
      </footer>
    </div>
  </aside>
</template>

<script lang="ts" setup>
import { computed, getCurrentInstance, inject, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useBemm } from 'bemm'
import { routeLocationKey } from 'vue-router'

import { useId } from '@/composables/useId'

import type { SidebarProps } from './Sidebar.model'

defineOptions({ name: 'Sidebar' })

const bemm = useBemm('sidebar', {
  includeBaseClass: true,
})

const props = withDefaults(defineProps<SidebarProps>(), {
  mobileBreakpoint: '960px',
  mobileCloseLabel: 'Close sidebar',
  mobileDefaultOpen: false,
  mobileEnabled: true,
  mobileOpenLabel: 'Open sidebar',
  sticky: true,
  subtitle: '',
  title: '',
  width: '100%',
})

const mobileOpen = ref(props.mobileDefaultOpen)
const isMobileViewport = ref(false)
const mobilePanelId = `sidebar-panel-${useId()}`
let mediaQueryList: MediaQueryList | null = null
const app = getCurrentInstance()
const injectedRoute = inject(routeLocationKey, null)

type RouteLike = {
  fullPath?: string
  path?: string
  query?: Record<string, unknown>
  hash?: string
}

function resolveRoute() {
  if (injectedRoute) {
    return injectedRoute as RouteLike
  }

  const proxy = app?.proxy as Record<string, unknown> | undefined
  if (proxy && Reflect.has(proxy, '$route')) {
    return (proxy.$route as RouteLike) || null
  }

  return (app?.appContext?.config?.globalProperties?.$route ?? null) as RouteLike | null
}

function toggleMobile() {
  mobileOpen.value = !mobileOpen.value
}

const showMobileTrigger = computed(() => props.mobileEnabled && isMobileViewport.value)
const panelVisible = computed(() => !showMobileTrigger.value || mobileOpen.value)

function syncViewportState(event?: MediaQueryListEvent) {
  isMobileViewport.value = event?.matches ?? mediaQueryList?.matches ?? false
}

watch(
  () => {
    const route = resolveRoute()
    if (!route) return ''
    if (route.fullPath) return route.fullPath
    return `${route.path ?? ''}|${JSON.stringify(route.query ?? {})}|${route.hash ?? ''}`
  },
  () => {
    if (showMobileTrigger.value) {
      mobileOpen.value = false
    }
  }
)

function bindMediaQuery() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return
  }

  mediaQueryList = window.matchMedia(`(max-width: ${props.mobileBreakpoint})`)
  syncViewportState()

  if (typeof mediaQueryList.addEventListener === 'function') {
    mediaQueryList.addEventListener('change', syncViewportState)
    return
  }

  mediaQueryList.addListener?.(syncViewportState)
}

function unbindMediaQuery() {
  if (!mediaQueryList) {
    return
  }

  if (typeof mediaQueryList.removeEventListener === 'function') {
    mediaQueryList.removeEventListener('change', syncViewportState)
  } else {
    mediaQueryList.removeListener?.(syncViewportState)
  }

  mediaQueryList = null
}

onMounted(bindMediaQuery)
onBeforeUnmount(unbindMediaQuery)
</script>

<style lang="scss">
@use '../../styles/mixins' as m;

.sidebar {
  @include m.component-props((
    'title-font-size': '1rem',
    'mobile-panel-width': 'min(86vw, 22rem)',
    'mobile-z-index': '180',
    'mobile-panel-z-index': '181',
    'mobile-trigger-z-index': '182',
    'mobile-transition': 'transform 180ms ease-in-out',
    'shadow': '0 1.2rem 3rem color-mix(in srgb, var(--color-foreground), transparent 93%)',
  ), 'sidebar');

  display: grid;
  align-content: start;
  gap: var(--space);
  width: min(100%, var(--sidebar-width, 100%));
  padding: var(--space);
  border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 90%);
  border-radius: calc(var(--border-radius, 1rem) * 1.2);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--color-background), white 24%), color-mix(in srgb, var(--color-background), var(--color-primary) 3%));
  box-shadow: var(--int-sidebar-shadow);

  &--sticky {
    position: sticky;
    top: var(--space);
  }

  &__header,
  &__footer {
    display: grid;
    gap: calc(var(--space) * 0.45);
  }

  &__panel {
    display: grid;
    gap: var(--space);
    min-width: 0;
  }

  &__headline {
    display: grid;
    gap: calc(var(--space) * 0.25);
  }

  &__title {
    margin: 0;
    font-size: var(--int-sidebar-title-font-size);
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

  &__mobile-trigger {
    display: none;
    width: calc(var(--space) * 1.8);
    height: calc(var(--space) * 3);
    border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 82%);
    background: color-mix(in srgb, var(--color-background), var(--color-primary) 6%);
    color: inherit;
    border-radius: 0 calc(var(--border-radius, 1rem) * 0.9) calc(var(--border-radius, 1rem) * 0.9) 0;
    padding: 0;
    text-align: center;
    font-size: 1rem;
    font-weight: var(--font-weight-semibold, 600);
    cursor: pointer;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0.7rem 2rem color-mix(in srgb, var(--color-foreground), transparent 85%);
  }

  &__mobile-trigger-arrow {
    line-height: 1;
  }

  &--mobile {
    width: auto;
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: var(--int-sidebar-mobile-z-index);
    padding: 0;
    border: 0;
    border-radius: 0;
    background: transparent;
    box-shadow: none;

    &.sidebar--sticky {
      position: fixed;
    }

    .sidebar__mobile-trigger {
      display: inline-flex;
      position: fixed;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      z-index: var(--int-sidebar-mobile-trigger-z-index);
    }

    .sidebar__panel {
      display: grid;
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      width: var(--int-sidebar-mobile-panel-width);
      overflow-y: auto;
      padding: var(--space);
      border-right: 1px solid color-mix(in srgb, var(--color-foreground), transparent 86%);
      background:
        linear-gradient(180deg, color-mix(in srgb, var(--color-background), white 22%), color-mix(in srgb, var(--color-background), var(--color-primary) 4%));
      box-shadow: 0 0 0 200vmax color-mix(in srgb, var(--color-foreground), transparent 80%);
      transform: translateX(-102%);
      transition: var(--int-sidebar-mobile-transition);
      z-index: var(--int-sidebar-mobile-panel-z-index);
    }

    &.sidebar--mobile-open {
      .sidebar__panel {
        transform: translateX(0);
      }
    }
  }
}
</style>
