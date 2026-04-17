import { ref, computed, watch, toValue, type MaybeRefOrGetter, type Ref } from 'vue'
import type {
  FormConfig,
  FormConfigData,
  FormConfigFieldConfig,
  FormConfigMeta,
} from './FormConfig.model'
import {
  extractDefaultValues,
  getAllFields,
  getVisibleFields,
  getVisibleSteps,
  isFieldVisible,
  validateValue,
} from './FormConfig.utils'

const STRUCTURAL_TYPES = new Set(['divider', 'section'])

export function useFormConfig(configInput: MaybeRefOrGetter<FormConfig>) {
  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------
  const values = ref<FormConfigData>({})
  const errors = ref<Record<string, string>>({})
  const touched = ref<Record<string, boolean>>({})
  const currentStepIndex = ref(0)
  const isSubmitting = ref(false)

  // ---------------------------------------------------------------------------
  // Computed helpers
  // ---------------------------------------------------------------------------
  const config = computed<FormConfig>(() => toValue(configInput))

  const isMultiStep = computed<boolean>(
    () => Boolean(config.value.steps && config.value.steps.length > 0)
  )

  const visibleSteps = computed(() =>
    getVisibleSteps(config.value, values.value)
  )

  const currentStep = computed(() => {
    if (!isMultiStep.value) return null
    return visibleSteps.value[currentStepIndex.value] ?? null
  })

  const currentStepFields = computed<FormConfigFieldConfig[]>(() => {
    if (isMultiStep.value) {
      return currentStep.value?.fields ?? []
    }
    return config.value.fields ?? []
  })

  const visibleFields = computed<FormConfigFieldConfig[]>(() =>
    getVisibleFields(currentStepFields.value, values.value)
  )

  const allFields = computed<FormConfigFieldConfig[]>(() =>
    getAllFields(config.value)
  )

  const isFirstStep = computed<boolean>(() => currentStepIndex.value === 0)

  const isLastStep = computed<boolean>(
    () => currentStepIndex.value >= visibleSteps.value.length - 1
  )

  const isDirty = computed<boolean>(() => {
    const defaults = extractDefaultValues(config.value)
    return allFields.value.some((field) => {
      const current = values.value[field.key]
      const def = defaults[field.key]
      return current !== def
    })
  })

  const isValid = computed<boolean>(() => Object.keys(errors.value).length === 0)

  const meta = computed<FormConfigMeta>(() => ({
    currentStep: currentStepIndex.value,
    totalSteps: visibleSteps.value.length,
    isFirstStep: isFirstStep.value,
    isLastStep: isLastStep.value,
    isDirty: isDirty.value,
    isValid: isValid.value,
  }))

  // ---------------------------------------------------------------------------
  // Methods
  // ---------------------------------------------------------------------------
  function setValue(key: string, value: unknown): void {
    values.value = { ...values.value, [key]: value }
    clearError(key)
    if (config.value.validateOnChange) {
      validateField(key)
    }
  }

  function setValues(data: FormConfigData): void {
    values.value = { ...values.value, ...data }
  }

  function setError(key: string, message: string): void {
    errors.value = { ...errors.value, [key]: message }
  }

  function clearError(key: string): void {
    if (errors.value[key] !== undefined) {
      const next = { ...errors.value }
      delete next[key]
      errors.value = next
    }
  }

  function clearAllErrors(): void {
    errors.value = {}
  }

  function setTouched(key: string): void {
    touched.value = { ...touched.value, [key]: true }
    if (config.value.validateOnBlur) {
      validateField(key)
    }
  }

  function validateField(key: string): boolean {
    // Find field in allFields
    const field = allFields.value.find((f) => f.key === key)
    if (!field) return true
    // Skip structural types
    if (STRUCTURAL_TYPES.has(field.type)) return true
    // Skip invisible fields
    if (!isFieldVisible(field, values.value)) {
      clearError(key)
      return true
    }

    // Build rules: auto-required rule + explicit validation rules
    const rules = [...(field.validation ?? [])]
    if (field.required) {
      // Prepend a required rule if not already present
      const hasRequired = rules.some((r) => r.type === 'required')
      if (!hasRequired) {
        rules.unshift({ type: 'required', message: `${field.label ?? key} is required` })
      }
    }

    const error = validateValue(values.value[key], rules, values.value)
    if (error) {
      setError(key, error)
      return false
    } else {
      clearError(key)
      return true
    }
  }

  function validateStep(): boolean {
    let valid = true
    for (const field of visibleFields.value) {
      if (!validateField(field.key)) {
        valid = false
      }
    }
    return valid
  }

  function validateAll(): boolean {
    // Validate all visible fields across all steps / flat fields
    let valid = true
    const allVisible = isMultiStep.value
      ? visibleSteps.value.flatMap((s) => getVisibleFields(s.fields, values.value))
      : getVisibleFields(config.value.fields ?? [], values.value)

    for (const field of allVisible) {
      if (!validateField(field.key)) {
        valid = false
      }
    }
    return valid
  }

  function reset(): void {
    values.value = extractDefaultValues(config.value)
    errors.value = {}
    touched.value = {}
    currentStepIndex.value = 0
  }

  function nextStep(): boolean {
    if (isLastStep.value) return false
    if (!validateStep()) return false
    currentStepIndex.value++
    return true
  }

  function prevStep(): boolean {
    if (isFirstStep.value) return false
    currentStepIndex.value--
    return true
  }

  function goToStep(index: number): void {
    if (index >= 0 && index < visibleSteps.value.length) {
      currentStepIndex.value = index
    }
  }

  function checkFieldVisible(field: FormConfigFieldConfig): boolean {
    return isFieldVisible(field, values.value)
  }

  function checkFieldDisabled(field: FormConfigFieldConfig): boolean {
    if (typeof field.disabled === 'function') {
      return field.disabled(values.value)
    }
    return field.disabled ?? false
  }

  function init(): void {
    values.value = extractDefaultValues(config.value)
  }

  // ---------------------------------------------------------------------------
  // Watchers
  // ---------------------------------------------------------------------------
  watch(
    config,
    () => {
      init()
    },
    { deep: true, immediate: true }
  )

  return {
    // state
    values,
    errors,
    touched,
    currentStepIndex,
    isSubmitting,
    // computed
    isMultiStep,
    visibleSteps,
    currentStep,
    currentStepFields,
    visibleFields,
    allFields,
    isFirstStep,
    isLastStep,
    isDirty,
    isValid,
    meta,
    // methods
    setValue,
    setValues,
    setError,
    clearError,
    clearAllErrors,
    setTouched,
    validateField,
    validateStep,
    validateAll,
    reset,
    nextStep,
    prevStep,
    goToStep,
    checkFieldVisible,
    checkFieldDisabled,
    init,
  }
}

export type UseFormConfig = ReturnType<typeof useFormConfig>
