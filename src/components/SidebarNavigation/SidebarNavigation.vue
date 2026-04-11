<template>
  <nav :aria-label="ariaLabel" :class="bemm()">
    <section
      v-for="section in sections"
      :key="section.id"
      :class="bemm('section')"
    >
      <header :class="bemm('section-header')">
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
      </header>

      <div :class="bemm('items')">
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
                <strong :class="bemm('item-label')">{{ item.label }}</strong>
                <span v-if="item.description" :class="bemm('item-description')">
                  {{ item.description }}
                </span>
              </span>

              <StatusBadge
                v-if="item.badge"
                :label="item.badge"
                :tone="item.badgeTone ?? 'accent'"
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
              <strong :class="bemm('item-label')">{{ item.label }}</strong>
              <span v-if="item.description" :class="bemm('item-description')">
                {{ item.description }}
              </span>
            </span>

            <StatusBadge
              v-if="item.badge"
              :label="item.badge"
              :tone="item.badgeTone ?? 'accent'"
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
              <strong :class="bemm('item-label')">{{ item.label }}</strong>
              <span v-if="item.description" :class="bemm('item-description')">
                {{ item.description }}
              </span>
            </span>

            <StatusBadge
              v-if="item.badge"
              :label="item.badge"
              :tone="item.badgeTone ?? 'accent'"
            />
          </button>
        </template>
      </div>
    </section>
  </nav>
</template>

<script lang="ts" setup>
import { useBemm } from 'bemm'
import { RouterLink } from 'vue-router'

import { Badge } from '../Badge'
import { StatusBadge } from '../StatusBadge'

import type { SidebarNavigationProps } from './SidebarNavigation.model'

defineOptions({
  name: 'SidebarNavigation',
})

withDefaults(defineProps<SidebarNavigationProps>(), {
  ariaLabel: 'Sidebar navigation',
})

const bemm = useBemm('sidebar-navigation', {
  includeBaseClass: true,
})

function handleNavigate(event: MouseEvent, navigate: () => void, disabled?: boolean) {
  if (disabled) {
    event.preventDefault()
    return
  }

  navigate()
}

function handleDisabledClick(event: MouseEvent, disabled?: boolean) {
  if (!disabled) {
    return
  }

  event.preventDefault()
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
    display: flex;
    align-items: start;
    justify-content: space-between;
    gap: calc(var(--space) * 0.5);
  }

  &__section-copy {
    display: grid;
    gap: 0.2rem;
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

  &__item-description {
    color: color-mix(in srgb, var(--color-foreground), transparent 34%);
    font-size: var(--font-size-xs);
    line-height: 1.5;
  }
}
</style>
