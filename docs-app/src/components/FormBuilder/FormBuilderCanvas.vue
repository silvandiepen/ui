<template>
  <div
    class="form-builder-canvas"
    @dragover.prevent="onDragOver"
    @drop.prevent="onDrop"
    @click.self="$emit('select', null)"
  >
    <div v-if="!fields.length" class="form-builder-canvas__empty">
      <p>Drag fields here to start building your form</p>
    </div>

    <FormBuilderFieldCard
      v-for="(field, index) in fields"
      :key="field.key"
      :field="field"
      :index="index"
      :selected="field.key === selectedKey"
      @select="$emit('select', field.key)"
      @delete="deleteField(index)"
      @duplicate="duplicateField(index)"
      @dragstart="dragIndex = index"
      @dragenter="dropIndex = index"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FormBuilderFieldCard from './FormBuilderFieldCard.vue'
import type { FormConfigFieldConfig, FormConfigFieldType } from '@ui-lib/components/Form/Form/FormConfig.model'

const props = defineProps<{
  fields: FormConfigFieldConfig[]
  selectedKey: string | null
}>()

const emit = defineEmits<{
  'update:fields': [fields: FormConfigFieldConfig[]]
  'select': [key: string | null]
  'add': [type: FormConfigFieldType, index?: number]
}>()

const dragIndex = ref(-1)
const dropIndex = ref(-1)

function onDragOver(_event: DragEvent) {
  // Allow drop
}

function onDrop(event: DragEvent) {
  const raw = event.dataTransfer?.getData('text/plain')
  if (!raw) return

  try {
    const data = JSON.parse(raw)
    if (data.action === 'reorder') {
      const from = dragIndex.value >= 0 ? dragIndex.value : data.index
      const to = dropIndex.value >= 0 ? dropIndex.value : 0
      if (from === to || from === -1) return

      const newFields = [...props.fields]
      const [moved] = newFields.splice(from, 1)
      newFields.splice(to, 0, moved)
      emit('update:fields', newFields)
    } else if (data.action === 'add') {
      const targetIndex = dropIndex.value >= 0 ? dropIndex.value : undefined
      emit('add', data.type, targetIndex)
    }
  } catch {
    // Ignore parse errors
  } finally {
    dragIndex.value = -1
    dropIndex.value = -1
  }
}

function deleteField(index: number) {
  const newFields = [...props.fields]
  newFields.splice(index, 1)
  emit('update:fields', newFields)
}

function duplicateField(index: number) {
  const newFields = [...props.fields]
  const original = newFields[index]
  const baseKey = original.key.replace(/-copy(-\d+)?$/, '')
  let newKey = `${baseKey}-copy`

  let counter = 2
  while (newFields.some(f => f.key === newKey)) {
    newKey = `${baseKey}-copy-${counter++}`
  }

  const clone: FormConfigFieldConfig = JSON.parse(JSON.stringify(original))
  clone.key = newKey
  newFields.splice(index + 1, 0, clone)
  emit('update:fields', newFields)
}
</script>

<style lang="scss">
.form-builder-canvas {
  display: flex;
  flex-direction: column;
  gap: var(--space-s);
  padding: var(--space);
  flex: 1;
  min-height: 300px;
  overflow-y: auto;
  background: color-mix(in srgb, var(--color-foreground), transparent 98%);

  &__empty {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 200px;
    border: 2px dashed color-mix(in srgb, var(--color-foreground), transparent 80%);
    border-radius: var(--border-radius);
    color: color-mix(in srgb, var(--color-foreground), transparent 50%);
    font-size: var(--font-size-s);
    text-align: center;
    padding: var(--space-l);

    p {
      margin: 0;
    }
  }
}
</style>
