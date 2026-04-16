<template>
  <div :class="bemm()">
    <header :class="bemm('header')">
      <p :class="bemm('eyebrow')">{{ t('docs.navigation.guides') }}</p>
      <h1 :class="bemm('title')">{{ t('docs.foundationTypes.title') }}</h1>
      <p :class="bemm('summary')">{{ t('docs.foundationTypes.summary') }}</p>
    </header>

    <Card
      v-for="group in typeGroups"
      :key="group.name"
      :class="bemm('group-card')"
    >
      <template #header>
        <h2 :class="bemm('group-title')">{{ group.name }}</h2>
      </template>

      <div :class="bemm('group-content')">
        <p v-if="group.description" :class="bemm('group-description')">{{ group.description }}</p>

        <div :class="bemm('type-values')">
          <div
            v-for="item in group.items"
            :key="item.value"
            :class="bemm('type-item')"
          >
            <span
              v-if="item.color"
              :class="bemm('color-swatch')"
              :style="{ '--swatch-color': `var(--color-${item.color})` }"
            />
            <code :class="bemm('type-item-value')">{{ item.value }}</code>
            <span v-if="item.label && item.label !== item.value" :class="bemm('type-item-label')">{{ item.label }}</span>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { useBemm } from 'bemm'
import { useI18n } from 'vue-i18n'
import { Card } from '@ui-lib/components/Card'

const bemm = useBemm('docs-foundation-types')
const { t } = useI18n()

interface TypeItem {
  color?: string
  label?: string
  value: string
}

interface TypeGroup {
  description?: string
  items: TypeItem[]
  name: string
}

const typeGroups: TypeGroup[] = [
  {
    name: 'Colors (semantic)',
    description: 'The Colors type represents the library\'s semantic color tokens. Use these for component color props.',
    items: [
      { value: 'primary', color: 'primary' },
      { value: 'secondary', color: 'secondary' },
      { value: 'tertiary', color: 'tertiary' },
      { value: 'quaternary', color: 'quaternary' },
      { value: 'quinary', color: 'quinary' },
      { value: 'accent', color: 'accent' },
      { value: 'success', color: 'success' },
      { value: 'warning', color: 'warning' },
      { value: 'error', color: 'error' },
      { value: 'info', color: 'info' },
      { value: 'background', color: 'background' },
      { value: 'foreground', color: 'foreground' },
      { value: 'dark', color: 'dark' },
      { value: 'light', color: 'light' },
    ],
  },
  {
    name: 'Size',
    description: 'The Size enum is used across components for consistent sizing.',
    items: [
      { value: 'xsmall', label: 'Extra small' },
      { value: 'small', label: 'Small' },
      { value: 'medium', label: 'Medium (default)' },
      { value: 'large', label: 'Large' },
      { value: 'xlarge', label: 'Extra large' },
    ],
  },
  {
    name: 'Status',
    description: 'Used for loading states, feedback surfaces, and status indicators.',
    items: [
      { value: 'idle', label: 'Idle' },
      { value: 'loading', label: 'Loading' },
      { value: 'default', label: 'Default' },
      { value: 'success', label: 'Success' },
      { value: 'warning', label: 'Warning' },
      { value: 'error', label: 'Error' },
      { value: 'info', label: 'Info' },
    ],
  },
  {
    name: 'ComponentVariant (common)',
    description: 'Most components that accept a variant prop use one of these values, though some define custom variants.',
    items: [
      { value: 'default' },
      { value: 'primary' },
      { value: 'secondary' },
      { value: 'outline' },
      { value: 'ghost' },
      { value: 'elevated' },
      { value: 'danger' },
    ],
  },
]
</script>

<style lang="scss">
.docs-foundation-types {
  display: grid;
  gap: 1.5rem;
  padding: 2rem;

  &__header {
    display: grid;
    gap: 0.6rem;
  }

  &__eyebrow {
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: color-mix(in srgb, var(--color-foreground), transparent 60%);
    font-size: 0.85rem;
  }

  &__title {
    margin: 0;
    font-size: clamp(2.2rem, 4vw, 3.6rem);
    line-height: 0.98;
  }

  &__summary {
    margin: 0;
    max-width: 46rem;
    line-height: 1.6;
    color: color-mix(in srgb, var(--color-foreground), transparent 24%);
  }

  &__group-card {
    overflow: hidden;
  }

  &__group-title {
    margin: 0;
    font-size: 1.15rem;
  }

  &__group-description {
    margin: 0;
    color: color-mix(in srgb, var(--color-foreground), transparent 40%);
    font-size: 0.9em;
    line-height: 1.5;
  }

  &__group-content {
    display: grid;
    gap: 1rem;
  }

  &__type-values {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  &__type-item {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.3em 0.7em;
    border-radius: var(--border-radius);
    background: color-mix(in srgb, var(--color-background), var(--color-foreground) 4%);
    border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 88%);
    font-size: 0.85em;
  }

  &__color-swatch {
    width: 0.85em;
    height: 0.85em;
    border-radius: 50%;
    background: var(--swatch-color, var(--color-foreground));
    flex-shrink: 0;
  }

  &__type-item-value {
    font-size: 0.9em;
  }

  &__type-item-label {
    color: color-mix(in srgb, var(--color-foreground), transparent 40%);
    font-size: 0.9em;
  }
}

@media (max-width: 960px) {
  .docs-foundation-types {
    padding: 1.2rem;
  }
}
</style>
