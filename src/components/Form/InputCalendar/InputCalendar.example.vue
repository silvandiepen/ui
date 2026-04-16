<template>
  <div :class="bemm()">
    <InputCalendar v-model="date" label="Single month" />
    <InputCalendar v-model="range" label="Two months (range)" :months="2" :options="{ selectionMode: 'range' }" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBemm } from 'bemm'
import InputCalendar from './InputCalendar.vue'

const bemm = useBemm('input-calendar-example')

const date = ref(null)
const range = ref(null)
</script>

<style lang="scss">
.input-calendar-example {
  display: grid;
  gap: var(--space);
  max-width: 24em;
}
</style>
