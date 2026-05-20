<script setup lang="ts">
import { computed, useSlots } from 'vue'
import type { Slots } from 'vue'
import { Button } from '../Button'
import { Icon } from '../Icon'
import type { IkkiSidebarFooterItem, IkkiSidebarItem } from './IkkiSidebar.model'

const props = withDefaults(defineProps<{
  open: boolean
  title: string
  items: IkkiSidebarItem[]
  loading?: boolean
  loadingLabel?: string
  emptyLabel?: string
  createLabel?: string
  createIcon?: string
  closeLabel?: string
  footerItems?: IkkiSidebarFooterItem[]
}>(), {
  loading: false,
  loadingLabel: 'Loading…',
  emptyLabel: 'Nothing here yet.',
  createLabel: '',
  createIcon: 'ui/add-l',
  closeLabel: 'Close sidebar',
  footerItems: () => [],
})

const emit = defineEmits<{
  close: []
  select: [item: IkkiSidebarItem]
  create: []
  footerAction: [item: IkkiSidebarFooterItem]
}>()

const slots: Slots = useSlots()
const hasCreate = computed(() => props.createLabel.length > 0)
const visibleFooterItems = computed<IkkiSidebarFooterItem[]>(() => props.footerItems.filter(item => item.visible !== false))
const hasFooter = computed<boolean>(() => visibleFooterItems.value.length > 0 || Boolean(slots.footer) || Boolean(slots['footer-extra']))

function rowStyle(index: number) {
  return { '--item-index': index } as Record<string, string | number>
}
</script>

<template>
  <Teleport to="body">
    <Transition name="ikki-sidebar-overlay">
      <div v-if="open" class="ikki-sidebar__overlay" @click="emit('close')" />
    </Transition>

    <Transition name="ikki-sidebar">
      <aside v-if="open" class="ikki-sidebar" aria-modal="true">
        <header class="ikki-sidebar__top">
          <slot name="title">
            <h2 class="ikki-sidebar__title">{{ title }}</h2>
          </slot>
          <Button
            class="ikki-sidebar__close"
            variant="ghost"
            icon-only
            :aria-label="closeLabel"
            @click="emit('close')"
          >
            <Icon name="wayfinding/cross" size="small" />
          </Button>
        </header>

        <div v-if="loading" class="ikki-sidebar__loading">{{ loadingLabel }}</div>

        <div v-else class="ikki-sidebar__list">
          <ul v-if="items.length > 0" class="ikki-sidebar__items">
            <li
              v-for="(item, index) in items"
              :key="item.id"
              class="ikki-sidebar__row"
              :class="{
                'ikki-sidebar__row--active': item.active,
                'ikki-sidebar__row--done': item.done,
              }"
              :style="rowStyle(index)"
              @click="emit('select', item)"
            >
              <span class="ikki-sidebar__row-hover-bg" />
              <slot name="item-icon" :item="item">
                <Icon v-if="item.icon" :name="item.icon" size="small" />
              </slot>
              <span class="ikki-sidebar__row-title">{{ item.title }}</span>
              <slot name="item-after-title" :item="item">
                <Icon v-if="item.locked" name="ui/lock" size="small" class="ikki-sidebar__row-lock" />
              </slot>
              <span v-if="item.progress || item.meta" class="ikki-sidebar__row-time">
                <span v-if="item.progress" class="ikki-sidebar__row-progress">{{ item.progress }}</span>
                <span v-if="item.meta">{{ item.meta }}</span>
              </span>
            </li>
          </ul>

          <div v-else class="ikki-sidebar__empty">
            <slot name="empty">{{ emptyLabel }}</slot>
          </div>

          <div v-if="hasCreate" class="ikki-sidebar__create">
            <Button
              class="ikki-sidebar__create-button"
              variant="primary"
              @click="emit('create')"
            >
              <Icon :name="createIcon" />
              {{ createLabel }}
            </Button>
          </div>
        </div>

        <footer v-if="hasFooter" class="ikki-sidebar__footer">
          <slot name="footer">
            <div v-if="visibleFooterItems.length > 0" class="ikki-sidebar__footer-row">
              <template v-for="item in visibleFooterItems" :key="item.id">
                <a
                  v-if="item.href"
                  class="ikki-sidebar__footer-link"
                  :class="{ 'ikki-sidebar__footer-link--badge': item.badge }"
                  :href="item.href"
                  :target="item.target"
                  :rel="item.rel"
                >
                  <Icon v-if="item.icon" :name="item.icon" size="small" />
                  <span>{{ item.label }}</span>
                </a>
                <button
                  v-else
                  class="ikki-sidebar__footer-link"
                  :class="{ 'ikki-sidebar__footer-link--badge': item.badge }"
                  type="button"
                  @click="emit('footerAction', item)"
                >
                  <Icon v-if="item.icon" :name="item.icon" size="small" />
                  <span>{{ item.label }}</span>
                </button>
              </template>
              <slot name="footer-extra" />
            </div>
          </slot>
        </footer>
      </aside>
    </Transition>
  </Teleport>
</template>

<style lang="scss">
.ikki-sidebar {
  --ikki-sidebar-width: 280px;
  --ikki-sidebar-surface: var(--color-primary);
  --ikki-sidebar-color: var(--color-primary-text);
  --ikki-sidebar-hover-surface: var(--color-background);
  --ikki-sidebar-hover-color: var(--color-foreground);
  --ikki-sidebar-active-icon-color: var(--color-primary);
  --ikki-sidebar-footer-color: var(--color-dark);
  --ikki-sidebar-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);

  position: fixed;
  top: calc(env(safe-area-inset-top, 0px) + var(--space));
  left: calc(env(safe-area-inset-left, 0px) + var(--space));
  bottom: calc(env(safe-area-inset-bottom, 0px) + var(--space));
  width: var(--ikki-sidebar-width);
  max-width: 80vw;
  z-index: 60;
  background: var(--ikki-sidebar-surface);
  color: var(--ikki-sidebar-color);
  display: flex;
  flex-direction: column;
  border-radius: var(--border-radius-l);
  padding: 0;
  box-shadow: var(--ikki-sidebar-shadow);
  overflow: hidden;

  &__overlay {
    position: fixed;
    inset: 0;
    z-index: 59;
    background: transparent;
    cursor: default;
  }

  &__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space) var(--space) var(--space-s);
  }

  &__title {
    margin: 0;
    font-size: var(--font-size-m);
    font-weight: 700;
    color: var(--ikki-sidebar-color);
  }

  &__close {
    flex-shrink: 0;
    color: var(--ikki-sidebar-color);
  }

  &__loading,
  &__empty {
    color: var(--ikki-sidebar-color);
    opacity: 0.5;
    font-size: var(--font-size-s);
    text-align: center;
    padding: var(--space-l) var(--space);
  }

  &__list {
    height: 100%;
    flex-shrink: 1;
    overflow: auto;
    padding: 0 var(--space) var(--space);
    display: flex;
    flex-direction: column;
    gap: var(--space-m);
  }

  &__items {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__row {
    display: flex;
    align-items: center;
    gap: var(--space-s);
    padding: var(--space-s) var(--space-m);
    border-radius: var(--border-radius);
    cursor: pointer;
    color: var(--ikki-sidebar-color);
    position: relative;
    overflow: hidden;
    transition: color 0.2s ease;
    animation: ikki-sidebar-row-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both;
    animation-delay: calc(0.08s + var(--item-index, 0) * 0.03s);

    &-hover-bg {
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: var(--ikki-sidebar-hover-surface);
      opacity: 0;
      transform: scale(0.92);
      transition: opacity 0.2s ease, transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
      pointer-events: none;
    }

    &:hover,
    &:focus-within,
    &--active {
      color: var(--ikki-sidebar-hover-color);
    }

    &:hover &-hover-bg,
    &:focus-within &-hover-bg,
    &--active &-hover-bg {
      opacity: 1;
      transform: scale(1);
    }

    &--active {
      .icon,
      svg {
        color: var(--ikki-sidebar-active-icon-color);
        --icon-stroke-color: var(--ikki-sidebar-active-icon-color);
        position: relative;
        z-index: 1;
      }
    }

    &--done {
      .icon,
      svg {
        color: var(--ikki-sidebar-color);
        --icon-stroke-color: var(--ikki-sidebar-color);
      }
    }
  }

  &__row-title,
  &__row-time,
  .icon,
  svg {
    position: relative;
    z-index: 1;
  }

  &__row-title {
    font-size: var(--font-size-s);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
  }

  &__row-time {
    font-size: var(--font-size-xs);
    opacity: 0;
    transition: opacity 0.2s ease;
    flex-shrink: 0;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: var(--space-xs);
  }

  &__row-progress {
    opacity: 0.5;
  }

  &__row:hover &__row-time,
  &__row:focus-within &__row-time {
    opacity: 0.7;
  }

  &__create {
    position: sticky;
    bottom: 0;
    padding-top: var(--space-s);
    background: linear-gradient(to top, var(--ikki-sidebar-surface) 60%, transparent);
  }

  &__create-button {
    width: 100%;
    --button-color: var(--color-foreground);
    --button-color-text: var(--color-background);
  }

  &__footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-xs);
    font-size: var(--font-size-xs);
    color: var(--ikki-sidebar-footer-color);
    padding: var(--space-s) var(--space);
    border-top: 1px solid var(--ikki-sidebar-footer-color);
    flex-shrink: 0;
    border-radius: 0 0 var(--border-radius-l) var(--border-radius-l);
  }

  &__footer-row {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: var(--space-s);
  }

  &__footer-link {
    display: inline-flex;
    align-items: center;
    gap: var(--space-xs);
    background: none;
    border: none;
    color: inherit;
    font: inherit;
    cursor: pointer;
    text-decoration: none;

    &:hover {
      opacity: 0.7;
    }

    &--badge {
      font-size: var(--font-size-xxs);
      font-weight: 700;
      color: var(--color-primary);
      background: var(--color-background);
      padding: 1px 6px;
      border-radius: var(--border-radius-xs);
      line-height: 1.4;
    }
  }
}

.ikki-sidebar-enter-active {
  transition: transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease;
}

.ikki-sidebar-leave-active {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease;
}

.ikki-sidebar-enter-from {
  transform: translateX(-20%) scale(0.95);
  opacity: 0;
}

.ikki-sidebar-leave-to {
  transform: translateX(-15%) scale(0.97);
  opacity: 0;
}

.ikki-sidebar-overlay-enter-active,
.ikki-sidebar-overlay-leave-active {
  transition: opacity 0.3s ease;
}

.ikki-sidebar-overlay-enter-from,
.ikki-sidebar-overlay-leave-to {
  opacity: 0;
}

@keyframes ikki-sidebar-row-in {
  from {
    opacity: 0;
    transform: translateX(-8px) scale(0.97);
  }
}
</style>
