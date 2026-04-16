<template>
  <InputCalendar v-model="model" v-bind="$attrs" />
</template>

<script lang="ts" setup>
import InputCalendar from '../InputCalendar/InputCalendar.vue'

type InputCalendarValue =
  | Date
  | Date[]
  | {
      start: Date | null
      end: Date | null
    }
  | null

const model = defineModel<InputCalendarValue>()

defineOptions({
  name: 'InputDate',
  inheritAttrs: true,
})
</script>
