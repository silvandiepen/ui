<template>
  <Example>
    <div :class="bemm()">
      <TabNavigation
        :items="items"
        :value="activeTab"
        @input="handleInput"
      />
      <p :class="bemm('copy')">Current tab: {{ activeTab }}</p>
    </div>
  </Example>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBemm } from 'bemm'

import TabNavigation from './TabNavigation.vue'

const bemm = useBemm('tab-navigation-example')

const activeTab = ref<string | number>('overview')

const items = [
  {
    id: 'overview',
    label: 'Overview',
  },
  {
    id: 'activity',
    label: 'Activity',
    badge: 3,
  },
  {
    id: 'settings',
    label: 'Settings',
  },
]

function handleInput(value: string | number) {
  activeTab.value = value
}
</script>

<style lang="scss">
.tab-navigation-example {
  display: grid;
  gap: var(--space);

  &__copy {
    margin: 0;
    color: color-mix(in srgb, var(--color-foreground), transparent 35%);
  }
}
</style>
