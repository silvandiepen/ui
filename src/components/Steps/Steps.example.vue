<template>
  <div :class="bemm()">
    <div :class="bemm('section')">
      <label :class="bemm('label')">Horizontal — default status flow</label>
      <Steps :steps="basicSteps" :current-step="currentStep" />
      <div :class="bemm('controls')">
        <Button size="small" :disabled="currentStep <= 0" @click="currentStep--">Previous</Button>
        <Button size="small" :disabled="currentStep >= basicSteps.length - 1" @click="currentStep++">Next</Button>
      </div>
    </div>

    <div :class="bemm('section')">
      <label :class="bemm('label')">Horizontal — with icons and colors</label>
      <Steps :steps="iconSteps" :current-step="1" color="success" />
    </div>

    <div :class="bemm('section')">
      <label :class="bemm('label')">Vertical — signup flow</label>
      <Steps :steps="verticalSteps" :current-step="2" direction="vertical" />
    </div>

    <div :class="bemm('section')">
      <label :class="bemm('label')">Error state</label>
      <Steps :steps="errorSteps" :current-step="2" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBemm } from 'bemm'
import Steps from './Steps.vue'
import Button from '../Button/Button.vue'
import type { StepItem } from './Steps.model'

const bemm = useBemm('t-steps-example')

const currentStep = ref(1)

const basicSteps: StepItem[] = [
  { title: 'Account', description: 'Create your credentials' },
  { title: 'Profile', description: 'Tell us about yourself' },
  { title: 'Preferences', description: 'Set up your experience' },
  { title: 'Confirm', description: 'Review and submit' },
]

const iconSteps: StepItem[] = [
  { title: 'Personal', description: 'Your details', icon: 'user' },
  { title: 'Address', description: 'Where you live', icon: 'map-pin' },
  { title: 'Payment', description: 'Billing info', icon: 'credit-card' },
  { title: 'Done', description: 'All set', icon: 'check-circle' },
]

const verticalSteps: StepItem[] = [
  { title: 'Email address', description: 'We sent a verification link to your inbox.' },
  { title: 'Phone number', description: 'Enter the SMS code to confirm your number.' },
  { title: 'Identity', description: 'Upload a photo ID for verification.' },
  { title: 'Complete', description: 'Your account is ready to use.' },
]

const errorSteps: StepItem[] = [
  { title: 'Shipping', description: 'Delivery address' },
  { title: 'Payment', description: 'Billing details', status: 'error' },
  { title: 'Review', description: 'Confirm order' },
]
</script>

<style lang="scss">
.t-steps-example {
  display: grid;
  gap: var(--space-xl);

  &__section {
    display: grid;
    gap: var(--space);
  }

  &__label {
    font-weight: 600;
    font-size: 0.875em;
    color: color-mix(in srgb, var(--color-foreground), transparent 20%);
  }

  &__controls {
    display: flex;
    gap: var(--space-xs);
  }
}
</style>
