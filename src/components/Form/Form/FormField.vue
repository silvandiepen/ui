<template>
  <div :class="fieldClasses">
    <div :class="bemm('main')" :style="mainStyles">
      <label v-if="label" :for="inputId" :class="bemm('label')">
        {{ label }}
        <span v-if="required" :class="bemm('required')">*</span>
      </label>

      <div :class="bemm('input')">
        <slot :id="inputId" />
      </div>
    </div>

    <div v-if="shouldShowDescription || shouldShowError" :class="bemm('info')">
      <p v-if="shouldShowError" :class="bemm('error')">
        {{ computedError }}
      </p>
      <p v-else-if="shouldShowDescription" :class="bemm('description')">
        {{ description }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { useBemm } from 'bemm'
import type { FormFieldProps } from './Form.model'

const props = withDefaults(defineProps<FormFieldProps>(), {
  required: false,
  showError: true,
  direction: 'column',
  gap: 'var(--space-xs)',
  labelWidth: 'auto',
  align: 'center',
})

const bemm = useBemm('form-field')

// Inject form context
const formContext = inject<any>('formContext', null)

// Generate unique ID
const inputId = computed(() =>
  `field-${props.name}-${Math.random().toString(36).substr(2, 9)}`
)

// Computed
const computedError = computed(() => {
  if (props.error) return props.error
  if (formContext?.errors.value && formContext.errors.value[props.name]) {
    return formContext.errors.value[props.name]
  }
  return null
})

const shouldShowError = computed(() => {
  return props.showError && computedError.value &&
    (formContext?.touched.value?.[props.name] || formContext?.showErrors.value)
})

const shouldShowDescription = computed(() => {
  return props.description && !shouldShowError.value
})

const fieldClasses = computed(() => {
  return bemm('', {
    row: props.direction === 'row',
    required: props.required,
    error: shouldShowError.value,
    disabled: formContext?.disabled.value
  })
})

const mainStyles = computed(() => ({
  '--form-field-direction': props.direction,
  '--form-field-gap': props.gap,
  '--form-field-label-width': props.direction === 'row' ? props.labelWidth : 'auto',
  '--form-field-align': props.align,
}))
</script>

<style lang="scss">
@use '../../../styles/mixins' as m;

.form-field {
  @include m.component-props((
    'label-font-size': '0.875rem',
    'label-font-weight': '500',
    'required-margin-left': '0.25rem',
    'info-font-size': '0.875rem',
    'info-line-height': '1.4',
  ), 'form-field');

  display: flex;
  flex-direction: column;
  gap: var(--space-xs);

  &__main {
    display: flex;
    flex-direction: var(--form-field-direction, column);
    align-items: var(--form-field-align, center);
    gap: var(--form-field-gap, var(--space-xs));
  }

  &__label {
    font-weight: var(--int-form-field-label-font-weight);
    color: var(--color-foreground);
    font-size: var(--int-form-field-label-font-size);
    width: var(--form-field-label-width, auto);
    flex-shrink: 0;
  }

  &__required {
    color: var(--color-error);
    margin-left: var(--int-form-field-required-margin-left);
  }

  &__input {
    width: 100%;
    min-width: 0;
  }

  &__info {
    font-size: var(--int-form-field-info-font-size);
    line-height: var(--int-form-field-info-line-height);
  }

  &__error {
    color: var(--color-error);
    margin: 0;
  }

  &__description {
    color: var(--color-text-secondary);
    margin: 0;
  }

  &--error {
    .form-field__label {
      color: var(--color-error);
    }
  }

  &--row {
    .form-field__label {
      line-height: 1;
    }
  }

  &--disabled {
    opacity: 0.6;
    pointer-events: none;
  }
}
</style>
