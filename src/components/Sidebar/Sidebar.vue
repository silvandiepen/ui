<template>
  <aside
    :class="[
      bemm(),
      showMobileTrigger ? bemm('', 'mobile') : '',
      showMobileTrigger && mobileOpen ? bemm('', 'mobile-open') : '',
      props.sticky ? bemm('', 'sticky') : '',
      props.variant ? bemm('', props.variant) : '',
    ]"
    :style="{
      '--sidebar-width': props.width,
    }"
    :data-test-id="testId"
  >
    <div :class="bemm('container')" :data-test-id="getTestId(props.testId, 'container')">
      <button
        v-if="showMobileTrigger"
        type="button"
        :class="bemm('mobile-trigger')"
        :aria-label="mobileOpen ? props.mobileCloseLabel : props.mobileOpenLabel"
        :aria-expanded="`${mobileOpen}`"
        :aria-controls="mobilePanelId"
        :data-test-id="getTestId(props.testId, 'mobile-trigger')"
        @click="toggleMobile"
      >
        <Icon :name="mobileOpen ? Icons.ARROW_LEFT : Icons.ARROW_RIGHT" :class="bemm('mobile-trigger-arrow')" :data-test-id="getTestId(props.testId, 'mobile-trigger-icon')" aria-hidden="true" />
      </button>

      <div v-show="panelVisible" :id="mobilePanelId" :class="bemm('panel')" :data-test-id="getTestId(props.testId, 'panel')">
        <header
          v-if="props.title || props.subtitle || $slots.header"
          :class="bemm('header')"
          :data-test-id="getTestId(props.testId, 'header')"
        >
          <slot name="header">
            <div :class="bemm('headline')" :data-test-id="getTestId(props.testId, 'headline')">
              <h2 v-if="props.title" :class="bemm('title')" :data-test-id="getTestId(props.testId, 'title')">{{ props.title }}</h2>
              <p v-if="props.subtitle" :class="bemm('subtitle')" :data-test-id="getTestId(props.testId, 'subtitle')">{{ props.subtitle }}</p>
            </div>
          </slot>
        </header>

        <div :class="bemm('content')" :data-test-id="getTestId(props.testId, 'content')">
          <slot />
        </div>

        <footer v-if="$slots.footer" :class="bemm('footer')" :data-test-id="getTestId(props.testId, 'footer')">
          <slot name="footer" />
        </footer>
      </div>
    </div>
  </aside>
</template>

<script lang="ts" setup>
import { computed, getCurrentInstance, inject, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useBemm } from 'bemm'
import { routeLocationKey } from 'vue-router'

import { useId } from '@/composables/useId'

import { SidebarVariant, type SidebarProps } from './Sidebar.model'
import Icon from '../Icon/Icon.vue'
import { Icons } from 'open-icon'
import { getTestId } from '../../utils/testId'

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
  variant: SidebarVariant.DEFAULT,
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
  display: grid;
  align-content: start;
  gap: var(--space);
  width: min(100%, var(--sidebar-width, 100%));
  padding: var(--space);
  border: m.p('border', none);
  border-radius: m.p("border-radius", 0);
  background: m.p(
    "background",
    color-mix(in srgb, var(--color-background), var(--color-foreground) 5%)
  );
  box-shadow: m.p(
    "shadow",
    0 1.2rem 3rem color-mix(in srgb, var(--color-foreground), transparent 93%)
  );

  &--sticky {
    position: sticky;
    top: var(--space);
  }

  &--float {

      --int-sidebar-border-radius: var(--border-radius);
      --int-sidebar-padding: var(--space);
      --int-sidebar-background: transparent;
      --int-sidebar-container-background: var(--color-background);
      --int-sidebar-container-padding: var(--space);
      --int-sidebar-container-border-radius: var(--border-radius-xl);
      --int-sidebar-container-box-shadow: .125em .25em .75em 0em color-mix(in srgb, var(--color-foreground), transparent 93%);
  }

  &__container{
    padding: m.p('padding', 0);
    border: m.p('border', none);
    border-radius: m.p('border-radius',0);
    background: m.p('background', transparent);
     box-shadow: m.p(
    "box-shadow",
    none);
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
    font-size: m.p("title-font-size", var(--font-size));
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
    border-radius: 0 calc(var(--border-radius, 1rem) * 0.9)
      calc(var(--border-radius, 1rem) * 0.9) 0;
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
    z-index: m.p("mobile-z-index", 180);
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
      z-index: m.p("mobile-trigger-z-index", 182);
    }

    .sidebar__panel {
      display: grid;
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      width: m.p("mobile-panel-width", min(86vw, 22rem));
      overflow-y: auto;
      padding: var(--space);
      border-right: 1px solid color-mix(in srgb, var(--color-foreground), transparent 86%);
      background: linear-gradient(
        180deg,
        color-mix(in srgb, var(--color-background), white 22%),
        color-mix(in srgb, var(--color-background), var(--color-primary) 4%)
      );
      box-shadow: 0 0 0 200vmax
        color-mix(in srgb, var(--color-foreground), transparent 80%);
      transform: translateX(-102%);
      transition: m.p("mobile-transition", transform 180ms ease-in-out);
      z-index: m.p("mobile-panel-z-index", 181);
    }

    &.sidebar--mobile-open {
      .sidebar__panel {
        transform: translateX(0);
      }
    }
  }
}
</style>
