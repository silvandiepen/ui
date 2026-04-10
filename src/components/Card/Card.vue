<template>
  <div :class="blockClasses" :data-variant="variant" :style="styles">
    <div v-if="badge" :class="bemm('badge')" :style="badgeStyles">
      {{ badge }}
    </div>

    <!-- Header -->
    <div v-if="showHeader" :class="[bemm('header'), noHeaderPadding && bemm('header', 'no-padding')]">
      <div v-if="title || description" :class="bemm('headline')">
        <h3 v-if="title" :class="bemm('title')">{{ title }}</h3>
        <p v-if="description" :class="bemm('description')">
          {{ description }}
        </p>
      </div>
      <slot v-else name="header" />

      <Actions
        v-if="headerActions?.length"
        :actions="headerActions"
        :icon-only="true"
        size="small"
        :class="bemm('header-actions')"
      />
    </div>

    <!-- Content -->
    <div :class="[bemm('content'), noContentPadding && bemm('content', 'no-padding')]">
      <slot />
    </div>

    <!-- Footer -->
    <div v-if="showFooter" :class="[bemm('footer'), noFooterPadding && bemm('footer', 'no-padding')]">
      <slot name="footer">
        <Actions
          v-if="footerActions?.length"
          :actions="footerActions"
          align="end"
          gap="m"
          :class="bemm('footer-actions')"
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
.card {
  background: var(--card-background-color, var(--color-background));
  border: 1px solid var(--card-border-color, var(--color-accent));
  color: var(--card-text-color, var(--color-foreground));
  border-radius: var(--card-radius, var(--spacing-5, 20px));
  position: relative;
  transition: all 0.3s ease;
  overflow: var(--card-overflow, visible);
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
      transform: translateY(calc(var(--spacing-1, 0.25rem) * -1.25));
      box-shadow: 0 8px 40px color-mix(in srgb, var(--color-foreground), transparent 88%);
    }
  }

  &--featured {
    border-color: var(--color-primary);
    border-width: 2px;
  }

  &[data-variant="elevated"] {
    box-shadow: 0 4px 20px color-mix(in srgb, var(--color-foreground), transparent 95%);
  }

  &[data-variant="ghost"] {
    background: transparent;
    border-color: transparent;
  }

  &__badge {
    position: absolute;
    top: calc(var(--spacing-3, 0.75rem) * -1);
    left: 50%;
    transform: translateX(-50%);
    background: var(--color-primary);
    color: var(--color-background);
    padding: var(--spacing-1, 0.25rem) var(--spacing-3, 0.75rem);
    border-radius: var(--spacing-1, 0.25rem);
    font-size: var(--font-size-m, 0.8rem);
    font-weight: 600;
    z-index: 1;
  }

  // When card has no padding, apply default padding to children
  &--no-padding {
    padding: 0;

    .card__content {
      padding: var(--card-padding, var(--space-m, 2rem));
    }
  }

  // Content wrapper - always has padding unless explicitly removed
  &__content {
    flex: 1;
    padding: var(--card-padding, var(--space-m, 2rem));

    &--no-padding {
      padding: 0;
    }
  }

  // Header styles
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space, 1rem);
    padding: var(--card-header-padding, var(--space) var(--space));
    border-bottom: 1px solid var(--card-border-color, var(--color-accent));

    &--no-padding {
      padding: 0;
    }
  }

  &__title {
    margin: 0;
    font-size: var(--card-title-size, var(--font-size-l, 1.25rem));
    font-weight: var(--card-title-weight, 600);
    color: var(--card-title-color, var(--color-foreground));
    flex: 1;
  }

  &__headline {
    flex: 1;
    min-width: 0;
  }

  &__description {
    margin: var(--space-xs, 0.5rem) 0 0;
    color: var(--card-description-color, var(--color-foreground-muted));
    font-size: var(--card-description-size, var(--font-size-s, 0.9rem));
    line-height: 1.5;
  }

  &__header-actions {
    flex-shrink: 0;
  }

  // Footer styles
  &__footer {
    display: flex;
    align-items: center;
    padding: var(--card-footer-padding, var(--spacing-6, 1.5rem) var(--space-m, 2rem));
    border-top: 1px solid var(--card-border-color, var(--color-accent));

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
      padding-top: var(--space-m, 2rem);
    }

    &.card--no-padding .card__content {
      padding-top: var(--card-padding, var(--space-m, 2rem));
    }
  }

  &--has-footer {
    .card__content {
      // Remove bottom padding when footer is present
      padding-bottom: var(--space-m, 2rem);
    }

    &.card--no-padding .card__content {
      padding-bottom: var(--card-padding, var(--space-m, 2rem));
    }
  }

  // Both header and footer
  &--has-header.card--has-footer {
    .card__content {
      padding: var(--space-m, 2rem);
    }
  }
}
</style>
