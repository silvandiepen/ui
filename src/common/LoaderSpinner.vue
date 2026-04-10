<template>
  <div :class="bemm()" :style="spinnerStyle" aria-hidden="true"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useBemm } from 'bemm'

const props = withDefaults(defineProps<{
  size?: number
  padding?: number
}>(), {
  size: 24,
  padding: 8
})

const bemm = useBemm('loader-spinner', { return: 'string', includeBaseClass: true })

const spinnerStyle = computed(() => ({
  '--loader-spinner-size': `${props.size}px`,
  '--loader-spinner-padding': `${props.padding}px`,
}))
</script>

<style lang="scss">
.loader-spinner {
  width: calc(var(--loader-spinner-size) + var(--loader-spinner-padding) * 2);
  height: calc(var(--loader-spinner-size) + var(--loader-spinner-padding) * 2);
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: '';
    width: var(--loader-spinner-size);
    height: var(--loader-spinner-size);
    border-radius: 999px;
    border: 2px solid color-mix(in srgb, var(--color-foreground), transparent 85%);
    border-top-color: var(--color-primary);
    animation: loaderSpinnerRotate 0.75s linear infinite;
  }
}

@keyframes loaderSpinnerRotate {
  to {
    transform: rotate(360deg);
  }
}
</style>
