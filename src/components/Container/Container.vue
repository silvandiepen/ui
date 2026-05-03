<template>
  <div
    :class="bemm('', ['', fluid ? 'fluid' : ''])"
    :style="containerStyle"
    :data-test-id="testId"
  >
    <header v-if="showHeader && (title || subtitle || headerActions?.length || $slots.header || back || next)"
      :class="bemm('header', { 'no-padding': disableHeaderPadding })"
      :data-test-id="getTestId(props.testId, 'header')">
      <Button v-if="back" :variant="ButtonVariant.GHOST" size="small" :icon="Icons.ARROWS_ARROW_LEFT" @click="handleBack"
        :class="bemm('back-button')" :test-id="getTestId(props.testId, 'back')" />

      <Button v-if="next" :variant="ButtonVariant.GHOST" size="small" :icon="Icons.ARROWS_ARROW_RIGHT" @click="handleNext"
        :class="bemm('next-button')" :test-id="getTestId(props.testId, 'next')" />
      <div :class="bemm('header-left')" :data-test-id="getTestId(props.testId, 'header-left')">
        <div :class="bemm('header-content')" :data-test-id="getTestId(props.testId, 'header-content')">
          <div v-if="title || subtitle" :class="bemm('header-text')" :data-test-id="getTestId(props.testId, 'header-text')">
            <h1 v-if="title" :class="bemm('title')" :data-test-id="getTestId(props.testId, 'title')">{{ title }}</h1>
            <p v-if="subtitle" :class="bemm('subtitle')" :data-test-id="getTestId(props.testId, 'subtitle')">{{ subtitle }}</p>
          </div>
          <div v-if="$slots.header" :class="bemm('header-slot')" :data-test-id="getTestId(props.testId, 'header-slot')">
            <slot name="header" />
          </div>
        </div>
      </div>
      <div :class="bemm('header-right')" :data-test-id="getTestId(props.testId, 'header-right')">
        <Actions v-if="headerActions?.length" :actions="headerActions"
          :size="headerActionSize"
          align="end"
          gap="s"
          :class="bemm('header-actions')"
          :test-id="getTestId(props.testId, 'header-actions')" />
      </div>
    </header>

    <main
      :class="bemm('content', ['', disableContentPadding ? 'no-padding' : ''])"
      :data-test-id="getTestId(props.testId, 'content')"
    >
      <slot />
    </main>

    <footer v-if="showFooter && (footerActions?.length || $slots.footer)"
      :class="bemm('footer', { 'no-padding': disableFooterPadding })"
      :data-test-id="getTestId(props.testId, 'footer')">
      <slot name="footer" />
      <Actions v-if="footerActions?.length" :actions="footerActions" layout="horizontal" alignment="center"
        :class="bemm('footer-actions')"
        :test-id="getTestId(props.testId, 'footer-actions')" />
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { useBemm } from 'bemm'
import type { ContainerProps } from './Container.model'
import Actions from '../Actions/Actions.vue'
import Button from '../Button/Button.vue'
import { ButtonVariant } from '../Button/Button.model'
import { Icons } from 'open-icon'
import { getTestId } from '../../utils/testId'

const props = withDefaults(defineProps<ContainerProps>(), {
  showHeader: true,
  showFooter: true,
  headerActionSize: 'small',
  noPadding: false,
  noHeaderPadding: false,
  noContentPadding: false,
  noFooterPadding: false
})
const bemm = useBemm('container',{
  includeBaseClass: true
})

const disableHeaderPadding = computed(() => props.noPadding || props.noHeaderPadding)
const disableContentPadding = computed(() => props.noPadding || props.noContentPadding)
const disableFooterPadding = computed(() => props.noPadding || props.noFooterPadding)

// Try to get router from Vue app context
const router = inject<any>('router', null)

// Handle back navigation
const handleBack = () => {
  if (typeof props.back === 'function') {
    props.back()
  } else if (typeof props.back === 'string' && router) {
    router.push(props.back)
  } else if (props.back === true) {
    if (router) {
      router.back()
    } else {
      // Fallback to browser history
      window.history.back()
    }
  }
}

// Handle next navigation
const handleNext = () => {
  if (typeof props.next === 'function') {
    props.next()
  } else if (typeof props.next === 'string' && router) {
    router.push(props.next)
  } else if (props.next === true) {
    if (router) {
      router.forward()
    } else {
      // Fallback to browser history
      window.history.forward()
    }
  }
}

const containerStyle = computed(() => ({
  '--int-container-max-width': props.maxWidth || 'var(--container-max-width, var(--max-content-width, 1200px))',
  '--int-container-padding': props.padding || 'var(--container-padding, var(--space-l, 2rem) var(--spacing, 2rem))'
}))
</script>

<style lang="scss">
.container {
  width: 100%;
  max-width: var(--int-container-max-width);
  margin: 0 auto;
  display: flex;
  flex-direction: column;

  &--fluid {
    max-width: 100%;
  }

  &__header {
    padding: var(--int-container-padding);
    border-bottom: 1px solid var(--color-border);
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: start;
    column-gap: var(--space-l);
    row-gap: var(--space);
    background-image: linear-gradient(to left bottom, color-mix(in srgb, var(--color-secondary), transparent 90%), transparent 50%);
    position: relative;

    &--no-padding {
      padding: 0;
    }
  }

  &__header-left {
    display: flex;
    align-items: center;
    gap: var(--space-m);
    flex: 1;
    min-width: 0;
  }

  &__header-content {
    display: flex;
    flex-direction: column;
    gap: var(--space-m);
    flex: 1;
  }

  &__header-right {
    display: flex;
    align-items: center;
    gap: var(--space-m);
    flex-shrink: 0;
    justify-self: end;
    align-self: start;
    max-width: 100%;
  }

  &__back-button,
  &__next-button {
  position: absolute;
  top: var(--space-l);
    flex-shrink: 0;
  }
  &__back-button{
    left: var(--space-l);
  }

  &__next-button{
    right: var(--space-l);
  }

  &__header-text {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  &__header-slot {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-s);
  }

  &__title {
    margin: 0;
    font-size: clamp(2.5rem, 4vw, 4rem);
    font-weight: var(--font-weight-semibold);
    color: var(--color-foreground);
    line-height: 0.95;
    letter-spacing: -0.04em;
  }

  &__subtitle {
    margin: 0;
    font-size: var(--font-size);
    color: var(--color-text-secondary);
    opacity: .5;
    max-width: 48rem;
  }

  &__header-actions {
    flex-shrink: 0;
    flex-wrap: wrap;
  }

  &__content {
    flex: 1;
    padding: var(--int-container-padding);
    display: flex;
    flex-direction: column;
    gap: var(--space);

    &--no-padding {
      padding: 0;
    }
  }

  &__footer {
    padding: var(--int-container-padding);
    border-top: 1px solid var(--color-border);
    display: flex;
    flex-direction: column;
    gap: var(--space-m);
    align-items: center;

    &--no-padding {
      padding: 0;
    }
  }

  &__footer-actions {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .container {
    &__header {
      grid-template-columns: 1fr;
    }

    &__header-right {
      width: 100%;
      justify-self: stretch;
    }

    &__header-actions {
      justify-content: flex-start;
    }
  }
}
</style>
