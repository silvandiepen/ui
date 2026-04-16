<template>
  <Example
    :component="TabNavigation"
    name="TabNavigation"
    :prop-options="{
      variant: ['pills', 'underline'],
      size: ['small', 'medium', 'large'],
      align: ['left', 'center', 'right'],
      iconOnly: [false, true],
      vertical: [false, true],
      items: [itemsDefault, itemsWithIcons],
      value: ['overview', 'activity', 'settings'],
    }"
  />
</template>

<script setup lang="ts">
import TabNavigation from './TabNavigation.vue'

const itemsDefault = [
  {
    id: 'overview',
    label: 'Overview',
    icon: 'home',
  },
  {
    id: 'activity',
    label: 'Activity',
    icon: 'clock',
    badge: 3,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'settings',
  },
]

const itemsWithIcons = [
  {
    id: 'overview',
    label: 'Overview',
    icon: 'home',
  },
  {
    id: 'activity',
    label: 'Activity',
    icon: 'clock',
    badge: 3,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'settings',
  },
]
</script>
