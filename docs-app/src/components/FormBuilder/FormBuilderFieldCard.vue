<template>
  <div
    :class="['form-builder-field-card', selected && 'form-builder-field-card--selected']"
    draggable="true"
    @click.stop="$emit('select')"
    @dragstart="handleDragStart"
    @dragenter.prevent="$emit('dragenter', index)"
    @dragover.prevent
  >
    <div class="form-builder-field-card__handle">
      <Icon name="grip-vertical" />
    </div>
    <div class="form-builder-field-card__info">
      <Icon :name="fieldDef?.icon ?? 'type'" class="form-builder-field-card__type-icon" />
      <div class="form-builder-field-card__text">
        <span class="form-builder-field-card__label">{{ field.label || '(no label)' }}</span>
        <code class="form-builder-field-card__key">{{ field.key }}</code>
      </div>
      <span class="form-builder-field-card__type">{{ field.type }}</span>
    </div>
    <div class="form-builder-field-card__actions">
      <button type="button" title="Duplicate" @click.stop="$emit('duplicate')"><Icon name="copy" /></button>
      <button type="button" title="Delete" @click.stop="$emit('delete')"><Icon name="trash" /></button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Icon from '@ui-lib/components/Icon/Icon.vue'
import { FIELD_TYPE_DEFINITIONS } from './FormBuilder.model'
import type { FormConfigFieldConfig } from '@ui-lib/components/Form/Form/FormConfig.model'

const props = defineProps<{
  field: FormConfigFieldConfig
  selected: boolean
  index: number
}>()

const emit = defineEmits<{
  select: []
  delete: []
  duplicate: []
  dragstart: [index: number]
  dragenter: [index: number]
}>()

const fieldDef = computed(() => FIELD_TYPE_DEFINITIONS.find(d => d.type === props.field.type))

function handleDragStart(event: DragEvent) {
  emit('dragstart', props.index)
  event.dataTransfer!.setData('text/plain', JSON.stringify({ action: 'reorder', index: props.index }))
  event.dataTransfer!.effectAllowed = 'move'
}
</script>

<style lang="scss">
.form-builder-field-card {
  display: flex;
  align-items: center;
  gap: var(--space-s);
  padding: var(--space-s) var(--space);
  background: var(--color-background);
  border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 88%);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all 0.15s ease;
  position: relative;

  &:hover {
    border-color: color-mix(in srgb, var(--color-primary), transparent 60%);
    box-shadow: 0 2px 8px color-mix(in srgb, var(--color-foreground), transparent 92%);

    .form-builder-field-card__handle {
      opacity: 1;
    }

    .form-builder-field-card__actions {
      opacity: 1;
    }
  }

  &--selected {
    border-color: var(--color-primary);
    border-left: 3px solid var(--color-primary);
    background: color-mix(in srgb, var(--color-primary), transparent 96%);
  }

  &__handle {
    opacity: 0;
    cursor: grab;
    color: color-mix(in srgb, var(--color-foreground), transparent 50%);
    transition: opacity 0.15s ease;
    flex-shrink: 0;
    display: flex;
    align-items: center;

    &:active {
      cursor: grabbing;
    }
  }

  &__info {
    display: flex;
    align-items: center;
    gap: var(--space-s);
    flex: 1;
    min-width: 0;
  }

  &__type-icon {
    flex-shrink: 0;
    color: color-mix(in srgb, var(--color-foreground), transparent 40%);
    font-size: 1rem;
  }

  &__text {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
    flex: 1;
  }

  &__label {
    font-size: var(--font-size-s);
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__key {
    font-size: var(--font-size-xs);
    color: color-mix(in srgb, var(--color-foreground), transparent 45%);
    font-family: monospace;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__type {
    font-size: var(--font-size-xs);
    color: color-mix(in srgb, var(--color-foreground), transparent 45%);
    background: color-mix(in srgb, var(--color-foreground), transparent 92%);
    padding: 2px var(--space-xs);
    border-radius: var(--border-radius-s);
    flex-shrink: 0;
    font-family: monospace;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    opacity: 0;
    transition: opacity 0.15s ease;
    flex-shrink: 0;

    button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border: none;
      background: transparent;
      cursor: pointer;
      border-radius: var(--border-radius-s);
      color: color-mix(in srgb, var(--color-foreground), transparent 40%);
      transition: all 0.15s ease;
      font-size: 0.875rem;

      &:hover {
        background: color-mix(in srgb, var(--color-foreground), transparent 90%);
        color: var(--color-foreground);
      }

      &[title='Delete']:hover {
        background: color-mix(in srgb, var(--color-error), transparent 85%);
        color: var(--color-error);
      }
    }
  }
}
</style>
