<template>
  <Container
      title="Shared UI library"
      subtitle="Layout wrapper with header, content, and footer regions."
    >
      <p :class="bemm('copy')">
        This example shows the container header and a bounded content area.
      </p>
    </Container>
</template>

<script setup lang="ts">
import { useBemm } from 'bemm'

import Container from './Container.vue'

const bemm = useBemm('container-example')
</script>

<style lang="scss">
.container-example {
  &__copy {
    margin: 0;
    max-width: 32rem;
  }
}
</style>
