<template>
  <Resizable
    :class="rootClasses"
    :style="rootStyles"
    :default-size="sidebar.defaultWidth"
    :min-size="sidebar.minWidth"
    :max-size="sidebar.maxWidth"
    :min-secondary-size="sidebar.minMainWidth"
    :settings-key="sidebar.settingsKey"
    :disabled="isMobile"
    :test-id="testId"
    aria-label="Application layout"
  >
    <template #start>
      <Sidebar
        :class="bemm('sidebar')"
        :sticky="false"
        :variant="'float'"
        :mobile-enabled="false"
        :test-id="getTestId(props.testId, 'sidebar')"
      >
        <template v-if="isMobile || $slots['sidebar-header']" #header>
          <div :class="bemm('sidebar-header-row')" :data-test-id="getTestId(props.testId, 'sidebar-header')">
            <slot name="sidebar-header" />
            <button
              v-if="isMobile"
              :class="bemm('sidebar-close')"
              type="button"
              aria-label="Close sidebar"
              :data-test-id="getTestId(props.testId, 'sidebar-close')"
              @click="closeSidebar"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              </svg>
            </button>
          </div>
        </template>

        <SidebarNavigation
          v-if="props.navigation?.length"
          :class="bemm('nav')"
          :sections="props.navigation"
          :settings-key="props.navigationSettingsKey"
          :test-id="getTestId(props.testId, 'navigation')"
        />

        <template v-if="$slots['sidebar-footer']" #footer>
          <slot name="sidebar-footer" />
        </template>
      </Sidebar>
    </template>

    <template #end>
      <div :class="bemm('body')" :data-test-id="getTestId(props.testId, 'body')">
        <PlatformHeader
          :class="bemm('header')"
          :max-width="header.maxWidth"
          :variant="header.variant"
          :color-mode="header.colorMode"
          :test-id="getTestId(props.testId, 'header')"
        >
          <template v-if="isMobile || $slots.brand" #brand>
            <button
              v-if="isMobile"
              :class="bemm('menu-trigger')"
              type="button"
              :aria-label="sidebarOpen ? 'Close sidebar' : 'Open sidebar'"
              :aria-expanded="`${sidebarOpen}`"
              :data-test-id="getTestId(props.testId, 'menu-trigger')"
              @click="toggleSidebar"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              </svg>
            </button>
            <slot name="brand" />
          </template>

          <template v-if="$slots['header-actions']" #actions>
            <slot name="header-actions" />
          </template>
        </PlatformHeader>

        <Resizable
          v-if="showSplit"
          :class="bemm('split')"
          direction="horizontal"
          :default-size="split.defaultWidth"
          :min-size="split.minWidth"
          :min-secondary-size="split.minSecondaryWidth"
          :settings-key="split.settingsKey"
          :test-id="getTestId(props.testId, 'split')"
        >
          <template #start>
            <div :class="bemm('content')" :data-test-id="getTestId(props.testId, 'content')">
              <slot />
            </div>
          </template>
          <template #end>
            <div :class="bemm('split-panel')" :data-test-id="getTestId(props.testId, 'split-panel')">
              <slot name="split" />
            </div>
          </template>
        </Resizable>

        <div v-else :class="bemm('content')" :data-test-id="getTestId(props.testId, 'content')">
          <slot />
        </div>
      </div>
    </template>
  </Resizable>

  <Teleport to="body">
    <div
      v-if="isMobile && sidebarOpen"
      :class="bemm('backdrop')"
      :data-test-id="getTestId(props.testId, 'backdrop')"
      aria-hidden="true"
      @click="closeSidebar"
    />
  </Teleport>
</template>

<script lang="ts" setup>
import { computed, inject, onBeforeUnmount, onMounted, ref, useSlots, watch } from 'vue'
import { useBemm } from 'bemm'
import { routeLocationKey } from 'vue-router'

import { PlatformHeader } from '../PlatformHeader'
import { Resizable } from '../Resizable'
import { Sidebar } from '../Sidebar'
import { SidebarNavigation } from '../SidebarNavigation'

import type { AppLayoutProps } from './AppLayout.model'
import { getTestId } from '../../utils/testId'

defineOptions({ name: 'AppLayout' })

const props = withDefaults(defineProps<AppLayoutProps>(), {
  config: () => ({}),
  navigation: undefined,
  navigationSettingsKey: undefined,
})

defineSlots<{
  brand?: () => any
  default?: () => any
  'header-actions'?: () => any
  'sidebar-footer'?: () => any
  'sidebar-header'?: () => any
  split?: () => any
}>()

const slots = useSlots()
const bemm = useBemm('app-layout')

const sidebarOpen = ref(false)
const isMobile = ref(false)
const isLargeScreen = ref(false)

const sidebar = computed(() => ({
  defaultWidth: props.config?.sidebar?.defaultWidth ?? 244,
  mobileBreakpoint: props.config?.sidebar?.mobileBreakpoint ?? 960,
  mobileWidth: props.config?.sidebar?.mobileWidth ?? '80vw',
  maxWidth: props.config?.sidebar?.maxWidth ?? 360,
  minMainWidth: props.config?.sidebar?.minMainWidth ?? 640,
  minWidth: props.config?.sidebar?.minWidth ?? 208,
  settingsKey: props.config?.sidebar?.settingsKey,
}))

const header = computed(() => ({
  maxWidth: props.config?.header?.maxWidth ?? '88rem',
  variant: props.config?.header?.variant,
  colorMode: props.config?.header?.colorMode,
}))

const split = computed(() => ({
  breakpoint: props.config?.split?.breakpoint ?? 1280,
  defaultWidth: props.config?.split?.defaultWidth ?? 480,
  enabled: props.config?.split?.enabled ?? false,
  minSecondaryWidth: props.config?.split?.minSecondaryWidth ?? 320,
  minWidth: props.config?.split?.minWidth ?? 320,
  settingsKey: props.config?.split?.settingsKey,
}))

const showSplit = computed(
  () => split.value.enabled && isLargeScreen.value && !!slots.split,
)

const rootClasses = computed(() => [
  bemm(),
  sidebarOpen.value && isMobile.value ? bemm('', 'sidebar-open') : '',
])

const rootStyles = computed(() => ({
  '--app-layout-sidebar-mobile-width': sidebar.value.mobileWidth,
}))

function openSidebar() {
  sidebarOpen.value = true
}

function closeSidebar() {
  sidebarOpen.value = false
}

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

let mobileQuery: MediaQueryList | null = null
let splitQuery: MediaQueryList | null = null

function onMobileChange(e?: MediaQueryListEvent) {
  isMobile.value = e?.matches ?? mobileQuery?.matches ?? false
  if (!isMobile.value) {
    sidebarOpen.value = false
  }
}

function onSplitChange(e?: MediaQueryListEvent) {
  isLargeScreen.value = e?.matches ?? splitQuery?.matches ?? false
}

onMounted(() => {
  if (typeof window === 'undefined') return

  mobileQuery = window.matchMedia(`(max-width: ${sidebar.value.mobileBreakpoint}px)`)
  onMobileChange()
  mobileQuery.addEventListener('change', onMobileChange)

  if (split.value.enabled) {
    splitQuery = window.matchMedia(`(min-width: ${split.value.breakpoint}px)`)
    onSplitChange()
    splitQuery.addEventListener('change', onSplitChange)
  }
})

onBeforeUnmount(() => {
  mobileQuery?.removeEventListener('change', onMobileChange)
  splitQuery?.removeEventListener('change', onSplitChange)
})

const injectedRoute = inject(routeLocationKey, null)

watch(
  () => (injectedRoute as { fullPath?: string } | null)?.fullPath,
  () => {
    if (isMobile.value) closeSidebar()
  },
)

defineExpose({ closeSidebar, openSidebar })
</script>

<style lang="scss">
@use '../../styles/mixins' as m;

.app-layout {
  height: 100svh;

  // Desktop: both panes fill full height
  .resizable__pane--start,
  .resizable__pane--end {
    min-height: 0;
    overflow: hidden;
  }

  // The Sidebar component inside the start pane fills full height
  &__sidebar {
    height: 100%;
    overflow-y: auto;
    .sidebar__panel {
      height: fit-content;
    }
  }

  &__sidebar-header-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--space-s, 0.5rem);
  }

  &__sidebar-close {
    display: none;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 2rem;
    height: 2rem;
    padding: 0;
    border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 84%);
    border-radius: var(--border-radius, 0.5rem);
    background: color-mix(in srgb, var(--color-background), transparent 10%);
    color: inherit;
    cursor: pointer;

    &:hover {
      background: color-mix(in srgb, var(--color-foreground), transparent 93%);
    }
  }

  &__body {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  }

  &__header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
  }

  &__content {
    flex: 1;
    overflow-y: auto;
    min-height: 0;
  }

  &__menu-trigger {
    display: none;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 2.25rem;
    height: 2.25rem;
    padding: 0;
    border: none;
    border-radius: var(--border-radius, 0.5rem);
    background: transparent;
    color: inherit;
    cursor: pointer;

    &:hover {
      background: color-mix(in srgb, var(--color-foreground), transparent 93%);
    }
  }

  &__backdrop {
    position: fixed;
    inset: 0;
    z-index: 199;
    background: color-mix(in srgb, var(--color-foreground), transparent 68%);
    backdrop-filter: blur(2px);
  }

  // Split screen inner resizable
  &__split {
    flex: 1;
    min-height: 0;
    --resizable-handle-size: 1rem;

    .resizable__pane--start,
    .resizable__pane--end {
      overflow-y: auto;
    }
  }

  &__split-panel {
    height: 100%;
  }

  // Mobile overrides
  @media (max-width: 960px) {
    // Collapse Resizable to single column (main content only)
    &.resizable {
      grid-template-columns: 1fr;
    }

    // Hide the resize handle
    .resizable__handle {
      display: none;
    }

    // Sidebar pane becomes fixed overlay
    .resizable__pane--start {
      position: fixed;
      top: 0;
      left: 0;
      width: m.p('sidebar-mobile-width', 80vw);
      height: 100svh;
      z-index: 200;
      overflow-y: auto;
      transform: translateX(-102%);
      transition: transform 280ms ease;
    }

    // Slide sidebar in when open
    &--sidebar-open {
      .resizable__pane--start {
        transform: translateX(0);
      }
    }

    // Show mobile controls
    &__sidebar-close {
      display: flex;
    }

    &__menu-trigger {
      display: flex;
    }
  }
}
</style>
