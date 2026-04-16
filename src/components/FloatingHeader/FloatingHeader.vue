<template>
  <header :class="bemm(['', fixed ? 'fixed' : 'sticky'])">
    <div :class="bemm('shell')">
      <component
        :is="brandComponent"
        :to="brandComponent === 'router-link' ? brandTo : undefined"
        :href="brandComponent === 'a' ? brandHref : undefined"
        :class="bemm('logo')"
        :aria-label="brandAriaLabel"
      >
        <slot name="brand-mark" />
        <span v-if="brandSuffix" :class="bemm('logo-text')">
          {{ brandSuffix }}
        </span>
      </component>

      <nav v-if="navItems.length" :class="bemm('nav')" aria-label="Primary">
        <component
          :is="item.to ? 'router-link' : 'a'"
          v-for="item in navItems"
          :key="item.to || item.href || item.label"
          :to="item.to"
          :href="item.href"
          :target="item.external ? '_blank' : undefined"
          :rel="item.external ? 'noopener noreferrer' : undefined"
          :class="[
            bemm('nav-link'),
            isActive(item) ? bemm('nav-link', 'active') : '',
          ]"
        >
          <Icon v-if="item.icon" :name="item.icon" :class="bemm('nav-icon')" />
          <span>{{ item.label }}</span>
        </component>
      </nav>

      <div :class="bemm('actions')">
        <div v-if="$slots.utilities" :class="bemm('utilities')">
          <slot name="utilities" />
        </div>
        <div v-if="$slots.actions" :class="bemm('action-slot')">
          <slot name="actions" />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useBemm } from 'bemm'
import { Icon } from '../Icon'
import type { FloatingHeaderNavItem, FloatingHeaderProps } from './FloatingHeader.model'

const props = withDefaults(defineProps<FloatingHeaderProps>(), {
  navItems: () => [],
  currentPath: undefined,
  brandHref: undefined,
  brandTo: undefined,
  brandSuffix: '',
  brandAriaLabel: 'Home',
  fixed: false,
})

const { bemm } = useBemm('floating-header')

const brandComponent = computed(() => {
  if (props.brandTo) {
    return 'router-link'
  }

  if (props.brandHref) {
    return 'a'
  }

  return 'div'
})

const resolvedCurrentPath = computed(() => {
  if (props.currentPath) {
    return normalizePath(props.currentPath)
  }

  if (typeof window === 'undefined') {
    return '/'
  }

  return normalizePath(window.location.pathname)
})

function isActive(item: FloatingHeaderNavItem): boolean {
  const itemPath = normalizeItemPath(item)

  if (!itemPath) {
    return false
  }

  if (item.exact || itemPath === '/') {
    return resolvedCurrentPath.value === itemPath
  }

  return resolvedCurrentPath.value === itemPath || resolvedCurrentPath.value.startsWith(`${itemPath}/`)
}

function normalizeItemPath(item: FloatingHeaderNavItem): string | null {
  const value = item.to || item.href

  if (!value) {
    return null
  }

  if (value.startsWith('/')) {
    return normalizePath(value)
  }

  try {
    return normalizePath(new URL(value).pathname)
  } catch {
    return null
  }
}

function normalizePath(value: string): string {
  const normalizedValue = value.trim() || '/'
  if (normalizedValue === '/') {
    return normalizedValue
  }

  return normalizedValue.replace(/\/+$/, '') || '/'
}
</script>

<style lang="scss">
.floating-header {
  --floating-header-top: 0;
  --floating-header-padding: 1rem clamp(1rem, 3vw, 2rem);
  --floating-header-max-width: max(fit-content, 1024px);
  --floating-header-shell-padding: 0.9rem 1rem;
  --floating-header-shell-radius: 999px;
  --floating-header-shell-border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 90%);
  --floating-header-shell-background: color-mix(in srgb, var(--color-background), transparent 90%);
  --floating-header-shell-shadow: 0 18px 42px color-mix(in srgb, var(--color-foreground), transparent 92%);
  --floating-header-shell-backdrop: blur(16px);
  --floating-header-link-color: color-mix(in srgb, var(--color-foreground), transparent 40%);
  --floating-header-link-hover-background: color-mix(in srgb, var(--color-foreground), transparent 94%);
  --floating-header-link-active-background: color-mix(in srgb, var(--color-primary), transparent 88%);
  --floating-header-link-active-color: var(--color-foreground);
  --floating-header-logo-color: var(--color-foreground);

  position: fixed;
  width:100%;
  top: var(--floating-header-top);
  z-index: var(--z-sticky, 100);
  padding: var(--floating-header-padding);
  margin: auto;

  &--fixed {
    position: fixed;
    left: 0;
    right: 0;
  }

  &__shell {
    width: var(--floating-header-max-width);
    margin: 0 auto;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 1rem;
    padding: var(--floating-header-shell-padding);
    border: var(--floating-header-shell-border);
    border-radius: var(--floating-header-shell-radius);
    background: var(--floating-header-shell-background);
    box-shadow: var(--floating-header-shell-shadow);
    backdrop-filter: var(--floating-header-shell-backdrop);
  }

  &__logo {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    justify-self: start;
    color: var(--floating-header-logo-color);
    text-decoration: none;

    &:hover,
    &:focus-visible {
      text-decoration: none;
    }
  }

  &__logo-text {
    font-size: var(--font-size-s, 0.875rem);
    font-weight: var(--font-weight-medium, 500);
    color: color-mix(in srgb, var(--floating-header-logo-color), transparent 22%);
  }

  &__nav {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    min-width: 0;
    padding: 0.35rem;
    border-radius: 999px;
    background: color-mix(in srgb, var(--color-foreground), transparent 97%);
  }

  &__nav-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border-radius: 999px;
    color: var(--floating-header-link-color);
    text-decoration: none;
    font-weight: var(--font-weight-medium, 500);
    line-height: 1;
    transition: color var(--transition-fast), background-color var(--transition-fast), transform var(--transition-fast);

    &:hover,
    &:focus-visible {
      text-decoration: none;
      color: var(--color-foreground);
      background: var(--floating-header-link-hover-background);
    }

    &--active {
      color: var(--floating-header-link-active-color);
      background: var(--floating-header-link-active-background);
      box-shadow: inset 0 -2px 0 var(--color-primary);
    }
  }

  &__nav-icon {
    font-size: 0.95em;
    opacity: 0.8;
  }

  &__actions {
    display: flex;
    align-items: center;
    justify-self: end;
    gap: 0.75rem;
    min-width: 0;
  }

  &__utilities,
  &__action-slot {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  @media (max-width: 900px) {
    &__shell {
      grid-template-columns: 1fr;
      border-radius: 1.6rem;
    }

    &__logo {
      justify-self: start;
    }

    &__nav {
      justify-content: flex-start;
      overflow-x: auto;
      padding-bottom: 0.5rem;
    }

    &__actions {
      justify-self: stretch;
      justify-content: space-between;
      flex-wrap: wrap;
    }

    &__utilities,
    &__action-slot {
      flex-wrap: wrap;
    }
  }
}
</style>
