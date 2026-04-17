<template>
  <Example
    :component="Skeleton"
    name="Skeleton"
    :prop-options="{
      shape: ['rect', 'pill', 'circle'],
    }"
  />
</template>

<script setup lang="ts">
import Skeleton from './Skeleton.vue'
</script>
