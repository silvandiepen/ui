<template>
  <div :class="bemm()">
      <InputSwitch
        v-model="value"
        label="View mode"
        :items="viewItems"
      />

      <InputSwitch
        v-model="plan"
        label="Plan"
        color="secondary"
        :items="planItems"
      />

      <InputSwitch
        v-model="align"
        label="Alignment"
        color="success"
        :items="alignItems"
      />

      <p :class="bemm('value')">View: {{ value }} | Plan: {{ plan }} | Align: {{ align }}</p>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBemm } from 'bemm'
import { Icons } from 'open-icon'
import InputSwitch from './InputSwitch.vue'

const bemm = useBemm('t-input-switch-example')

const value = ref('grid')
const plan = ref('pro')
const align = ref('left')

const viewItems = [
  { label: 'Grid', value: 'grid', icon: Icons.UI_BOARD },
  { label: 'List', value: 'list', icon: Icons.FOOD_DRINKS_HAMBURGER },
  { label: 'Table', value: 'table', icon: Icons.UI_TABLES },
]

const planItems = [
  { label: 'Free', value: 'free' },
  { label: 'Pro', value: 'pro' },
  { label: 'Enterprise', value: 'enterprise' },
]

const alignItems = [
  { label: '', value: 'left', icon: Icons.UI_TEXT_ALIGN_LEFT },
  { label: '', value: 'center', icon: Icons.UI_TEXT_ALIGN_CENTER },
  { label: '', value: 'right', icon: Icons.UI_TEXT_ALIGN_RIGHT },
]
</script>

<style lang="scss">
.t-input-switch-example {
  display: grid;
  gap: var(--space);

  &__value {
    margin: 0;
  }
}
</style>
