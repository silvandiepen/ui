<template>
  <div :class="actionsClasses">
    <Button
      v-for="(action, index) in actions"
      :key="`action-${index}`"
      :variant="action.variant || defaultVariant"
      :color="action.color"
      :icon="action.icon"
      :size="buttonSize"
      :loading="action.loading"
      :disabled="action.disabled"
      :href="action.href"
      :icon-only="action.iconOnly"
      :to="action.to"
      :tooltip="action.tooltip || ((iconOnly || action.iconOnly) ? action.label : undefined)"
      @click="action.action"
    >
      <template v-if="!iconOnly">
        {{ action.label }}
      </template>
    </Button>

    <!-- Context Menu -->
    <ContextMenu
      v-if="contextMenuItems && contextMenuItems.length > 0"
      :config="{
        menu: transformedMenuItems,
        position: props.contextMenuPosition,
        size: buttonSize
      }"
    >
      <Button
        :variant="ButtonVariant.GHOST"
        :size="buttonSize"
        :icon="Icons.THREE_DOTS_HORIZONTAL"
        icon-only
        title="More actions"
      />
    </ContextMenu>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useBemm } from 'bemm'
import type { ActionsProps } from './Actions.model'
import Button from '../Button/Button.vue'
import { ButtonVariant } from '../Button'
import { Size } from '../../types'
import ContextMenu from '../ContextMenu/ContextMenu.vue'
import { Icons } from 'open-icon'

const props = withDefaults(defineProps<ActionsProps>(), {
  variant: 'inline',
  size: 'medium',
  iconOnly: false,
  align: 'start',
  gap: 'm',
  contextMenuPosition: 'bottom-left'
})

const bemm = useBemm('actions')

const actionsClasses = computed(() => {
  return [
    bemm(),
    bemm('', props.variant),
    bemm('', `align-${props.align}`),
    bemm('', `gap-${props.gap}`)
  ]
})

const buttonSize = computed(() => {
  const sizeMap = {
    small: Size.SMALL,
    medium: Size.MEDIUM,
    large: Size.LARGE
  }
  return sizeMap[props.size || 'medium']
})

const defaultVariant = computed(() => {
  // For icon-only actions, default to ghost variant
  return props.iconOnly ? ButtonVariant.GHOST : ButtonVariant.PRIMARY
})

const contextMenuItems = computed(() => props.contextMenuItems || [])

// Transform our simple menu items to the ContextMenu format
const transformedMenuItems = computed(() => {
  if (!contextMenuItems.value.length) return []

  return contextMenuItems.value.map((item, index) => ({
    id: `menu-item-${index}`,
    label: item.label,
    icon: item.icon || '',
    action: item.action,
    link: item.href || '',
    disabled: item.disabled || false,
    active: true,
    items: [],
    size: buttonSize.value,
    type: item.divider ? 'separator' as const : 'default' as const
  }))
})
</script>

<style lang="scss">
@use '../../styles/mixins' as m;

.actions {
  @include m.component-props((
    'gap-xs': 'var(--space-xs)',
    'gap-s':  'var(--space-s)',
    'gap-m':  'var(--space-m)',
    'gap-l':  'var(--space-m)',
    'gap-xl': 'var(--space-l)',
  ), 'actions');

  display: flex;

  &--inline {
    flex-direction: row;
  }

  &--stacked {
    flex-direction: column;

    > * {
      width: 100%;
    }
  }

  &--justified {
    flex-direction: row;

    > * {
      flex: 1;
    }
  }

  // Alignment variants
  &--align-start {
    justify-content: flex-start;
  }

  &--align-center {
    justify-content: center;
  }

  &--align-end {
    justify-content: flex-end;
  }

  &--align-space-between {
    justify-content: space-between;
  }

  &--align-space-around {
    justify-content: space-around;
  }

  // Gap variants
  &--gap-none {
    gap: 0;
  }

  &--gap-xs {
    gap: var(--int-actions-gap-xs);
  }

  &--gap-s {
    gap: var(--int-actions-gap-s);
  }

  &--gap-m {
    gap: var(--int-actions-gap-m);
  }

  &--gap-l {
    gap: var(--int-actions-gap-l);
  }

  &--gap-xl {
    gap: var(--int-actions-gap-xl);
  }
}
</style>
