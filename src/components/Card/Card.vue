<template>
  <div
    :class="blockClasses"
    :data-variant="variant"
    :style="styles"
    :data-test-id="testId"
  >
    <div
      v-if="badge"
      :class="bemm('badge')"
      :style="badgeStyles"
      :data-test-id="getTestId(props.testId, 'badge')"
    >
      {{ badge }}
    </div>

    <!-- Header -->
    <div
      v-if="showHeader"
      :class="[bemm('header'), noHeaderPadding && bemm('header', 'no-padding')]"
      :data-test-id="getTestId(props.testId, 'header')"
    >
      <div
        v-if="title || description"
        :class="bemm('headline')"
        :data-test-id="getTestId(props.testId, 'headline')"
      >
        <h3
          v-if="title"
          :class="bemm('title')"
          :data-test-id="getTestId(props.testId, 'title')"
        >{{ title }}</h3>
        <p
          v-if="description"
          :class="bemm('description')"
          :data-test-id="getTestId(props.testId, 'description')"
        >
          {{ description }}
        </p>
      </div>
      <slot v-else name="header" />

      <slot name="actions"></slot>
      <Actions
        v-if="headerActions?.length"
        :actions="headerActions"
        :icon-only="true"
        size="small"
        :class="bemm('header-actions')"
        :test-id="getTestId(props.testId, 'header-actions')"
      />
    </div>

    <!-- Content -->
    <div
      :class="[bemm('content'), noContentPadding && bemm('content', 'no-padding')]"
      :data-test-id="getTestId(props.testId, 'content')"
    >
      <slot />
    </div>

    <!-- Footer -->
    <div
      v-if="showFooter"
      :class="[bemm('footer'), noFooterPadding && bemm('footer', 'no-padding')]"
      :data-test-id="getTestId(props.testId, 'footer')"
    >
      <slot name="footer">
        <Actions
          v-if="footerActions?.length"
          :actions="footerActions"
          align="end"
          gap="m"
          :class="bemm('footer-actions')"
          :test-id="getTestId(props.testId, 'footer-actions')"
        />
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBemm } from 'bemm'
import { computed } from 'vue'
import type { CardProps } from './Card.model'
import Actions from '../Actions/Actions.vue'
import { getTestId } from '../../utils/testId'

const props = withDefaults(defineProps<CardProps>(), {
  variant: 'default',
  noPadding: false,
  noHeaderPadding: false,
  noContentPadding: false,
  noFooterPadding: false
})

const slots = defineSlots<{
  default: any
  header?: any
  actions?: any
  footer?: any
}>()

const bemm = useBemm('card')

// Determine if header should be shown
const showHeader = computed(() => {
  return props.title || props.description || slots.header || (props.headerActions && props.headerActions.length > 0)
})

// Determine if footer should be shown
const showFooter = computed(() => {
  return slots.footer || (props.footerActions && props.footerActions.length > 0)
})

const blockClasses = computed(()=>{
  const classes = [
    bemm(),
    props.variant && bemm('',props.variant),
    props.color && bemm('',props.color),
    props.color && bemm('','has-color'),
    props.featured && bemm('','featured'),
    props.hoverable && bemm('', 'hoverable'),
    props.noPadding && bemm('', 'no-padding'),
    showHeader.value && bemm('', 'has-header'),
    showFooter.value && bemm('', 'has-footer')
  ]

  return classes.filter(Boolean);
})

const styles = computed(()=>{
  if(props.color){
    return {'--card-color': `var(--color-${props.color})` }
  }
  return {}
})

const badgeStyles = computed(() => {
  if (props.badgeColor) {
    return {
      backgroundColor: props.badgeColor.startsWith('#') || props.badgeColor.startsWith('var(')
        ? props.badgeColor
        : `var(--color-${props.badgeColor})`,
      color: 'white'
    }
  }
  return {}
})
</script>

<style lang="scss">
@use '../../styles/mixins' as m;

.card {
  background: m.p('background-color', var(--color-background));
  border: 1px solid m.p('border-color', color-mix(in srgb, var(--color-foreground), transparent 75%));
  color: m.p('text-color', var(--color-foreground));
  border-radius: m.p('radius', var(--border-radius));
  position: relative;
  transition: all 0.3s ease;
  overflow: m.p('overflow', visible);
  display: flex;
  flex-direction: column;

  &--has-color{
    --card-background-color: color-mix(in srgb , var(--card-color), transparent 90%);
    --card-border-color: color-mix(in srgb , var(--card-color), transparent 25%);
    --card-text-color: color-mix(in srgb , var(--card-color), transparent 0%);
  }


  &--hoverable {
    cursor: pointer;

    &:hover {
      transform: translateY(calc(var(--space-xs) * -1.25));
      box-shadow: 0 8px 40px color-mix(in srgb, var(--color-foreground), transparent 88%);
    }
  }

  &--featured {
    border-color: var(--color-primary);
    border-width: 2px;
  }

  &--elevated{
    border: none;
    box-shadow: m.p('shadow', 0 4px 20px color-mix(in srgb, var(--color-foreground), transparent 95%));
  }

  &[data-variant="elevated"] {
    box-shadow: m.p('shadow', 0 4px 20px color-mix(in srgb, var(--color-foreground), transparent 95%));
  }

  &[data-variant="ghost"] {
    background: transparent;
    border-color: transparent;
  }

  &__badge {
    position: absolute;
    top: calc(var(--space-s) * -1);
    left: 50%;
    transform: translateX(-50%);
    background: var(--color-primary);
    color: var(--color-background);
    padding: var(--space-xs) var(--space-s);
    border-radius: var(--border-radius-s);
    font-size: var(--font-size-m, 0.8rem);
    font-weight: 600;
    z-index: 1;
  }

  // When card has no padding, apply default padding to children
  &--no-padding {
    padding: 0;

    .card__content {
      padding: m.p('padding', var(--space-m));
    }
  }

  // Content wrapper - always has padding unless explicitly removed
  &__content {
    flex: 1;
    padding: m.p('padding', var(--space-m));

    &--no-padding {
      padding: 0;
    }
  }

  // Header styles
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space);
    padding: m.p('header-padding', var(--space) var(--space));
    border-bottom: 1px solid m.p('header-border-color', color-mix(in srgb, var(--color-foreground), transparent 85%));
    background-color: var(--card-header-background, transparent);
    border-radius: m.p('radius', var(--border-radius)) m.p('radius', var(--border-radius)) 0 0;

    &--no-padding {
      padding: 0;
    }
  }

  &__title {
    margin: 0;
    font-size: m.p('title-size', var(--font-size-l));
    font-weight: m.p('title-weight', 600);
    color: m.p('title-color', var(--color-foreground));
    flex: 1;
  }

  &__headline {
    flex: 1;
    min-width: 0;
  }

  &__description {
    margin: var(--space-xs) 0 0;
    color: m.p('description-color', var(--color-foreground-muted));
    font-size: m.p('description-size', var(--font-size-s));
    line-height: 1.5;
  }

  &__header-actions {
    flex-shrink: 0;
  }

  // Footer styles
  &__footer {
    display: flex;
    align-items: center;
    padding: m.p('footer-padding', var(--space-l) var(--space-m));
    border-top: 1px solid m.p('border-color', color-mix(in srgb, var(--color-foreground), transparent 75%));

    &--no-padding {
      padding: 0;
    }
  }

  &__footer-actions {
    width: 100%;
  }

  // Adjustments when header/footer are present
  &--has-header {
    .card__content {
      // Remove top padding when header is present
      padding-top: var(--space-m);
    }

    &.card--no-padding .card__content {
      padding-top: m.p('padding', var(--space-m));
    }
  }

  &--has-footer {
    .card__content {
      // Remove bottom padding when footer is present
      padding-bottom: var(--space-m);
    }

    &.card--no-padding .card__content {
      padding-bottom: m.p('padding', var(--space-m));
    }
  }

  // Both header and footer
  &--has-header.card--has-footer {
    .card__content {
      padding: var(--space-m);
    }
  }
}
</style>
