<template>
  <div :class="bemm()">
    <Icon
      v-if="icon"
      :name="icon"
      :class="bemm('icon')"
    />
    <h3 v-if="title" :class="bemm('title')">{{ title }}</h3>
    <p v-if="description || message" :class="bemm('description')">{{ description ?? message }}</p>
    <div v-if="$slots.default || $slots.actions || action" :class="bemm('actions')">
      <slot name="actions">
        <slot />
      </slot>
      <Button
        v-if="action && !$slots.default && !$slots.actions"
        v-bind="actionButtonProps"
        @click="action.action"
      >
        {{ action.label }}
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useBemm } from 'bemm'

import Icon from '../Icon/Icon.vue'
import { Button } from '../Button'
import type { EmptyStateProps } from './EmptyState.model'

const props = withDefaults(defineProps<EmptyStateProps>(), {
  icon: undefined,
  title: undefined,
  description: undefined,
  message: undefined,
  action: undefined,
})

const { bemm } = useBemm('empty-state')

const actionButtonProps = computed(() => {
  if (!props.action) return {}
  const { action, label, ...buttonProps } = props.action
  return buttonProps
})
</script>

<style lang="scss">
@use '../../styles/mixins' as m;

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: calc(var(--space) * 4);
  gap: var(--space-m);

  &__icon {
    font-size: m.p('icon-size', calc(var(--space) * 3));
    color: var(--color-tertiary);

    background-color: color-mix(in srgb, var(--color-tertiary), transparent 80%);
    border-radius: var(--border-radius-xs);
  }

  &__title {
    font-size: var(--font-size-l);
    font-weight: var(--font-weight-semibold);
    color: var(--color-foreground);
    margin: 0;
  }

  &__description {
    font-size: var(--font-size-m);
    color: var(--color-gray);
    margin: 0;
    max-width: m.p('description-max-width', 400px);
    line-height: m.p('line-height', 1.5);
  }

  &__actions {
    display: flex;
    gap: var(--space-m);
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
