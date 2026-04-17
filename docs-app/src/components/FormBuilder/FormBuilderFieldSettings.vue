<template>
  <div class="form-builder-field-settings">

    <!-- Basic Settings -->
    <div class="form-builder-field-settings__section">
      <div class="form-builder-field-settings__section-title">Basic</div>

      <InputText
        :size="Size.SMALL"
        label="Key"
        :model-value="draft.key"
        @update:model-value="(v) => onKeyInput(v as string)"
      />
      <InputText
        :size="Size.SMALL"
        label="Label"
        :model-value="draft.label ?? ''"
        @update:model-value="(v) => onLabelInput(v as string)"
      />
      <InputText
        v-if="!['checkbox', 'toggle', 'divider', 'section'].includes(draft.type)"
        :size="Size.SMALL"
        label="Placeholder"
        :model-value="draft.placeholder ?? ''"
        @update:model-value="(v) => { draft.placeholder = v as string; emitUpdate() }"
      />
      <InputText
        :size="Size.SMALL"
        label="Hint"
        :model-value="draft.hint ?? ''"
        @update:model-value="(v) => { draft.hint = v as string; emitUpdate() }"
      />

      <div class="form-builder-field-settings__toggles">
        <InputToggle
          size="small"
          label="Required"
          :model-value="!!draft.required"
          @update:model-value="(v) => { draft.required = v as boolean; emitUpdate() }"
        />
        <InputToggle
          size="small"
          label="Disabled"
          :model-value="!!draft.disabled"
          @update:model-value="(v) => { draft.disabled = v as boolean; emitUpdate() }"
        />
      </div>

      <InputNumber
        :size="Size.SMALL"
        label="Columns (1–12)"
        :model-value="draft.cols ?? 1"
        :min="1"
        :max="12"
        :step="1"
        @update:model-value="(v) => { draft.cols = v as number; emitUpdate() }"
      />
    </div>

    <!-- Type-specific props -->
    <div v-if="hasTypeProps" class="form-builder-field-settings__section">
      <div class="form-builder-field-settings__section-title">Field Props</div>

      <!-- number / range -->
      <template v-if="['number', 'range'].includes(draft.type)">
        <InputNumber :size="Size.SMALL" label="Min" :model-value="getProp('min')" @update:model-value="(v) => setProp('min', v)" />
        <InputNumber :size="Size.SMALL" label="Max" :model-value="getProp('max')" @update:model-value="(v) => setProp('max', v)" />
        <InputNumber :size="Size.SMALL" label="Step" :model-value="getProp('step', 1)" @update:model-value="(v) => setProp('step', v)" />
        <InputNumber v-if="draft.type === 'number'" :size="Size.SMALL" label="Decimals" :model-value="getProp('decimals', 0)" @update:model-value="(v) => setProp('decimals', v)" />
      </template>

      <!-- date -->
      <template v-if="draft.type === 'date'">
        <InputText :size="Size.SMALL" label="Date Format" :model-value="getPropStr('dateFormat', 'YYYY-MM-DD')" @update:model-value="(v) => setProp('dateFormat', v)" />
        <InputSelect :size="Size.SMALL" label="Months Shown" :model-value="String(getProp('months', 1))" :options="['1', '2']" @update:model-value="(v) => setProp('months', Number(v))" />
      </template>

      <!-- pin -->
      <template v-if="draft.type === 'pin'">
        <InputNumber :size="Size.SMALL" label="PIN Length" :model-value="getProp('length', 4)" @update:model-value="(v) => setProp('length', v)" />
      </template>

      <!-- textarea -->
      <template v-if="draft.type === 'textarea'">
        <InputNumber :size="Size.SMALL" label="Min Rows" :model-value="getProp('minRows', 2)" @update:model-value="(v) => setProp('minRows', v)" />
        <InputNumber :size="Size.SMALL" label="Max Rows" :model-value="getProp('maxRows', 6)" @update:model-value="(v) => setProp('maxRows', v)" />
        <InputToggle size="small" label="Auto Grow" :model-value="getPropBool('autoGrow', false)" @update:model-value="(v) => setProp('autoGrow', v)" />
      </template>

      <!-- select -->
      <template v-if="draft.type === 'select'">
        <InputToggle size="small" label="Filterable / Searchable" :model-value="getPropBool('filterable', false)" @update:model-value="(v) => setProp('filterable', v)" />
        <InputToggle size="small" label="Allow Empty" :model-value="getPropBool('allowNull', false)" @update:model-value="(v) => setProp('allowNull', v)" />
        <InputText v-if="getPropBool('allowNull', false)" :size="Size.SMALL" label="Empty Label" :model-value="getPropStr('nullLabel', 'Please select...')" @update:model-value="(v) => setProp('nullLabel', v)" />
      </template>

      <!-- toggle / checkbox -->
      <template v-if="['toggle', 'checkbox'].includes(draft.type)">
        <InputSelect :size="Size.SMALL" label="Color" :model-value="getPropStr('color', 'primary')" :options="['primary', 'secondary', 'success', 'warning', 'error']" @update:model-value="(v) => setProp('color', v)" />
      </template>
    </div>

    <!-- Options (for select, radio, switch) -->
    <div v-if="['select', 'radio', 'switch'].includes(draft.type)" class="form-builder-field-settings__section">
      <div class="form-builder-field-settings__section-title">Options</div>

      <div v-for="(opt, i) in (draft.options ?? [])" :key="i" class="form-builder-field-settings__option-row">
        <input
          class="form-builder-field-settings__raw-input"
          type="text"
          placeholder="Label"
          :value="opt.label"
          @input="updateOption(i, 'label', ($event.target as HTMLInputElement).value)"
        />
        <input
          class="form-builder-field-settings__raw-input"
          type="text"
          placeholder="Value"
          :value="String(opt.value)"
          @input="updateOption(i, 'value', ($event.target as HTMLInputElement).value)"
        />
        <button type="button" class="form-builder-field-settings__delete-btn" @click="removeOption(i)">✕</button>
      </div>

      <Button variant="ghost" size="small" @click="addOption">+ Add option</Button>
    </div>

    <!-- Validation -->
    <div class="form-builder-field-settings__section">
      <div class="form-builder-field-settings__section-title">Validation</div>

      <div v-for="(rule, i) in (draft.validation ?? [])" :key="i" class="form-builder-field-settings__validation-row">
        <select
          class="form-builder-field-settings__raw-input form-builder-field-settings__raw-input--select"
          :value="rule.type"
          @change="updateValidation(i, 'type', ($event.target as HTMLSelectElement).value)"
        >
          <option v-for="vt in validationTypes" :key="vt" :value="vt">{{ vt }}</option>
        </select>
        <input
          v-if="['minLength', 'maxLength', 'min', 'max', 'pattern', 'custom'].includes(rule.type)"
          class="form-builder-field-settings__raw-input"
          type="text"
          placeholder="Value"
          :value="String(rule.value ?? '')"
          @input="updateValidation(i, 'value', ($event.target as HTMLInputElement).value)"
        />
        <input
          class="form-builder-field-settings__raw-input"
          type="text"
          placeholder="Error message"
          :value="rule.message"
          @input="updateValidation(i, 'message', ($event.target as HTMLInputElement).value)"
        />
        <button type="button" class="form-builder-field-settings__delete-btn" @click="removeValidation(i)">✕</button>
      </div>

      <Button variant="ghost" size="small" @click="addValidation">+ Add rule</Button>
    </div>

    <!-- Condition -->
    <div class="form-builder-field-settings__section">
      <div class="form-builder-field-settings__section-title">Condition</div>

      <InputToggle
        size="small"
        label="Enable condition"
        :model-value="conditionEnabled"
        @update:model-value="(v) => toggleCondition(v as boolean)"
      />

      <template v-if="conditionEnabled && singleCondition">
        <InputText
          :size="Size.SMALL"
          label="Field key"
          :model-value="singleCondition.field"
          @update:model-value="(v) => updateCondition('field', v as string)"
        />
        <InputSelect
          :size="Size.SMALL"
          label="Operator"
          :model-value="singleCondition.operator"
          :options="conditionOperators"
          @update:model-value="(v) => updateCondition('operator', String(v ?? ''))"
        />
        <InputText
          :size="Size.SMALL"
          label="Value"
          :model-value="String(singleCondition.value ?? '')"
          @update:model-value="(v) => updateCondition('value', v as string)"
        />
      </template>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import InputText from '@ui-lib/components/Form/InputText/InputText.vue'
import InputNumber from '@ui-lib/components/Form/InputNumber/InputNumber.vue'
import InputToggle from '@ui-lib/components/Form/InputToggle/InputToggle.vue'
import InputSelect from '@ui-lib/components/Form/InputSelect/InputSelect.vue'
import { Button } from '@ui-lib/components/Button'
import { Size } from '@ui-lib/types'
import type {
  FormConfigFieldConfig,
  FormConfigValidationType,
  FormConfigConditionOperator,
  FormConfigCondition,
} from '@ui-lib/components/Form/Form/FormConfig.model'

const props = defineProps<{
  field: FormConfigFieldConfig
}>()

const emit = defineEmits<{
  update: [field: FormConfigFieldConfig]
}>()

const validationTypes: FormConfigValidationType[] = [
  'required', 'minLength', 'maxLength', 'min', 'max', 'pattern', 'email', 'url', 'custom',
]

const conditionOperators: FormConfigConditionOperator[] = [
  'eq', 'neq', 'gt', 'gte', 'lt', 'lte',
  'contains', 'notContains', 'startsWith', 'endsWith',
  'empty', 'notEmpty', 'in', 'notIn',
]

const typePropsMap: Record<string, boolean> = {
  number: true, range: true, date: true, pin: true,
  textarea: true, select: true, toggle: true, checkbox: true,
}

const hasTypeProps = computed(() => typePropsMap[draft.value.type] ?? false)

const keyManuallyEdited = ref(false)
const draft = ref<FormConfigFieldConfig>(JSON.parse(JSON.stringify(props.field)))

watch(() => props.field, (newField) => {
  draft.value = JSON.parse(JSON.stringify(newField))
  keyManuallyEdited.value = false
}, { deep: true })

function labelToKey(label: string): string {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function emitUpdate() {
  emit('update', JSON.parse(JSON.stringify(draft.value)))
}

function onKeyInput(value: string) {
  keyManuallyEdited.value = true
  draft.value.key = value
  emitUpdate()
}

function onLabelInput(value: string) {
  draft.value.label = value
  if (!keyManuallyEdited.value) {
    const slug = labelToKey(value)
    if (slug) draft.value.key = slug
  }
  emitUpdate()
}

// Type-specific props helpers
function getProp<T = number>(key: string, defaultValue?: T): T | undefined {
  return ((draft.value.props as Record<string, unknown>)?.[key] as T) ?? defaultValue
}

function getPropStr(key: string, defaultValue = ''): string {
  return (((draft.value.props as Record<string, unknown>)?.[key]) as string) ?? defaultValue
}

function getPropBool(key: string, defaultValue = false): boolean {
  return (((draft.value.props as Record<string, unknown>)?.[key]) as boolean) ?? defaultValue
}

function setProp(key: string, value: unknown) {
  draft.value.props = { ...(draft.value.props as Record<string, unknown> ?? {}), [key]: value }
  emitUpdate()
}

// Options
function addOption() {
  if (!draft.value.options) draft.value.options = []
  const n = draft.value.options.length + 1
  draft.value.options.push({ label: `Option ${n}`, value: `option-${n}` })
  emitUpdate()
}

function removeOption(i: number) {
  draft.value.options?.splice(i, 1)
  emitUpdate()
}

function updateOption(i: number, key: 'label' | 'value', val: string) {
  if (draft.value.options?.[i]) {
    const opt = draft.value.options[i] as Record<string, unknown>
    opt[key] = val
    emitUpdate()
  }
}

// Validation
function addValidation() {
  if (!draft.value.validation) draft.value.validation = []
  draft.value.validation.push({ type: 'required', message: 'This field is required' })
  emitUpdate()
}

function removeValidation(i: number) {
  draft.value.validation?.splice(i, 1)
  emitUpdate()
}

function updateValidation(i: number, key: string, val: string) {
  if (draft.value.validation?.[i]) {
    (draft.value.validation[i] as Record<string, unknown>)[key] = val
    emitUpdate()
  }
}

// Condition
const conditionEnabled = computed(() => !!draft.value.condition)

const singleCondition = computed<FormConfigCondition | null>(() => {
  if (!draft.value.condition) return null
  if (Array.isArray(draft.value.condition)) return draft.value.condition[0] ?? null
  return draft.value.condition
})

function toggleCondition(enabled: boolean) {
  if (enabled) {
    draft.value.condition = { field: '', operator: 'eq', value: '' }
  } else {
    delete draft.value.condition
  }
  emitUpdate()
}

function updateCondition(key: keyof FormConfigCondition, val: string) {
  if (!draft.value.condition) return
  const target = Array.isArray(draft.value.condition)
    ? draft.value.condition[0]
    : draft.value.condition
  if (target) {
    (target as Record<string, unknown>)[key] = val
  }
  emitUpdate()
}
</script>

<style lang="scss">
.form-builder-field-settings {
  display: flex;
  flex-direction: column;
  gap: var(--space-s);
  padding: var(--space-s);
  height: 100%;
  overflow-y: auto;

  &__section {
    display: flex;
    flex-direction: column;
    gap: var(--space-s);
    padding: var(--space-s);
    background: color-mix(in srgb, var(--color-foreground), transparent 97%);
    border-radius: var(--border-radius);
    border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 90%);
  }

  &__section-title {
    font-size: var(--font-size-xs);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: color-mix(in srgb, var(--color-foreground), transparent 40%);
  }

  &__toggles {
    display: flex;
    gap: var(--space);
  }

  &__option-row,
  &__validation-row {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
  }

  &__raw-input {
    flex: 1;
    min-width: 0;
    padding: var(--space-xs) var(--space-s);
    border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 80%);
    border-radius: var(--border-radius-s);
    background: var(--color-background);
    color: var(--color-foreground);
    font-size: var(--font-size-xs);
    font-family: inherit;

    &:focus {
      outline: none;
      border-color: var(--color-primary);
    }

    &--select {
      flex: 0 0 auto;
      width: 90px;
    }
  }

  &__delete-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    border: none;
    background: transparent;
    cursor: pointer;
    border-radius: var(--border-radius-s);
    color: color-mix(in srgb, var(--color-foreground), transparent 50%);
    font-size: 0.75rem;

    &:hover {
      background: color-mix(in srgb, var(--color-error), transparent 85%);
      color: var(--color-error);
    }
  }
}
</style>
