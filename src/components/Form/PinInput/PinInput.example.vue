<template>
  <div :class="bemm()">
      <div :class="bemm('group')">
        <label :class="bemm('label')">Verification code (4 digits)</label>
        <PinInput
          v-model="code4"
          :length="4"
          @complete="handleComplete4"
        />
        <p :class="bemm('status')">{{ status4 }}</p>
      </div>

      <div :class="bemm('group')">
        <label :class="bemm('label')">Enter your 6-digit code</label>
        <PinInput
          v-model="code6"
          :length="6"
          :show-value="true"
          auto-submit
          @complete="handleComplete6"
        />
        <p :class="bemm('status')">{{ status6 }}</p>
      </div>

      <div :class="bemm('group')">
        <label :class="bemm('label')">Masked PIN</label>
        <PinInput
          v-model="codeMasked"
          :length="4"
          :show-value="true"
          mask
          mask-character="•"
          @complete="handleCompleteMasked"
        />
        <p :class="bemm('status')">{{ statusMasked }}</p>
      </div>
    </div>
</template>

<script setup lang="ts">
import { useBemm } from 'bemm'
import { computed, ref } from 'vue'

import PinInput from './PinInput.vue'

const bemm = useBemm('t-pin-input-example')

const code4 = ref('')
const code6 = ref('')
const codeMasked = ref('')

const completed4 = ref('')
const completed6 = ref('')
const completedMasked = ref('')

const status4 = computed(() =>
  completed4.value
    ? `Verified: ${completed4.value}`
    : code4.value
      ? `${code4.value.length}/4 digits`
      : 'Tap or click to start',
)

const status6 = computed(() =>
  completed6.value
    ? `Submitted: ${completed6.value}`
    : code6.value
      ? `${code6.value.length}/6 digits`
      : 'Enter your code',
)

const statusMasked = computed(() =>
  completedMasked.value
    ? 'PIN confirmed'
    : codeMasked.value
      ? `${codeMasked.value.length}/4 entered`
      : 'Hidden PIN entry',
)

function handleComplete4(value: string) {
  completed4.value = value
}

function handleComplete6(value: string) {
  completed6.value = value
}

function handleCompleteMasked(value: string) {
  completedMasked.value = value
}
</script>

<style lang="scss">
.t-pin-input-example {
  display: grid;
  gap: var(--space-xl);

  &__group {
    display: grid;
    gap: var(--space-xs);
    justify-items: start;
  }

  &__label {
    font-weight: 600;
    font-size: 0.875em;
    color: color-mix(in srgb, var(--color-foreground), transparent 20%);
  }

  &__status {
    margin: 0;
    font-size: 0.8125em;
    color: color-mix(in srgb, var(--color-foreground), transparent 40%);
  }
}
</style>
