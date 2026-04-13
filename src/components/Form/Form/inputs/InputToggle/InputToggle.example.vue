<template>
  <div :class="bemm()">
    <InputToggle
      v-model="enabled"
      label="Enable notifications"
      color="primary"
      :labels="{ on: 'On', off: 'Off' }"
    />

    <InputToggle
      v-model="density"
      label="Density"
      :options="densityOptions"
    />

    <p :class="bemm('value')">Notifications: {{ enabled ? 'enabled' : 'disabled' }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBemm } from 'bemm'

import InputToggle from './InputToggle.vue'

const bemm = useBemm('t-input-toggle-example')

const enabled = ref(true)
const density = ref<'comfortable' | 'compact'>('comfortable')
const densityOptions = [
  { label: 'Comfortable', value: 'comfortable', icon: 'grid' },
  { label: 'Compact', value: 'compact', icon: 'menu' },
]
</script>

<style lang="scss">
.t-input-toggle-example {
  display: grid;
  gap: var(--space);

  &__value {
    margin: 0;
  }
}
</style>
