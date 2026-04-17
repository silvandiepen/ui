<template>
  <div class="form-builder-palette">
    <div class="form-builder-palette__title">Fields</div>
    <div class="form-builder-palette__items">
      <div
        v-for="def in FIELD_TYPE_DEFINITIONS"
        :key="def.type"
        class="form-builder-palette__item"
        draggable="true"
        @dragstart="onDragStart(def.type, $event)"
        @click="$emit('add-field', def.type)"
      >
        <Icon :name="def.icon" class="form-builder-palette__item-icon" />
        <span class="form-builder-palette__item-label">{{ def.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Icon from '@ui-lib/components/Icon/Icon.vue'
import { FIELD_TYPE_DEFINITIONS } from './FormBuilder.model'
import type { FormConfigFieldType } from '@ui-lib/components/Form/Form/FormConfig.model'

defineEmits<{
  'add-field': [type: FormConfigFieldType]
}>()

function onDragStart(type: FormConfigFieldType, event: DragEvent) {
  event.dataTransfer!.setData('text/plain', JSON.stringify({ action: 'add', type }))
  event.dataTransfer!.effectAllowed = 'copy'
}
</script>

<style lang="scss">
.form-builder-palette {
  display: flex;
  flex-direction: column;
  gap: var(--space-s);
  padding: var(--space-s);
  background: color-mix(in srgb, var(--color-foreground), transparent 97%);
  border-right: 1px solid color-mix(in srgb, var(--color-foreground), transparent 90%);
  height: 100%;
  overflow-y: auto;

  &__title {
    font-size: var(--font-size-xs);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: color-mix(in srgb, var(--color-foreground), transparent 40%);
    padding: var(--space-xs) var(--space-xs) 0;
  }

  &__items {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-xs);
  }

  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-xs);
    padding: var(--space-s) var(--space-xs);
    border-radius: var(--border-radius);
    cursor: grab;
    border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 90%);
    background: var(--color-background);
    transition: all 0.15s ease;
    user-select: none;
    text-align: center;

    &:hover {
      background: color-mix(in srgb, var(--color-primary), transparent 90%);
      border-color: color-mix(in srgb, var(--color-primary), transparent 70%);
      color: var(--color-primary);
    }

    &:active {
      cursor: grabbing;
      transform: scale(0.96);
    }
  }

  &__item-icon {
    font-size: 1rem;
    opacity: 0.7;
  }

  &__item-label {
    font-size: var(--font-size-xs);
    font-weight: 500;
    line-height: 1;
  }
}
</style>
