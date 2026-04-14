<template>
  <nav :aria-label="ariaLabel" :class="bemm()">
    <section
      v-for="section in sections"
      :key="section.id"
      :class="bemm('section')"
    >
      <header :class="bemm('section-header')">
        <button
          v-if="isSectionCollapsible(section)"
          type="button"
          :class="bemm('section-toggle')"
          :aria-controls="getSectionItemsId(section)"
          :aria-expanded="isSectionExpanded(section) ? 'true' : 'false'"
          @click="toggleSection(section)"
        >
          <span :class="bemm('section-copy')">
            <span :class="bemm('section-label')">{{ section.label }}</span>
            <span
              v-if="section.description"
              :class="bemm('section-description')"
            >
              {{ section.description }}
            </span>
          </span>
          <span :class="bemm('section-meta')">
            <Badge>{{ section.items.length }}</Badge>
            <Icon
              :name="Icons.CHEVRON_DOWN"
              :class="bemm('section-icon', { expanded: isSectionExpanded(section) })"
            />
          </span>
        </button>

        <div v-else :class="bemm('section-summary')">
          <span :class="bemm('section-copy')">
            <span :class="bemm('section-label')">{{ section.label }}</span>
            <span
              v-if="section.description"
              :class="bemm('section-description')"
            >
              {{ section.description }}
            </span>
          </span>
          <Badge>{{ section.items.length }}</Badge>
        </div>
      </header>

      <div
        v-show="isSectionExpanded(section)"
        :id="getSectionItemsId(section)"
        :class="bemm('items')"
      >
        <template v-for="item in section.items" :key="item.id">
          <RouterLink
            v-if="item.to"
            custom
            :to="item.to"
            v-slot="{ href, isActive, navigate }"
          >
            <a
              :href="href"
              :aria-disabled="item.disabled ? 'true' : undefined"
              :class="[
                bemm('item'),
                isActive ? bemm('item', 'active') : '',
                item.disabled ? bemm('item', 'disabled') : '',
              ]"
              @click="handleNavigate($event, navigate, item.disabled)"
            >
              <span :class="bemm('item-copy')">
                <strong :class="bemm('item-label')">
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
                :label="item.badge"
                :tone="item.badgeTone ?? Status.INFO"
              />
            </a>
          </RouterLink>

          <a
            v-else-if="item.href"
            :href="item.href"
            :target="item.target ?? '_self'"
            :rel="item.target === '_blank' ? 'noreferrer' : undefined"
            :aria-disabled="item.disabled ? 'true' : undefined"
            :class="[
              bemm('item'),
              item.disabled ? bemm('item', 'disabled') : '',
            ]"
            @click="handleDisabledClick($event, item.disabled)"
          >
            <span :class="bemm('item-copy')">
              <strong :class="bemm('item-label')">
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
              :label="item.badge"
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
            ]"
          >
            <span :class="bemm('item-copy')">
              <strong :class="bemm('item-label')">
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
              :label="item.badge"
              :tone="item.badgeTone ?? Status.INFO"
            />
          </button>
        </template>
      </div>
    </section>
  </nav>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useBemm } from 'bemm'
import { RouterLink } from 'vue-router'
import { Icons } from 'open-icon'
import { Status } from '../../types'
import { useSettingsStore } from '@/stores/settings'

import { Badge } from '../Badge'
import { Icon } from '../Icon'
import { StatusBadge } from '../StatusBadge'

import type { SidebarNavigationProps } from './SidebarNavigation.model'

defineOptions({
  name: 'SidebarNavigation',
})

const props = withDefaults(defineProps<SidebarNavigationProps>(), {
  ariaLabel: 'Sidebar navigation',
})

const bemm = useBemm('sidebar-navigation', {
  includeBaseClass: true,
})
const expandedSections = ref<Record<string, boolean>>({})
const settingsStore = useSettingsStore()
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

function handleNavigate(
  event: MouseEvent,
  navigate: (event?: MouseEvent) => void,
  disabled?: boolean,
) {
  if (disabled) {
    event.preventDefault()
    return
  }

  navigate(event)
}

function handleDisabledClick(event: MouseEvent, disabled?: boolean) {
  if (!disabled) {
    return
  }

  event.preventDefault()
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
.sidebar-navigation {
  display: grid;
  gap: calc(var(--space) * 0.9);

  &__section {
    display: grid;
    gap: calc(var(--space) * 0.5);
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
    gap: 0.2rem;
  }

  &__section-meta {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    flex-shrink: 0;
  }

  &__section-label {
    text-transform: uppercase;
    letter-spacing: 0.08em;
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
    gap: 0.4rem;
  }

  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: calc(var(--space) * 0.75);
    padding: 0.8rem 0.9rem;
    border-radius: calc(var(--border-radius, 1rem) * 0.9);
    border: 0;
    background: color-mix(in srgb, var(--color-background), white 48%);
    color: inherit;
    text-decoration: none;
    text-align: left;
    cursor: pointer;
    transition:
      transform 140ms ease,
      background-color 140ms ease,
      box-shadow 140ms ease;

    &:hover {
      transform: translateX(0.12rem);
      background: color-mix(in srgb, var(--color-primary), transparent 92%);
      box-shadow: 0 0.8rem 1.6rem color-mix(in srgb, var(--color-foreground), transparent 94%);
    }

    &:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }

    &--active {
      background: color-mix(in srgb, var(--color-primary), transparent 88%);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--color-primary), transparent 72%);
    }

    &--disabled {
      opacity: 0.5;
      pointer-events: none;
    }
  }

  &__item-copy {
    display: grid;
    gap: 0.25rem;
    min-width: 0;
  }

  &__item-label {
    font-size: var(--font-size-s);
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
