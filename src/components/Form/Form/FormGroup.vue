<template>
  <div :class="groupClasses" :style="groupStyles">
    <div v-if="label || collapsible" :class="bemm('header')" @click="handleHeaderClick">
      <h3 v-if="label" :class="bemm('label')">{{ label }}</h3>
      <button
        v-if="collapsible"
        type="button"
        :class="bemm('toggle')"
        :aria-expanded="!isCollapsed"
        :aria-label="isCollapsed ? 'Expand group' : 'Collapse group'"
      >
        <Icon :name="isCollapsed ? 'chevron-right' : 'chevron-down'" />
      </button>
    </div>

    <p v-if="description && !isCollapsed" :class="bemm('description')">
      {{ description }}
    </p>

    <div v-show="!isCollapsed" :class="bemm('content')">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useBemm } from 'bemm'
import Icon from '../../Icon/Icon.vue'
import type { FormGroupProps } from './Form.model'

const props = withDefaults(defineProps<FormGroupProps>(), {
  direction: 'column',
  gap: 'var(--space)',
  wrap: false,
  align: 'stretch',
  justify: 'flex-start',
  padding: '0',
  bordered: false,
  collapsible: false,
  collapsed: false
})

const bemm = useBemm('form-group')

// State
const isCollapsed = ref(props.collapsed)

// Computed
const groupClasses = computed(() => {
  return bemm('', {
    bordered: props.bordered,
    row: props.direction === 'row',
    wrap: props.wrap,
    collapsible: props.collapsible,
    collapsed: isCollapsed.value
  })
})

const groupStyles = computed(() => ({
  '--form-group-direction': props.direction,
  '--form-group-gap': props.gap,
  '--form-group-wrap': props.wrap ? 'wrap' : 'nowrap',
  '--form-group-align': props.align,
  '--form-group-justify': props.justify,
  '--form-group-padding': props.padding,
}))

// Methods
const handleHeaderClick = () => {
  if (props.collapsible) {
    isCollapsed.value = !isCollapsed.value
  }
}
</script>

<style lang="scss">
.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--form-group-gap, var(--space));
  padding: var(--form-group-padding, 0);
  border: 1px solid transparent;
  border-radius: var(--form-group-border-radius, var(--border-radius));
  background: transparent;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space);

    &--clickable {
      cursor: pointer;
    }
  }

  &__label {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--color-foreground);
  }

  &__toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    padding: 0;
    border: none;
    background: transparent;
    color: var(--color-text-secondary);
    cursor: pointer;
    border-radius: var(--border-radius-s);
    transition: all 0.2s ease;

    &:hover {
      background: var(--color-background-hover);
      color: var(--color-foreground);
    }

    &:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }
  }

  &__description {
    margin: 0;
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    line-height: 1.5;
  }

  &__content {
    display: flex;
    flex-direction: var(--form-group-direction, column);
    flex-wrap: var(--form-group-wrap, nowrap);
    align-items: var(--form-group-align, stretch);
    justify-content: var(--form-group-justify, flex-start);
    gap: var(--form-group-gap, var(--space));
  }

  &--bordered {
    border-color: var(--form-group-border, var(--color-accent));
    background: var(--form-group-background, var(--color-background));
  }

  &--collapsible {
    .form-group__header {
      cursor: pointer;

      &:hover {
        .form-group__toggle {
          background: var(--color-background-hover);
        }
      }
    }
  }

  &--collapsed {
    .form-group__content {
      display: none;
    }
  }
}
</style>
