<template>
  <section
    :class="bemm('', { centered })"
    :data-variant="variant"
    :data-test-id="testId"
  >
    <Container
      v-if="!noContainer"
      v-bind="containerProps"
      :test-id="getTestId(props.testId, 'container')"
    >
      <slot />
    </Container>
    <slot v-else />
  </section>
</template>

<script setup lang="ts">
import { useBemm } from 'bemm'
import Container from '../Container/Container.vue'
import type { SectionProps } from './Section.model'
import { getTestId } from '../../utils/testId'

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
  padding: m.p('padding', var(--space-xl) 0);

  &--centered {
    text-align: center;
  }

  &[data-variant="hero"] {
    padding: m.p('padding-hero', var(--space-xxl) 0 var(--space-xxl));
    min-height: m.p('hero-min-height', 80vh);
    display: flex;
    align-items: center;
  }

  &[data-variant="cta"] {
    background: m.p('cta-background', var(--color-primary));
    color: m.p('cta-color', var(--color-background));

    :deep(*) {
      color: inherit;
    }
  }

  &[data-variant="alternate"] {
    background: m.p('alternate-background', color-mix(in srgb, var(--color-primary), transparent 95%));
  }
}
</style>
