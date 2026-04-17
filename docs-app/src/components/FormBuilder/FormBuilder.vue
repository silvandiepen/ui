<template>
  <div :class="bemm()">
    <!-- Builder Card -->
    <Card :class="bemm('builder')">
      <!-- Toolbar -->
      <div :class="bemm('toolbar')">
        <span :class="bemm('title')">Form Builder</span>
        <div :class="bemm('toolbar-actions')">
          <button
            type="button"
            :class="bemm('toolbar-btn')"
            @click="activePanel = activePanel === 'form' ? 'field' : 'form'"
          >
            {{ activePanel === 'form' ? 'Field Settings' : 'Form Settings' }}
          </button>
          <button
            type="button"
            :class="bemm('toolbar-btn')"
            @click="showPreview = !showPreview"
          >
            {{ showPreview ? 'Hide Preview' : 'Show Preview' }}
          </button>
          <button
            v-if="showExport"
            type="button"
            :class="bemm('toolbar-btn')"
            @click="exportConfig"
          >
            Export JSON
          </button>
        </div>
      </div>

      <!-- Main area -->
      <div :class="bemm('body')">
        <!-- Palette -->
        <div :class="bemm('palette-panel')">
          <FormBuilderPalette @add-field="addField" />
        </div>

        <!-- Canvas -->
        <div :class="bemm('canvas-panel')">
          <FormBuilderCanvas
            :fields="config.fields ?? []"
            :selected-key="selectedFieldKey"
            @update:fields="updateFields"
            @select="selectedFieldKey = $event"
            @add="addField"
          />
        </div>

        <!-- Settings -->
        <div :class="bemm('settings-panel')">
          <template v-if="activePanel === 'field'">
            <template v-if="selectedField">
              <FormBuilderFieldSettings
                :field="selectedField"
                @update="updateField"
              />
            </template>
            <div v-else :class="bemm('settings-empty')">
              Select a field to edit its settings
            </div>
          </template>
          <template v-else>
            <FormBuilderFormSettings
              :config="config"
              @update="updateConfig"
            />
          </template>
        </div>
      </div>
    </Card>

    <!-- Preview Card -->
    <Card v-if="showPreview" variant="elevated" :class="bemm('preview')">
      <div :class="bemm('preview-title')">Preview</div>
      <FormConfig :config="config" />
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useBemm } from 'bemm'
import FormBuilderPalette from './FormBuilderPalette.vue'
import FormBuilderCanvas from './FormBuilderCanvas.vue'
import FormBuilderFieldSettings from './FormBuilderFieldSettings.vue'
import FormBuilderFormSettings from './FormBuilderFormSettings.vue'
import FormConfig from '@ui-lib/components/Form/Form/FormConfig.vue'
import { Card } from '@ui-lib/components/Card'
import { FIELD_TYPE_DEFINITIONS } from './FormBuilder.model'
import type { FormConfig as FormConfigType, FormConfigFieldConfig, FormConfigFieldType } from '@ui-lib/components/Form/Form/FormConfig.model'

const props = withDefaults(defineProps<{
  modelValue?: FormConfigType
  showExport?: boolean
}>(), {
  showExport: true,
})

const emit = defineEmits<{
  'update:modelValue': [config: FormConfigType]
}>()

const { bemm } = useBemm('form-builder')

const config = ref<FormConfigType>(
  props.modelValue ? JSON.parse(JSON.stringify(props.modelValue)) : { fields: [], columns: 1 }
)
const selectedFieldKey = ref<string | null>(null)
const showPreview = ref(true)
const activePanel = ref<'field' | 'form'>('field')

watch(() => props.modelValue, (newVal) => {
  if (newVal) config.value = JSON.parse(JSON.stringify(newVal))
}, { deep: true })

watch(config, (newConfig) => {
  emit('update:modelValue', JSON.parse(JSON.stringify(newConfig)))
}, { deep: true })

const selectedField = computed<FormConfigFieldConfig | null>(() => {
  if (!selectedFieldKey.value) return null
  return config.value.fields?.find(f => f.key === selectedFieldKey.value) ?? null
})

function addField(type: FormConfigFieldType, index?: number) {
  const def = FIELD_TYPE_DEFINITIONS.find(d => d.type === type)
  const key = `${type}-${Date.now()}`
  const newField: FormConfigFieldConfig = {
    key,
    type,
    ...def?.defaultConfig,
    label: def?.defaultConfig.label ?? type,
  }

  const fields = [...(config.value.fields ?? [])]
  if (index !== undefined && index >= 0) {
    fields.splice(index, 0, newField)
  } else {
    fields.push(newField)
  }

  config.value = { ...config.value, fields }
  selectedFieldKey.value = key
  activePanel.value = 'field'
}

function updateFields(fields: FormConfigFieldConfig[]) {
  config.value = { ...config.value, fields }
}

function updateField(updated: FormConfigFieldConfig) {
  const fields = (config.value.fields ?? []).map(f =>
    f.key === selectedFieldKey.value ? updated : f
  )
  config.value = { ...config.value, fields }
  if (updated.key) selectedFieldKey.value = updated.key
}

function updateConfig(partial: FormConfigType) {
  config.value = { ...config.value, ...partial, fields: config.value.fields }
}

async function exportConfig() {
  try {
    await navigator.clipboard.writeText(JSON.stringify(config.value, null, 2))
  } catch {
    console.log('Config:', JSON.stringify(config.value, null, 2))
  }
}
</script>

<style lang="scss">
.form-builder {
  display: flex;
  flex-direction: column;
  gap: var(--space);
  font-family: inherit;

  &__builder {
    overflow: hidden;
    padding: 0 !important;
  }

  &__toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-s) var(--space);
    background: color-mix(in srgb, var(--color-foreground), transparent 96%);
    border-bottom: 1px solid color-mix(in srgb, var(--color-foreground), transparent 88%);
    gap: var(--space);
    flex-shrink: 0;
  }

  &__title {
    font-weight: 600;
    font-size: var(--font-size-s);
    color: var(--color-foreground);
  }

  &__toolbar-actions {
    display: flex;
    gap: var(--space-s);
    align-items: center;
  }

  &__toolbar-btn {
    padding: var(--space-xs) var(--space-s);
    border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 80%);
    border-radius: var(--border-radius-s);
    background: var(--color-background);
    color: var(--color-foreground);
    font-size: var(--font-size-xs);
    font-family: inherit;
    cursor: pointer;
    transition: all 0.15s ease;
    white-space: nowrap;

    &:hover {
      border-color: var(--color-primary);
      color: var(--color-primary);
      background: color-mix(in srgb, var(--color-primary), transparent 92%);
    }
  }

  &__body {
    display: flex;
    min-height: 400px;
    overflow: hidden;
  }

  &__palette-panel {
    width: 180px;
    flex-shrink: 0;
    border-right: 1px solid color-mix(in srgb, var(--color-foreground), transparent 88%);
    overflow-y: auto;
  }

  &__canvas-panel {
    flex: 1;
    overflow-y: auto;
    min-width: 0;
  }

  &__settings-panel {
    width: 280px;
    flex-shrink: 0;
    border-left: 1px solid color-mix(in srgb, var(--color-foreground), transparent 88%);
    overflow-y: auto;
    background: color-mix(in srgb, var(--color-foreground), transparent 98%);
  }

  &__settings-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    min-height: 200px;
    padding: var(--space);
    color: color-mix(in srgb, var(--color-foreground), transparent 50%);
    font-size: var(--font-size-s);
    text-align: center;
  }

  &__preview-title {
    font-size: var(--font-size-xs);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: color-mix(in srgb, var(--color-foreground), transparent 40%);
    padding-bottom: var(--space-s);
    border-bottom: 1px solid color-mix(in srgb, var(--color-foreground), transparent 90%);
    margin-bottom: var(--space-s);
  }
}
</style>
