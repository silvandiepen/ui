<template>
  <div :class="bemm('', { variant })">
    <button
      v-for="tab in tabs"
      :key="tab.value"
      :class="bemm('tab', { active: modelValue === tab.value, disabled: tab.disabled })"
      :disabled="tab.disabled"
      @click="handleTabClick(tab.value)"
    >
      <Icon v-if="tab.icon" :name="tab.icon" :class="bemm('tab-icon')" />
      <span :class="bemm('tab-label')">{{ tab.label }}</span>
      <span v-if="tab.badge" :class="bemm('tab-badge')">{{ tab.badge }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useBemm } from 'bemm'
import Icon from '../Icon/Icon.vue'

export interface Tab {
  value: string
  label: string
  icon?: string
  badge?: string | number
  disabled?: boolean
}

interface TabBarProps {
  tabs: Tab[]
  modelValue: string
  variant?: 'default' | 'pills' | 'underline'
}

interface TabBarEmits {
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
}

const props = withDefaults(defineProps<TabBarProps>(), {
  variant: 'default'
})

const emit = defineEmits<TabBarEmits>()

const bemm = useBemm('tab-bar')

function handleTabClick(value: string) {
  if (props.modelValue !== value) {
    emit('update:modelValue', value)
    emit('change', value)
  }
}
</script>

<style lang="scss">
.tab-bar {
  display: flex;
  position: relative;

  // Default variant - underline style
  &--default {
    border-bottom: 2px solid var(--color-border);
    
    .tab-bar__tab {
      padding: var(--space-m) var(--space-xl);
      background: none;
      border: none;
      color: var(--color-muted);
      font-size: var(--font-size-m);
      font-weight: var(--font-weight-medium);
      cursor: pointer;
      transition: all 0.2s ease;
      border-bottom: 2px solid transparent;
      margin-bottom: -2px;
      position: relative;

      &:hover:not(&--disabled) {
        color: var(--color-foreground);
        background: color-mix(in srgb, var(--color-primary), transparent 95%);
      }

      &--active {
        color: var(--color-primary);
        border-bottom-color: var(--color-primary);
        font-weight: var(--font-weight-semibold);
      }

      &--disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  }

  // Pills variant - rounded tabs
  &--pills {
    gap: var(--space-xs);
    padding: var(--space-xs);
    background: var(--color-surface);
    border-radius: var(--border-radius-lg);
    
    .tab-bar__tab {
      padding: var(--space-s) var(--space-l);
      background: transparent;
      border: none;
      color: var(--color-muted);
      font-size: var(--font-size-m);
      font-weight: var(--font-weight-medium);
      cursor: pointer;
      transition: all 0.2s ease;
      border-radius: var(--border-radius);

      &:hover:not(&--disabled) {
        color: var(--color-foreground);
        background: color-mix(in srgb, var(--color-primary), transparent 90%);
      }

      &--active {
        color: var(--color-primary-text);
        background: var(--color-primary);
        font-weight: var(--font-weight-semibold);
        box-shadow: var(--shadow-s);
      }

      &--disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  }

  // Underline variant - clean underline style
  &--underline {
    gap: var(--space-xl);
    border-bottom: 1px solid var(--color-border);
    
    .tab-bar__tab {
      padding: var(--space-m) 0;
      background: none;
      border: none;
      color: var(--color-muted);
      font-size: var(--font-size-m);
      font-weight: var(--font-weight-medium);
      cursor: pointer;
      transition: all 0.2s ease;
      border-bottom: 2px solid transparent;
      margin-bottom: -1px;
      position: relative;

      &:hover:not(&--disabled) {
        color: var(--color-foreground);
      }

      &--active {
        color: var(--color-primary);
        border-bottom-color: var(--color-primary);
        font-weight: var(--font-weight-semibold);
      }

      &--disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  }

  &__tab {
    display: flex;
    align-items: center;
    gap: var(--space-s);
    white-space: nowrap;
    min-height: 44px; // Touch target
  }

  &__tab-icon {
    width: 16px;
    height: 16px;
  }

  &__tab-label {
    line-height: 1.2;
  }

  &__tab-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 20px;
    padding: 0 var(--space-xs);
    background: var(--color-danger);
    color: var(--color-danger-text);
    border-radius: var(--border-radius-round);
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-bold);
    line-height: 1;

    .tab-bar__tab--active & {
      background: var(--color-primary-text);
      color: var(--color-primary);
    }
  }
}

// Responsive design
@media (max-width: 768px) {
  .tab-bar {
    &__tab {
      min-width: 0;
      flex: 1;
      justify-content: center;
    }

    &--default .tab-bar__tab,
    &--underline .tab-bar__tab {
      padding-left: var(--space-m);
      padding-right: var(--space-m);
    }

    &--pills {
      .tab-bar__tab {
        padding-left: var(--space-m);
        padding-right: var(--space-m);
      }
    }
  }
}

// Dark mode optimizations
@media (prefers-color-scheme: dark) {
  .tab-bar {
    &--pills {
      background: color-mix(in srgb, var(--color-foreground), transparent 95%);
    }
  }
}
</style>