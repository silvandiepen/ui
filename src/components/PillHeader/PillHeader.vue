<template>
  <header
    :class="[
      bemm(),
      bemm('', `color-mode-${props.colorMode}`),
    ]"
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
        <div
          v-for="item in navItems"
          :key="getItemKey(item)"
          :style="linkStyles(item)"
          :class="[
            bemm('item'),
            hasSubItems(item) ? bemm('item', 'has-submenu') : '',
            isSubmenuOpen(item) ? bemm('item', 'open') : '',
          ]"
          @mouseenter="openSubmenu(item)"
          @mouseleave="closeSubmenu(item)"
        >
          <component
            :is="getItemComponent(item)"
            :type="getItemComponent(item) === 'button' ? 'button' : undefined"
            :to="item.to"
            :href="item.href"
            :target="getItemTarget(item)"
            :rel="getItemRel(item)"
            :disabled="getItemComponent(item) === 'button' ? item.disabled : undefined"
            :aria-disabled="item.disabled ? 'true' : undefined"
            :aria-haspopup="hasSubItems(item) ? 'menu' : undefined"
            :aria-expanded="hasSubItems(item) ? isSubmenuOpen(item) : undefined"
            :class="[
              bemm('link'),
              isActive(item) ? bemm('link', 'active') : '',
              item.disabled ? bemm('link', 'disabled') : '',
              hasSubItems(item) ? bemm('link', 'has-submenu') : '',
            ]"
            :data-test-id="getTestId(props.testId, `link-${getItemKey(item)}`)"
            @click="handleItemClick($event, item)"
          >
            <Icon v-if="item.icon" :name="item.icon" :class="bemm('link-icon')" aria-hidden="true" />
            <span>{{ item.label }}</span>
            <Icon v-if="hasSubItems(item)" :name="Icons.ARROWS_CHEVRON_DOWN" :class="bemm('link-chevron')" aria-hidden="true" />
          </component>

          <div
            v-if="hasSubItems(item)"
            :class="[
              bemm('submenu'),
              isSubmenuOpen(item) ? bemm('submenu', 'open') : '',
            ]"
            role="menu"
            :data-test-id="getTestId(props.testId, `submenu-${getItemKey(item)}`)"
          >
            <component
              :is="getItemComponent(subItem)"
              v-for="subItem in item.items"
              :key="getItemKey(subItem)"
              :type="getItemComponent(subItem) === 'button' ? 'button' : undefined"
              :to="subItem.to"
              :href="subItem.href"
              :target="getItemTarget(subItem)"
              :rel="getItemRel(subItem)"
              :disabled="getItemComponent(subItem) === 'button' ? subItem.disabled : undefined"
              :aria-disabled="subItem.disabled ? 'true' : undefined"
              :style="linkStyles(subItem, item)"
              :class="[
                bemm('submenu-link'),
                isActive(subItem) ? bemm('submenu-link', 'active') : '',
                subItem.disabled ? bemm('submenu-link', 'disabled') : '',
              ]"
              role="menuitem"
              :data-test-id="getTestId(props.testId, `link-${getItemKey(subItem)}`)"
              @click="handleItemClick($event, subItem)"
            >
              <Icon v-if="subItem.icon" :name="subItem.icon" :class="bemm('submenu-icon')" aria-hidden="true" />
              <span :class="bemm('submenu-copy')">
                <span :class="bemm('submenu-label')">{{ subItem.label }}</span>
                <span v-if="subItem.description" :class="bemm('submenu-description')">{{ subItem.description }}</span>
              </span>
            </component>
          </div>
        </div>
      </nav>

      <button
        :class="[bemm('toggle'), isMenuOpen ? bemm('toggle', 'open') : '']"
        type="button"
        :aria-expanded="isMenuOpen"
        :aria-controls="menuId"
        :data-test-id="getTestId(props.testId, 'toggle')"
        @click="toggleMenu"
      >
        <span class="sr-only">Toggle navigation</span>
        <Icon :name="isMenuOpen ? props.closeIcon : props.menuIcon" :class="bemm('toggle-icon')" />
      </button>

      <div v-if="actions.length" :class="bemm('actions')" :data-test-id="getTestId(props.testId, 'actions')">
        <template v-for="action in actions" :key="action.label">
          <DropdownMenu
            v-if="action.items?.length"
            :options="toDropdownOptions(action.items)"
            align="right"
            :close-on-select="true"
            @select="onActionSelect"
          >
            <template #trigger="{ toggle }">
              <button
                :style="linkStyles(action)"
                :class="[bemm('action'), action.icon ? bemm('action', 'has-icon') : '']"
                :aria-label="action.label"
                @click="toggle"
              >
                <Icon v-if="action.icon" :name="action.icon" :class="bemm('action-icon')" />
                <span :class="bemm('action-label')">{{ action.label }}</span>
              </button>
            </template>
          </DropdownMenu>
          <button
            v-else
            :style="linkStyles(action)"
            :class="[bemm('action'), action.icon ? bemm('action', 'has-icon') : '']"
            :aria-label="action.label"
            @click="action.handler"
          >
            <Icon v-if="action.icon" :name="action.icon" :class="bemm('action-icon')" />
            <span :class="bemm('action-label')">{{ action.label }}</span>
          </button>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useBemm } from 'bemm'
import { Icons } from '../../types'
import { Icon } from '../Icon'
import { DropdownMenu } from '../Dropdown'
import type { DropdownItem } from '../Dropdown'
import type { PillHeaderAction, PillHeaderActionItem, PillHeaderNavItem, PillHeaderProps } from './PillHeader.model'
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
  colorMode: 'auto',
  theme: 'dark',
  menuIcon: Icons.SPECIAL_CHARACTERS_THREE_DOTS_HORIZONTAL,
  closeIcon: Icons.UI_MULTIPLY_M,
})

const emit = defineEmits<{
  themeToggle: []
}>()

const { bemm } = useBemm('pill-header')

const isMenuOpen = ref(false)
const openSubmenuKey = ref<string | null>(null)
const isMobileNavigation = ref(false)
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

onMounted(() => {
  updateMobileNavigation()
  window.addEventListener('resize', updateMobileNavigation)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateMobileNavigation)
})

function isActive(item: PillHeaderNavItem): boolean {
  if (props.currentSection && item.section === props.currentSection) return true
  if (item.items?.some((subItem) => isActive(subItem))) return true

  const itemPath = normalizeItemPath(item)
  if (!itemPath) return false
  if (item.exact || itemPath === '/') return resolvedCurrentPath.value === itemPath
  return resolvedCurrentPath.value === itemPath || resolvedCurrentPath.value.startsWith(`${itemPath}/`)
}

function normalizeItemPath(item: PillHeaderNavItem): string | null {
  const value = item.to || item.href
  if (!value) return null
  if (typeof value !== 'string') return null
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

function getItemKey(item: PillHeaderNavItem): string {
  return item.id ?? item.section ?? String(item.to ?? item.href ?? item.label)
}

function getItemComponent(item: PillHeaderNavItem): 'router-link' | 'a' | 'button' {
  if (item.to) return 'router-link'
  if (item.href) return 'a'
  return 'button'
}

function getItemTarget(item: PillHeaderNavItem): '_blank' | '_self' | undefined {
  if (!item.href && !item.to) return undefined
  if (item.target) return item.target
  return item.external ? '_blank' : undefined
}

function getItemRel(item: PillHeaderNavItem): string | undefined {
  return getItemTarget(item) === '_blank' ? 'noopener noreferrer' : undefined
}

function hasSubItems(item: PillHeaderNavItem): boolean {
  return Boolean(item.items?.length)
}

function isSubmenuOpen(item: PillHeaderNavItem): boolean {
  return openSubmenuKey.value === getItemKey(item)
}

function openSubmenu(item: PillHeaderNavItem) {
  if (isMobileNavigation.value) return
  if (!hasSubItems(item)) return
  openSubmenuKey.value = getItemKey(item)
}

function closeSubmenu(item: PillHeaderNavItem) {
  if (isMobileNavigation.value) return
  if (openSubmenuKey.value !== getItemKey(item)) return
  openSubmenuKey.value = null
}

function linkStyles(item: PillHeaderNavItem | PillHeaderAction, parentItem?: PillHeaderNavItem): Record<string, string> | undefined {
  const color = getNavigationColor(item, parentItem)
  if (!color) return undefined

  const baseColor = `var(--color-${color})`

  return {
    '--pill-header-link-background-color': baseColor,
    '--pill-header-link-color': `var(--color-${color}-contrast)`,
    '--pill-header-link-hover-color':`var(--color-${color}-contrast)`,
    '--pill-header-link-hover-background': `color-mix(in srgb, ${baseColor}, transparent 10%)`,
    '--pill-header-link-active-color': baseColor,
    '--pill-header-link-active-background': `color-mix(in srgb, ${baseColor}, transparent 87.5%)`,
  }
}

function getNavigationColor(item: PillHeaderNavItem | PillHeaderAction, parentItem?: PillHeaderNavItem) {
  return item.color ?? parentItem?.color ?? props.color
}

function handleItemClick(event: MouseEvent, item: PillHeaderNavItem) {
  if (item.disabled) {
    event.preventDefault()
    return
  }

  if (hasSubItems(item) && isMobileNavigation.value) {
    event.preventDefault()
    openSubmenuKey.value = isSubmenuOpen(item) ? null : getItemKey(item)
    return
  }

  if (item.action) {
    event.preventDefault()
    void item.action(event)
    isMenuOpen.value = false
    openSubmenuKey.value = null
    return
  }

  if (hasSubItems(item) && !item.to && !item.href) {
    event.preventDefault()
    openSubmenuKey.value = isSubmenuOpen(item) ? null : getItemKey(item)
    return
  }

  isMenuOpen.value = false
  openSubmenuKey.value = null
}

function toDropdownOptions(items: PillHeaderActionItem[]): DropdownItem[] {
  return items.map((item) => ({
    type: 'item' as const,
    label: item.label,
    value: item.label,
    icon: item.icon,
    action: () => item.handler?.(),
  }))
}

function onActionSelect(item: DropdownItem) {
  item.action?.(item)
}

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value

  if (!isMenuOpen.value) {
    openSubmenuKey.value = null
  }
}

function updateMobileNavigation() {
  isMobileNavigation.value = typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches

  if (!isMobileNavigation.value) {
    return
  }

  openSubmenuKey.value = null
}
</script>

<style lang="scss">
@use '../../styles/mixins' as m;

.pill-header {
  --pill-header-top: 0;
  --pill-header-padding: 0.75rem clamp(1rem, 3vw, 2rem) 0;
  --pill-header-shell-padding: 0.3rem 0.3rem 0.3rem 1rem;
  --pill-header-shell-radius: 999px;
  --int-pill-header-surface-color: var(--color-dark);
  --int-pill-header-content-color: var(--color-light);
  --pill-header-shell-background: color-mix(in srgb, var(--int-pill-header-surface-color), transparent 10%);
  --pill-header-shell-shadow: 0 8px 32px color-mix(in srgb, var(--int-pill-header-surface-color), transparent 94%);
  --pill-header-shell-backdrop: blur(16px);
  --pill-header-nav-background: color-mix(in srgb, var(--int-pill-header-surface-color), transparent 0%);
  --pill-header-brand-color: var(--int-pill-header-content-color);
  --pill-header-link-color: color-mix(in srgb, var(--int-pill-header-content-color), transparent 33.33%);
  --pill-header-link-hover-color: var(--int-pill-header-content-color);
  --pill-header-link-hover-background: color-mix(in srgb, var(--int-pill-header-content-color), transparent 92%);
  --pill-header-link-active-color: var(--int-pill-header-content-color);
  --pill-header-link-active-background: color-mix(in srgb, var(--int-pill-header-content-color), transparent 94%);
  --pill-header-link-font-size: var(--font-size-s);
  --pill-header-brand-font-size: var(--font-size-xs);
  --pill-header-nav-gap: var(--space-s);
  --pill-header-link-padding: 0 var(--space-s);
  --pill-header-link-min-height: var(--space-l);
  --pill-header-toggle-size: var(--space-l);
  --pill-header-action-size: var(--space-l);


  position: sticky;
  top: var(--pill-header-top);
  z-index: var(--z-sticky, 100);
  display: flex;
  justify-content: center;
  padding: var(--pill-header-padding);

  &--color-mode-light {
    --int-pill-header-surface-color: var(--color-light);
    --int-pill-header-content-color: var(--color-dark);
  }

  &--color-mode-dark {
    --int-pill-header-surface-color: var(--color-dark);
    --int-pill-header-content-color: var(--color-light);
  }

  &--color-mode-auto {
    --int-pill-header-surface-color: var(--color-light);
    --int-pill-header-content-color: var(--color-dark);

    @media (prefers-color-scheme: dark) {
      --int-pill-header-surface-color: var(--color-dark);
      --int-pill-header-content-color: var(--color-light);
    }

    :root[data-color-mode='dark'] &,
    :root[data-theme='dark'] & {
      --int-pill-header-surface-color: var(--color-dark);
      --int-pill-header-content-color: var(--color-light);
    }

    :root[data-color-mode='light'] &,
    :root[data-theme='light'] & {
      --int-pill-header-surface-color: var(--color-light);
      --int-pill-header-content-color: var(--color-dark);
    }
  }

  &--color-mode-inverse {
    --int-pill-header-surface-color: var(--color-dark);
    --int-pill-header-content-color: var(--color-light);

    @media (prefers-color-scheme: dark) {
      --int-pill-header-surface-color: var(--color-light);
      --int-pill-header-content-color: var(--color-dark);
    }

    :root[data-color-mode='dark'] &,
    :root[data-theme='dark'] & {
      --int-pill-header-surface-color: var(--color-light);
      --int-pill-header-content-color: var(--color-dark);
    }

    :root[data-color-mode='light'] &,
    :root[data-theme='light'] & {
      --int-pill-header-surface-color: var(--color-dark);
      --int-pill-header-content-color: var(--color-light);
    }
  }

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
    justify-content: center;
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
    gap: var(--space-s);
    font-size: var(--pill-header-brand-font-size);
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--pill-header-brand-color);
    text-decoration: none;
    margin-left: calc(var(--space-s) * -1);

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
    top: calc(var(--space-s) * -1);
    padding: var(--space-s);
    padding-top: var(--space-xl);
    z-index: -1;
    right: 0;
    left: calc(var(--space-s) * -1);
    display: flex;
    flex-direction: column;
    gap: 2px;
    border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 92%);
    border-radius: calc(1.75rem);
    backdrop-filter: var(--pill-header-shell-backdrop);
    background: var(--pill-header-nav-background);
    width: calc(100% + var(--space-s) * 2);

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

  &__item {
    position: relative;
    display: flex;
    min-width: 0;
  }

  &__link {
    display: inline-flex;
    align-items: center;
    gap:var(--space-xs);
    min-height: var(--pill-header-link-min-height);
    padding: var(--pill-header-link-padding);
    border-radius: 999px;
    color: var(--pill-header-link-color);
    font-size: var(--pill-header-link-font-size);
    font-weight: 500;
    text-decoration: none;
    border: 0;
    background: var(--pill-header-link-background-color, transparent);
    cursor: pointer;
    transition: color 0.2s ease, background-color 0.2s ease;

    &:hover,
    &:focus-visible {
      color: var(--pill-header-link-hover-color);
      background: var(--pill-header-link-hover-background);
      text-decoration: none;
    }

    &--active {
      color: var(--pill-header-link-active-color);
      background: var(--pill-header-link-active-background);
    }

    &--disabled {
      opacity: 0.45;
      pointer-events: none;
      cursor: not-allowed;
    }
  }

  &__link-icon {
    font-size: 0.95em;
    opacity: 0.8;
  }

  &__link-chevron {
    width: 12px;
    height: 12px;
    opacity: 0.6;
    transition: transform 160ms ease;
  }

  &__item--open &__link-chevron {
    transform: rotate(180deg);
  }

  &__submenu {
    display: grid;
    gap: var(--space-xs);
    padding: 0.35rem;
    border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 92%);
    border-radius: 0.875rem;
    background: var(--pill-header-shell-background);
    box-shadow: var(--pill-header-shell-shadow);
    backdrop-filter: var(--pill-header-shell-backdrop);
  }

  &__submenu-link {
    display: flex;
    align-items: center;
    gap: var(--space-s);
    min-height: 2.25rem;
    padding: 0.45rem 0.65rem;
    border: 0;
    border-radius: 0.65rem;
    background: var(--pill-header-link-background-color, transparent);
    color: var(--pill-header-link-color);
    font-size: var(--pill-header-link-font-size);
    font-weight: 500;
    text-align: left;
    text-decoration: none;
    cursor: pointer;
    transition: color 0.2s ease, background-color 0.2s ease;

    &:hover,
    &:focus-visible {
      color: var(--pill-header-link-hover-color);
      background: var(--pill-header-link-hover-background);
      text-decoration: none;
    }

    &--active {
      color: var(--pill-header-link-active-color);
      background: var(--pill-header-link-active-background);
    }

    &--disabled {
      opacity: 0.45;
      pointer-events: none;
      cursor: not-allowed;
    }
  }

  &__submenu-icon {
    flex-shrink: 0;
    width: var(--space);
    height: var(--space);
    opacity: 0.8;
  }

  &__submenu-copy {
    display: grid;
    gap: 0.15rem;
    min-width: 0;
  }

  &__submenu-label,
  &__submenu-description {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__submenu-description {
    color: var(--pill-header-link-color);
    font-size: var(--font-size-s);
    font-weight: 400;
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
    color: color-mix(in srgb, var(--int-pill-header-content-color), transparent 50%);
    cursor: pointer;
    transition: color 0.2s ease, background-color 0.2s ease;

    &:hover,
    &:focus-visible {
      color: var(--int-pill-header-content-color);
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
    background: var(--pill-header-link-background-color, transparent);
    color: var(--pill-header-link-color);
    font-size: var(--pill-header-link-font-size);
    font-weight: 500;
    cursor: pointer;
    transition: color 0.2s ease, background-color 0.2s ease;
    white-space: nowrap;

    &:hover,
    &:focus-visible {
      color: var(--pill-header-link-hover-color);
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
      // background: transparent;
      backdrop-filter: none;

      opacity: 1;
      visibility: visible;
      transform: none;
    }

    &__submenu {
      position: absolute;
      top: calc(100% + 0.45rem);
      left: 0;
      min-width: 14rem;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-4px);
      transform-origin: top left;
      transition:
        opacity 0.16s ease,
        transform 0.16s ease,
        visibility 0.16s;
    }

    &__item:hover &__submenu,
    &__item:focus-within &__submenu,
    &__submenu--open {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
  }

  /* --- Mobile (<768px): actions with icons collapse to icon-only --- */
  @media (max-width: 767px) {
    &__item {
      display: grid;
    }

    &__link {
      justify-content: flex-start;
      width: 100%;
    }

    &__link-chevron {
      margin-left: auto;
    }

    &__submenu {
      display: none;
      margin: 0.2rem 0 0.35rem;
      box-shadow: none;
    }

    &__submenu--open {
      display: grid;
    }

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
