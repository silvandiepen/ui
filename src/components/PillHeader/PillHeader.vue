<template>
  <header
    :class="bemm()"
    :data-test-id="testId"
  >
    <div :class="bemm('shell')" :data-test-id="getTestId(props.testId, 'shell')">
      <component
        :is="brandComponent"
        :to="brandComponent === 'router-link' ? brandTo : undefined"
        :class="bemm('brand')"
        :aria-label="brandAriaLabel"
        :data-test-id="getTestId(props.testId, 'brand')"
      >
        <slot name="brand-mark" />
        <span v-if="brandSuffix" :class="bemm('brand-text')">{{ brandSuffix }}</span>
      </component>

      <nav
        :id="menuId"
        :class="[bemm('nav'), isMenuOpen ? bemm('nav', 'open') : '']"
        aria-label="Primary"
        :data-test-id="getTestId(props.testId, 'nav')"
      >
        <component
          :is="item.to ? 'router-link' : 'a'"
          v-for="item in navItems"
          :key="item.to || item.href || item.label"
          :to="item.to"
          :href="item.href"
          :target="item.external ? '_blank' : undefined"
          :rel="item.external ? 'noopener noreferrer' : undefined"
          :class="[
            bemm('link'),
            isActive(item) ? bemm('link', 'active') : '',
          ]"
          :data-test-id="getTestId(props.testId, `link-${item.label}`)"
          @click="isMenuOpen = false"
        >
          <Icon v-if="item.icon" :name="item.icon" :class="bemm('link-icon')" />
          <span>{{ item.label }}</span>
        </component>
      </nav>

      <button
        :class="[bemm('toggle'), isMenuOpen ? bemm('toggle', 'open') : '']"
        type="button"
        :aria-expanded="isMenuOpen"
        :aria-controls="menuId"
        :data-test-id="getTestId(props.testId, 'toggle')"
        @click="isMenuOpen = !isMenuOpen"
      >
        <span class="sr-only">Toggle navigation</span>
        <Icon :name="isMenuOpen ? props.closeIcon : props.menuIcon" :class="bemm('toggle-icon')" />
      </button>

      <div v-if="actions.length" :class="bemm('actions')" :data-test-id="getTestId(props.testId, 'actions')">
        <button
          v-for="action in actions"
          :key="action.label"
          :class="[bemm('action'), action.icon ? bemm('action', 'has-icon') : '']"
          :aria-label="action.label"
          @click="action.handler"
        >
          <Icon v-if="action.icon" :name="action.icon" :class="bemm('action-icon')" />
          <span :class="bemm('action-label')">{{ action.label }}</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useBemm } from 'bemm'
import { Icons } from '../../types'
import { Icon } from '../Icon'
import type { PillHeaderAction, PillHeaderNavItem, PillHeaderProps } from './PillHeader.model'
import { getTestId } from '../../utils/testId'

defineOptions({
  name: 'PillHeader',
})

const props = withDefaults(defineProps<PillHeaderProps>(), {
  navItems: () => [],
  actions: () => [],
  currentPath: undefined,
  currentSection: undefined,
  brandTo: '/',
  brandSuffix: '',
  brandAriaLabel: 'Home',
  theme: 'dark',
  menuIcon: Icons.SPECIAL_CHARACTERS_THREE_DOTS_HORIZONTAL,
  closeIcon: Icons.UI_MULTIPLY_M,
})

const emit = defineEmits<{
  themeToggle: []
}>()

const { bemm } = useBemm('pill-header')

const isMenuOpen = ref(false)
const menuId = 'pill-header-navigation'

const brandComponent = computed(() => {
  if (props.brandTo) return 'router-link'
  return 'div'
})

const resolvedCurrentPath = computed(() => {
  if (props.currentPath) return normalizePath(props.currentPath)
  if (typeof window === 'undefined') return '/'
  return normalizePath(window.location.pathname)
})

function isActive(item: PillHeaderNavItem): boolean {
  if (props.currentSection && item.section === props.currentSection) return true

  const itemPath = normalizeItemPath(item)
  if (!itemPath) return false
  if (item.exact || itemPath === '/') return resolvedCurrentPath.value === itemPath
  return resolvedCurrentPath.value === itemPath || resolvedCurrentPath.value.startsWith(`${itemPath}/`)
}

function normalizeItemPath(item: PillHeaderNavItem): string | null {
  const value = item.to || item.href
  if (!value) return null
  if (value.startsWith('/')) return normalizePath(value)
  try {
    return normalizePath(new URL(value).pathname)
  } catch {
    return null
  }
}

function normalizePath(value: string): string {
  const normalizedValue = value.trim() || '/'
  if (normalizedValue === '/') return normalizedValue
  return normalizedValue.replace(/\/+$/, '') || '/'
}
</script>

<style lang="scss">
@use '../../styles/mixins' as m;

.pill-header {
  --pill-header-top: 0;
  --pill-header-padding: 0.75rem clamp(1rem, 3vw, 2rem) 0;
  --pill-header-shell-padding: 0.3rem 0.3rem 0.3rem 1rem;
  --pill-header-shell-radius: 999px;
  --pill-header-shell-background: color-mix(in srgb, var(--color-background), transparent 90%);
  --pill-header-shell-shadow: 0 8px 32px color-mix(in srgb, var(--color-foreground), transparent 94%);
  --pill-header-shell-backdrop: blur(16px);
  --pill-header-brand-color: var(--color-foreground);
  --pill-header-link-color: color-mix(in srgb, var(--color-foreground), transparent 45%);
  --pill-header-link-hover-background: color-mix(in srgb, var(--color-foreground), transparent 92%);
  --pill-header-link-active-color: var(--color-foreground);
  --pill-header-link-active-background: color-mix(in srgb, var(--color-foreground), transparent 94%);
  --pill-header-link-font-size: 0.8rem;
  --pill-header-brand-font-size: 0.8rem;
  --pill-header-nav-gap: 0.25rem;
  --pill-header-link-padding: 0 0.6rem;
  --pill-header-link-min-height: 2rem;
  --pill-header-toggle-size: 2.25rem;
  --pill-header-action-size: 2rem;

  position: sticky;
  top: var(--pill-header-top);
  z-index: var(--z-sticky, 100);
  display: flex;
  justify-content: center;
  padding: var(--pill-header-padding);

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
  }

  &__shell {
    display: inline-flex;
    align-items: center;
    gap: var(--pill-header-nav-gap);
    padding: var(--pill-header-shell-padding);
    border-radius: var(--pill-header-shell-radius);
    background: var(--pill-header-shell-background);
    box-shadow: var(--pill-header-shell-shadow);
    backdrop-filter: var(--pill-header-shell-backdrop);
    position: relative;
  }

  &__brand {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: var(--pill-header-brand-font-size);
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--pill-header-brand-color);
    text-decoration: none;
    margin-right: 0.25rem;

    &:hover,
    &:focus-visible {
      text-decoration: none;
    }
  }

  &__brand-text {
    font-size: inherit;
    font-weight: inherit;
  }

  &__nav {
    position: absolute;
    top: calc(100% + 0.5rem);
    right: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 0.5rem;
    border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 92%);
    border-radius: 1rem;
    background: var(--pill-header-shell-background);
    backdrop-filter: var(--pill-header-shell-backdrop);

    opacity: 0;
    visibility: hidden;
    transform: scale(0.95) translateY(-8px);
    transform-origin: top center;
    transition:
      opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1),
      transform 0.2s cubic-bezier(0.16, 1, 0.3, 1),
      visibility 0.2s;

    &--open {
      opacity: 1;
      visibility: visible;
      transform: scale(1) translateY(0);
    }
  }

  &__link {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    min-height: var(--pill-header-link-min-height);
    padding: var(--pill-header-link-padding);
    border-radius: 999px;
    color: var(--pill-header-link-color);
    font-size: var(--pill-header-link-font-size);
    font-weight: 500;
    text-decoration: none;
    transition: color 0.2s ease, background-color 0.2s ease;

    &:hover,
    &:focus-visible {
      color: var(--color-foreground);
      background: var(--pill-header-link-hover-background);
      text-decoration: none;
    }

    &--active {
      color: var(--pill-header-link-active-color);
      background: var(--pill-header-link-active-background);
    }
  }

  &__link-icon {
    font-size: 0.95em;
    opacity: 0.8;
  }

  &__toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--pill-header-toggle-size);
    height: var(--pill-header-toggle-size);
    padding: 0;
    border: none;
    border-radius: 999px;
    background: transparent;
    color: color-mix(in srgb, var(--color-foreground), transparent 50%);
    cursor: pointer;
    transition: color 0.2s ease, background-color 0.2s ease;

    &:hover,
    &:focus-visible {
      color: var(--color-foreground);
      background: var(--pill-header-link-hover-background);
    }
  }

  &__toggle-icon {
    width: 16px;
    height: 16px;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  &__action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    height: var(--pill-header-action-size);
    padding: 0 0.5rem;
    border: none;
    border-radius: 999px;
    background: transparent;
    color: color-mix(in srgb, var(--color-foreground), transparent 50%);
    font-size: var(--pill-header-link-font-size);
    font-weight: 500;
    cursor: pointer;
    transition: color 0.2s ease, background-color 0.2s ease;
    white-space: nowrap;

    &:hover,
    &:focus-visible {
      color: var(--color-foreground);
      background: var(--pill-header-link-hover-background);
    }
  }

  &__action-icon {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }

  &__action-label {
    /* Visible by default */
  }

  /* --- Desktop (>=768px): nav inline, toggle hidden --- */
  @media (min-width: 768px) {
    &__toggle {
      display: none;
    }

    &__nav {
      position: static;
      flex-direction: row;
      align-items: center;
      gap: 2px;
      padding: 0;
      border: 0;
      background: transparent;
      backdrop-filter: none;

      opacity: 1;
      visibility: visible;
      transform: none;
    }
  }

  /* --- Mobile (<768px): actions with icons collapse to icon-only --- */
  @media (max-width: 767px) {
    &__action--has-icon &__action-label {
      display: none;
    }

    &__action--has-icon {
      padding: 0;
      width: var(--pill-header-action-size);
    }
  }
}
</style>
