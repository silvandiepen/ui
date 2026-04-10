<template>
  <div :class="bemm()">
    <div :class="bemm('content')">
      <div v-if="title" :class="bemm('title')">{{ title }}</div>
      <div v-if="message" :class="bemm('message')">{{ message }}</div>
      <div :class="bemm('progress')">
        <div :class="bemm('progress-bar')" :style="{ width: `${progress}%` }" />
      </div>
      <div v-if="showPercentage" :class="bemm('percentage')">{{ Math.round(progress) }}%</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBemm } from 'bemm'

interface Props {
  title?: string
  message?: string
  progress?: number
  showPercentage?: boolean
}

withDefaults(defineProps<Props>(), {
  progress: 0,
  showPercentage: false
})

const { bemm } = useBemm('progress-dialog')
</script>

<style lang="scss">
.progress-dialog {
  padding: var(--space-l);
  min-width: 300px;
  
  &__content {
    text-align: center;
  }
  
  &__title {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    margin-bottom: var(--space-m);
    color: var(--color-foreground);
  }
  
  &__message {
    font-size: var(--font-size-m);
    color: var(--color-gray);
    margin-bottom: var(--space-l);
  }
  
  &__progress {
    width: 100%;
    height: 8px;
    background: var(--color-background-secondary);
    border-radius: var(--radius-full);
    overflow: hidden;
    margin-bottom: var(--space-m);
  }
  
  &__progress-bar {
    height: 100%;
    background: var(--color-primary);
    border-radius: var(--radius-full);
    transition: width 0.3s ease;
  }
  
  &__percentage {
    font-size: var(--font-size-s);
    color: var(--color-gray);
  }
}</style>