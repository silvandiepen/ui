<template>
  <div :class="bemm()">
    <TInputToggle
      v-model="enabled"
      label="Enable notifications"
      color="primary"
      :labels="{ on: 'On', off: 'Off' }"
    />

    <p :class="bemm('value')">Notifications: {{ enabled ? 'enabled' : 'disabled' }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBemm } from 'bemm'

import TInputToggle from './TInputToggle.vue'

const bemm = useBemm('t-input-toggle-example')

const enabled = ref(true)
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
