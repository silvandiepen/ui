<template>
  <div :class="bemm()">
    <div :class="bemm('controls')">
      <div :class="bemm('modes')">
        <button
          v-for="mode in selectionModes"
          :key="mode"
          type="button"
          :class="bemm('mode', { active: selectionMode === mode })"
          @click="setSelectionMode(mode)"
        >
          {{ mode }}
        </button>
      </div>

      <div :class="bemm('toggles')">
        <button
          v-for="m in monthOptions"
          :key="m"
          type="button"
          :class="bemm('mode', { active: months === m })"
          @click="months = m"
        >
          {{ m }} month{{ m > 1 ? 's' : '' }}
        </button>
      </div>
    </div>

    <DatePicker
      v-model="value"
      :selection-mode="selectionMode"
      :action-buttons="actionButtons"
      :months="months"
    />

    <pre :class="bemm('value')">{{ serializedValue }}</pre>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useBemm } from 'bemm'

import DatePicker from './DatePicker.vue'
import type { DatePickerModelValue, DatePickerMonths, DatePickerSelectionMode } from './DatePicker.model'

const bemm = useBemm('date-picker-example')

const selectionModes: DatePickerSelectionMode[] = ['single', 'multiple', 'range']
const monthOptions: DatePickerMonths[] = [1, 2]
const selectionMode = ref<DatePickerSelectionMode>('single')
const months = ref<DatePickerMonths>(1)
const value = ref<DatePickerModelValue>(null)

const actionButtons = [
  { id: 'today', label: 'Today', action: 'today' as const },
  { id: 'clear', label: 'Clear', action: 'clear' as const },
]

const serializedValue = computed(() => JSON.stringify(value.value, null, 2))

const setSelectionMode = (mode: DatePickerSelectionMode) => {
  selectionMode.value = mode

  if (mode === 'single') {
    value.value = null
    return
  }

  if (mode === 'multiple') {
    value.value = []
    return
  }

  value.value = { start: undefined, end: undefined }
}
</script>

<style lang="scss">
.date-picker-example {
  display: grid;
  gap: var(--space-s);

  &__controls {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-s);
    align-items: center;
  }

  &__modes,
  &__toggles {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs);
  }

  &__mode {
    border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 78%);
    background: var(--color-background);
    color: var(--color-foreground);
    border-radius: var(--border-radius-s);
    padding: 0.35rem 0.55rem;
    cursor: pointer;
    text-transform: capitalize;

    &--active {
      border-color: var(--color-primary);
      background: color-mix(in srgb, var(--color-primary), transparent 90%);
    }
  }

  &__value {
    margin: 0;
    padding: var(--space-xs) var(--space-s);
    font-size: var(--font-size-s);
    border-radius: var(--border-radius-s);
    background: color-mix(in srgb, var(--color-foreground), transparent 94%);
  }
}
</style>
