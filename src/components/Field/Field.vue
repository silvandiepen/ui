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

const bemm = useBemm('ui-field', { return: 'string', includeBaseClass: true })

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

<style lang="scss">
@use '../../styles/mixins' as m;

.ui-field {
  display: flex;
  flex-direction: column;
  gap: calc(var(--space) * 0.4);
}

.ui-field__label {
  font-size: calc(var(--font-size) * 0.9);
  font-weight: var(--font-weight-extra-bold);
  letter-spacing: m.p('label-letter-spacing', 0.05em);
  text-transform: uppercase;
  color: color-mix(in srgb, var(--color-foreground), transparent 44%);
}

.ui-field__required {
  color: var(--color-error);
  margin-inline-start: var(--space-xs);
}

.ui-field__control {
  display: flex;
  flex-direction: column;
}

.ui-field__value {
  color: var(--color-foreground);
}

.ui-field__hint {
  font-size: calc(var(--font-size) * 0.9);
  color: color-mix(in srgb, var(--color-foreground), transparent 52%);
}

.ui-field__error {
  font-size: var(--font-size-xs, 0.75rem);
  color: var(--color-error);
}

.ui-field--is-disabled {
  opacity: 0.5;
  pointer-events: none;
}
</style>
