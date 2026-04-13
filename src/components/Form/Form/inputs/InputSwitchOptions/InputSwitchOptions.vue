<template>
  <InputSwitch
    v-bind="props"
    v-model="model"
    :class="bemm()"
    @change="emit('change', $event)"
    @touched="emit('touched', $event)"
  />
</template>

<script setup lang="ts">
import { useBemm } from 'bemm'
import InputSwitch from '../InputSwitch/InputSwitch.vue'
import type {
  InputSwitchOptionsEmits,
  InputSwitchOptionsProps,
} from './InputSwitchOptions.model'
import { Size } from '../../../../../types'

const props = withDefaults(defineProps<InputSwitchOptionsProps>(), {
  label: '',
  options: () => [],
  size: Size.MEDIUM,
  disabled: false,
  error: () => [],
  required: false,
})

const emit = defineEmits<InputSwitchOptionsEmits>()
const model = defineModel<string | number | boolean>()

const bemm = useBemm('input-switch-options')
</script>
