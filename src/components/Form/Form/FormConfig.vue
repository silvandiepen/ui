<template>
  <form @submit.prevent="handleSubmit" :class="rootClasses">
    <!-- Step navigation (only for multi-step) -->
    <FormConfigStepNav
      v-if="isMultiStep"
      :steps="visibleSteps"
      :current-index="currentStepIndex"
    />

    <!-- Step title/description (for multi-step) -->
    <div v-if="isMultiStep && currentStep" :class="bemm('step-header')">
      <h3>{{ currentStep.title }}</h3>
      <p v-if="currentStep.description">{{ currentStep.description }}</p>
    </div>

    <!-- Fields grid -->
    <div :class="bemm('fields')" :style="gridStyle">
      <div
        v-for="field in visibleFields"
        :key="field.key"
        :class="bemm('field-wrapper')"
        :style="{ '--form-config-field-cols': String(field.cols ?? config.columns ?? 1) }"
      >
        <FormConfigField
          :config="field"
          :model-value="values[field.key]"
          :error="errors[field.key]"
          :disabled="disabled || checkFieldDisabled(field)"
          @update:model-value="handleFieldChange(field.key, $event)"
          @blur="handleBlur(field.key)"
        />
      </div>
    </div>

    <!-- Actions -->
    <div :class="bemm('actions')">
      <Button
        v-for="action in resolvedActions"
        :key="action.key"
        :type="action.type === 'submit' ? 'submit' : 'button'"
        :variant="(action.variant ?? 'outline') as any"
        :icon="action.icon"
        :loading="action.type === 'submit' && isSubmitting"
        :disabled="
          disabled ||
          (typeof action.disabled === 'function'
            ? action.disabled(values, meta)
            : action.disabled) ||
          false
        "
        @click="action.type !== 'submit' ? handleAction(action) : undefined"
      >{{ action.label }}</Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useBemm } from 'bemm'

import Button from '../../Button/Button.vue'
import FormConfigField from './FormConfigField.vue'
import FormConfigStepNav from './FormConfigStepNav.vue'
import { useFormConfig } from './useFormConfig'
import type { FormConfig, FormConfigAction, FormConfigData } from './FormConfig.model'

// ---------------------------------------------------------------------------
// Props & emits
// ---------------------------------------------------------------------------
const props = withDefaults(
  defineProps<{
    config: FormConfig
    modelValue?: FormConfigData
    loading?: boolean
    disabled?: boolean
  }>(),
  {
    loading: false,
    disabled: false,
  }
)

const emit = defineEmits<{
  'update:modelValue': [values: FormConfigData]
  submit: [values: FormConfigData]
  reset: []
  'step-change': [step: number]
  action: [key: string, values: FormConfigData]
  'field-change': [key: string, value: unknown]
}>()

// ---------------------------------------------------------------------------
// Composable
// ---------------------------------------------------------------------------
const {
  values,
  errors,
  currentStepIndex,
  isSubmitting,
  isMultiStep,
  visibleSteps,
  currentStep,
  visibleFields,
  isFirstStep,
  isLastStep,
  meta,
  setValue,
  setValues,
  setTouched,
  validateAll,
  validateStep,
  nextStep,
  prevStep,
  reset,
  checkFieldDisabled,
} = useFormConfig(() => props.config)

// ---------------------------------------------------------------------------
// Sync external modelValue → internal values
// ---------------------------------------------------------------------------
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) setValues(newVal)
  },
  { deep: true }
)

// Sync internal values → external modelValue
watch(
  values,
  (newVal) => {
    emit('update:modelValue', { ...newVal })
  },
  { deep: true }
)

// ---------------------------------------------------------------------------
// BEM
// ---------------------------------------------------------------------------
const bemm = useBemm('form-config')

const rootClasses = computed(() =>
  bemm('', {
    loading: props.loading,
    disabled: props.disabled,
  })
)

// ---------------------------------------------------------------------------
// Grid style
// ---------------------------------------------------------------------------
const gridStyle = computed(() => ({
  '--form-config-columns': String(props.config.columns ?? 1),
}))

// ---------------------------------------------------------------------------
// Resolved actions
// ---------------------------------------------------------------------------
const resolvedActions = computed<FormConfigAction[]>(() => {
  if (props.config.actions) return props.config.actions

  if (!isMultiStep.value) {
    return [{ key: 'submit', label: 'Submit', type: 'submit', variant: 'primary' }]
  }

  if (isFirstStep.value && !isLastStep.value) {
    return [{ key: 'next', label: 'Next', type: 'next', variant: 'primary' }]
  }

  if (isLastStep.value) {
    return [
      { key: 'prev', label: 'Back', type: 'prev', variant: 'outline' },
      { key: 'submit', label: 'Submit', type: 'submit', variant: 'primary' },
    ]
  }

  // Middle steps
  return [
    { key: 'prev', label: 'Back', type: 'prev', variant: 'outline' },
    { key: 'next', label: 'Next', type: 'next', variant: 'primary' },
  ]
})

// ---------------------------------------------------------------------------
// Handlers
// ---------------------------------------------------------------------------
function handleFieldChange(key: string, value: unknown): void {
  setValue(key, value)
  emit('field-change', key, value)
  emit('update:modelValue', { ...values.value })
}

function handleBlur(key: string): void {
  setTouched(key)
}

function handleAction(action: FormConfigAction): void {
  switch (action.type) {
    case 'submit':
      handleSubmit()
      break
    case 'reset':
      handleReset()
      break
    case 'next': {
      const advanced = nextStep()
      if (advanced) emit('step-change', currentStepIndex.value)
      break
    }
    case 'prev': {
      prevStep()
      emit('step-change', currentStepIndex.value)
      break
    }
    default:
      emit('action', action.key, { ...values.value })
  }
}

async function handleSubmit(): Promise<void> {
  if (!validateAll()) return
  isSubmitting.value = true
  emit('submit', { ...values.value })
  isSubmitting.value = false
}

function handleReset(): void {
  reset()
  emit('reset')
}
</script>

<style lang="scss">
.form-config {
  display: flex;
  flex-direction: column;
  gap: var(--space);

  &--loading {
    opacity: 0.7;
    pointer-events: none;
  }

  &--disabled {
    opacity: 0.6;
    pointer-events: none;
  }

  &__fields {
    display: grid;
    grid-template-columns: repeat(var(--form-config-columns, 1), 1fr);
    gap: var(--space);
  }

  &__field-wrapper {
    grid-column: span min(var(--form-config-field-cols, 1), var(--form-config-columns, 1));
  }

  &__actions {
    display: flex;
    gap: var(--space-s);
    justify-content: flex-end;
  }

  &__step-header {
    h3 {
      margin: 0;
    }

    p {
      margin: calc(var(--space-xs) * 0.5) 0 0;
      color: color-mix(in srgb, var(--color-foreground), transparent 40%);
      font-size: var(--font-size-s);
    }
  }
}
</style>
