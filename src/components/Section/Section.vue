<template>
  <section :class="bemm('', { centered })" :data-variant="variant">
    <Container v-if="!noContainer" v-bind="containerProps">
      <slot />
    </Container>
    <slot v-else />
  </section>
</template>

<script setup lang="ts">
import { useBemm } from 'bemm'
import Container from '../Container/Container.vue'
import type { SectionProps } from './Section.model'

const props = withDefaults(defineProps<SectionProps>(), {
  noContainer: false
})

const bemm = useBemm('section')

const containerProps = {
  maxWidth: props.maxWidth,
  padding: props.padding,
  fluid: props.fluid
}
</script>

<style lang="scss">
.section {
  padding: var(--section-padding, var(--spacing-16, 4rem) 0);
  
  &--centered {
    text-align: center;
  }

  &[data-variant="hero"] {
    padding: var(--spacing-32, 8rem) 0 var(--spacing-24, 6rem);
    min-height: 80vh;
    display: flex;
    align-items: center;
  }

  &[data-variant="cta"] {
    background: var(--color-primary);
    color: var(--color-background);
    
    :deep(*) {
      color: inherit;
    }
  }

  &[data-variant="alternate"] {
    background: color-mix(in srgb, var(--color-primary), transparent 95%);
  }
}
</style>
