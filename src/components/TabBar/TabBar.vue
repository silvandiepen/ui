<template>
  <div :class="bemm('', { variant })">
    <TabNavigation
      :class="bemm('nav')"
      :items="navigationItems"
      :value="modelValue"
      @input="handleTabInput"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useBemm } from 'bemm'
import TabNavigation from '../Tabs/TabNavigation.vue'
import type { TabNavigationItem } from '../Tabs/Tabs.model'
import type { TabBarEmits, TabBarProps } from './TabBar.model'

const props = withDefaults(defineProps<TabBarProps>(), {
  variant: 'default'
})

const emit = defineEmits<TabBarEmits>()

const bemm = useBemm('tab-bar')

const navigationItems = computed<TabNavigationItem[]>(() =>
  props.tabs.map((tab) => ({
    id: tab.value,
    label: tab.label,
    icon: tab.icon,
    badge: tab.badge,
    disabled: tab.disabled
  }))
)

function handleTabInput(value: string | number) {
  const nextValue = String(value)

  if (props.modelValue !== nextValue) {
    emit('update:modelValue', nextValue)
    emit('change', nextValue)
  }
}
</script>

<style lang="scss">
.tab-bar {
  display: block;

  &__nav.ui-tab-nav {
    width: 100%;
    max-width: 100%;
    margin: 0;
  }

  &--default .ui-tab-nav {
    background: color-mix(in srgb, var(--color-foreground), transparent 95%);
  }

  &--pills .ui-tab-nav {
    padding: var(--space-xs);
    background: color-mix(in srgb, var(--color-primary), transparent 92%);
  }

  &--pills .ui-tab-nav__button--active {
    color: var(--color-primary-contrast, var(--color-primary-text));
  }

  &--underline .ui-tab-nav {
    padding: 0;
    border-bottom: 1px solid var(--color-border);
    border-radius: 0;
    background: transparent;
  }

  &--underline .ui-tab-nav__button {
    padding: var(--space-m) var(--space-s);
    border-radius: 0;
  }

  &--underline .ui-tab-nav__button--active {
    color: var(--color-foreground);
  }

  &--underline .ui-tab-nav__indicator {
    top: auto;
    bottom: -1px;
    height: 2px;
    border-radius: 999em;
  }

  &--underline .ui-tab-nav__hover {
    inset-block: 0.35rem;
  }

  &--underline .ui-tab-nav__button-badge {
    background: color-mix(in srgb, var(--color-foreground), transparent 90%);
  }
}
</style>
