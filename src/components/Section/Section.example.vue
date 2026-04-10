<template>
  <Section variant="alternate">
    <h3 :class="bemm('title')">Alternate section</h3>
    <p :class="bemm('copy')">
      This section uses the shared container wrapper and background variant.
    </p>
  </Section>
</template>

<script setup lang="ts">
import { useBemm } from 'bemm'

import Section from './Section.vue'

const bemm = useBemm('section-example')
</script>

<style lang="scss">
.section-example {
  &__title,
  &__copy {
    margin: 0;
  }

  &__copy {
    margin-top: 0.5rem;
    max-width: 36rem;
  }
}
</style>
