<template>
  <InputToggle
    v-bind="props"
    v-model="model"
    @change="emit('change', $event)"
    @touched="emit('touched', $event)"
  />
</template>

<script setup lang="ts">
import InputToggle from '../Form/inputs/InputToggle/InputToggle.vue'

import type { ToggleEmits, ToggleProps, ToggleValue } from './Toggle.model'

defineOptions({
  name: 'Toggle',
})

const props = defineProps<ToggleProps>()
const model = defineModel<ToggleValue>({
  default: false,
})
const emit = defineEmits<ToggleEmits>()
</script>
