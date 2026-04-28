<template>
  <div
    :class="actionsClasses"
    :data-test-id="testId"
  >
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
      :test-id="getTestId(props.testId, `action-${index}`)"
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
        :test-id="getTestId(props.testId, 'more')"
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
import { getTestId } from '../../utils/testId'

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
    bemm('', `size-${props.gap}`)
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

  // Size variants — control the gap between actions
  &--size-none {
    gap: 0;
  }

  &--size-xs {
    gap: m.p('gap', var(--space-xs));
  }

  &--size-s {
    gap: m.p('gap', var(--space-s));
  }

  &--size-m {
    gap: m.p('gap', var(--space-m));
  }

  &--size-l {
    gap: m.p('gap', var(--space-l));
  }

  &--size-xl {
    gap: m.p('gap', var(--space-xl));
  }
}
</style>
