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
@use '../../styles/mixins' as m;

.section {
  @include m.component-props((
    'padding':           'var(--space-xl) 0',
    'padding-hero':      'var(--space-xxl) 0 var(--space-xxl)',
    'hero-min-height':   '80vh',
    'cta-background':    'var(--color-primary)',
    'cta-color':         'var(--color-background)',
    'alternate-background': 'color-mix(in srgb, var(--color-primary), transparent 95%)',
  ), 'section');

  padding: var(--int-section-padding);

  &--centered {
    text-align: center;
  }

  &[data-variant="hero"] {
    padding: var(--int-section-padding-hero);
    min-height: var(--int-section-hero-min-height);
    display: flex;
    align-items: center;
  }

  &[data-variant="cta"] {
    background: var(--int-section-cta-background);
    color: var(--int-section-cta-color);

    :deep(*) {
      color: inherit;
    }
  }

  &[data-variant="alternate"] {
    background: var(--int-section-alternate-background);
  }
}
</style>
