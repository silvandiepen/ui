<template>
  <nav :aria-label="ariaLabel" :class="bemm()" :data-test-id="testId">
    <section
      v-for="section in sections"
      :key="section.id"
      :class="bemm('section')"
      :data-test-id="getTestId(props.testId, `section-${section.id}`)"
    >
      <header :class="bemm('section-header')" :data-test-id="getTestId(props.testId, `section-${section.id}-header`)">
        <button
          v-if="isSectionCollapsible(section)"
          type="button"
          :class="bemm('section-toggle')"
          :aria-controls="getSectionItemsId(section)"
          :aria-expanded="isSectionExpanded(section) ? 'true' : 'false'"
          :data-test-id="getTestId(props.testId, `section-${section.id}-toggle`)"
          @click="toggleSection(section)"
        >
          <span :class="bemm('section-start')" :data-test-id="getTestId(props.testId, `section-${section.id}-start`)">
            <Icon v-if="section.icon" :name="section.icon" size="small" :class="bemm('section-icon-custom')" :data-test-id="getTestId(props.testId, `section-${section.id}-icon`)" aria-hidden="true" />
            <span :class="bemm('section-copy')" :data-test-id="getTestId(props.testId, `section-${section.id}-copy`)">
              <span :class="bemm('section-label')" :data-test-id="getTestId(props.testId, `section-${section.id}-label`)">{{ section.label }}</span>
              <span
                v-if="section.description"
                :class="bemm('section-description')"
                :data-test-id="getTestId(props.testId, `section-${section.id}-description`)"
              >
                {{ section.description }}
              </span>
            </span>
          </span>
          <span :class="bemm('section-meta')" :data-test-id="getTestId(props.testId, `section-${section.id}-meta`)">
            <Badge v-if="showSectionItemCount" :size="Size.SMALL" :test-id="getTestId(props.testId, `section-${section.id}-count`)">{{ section.items.length }}</Badge>
            <Icon
              :name="Icons.ARROWS_CHEVRON_DOWN"
              :class="bemm('section-icon', { expanded: isSectionExpanded(section) })"
              :data-test-id="getTestId(props.testId, `section-${section.id}-chevron`)"
            />
          </span>
        </button>

        <div v-else :class="bemm('section-summary')" :data-test-id="getTestId(props.testId, `section-${section.id}-summary`)">
          <span :class="bemm('section-start')" :data-test-id="getTestId(props.testId, `section-${section.id}-start`)">
            <Icon v-if="section.icon" :name="section.icon" size="small" :class="bemm('section-icon-custom')" :data-test-id="getTestId(props.testId, `section-${section.id}-icon`)" aria-hidden="true" />
            <span :class="bemm('section-copy')" :data-test-id="getTestId(props.testId, `section-${section.id}-copy`)">
              <span :class="bemm('section-label')" :data-test-id="getTestId(props.testId, `section-${section.id}-label`)">{{ section.label }}</span>
              <span
                v-if="section.description"
                :class="bemm('section-description')"
                :data-test-id="getTestId(props.testId, `section-${section.id}-description`)"
              >
                {{ section.description }}
              </span>
            </span>
          </span>
          <Badge v-if="showSectionItemCount" :test-id="getTestId(props.testId, `section-${section.id}-count`)">{{ section.items.length }}</Badge>
        </div>
      </header>

      <div
        v-show="isSectionExpanded(section)"
        :id="getSectionItemsId(section)"
        :class="bemm('items')"
        :data-test-id="getTestId(props.testId, `section-${section.id}-items`)"
      >
        <template v-for="item in section.items" :key="item.id">
          <a
            v-if="item.to"
            :href="resolveToHref(item.to)"
            :target="item.target ?? '_self'"
            :rel="item.target === '_blank' ? 'noreferrer' : undefined"
            :aria-disabled="item.disabled ? 'true' : undefined"
            :class="[
              bemm('item'),
              isToItemActive(item.to) ? bemm('item', 'active') : '',
              item.disabled ? bemm('item', 'disabled') : '',
              item.icon ? bemm('item', 'has-icon') : '',
            ]"
            :data-test-id="getTestId(props.testId, `item-${item.id}`)"
            @click="handleToItemClick($event, item)"
          >
            <Icon v-if="item.icon" :name="item.icon" size="small" :class="bemm('item-icon')" :data-test-id="getTestId(props.testId, `item-${item.id}-icon`)" aria-hidden="true" />
            <span :class="bemm('item-copy')" :data-test-id="getTestId(props.testId, `item-${item.id}-copy`)">
              <strong :class="bemm('item-label')" :data-test-id="getTestId(props.testId, `item-${item.id}-label`)">
                <span
                  v-if="item.labelPrefix"
                  :class="bemm('item-label-prefix')"
                >
                  {{ item.labelPrefix }}
                </span>
                {{ item.label }}
              </strong>
              <span v-if="item.description" :class="bemm('item-description')">
                {{ item.description }}
              </span>
            </span>

            <StatusBadge
              v-if="item.badge"
              :label="String(item.badge)"
              :tone="item.badgeTone ?? Status.INFO"
            />
          </a>

          <a
            v-else-if="item.href"
            :href="item.href"
            :target="item.target ?? '_self'"
            :rel="item.target === '_blank' ? 'noreferrer' : undefined"
            :aria-disabled="item.disabled ? 'true' : undefined"
            :class="[
              bemm('item'),
              isHrefItemActive(item.href) ? bemm('item', 'active') : '',
              item.disabled ? bemm('item', 'disabled') : '',
              item.icon ? bemm('item', 'has-icon') : '',
            ]"
            :data-test-id="getTestId(props.testId, `item-${item.id}`)"
            @click="handleHrefItemClick($event, item)"
          >
            <Icon v-if="item.icon" :name="item.icon" size="small" :class="bemm('item-icon')" :data-test-id="getTestId(props.testId, `item-${item.id}-icon`)" aria-hidden="true" />
            <span :class="bemm('item-copy')" :data-test-id="getTestId(props.testId, `item-${item.id}-copy`)">
              <strong :class="bemm('item-label')" :data-test-id="getTestId(props.testId, `item-${item.id}-label`)">
                <span
                  v-if="item.labelPrefix"
                  :class="bemm('item-label-prefix')"
                >
                  {{ item.labelPrefix }}
                </span>
                {{ item.label }}
              </strong>
              <span v-if="item.description" :class="bemm('item-description')">
                {{ item.description }}
              </span>
            </span>

            <StatusBadge
              v-if="item.badge"
              :label="String(item.badge)"
              :tone="item.badgeTone ?? Status.INFO"
            />
          </a>

          <button
            v-else
            type="button"
            :disabled="item.disabled"
            :class="[
              bemm('item'),
              item.disabled ? bemm('item', 'disabled') : '',
              item.icon ? bemm('item', 'has-icon') : '',
            ]"
            :data-test-id="getTestId(props.testId, `item-${item.id}`)"
            @click="handleButtonItemClick($event, item)"
          >
            <Icon v-if="item.icon" :name="item.icon" size="small" :class="bemm('item-icon')" :data-test-id="getTestId(props.testId, `item-${item.id}-icon`)" aria-hidden="true" />
            <span :class="bemm('item-copy')" :data-test-id="getTestId(props.testId, `item-${item.id}-copy`)">
              <strong :class="bemm('item-label')" :data-test-id="getTestId(props.testId, `item-${item.id}-label`)">
                <span
                  v-if="item.labelPrefix"
                  :class="bemm('item-label-prefix')"
                >
                  {{ item.labelPrefix }}
                </span>
                {{ item.label }}
              </strong>
              <span v-if="item.description" :class="bemm('item-description')">
                {{ item.description }}
              </span>
            </span>

            <StatusBadge
              v-if="item.badge"
              :label="String(item.badge)"
              :tone="item.badgeTone ?? Status.INFO"
            />
          </button>
        </template>
      </div>
    </section>
  </nav>
</template>

<script lang="ts" setup>
import { computed, getCurrentInstance, ref, watch } from 'vue'
import { useBemm } from 'bemm'
import type { RouteLocationRaw, Router } from 'vue-router'
import { Icons } from 'open-icon'
import { Size, Status } from '../../types'
import { useSettingsStore } from '@/stores/settings'

import { Badge } from '../Badge'
import { Icon } from '../Icon'
import { StatusBadge } from '../StatusBadge'
import { getTestId } from '../../utils/testId'

import type {
  SidebarNavigationItem,
  SidebarNavigationProps,
} from './SidebarNavigation.model'

defineOptions({
  name: 'SidebarNavigation',
})

const props = withDefaults(defineProps<SidebarNavigationProps>(), {
  ariaLabel: 'Sidebar navigation',
  linkMode: 'auto',
  showSectionItemCount: false,
})

const bemm = useBemm('sidebar-navigation', {
  includeBaseClass: true,
})
const expandedSections = ref<Record<string, boolean>>({})
const settingsStore = useSettingsStore()
const currentInstance = getCurrentInstance()

const resolvedRouter = computed<Router | null>(() => {
  if (props.router) {
    return props.router
  }

  return (currentInstance?.proxy?.$router as Router | undefined) ?? null
})

const currentRoute = computed(() => currentInstance?.proxy?.$route ?? null)

const useRouterNavigation = computed(() => {
  if (props.linkMode === 'href') {
    return false
  }

  return Boolean(resolvedRouter.value)
})

const navigationSettingsKey = computed(() => {
  if (props.settingsKey) {
    return props.settingsKey
  }

  return [
    'sidebar-navigation',
    props.ariaLabel,
    ...props.sections.map((section) => section.id),
  ].join(':')
})

watch(
  [() => props.sections, navigationSettingsKey],
  ([sections, settingsKey]) => {
    const storedState = settingsStore.getSidebarNavigationSections(settingsKey) ?? {}
    const nextState: Record<string, boolean> = {}

    for (const section of sections) {
      nextState[section.id] = section.collapsible === false
        ? true
        : storedState[section.id] ?? expandedSections.value[section.id] ?? !section.defaultCollapsed
    }

    expandedSections.value = nextState
  },
  {
    deep: true,
    immediate: true,
  }
)

watch(
  [expandedSections, navigationSettingsKey],
  ([sectionState, settingsKey]) => {
    settingsStore.setSidebarNavigationSections(settingsKey, sectionState)
  },
  {
    deep: true,
  }
)

function resolveToHref(to: RouteLocationRaw) {
  if (resolvedRouter.value) {
    return resolvedRouter.value.resolve(to).href
  }

  if (typeof to === 'string') {
    return to
  }

  return '#'
}

function isToItemActive(to: RouteLocationRaw) {
  if (!useRouterNavigation.value || !resolvedRouter.value || !currentRoute.value) {
    return false
  }

  const resolvedTarget = resolvedRouter.value.resolve(to)

  return resolvedTarget.fullPath === currentRoute.value.fullPath
}

function isHrefItemActive(href: string) {
  if (!useRouterNavigation.value || !resolvedRouter.value || !currentRoute.value) {
    return false
  }

  if (isExternalLink(href)) {
    return false
  }

  const resolvedTarget = resolvedRouter.value.resolve(href)

  return resolvedTarget.fullPath === currentRoute.value.fullPath
}

function hasModifierKey(event: MouseEvent) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
}

function isExternalLink(value: string) {
  return value.startsWith('http://') || value.startsWith('https://') || value.startsWith('mailto:')
}

function runItemAction(event: MouseEvent, item: SidebarNavigationItem) {
  if (!item.action) {
    return false
  }

  event.preventDefault()
  void item.action(event)
  return true
}

function handleToItemClick(event: MouseEvent, item: SidebarNavigationItem) {
  if (item.disabled) {
    event.preventDefault()
    return
  }

  if (runItemAction(event, item)) {
    return
  }

  if (!item.to || !useRouterNavigation.value || !resolvedRouter.value) {
    return
  }

  if (item.target === '_blank' || hasModifierKey(event)) {
    return
  }

  event.preventDefault()
  void resolvedRouter.value.push(item.to)
}

function handleHrefItemClick(event: MouseEvent, item: SidebarNavigationItem) {
  if (item.disabled) {
    event.preventDefault()
    return
  }

  if (runItemAction(event, item)) {
    return
  }

  if (!item.href || !useRouterNavigation.value || !resolvedRouter.value) {
    return
  }

  if (item.target === '_blank' || hasModifierKey(event) || isExternalLink(item.href)) {
    return
  }

  event.preventDefault()
  void resolvedRouter.value.push(item.href)
}

function handleButtonItemClick(event: MouseEvent, item: SidebarNavigationItem) {
  if (item.disabled) {
    event.preventDefault()
    return
  }

  if (item.action) {
    void item.action(event)
  }
}

function isSectionCollapsible(section: SidebarNavigationProps['sections'][number]) {
  return section.collapsible !== false
}

function isSectionExpanded(section: SidebarNavigationProps['sections'][number]) {
  if (!isSectionCollapsible(section)) {
    return true
  }

  return expandedSections.value[section.id] ?? !section.defaultCollapsed
}

function toggleSection(section: SidebarNavigationProps['sections'][number]) {
  if (!isSectionCollapsible(section)) {
    return
  }

  expandedSections.value = {
    ...expandedSections.value,
    [section.id]: !isSectionExpanded(section),
  }
}

function getSectionItemsId(section: SidebarNavigationProps['sections'][number]) {
  return `sidebar-navigation-items-${section.id}`
}
</script>

<style lang="scss">
@use '../../styles/mixins' as m;

.sidebar-navigation {
  display: m.p('display', grid);
  gap: m.p('gap', calc(var(--space) * 0.9));

  &__section {
    display: m.p('display', grid);
    gap: m.p('gap', var(--space-s));
  }

  &__section-header {
    display: block;
  }

  &__section-toggle,
  &__section-summary {
    width: 100%;
    display: flex;
    align-items: start;
    justify-content: space-between;
    gap: calc(var(--space) * 0.5);
  }

  &__section-start {
    display: flex;
    align-items: center;
    gap: calc(var(--space) * 0.4);
    min-width: 0;
  }

  &__section-icon-custom {
    flex-shrink: 0;
    color: m.p('color', color-mix(in srgb, var(--color-foreground), transparent 42%));
  }

  &__section-toggle {
    padding: 0;
    border: 0;
    background: transparent;
    color: inherit;
    text-align: left;
    cursor: pointer;

    &:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
      border-radius: calc(var(--border-radius, 1rem) * 0.4);
    }
  }

  &__section-copy {
    display: grid;
    gap: m.p('gap', var(--space-xs));
  }

  &__section-meta {
    display: inline-flex;
    align-items: center;
    gap: m.p('gap', calc(var(--space-xs) * 1.75));
    flex-shrink: 0;
  }

  &__section-label {
    text-transform: uppercase;
    letter-spacing: m.p('letter-spacing', 0.08em);
    font-size: var(--font-size-xs);
    color: color-mix(in srgb, var(--color-foreground), transparent 42%);
  }

  &__section-description {
    color: color-mix(in srgb, var(--color-foreground), transparent 34%);
    font-size: var(--font-size-xs);
    line-height: 1.5;
  }

  &__section-icon {
    color: color-mix(in srgb, var(--color-foreground), transparent 42%);
    transition: transform 160ms ease;

    &--expanded {
      transform: rotate(180deg);
    }
  }

  &__items {
    display: grid;
    gap: m.p('gap', calc(var(--space-xs) * 1.5));
  }

  &__item-icon {
    flex-shrink: 0;
    color: m.p('color', color-mix(in srgb, var(--color-foreground), transparent 36%));
    transition: color 140ms ease;
  }

  &__item {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: m.p('gap', calc(var(--space) * 0.75));
    padding: m.p('padding', var(--space-s) var(--space));
    border-radius: m.p('border-radius', calc(var(--border-radius, 1rem) * 0.9));
    border: m.p('border', none);
    background: m.p('background', color-mix(in srgb, var(--color-background), var(--color-background) 48%));
    color: inherit;
    text-decoration: none;
    text-align: left;
    cursor: pointer;
    transition:
      transform 140ms ease,
      background-color 140ms ease,
      box-shadow 140ms ease;

    &:hover {
      background: m.p('background', color-mix(in srgb, var(--color-primary), transparent 92%));
      transform: m.p('transform', none);
      box-shadow: m.p('box-shadow', none);

      .sidebar-navigation__item-icon {
        color: var(--color-primary);
      }
    }

    &:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }

    &--active {
      background: m.p('background', color-mix(in srgb, var(--color-primary), transparent 88%));
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--color-primary), transparent 72%);
    }

    &--disabled {
      opacity: 0.5;
      pointer-events: none;
    }
  }

  &__item-copy {
    display: grid;
    gap: m.p('gap', var(--space-xs));
    min-width: 0;
  }

  &__item-label {
    font-size: m.p('font-size', var(--font-size-s));
  }

  &__item-label-prefix {
    opacity: 0.56;
  }

  &__item-description {
    color: color-mix(in srgb, var(--color-foreground), transparent 34%);
    font-size: var(--font-size-xs);
    line-height: 1.5;
  }
}
</style>
