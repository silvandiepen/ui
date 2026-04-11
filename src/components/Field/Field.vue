<template>
  <div :class="fieldClasses">
    <label v-if="label" :for="fieldId" :class="bemm('label')">
      {{ label }}
      <span v-if="required" :class="bemm('required')" aria-hidden="true">*</span>
    </label>
    <div :class="bemm('control')">
      <slot>
        <span :class="bemm('value')">{{ displayValue }}</span>
      </slot>
    </div>
    <p v-if="hint" :class="bemm('hint')">{{ hint }}</p>
    <p v-if="error" :class="bemm('error')" role="alert">{{ error }}</p>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useBemm } from 'bemm'
import { FieldType } from './Field.model'

defineOptions({ name: 'SilField' })

const props = withDefaults(
  defineProps<{
    label?: string
    hint?: string
    error?: string
    required?: boolean
    disabled?: boolean
    id?: string
    type?: FieldType | string
    value?: unknown
    format?: string | ((value: unknown) => string)
    copyable?: boolean
    trueLabel?: string
    falseLabel?: string
    prefix?: string
    maxChars?: number
  }>(),
  {
    label: undefined,
    hint: undefined,
    error: undefined,
    required: false,
    disabled: false,
    id: undefined,
    type: FieldType.TEXT,
    value: undefined,
    format: undefined,
    copyable: false,
    trueLabel: 'Yes',
    falseLabel: 'No',
    prefix: '',
    maxChars: undefined,
  }
)

const fieldId = computed(() => props.id ?? `field-${Math.random().toString(36).slice(2, 8)}`)

const bemm = useBemm('sil-field', { return: 'string', includeBaseClass: true })

const displayValue = computed(() => {
  if (typeof props.format === 'function') {
    return props.format(props.value)
  }

  if (props.type === FieldType.BOOLEAN || props.type === FieldType.SWITCH) {
    return props.value ? props.trueLabel : props.falseLabel
  }

  const stringValue = props.value === null || props.value === undefined ? '' : String(props.value)
  const prefixedValue = props.prefix ? `${props.prefix}${stringValue}` : stringValue

  if (props.maxChars && prefixedValue.length > props.maxChars) {
    return `${prefixedValue.slice(0, props.maxChars)}...`
  }

  return prefixedValue
})

const fieldClasses = computed(() =>
  bemm('', {
    'has-error': Boolean(props.error),
    'is-disabled': props.disabled,
    'is-required': props.required,
  })
)
</script>

<style>
.sil-field {
  display: flex;
  flex-direction: column;
  gap: calc(var(--space) * 0.4);
}

.sil-field__label {
  font-size: calc(var(--font-size) * 0.9);
  font-weight: var(--font-weight-extra-bold);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--color-foreground), transparent 44%);
}

.sil-field__required {
  color: var(--color-error);
  margin-inline-start: var(--space-xs);
}

.sil-field__control {
  display: flex;
  flex-direction: column;
}

.sil-field__value {
  color: var(--color-foreground);
}

.sil-field__hint {
  font-size: calc(var(--font-size) * 0.9);
  color: color-mix(in srgb, var(--color-foreground), transparent 52%);
}

.sil-field__error {
  font-size: var(--font-size-xs, 0.75rem);
  color: var(--color-error);
}

.sil-field--is-disabled {
  opacity: 0.5;
  pointer-events: none;
}
</style>
