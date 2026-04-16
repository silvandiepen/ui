<template>
  <Example>
    <div :class="bemm()">
      <TabBar v-model="activeTab" :tabs="tabs" :variant="variant" />
      <p :class="bemm('copy')">Current tab: {{ activeTab }}</p>
    </div>
  </Example>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBemm } from 'bemm'

import TabBar from './TabBar.vue'

const bemm = useBemm('tab-bar-example')

const activeTab = ref('overview')
const variant = ref<'default' | 'pills' | 'underline' | 'minimal'>('minimal')

const tabs = [
  {
    label: 'Overview',
    value: 'overview',
  },
  {
    label: 'Activity',
    value: 'activity',
    badge: 3,
  },
  {
    label: 'Settings',
    value: 'settings',
  },
]
</script>

<style lang="scss">
.tab-bar-example {
  display: grid;
  gap: var(--space);

  &__copy {
    margin: 0;
    color: var(--color-foreground-muted, color-mix(in srgb, var(--color-foreground), transparent 35%));
  }
}
</style>
