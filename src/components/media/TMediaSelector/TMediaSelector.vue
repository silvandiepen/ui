<template>
  <div :class="bemm()">
    <!-- Stub component for media selector -->
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useBemm } from 'bemm';

defineProps<{
  modelValue?: any;
  multiple?: boolean;
}>();

defineEmits<{
  'update:modelValue': [value: any];
}>();

const bemm = useBemm('media-selector');
</script>

<style lang="scss">
.media-selector {
  // Stub styles
}
</style>