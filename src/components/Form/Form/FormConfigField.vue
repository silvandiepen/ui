<template>
  <!-- section -->
  <div v-if="config.type === 'section'" class="form-config-field--section">
    <h4>{{ config.label }}</h4>
    <p v-if="config.hint">{{ config.hint }}</p>
  </div>

  <!-- divider -->
  <hr v-else-if="config.type === 'divider'" class="form-config-field--divider" />

  <!-- text -->
  <InputText
    v-else-if="config.type === 'text'"
    :model-value="modelValue as string"
    :label="config.label ?? ''"
    :placeholder="config.placeholder ?? ''"
    :description="config.hint ?? ''"
    :disabled="disabled"
    :error="error ? [error] : []"
    :required="config.required ?? false"
    v-bind="config.props ?? {}"
    @update:model-value="$emit('update:modelValue', $event)"
    @touched="$emit('blur')"
  />

  <!-- email -->
  <InputEmail
    v-else-if="config.type === 'email'"
    :model-value="modelValue as string"
    :label="config.label ?? ''"
    :placeholder="config.placeholder ?? ''"
    :description="config.hint ?? ''"
    :disabled="disabled"
    :error="error ? [error] : []"
    :required="config.required ?? false"
    v-bind="config.props ?? {}"
    @update:model-value="$emit('update:modelValue', $event)"
    @touched="$emit('blur')"
  />

  <!-- password -->
  <InputPassword
    v-else-if="config.type === 'password'"
    :model-value="modelValue as string"
    :label="config.label ?? ''"
    :placeholder="config.placeholder ?? ''"
    :description="config.hint ?? ''"
    :disabled="disabled"
    :error="error ? [error] : []"
    :required="config.required ?? false"
    v-bind="config.props ?? {}"
    @update:model-value="$emit('update:modelValue', $event)"
    @touched="$emit('blur')"
  />

  <!-- number -->
  <InputNumber
    v-else-if="config.type === 'number'"
    :model-value="modelValue as number | undefined"
    :label="config.label ?? ''"
    :placeholder="config.placeholder ?? ''"
    :disabled="disabled"
    v-bind="config.props ?? {}"
    @update:model-value="$emit('update:modelValue', $event)"
    @touched="$emit('blur')"
  />

  <!-- textarea -->
  <InputTextArea
    v-else-if="config.type === 'textarea'"
    :model-value="modelValue as string"
    :label="config.label ?? ''"
    :placeholder="config.placeholder ?? ''"
    :description="config.hint ?? ''"
    :disabled="disabled"
    :error="error ? [error] : []"
    :required="config.required ?? false"
    v-bind="config.props ?? {}"
    @update:model-value="$emit('update:modelValue', $event)"
    @touched="$emit('blur')"
  />

  <!-- select -->
  <InputSelect
    v-else-if="config.type === 'select'"
    :model-value="modelValue as string"
    :label="config.label ?? ''"
    :description="config.hint ?? ''"
    :disabled="disabled"
    :error="error ? [error] : []"
    :options="toSelectOptions(config.options)"
    v-bind="config.props ?? {}"
    @update:model-value="$emit('update:modelValue', $event)"
    @touched="$emit('blur')"
  />

  <!-- checkbox -->
  <InputCheckbox
    v-else-if="config.type === 'checkbox'"
    :model-value="Boolean(modelValue)"
    :label="config.label ?? ''"
    :disabled="disabled"
    :error="error ? [error] : []"
    v-bind="config.props ?? {}"
    @update:model-value="$emit('update:modelValue', $event)"
    @touched="$emit('blur')"
  />

  <!-- toggle -->
  <InputToggle
    v-else-if="config.type === 'toggle'"
    :model-value="Boolean(modelValue)"
    :label="config.label ?? ''"
    :description="config.hint ?? ''"
    :disabled="disabled"
    :error="error ? [error] : []"
    v-bind="config.props ?? {}"
    @update:model-value="$emit('update:modelValue', $event)"
    @touched="$emit('blur')"
  />

  <!-- switch -->
  <InputSwitch
    v-else-if="config.type === 'switch'"
    :model-value="modelValue as string | number | boolean | undefined"
    :label="config.label ?? ''"
    :disabled="disabled"
    :error="error ? [error] : []"
    :items="toSwitchItems(config.options)"
    v-bind="config.props ?? {}"
    @update:model-value="$emit('update:modelValue', $event)"
    @touched="$emit('blur')"
  />

  <!-- radio group -->
  <div v-else-if="config.type === 'radio'" class="form-config-field__radio-group">
    <div class="form-config-field__radio-label">
      {{ config.label }}
      <span v-if="config.required" class="form-config-field__radio-required">*</span>
    </div>
    <InputRadio
      v-for="option in (config.options ?? [])"
      :key="String(option.value)"
      :model-value="modelValue as string"
      :value="String(option.value)"
      :label="option.label"
      :name="config.key"
      :disabled="disabled || option.disabled"
      v-bind="config.props ?? {}"
      @update:model-value="$emit('update:modelValue', $event)"
      @touched="$emit('blur')"
    />
    <div v-if="error" class="form-config-field__radio-error">{{ error }}</div>
    <div v-else-if="config.hint" class="form-config-field__radio-hint">{{ config.hint }}</div>
  </div>

  <!-- date -->
  <InputDate
    v-else-if="config.type === 'date'"
    :model-value="(modelValue as any)"
    :label="config.label ?? ''"
    :placeholder="config.placeholder ?? ''"
    :description="config.hint ?? ''"
    :disabled="disabled"
    :error="error ? [error] : []"
    v-bind="config.props ?? {}"
    @update:model-value="$emit('update:modelValue', $event)"
  />

  <!-- color -->
  <InputColor
    v-else-if="config.type === 'color'"
    :model-value="modelValue as string"
    :label="config.label ?? ''"
    :disabled="disabled"
    v-bind="config.props ?? {}"
    @update:model-value="$emit('update:modelValue', $event)"
    @touched="$emit('blur')"
  />

  <!-- range -->
  <InputRange
    v-else-if="config.type === 'range'"
    :model-value="modelValue as number"
    :label="config.label ?? ''"
    :description="config.hint ?? ''"
    :disabled="disabled"
    :error="error ?? undefined"
    v-bind="config.props ?? {}"
    @update:model-value="$emit('update:modelValue', $event)"
    @blur="$emit('blur')"
  />

  <!-- pin -->
  <PinInput
    v-else-if="config.type === 'pin'"
    :model-value="modelValue as string"
    :disabled="disabled"
    :error="Boolean(error)"
    v-bind="config.props ?? {}"
    @update:model-value="$emit('update:modelValue', $event)"
    @blur="$emit('blur')"
  />
</template>

<script setup lang="ts">
import type { FormConfigFieldConfig, FormConfigOption } from './FormConfig.model'
import type { Option as SelectOption } from '../InputSelect/InputSelect.model'
import type { SwitchItem } from '../InputSwitch/InputSwitch.model'

import InputText from '../InputText/InputText.vue'
import InputEmail from '../InputEmail/InputEmail.vue'
import InputPassword from '../InputPassword/InputPassword.vue'
import InputNumber from '../InputNumber/InputNumber.vue'
import InputTextArea from '../InputTextArea/InputTextArea.vue'
import InputSelect from '../InputSelect/InputSelect.vue'
import InputCheckbox from '../InputCheckbox/InputCheckbox.vue'
import InputToggle from '../InputToggle/InputToggle.vue'
import InputSwitch from '../InputSwitch/InputSwitch.vue'
import InputRadio from '../InputRadio/InputRadio.vue'
import InputDate from '../InputDate/InputDate.vue'
import InputColor from '../InputColor/InputColor.vue'
import InputRange from '../InputRange/InputRange.vue'
import PinInput from '../PinInput/PinInput.vue'

const props = defineProps<{
  config: FormConfigFieldConfig
  modelValue: unknown
  error?: string
  disabled?: boolean
}>()

defineEmits<{
  'update:modelValue': [value: unknown]
  blur: []
}>()

function toSelectOptions(options: FormConfigOption[] | undefined): SelectOption[] {
  return (options ?? []).map((o) => ({
    label: o.label,
    value: String(o.value),
    disabled: o.disabled,
    icon: o.icon,
  }))
}

function toSwitchItems(options: FormConfigOption[] | undefined): SwitchItem[] {
  return (options ?? []).map((o) => ({
    label: o.label,
    value: o.value as string | number | boolean,
    disabled: o.disabled,
    icon: o.icon ?? null,
  }))
}
</script>

<style lang="scss">
.form-config-field {
  &--section {
    h4 {
      margin: 0 0 var(--space-xs);
      font-size: var(--font-size-m);
      font-weight: 600;
    }
    p {
      margin: 0;
      font-size: var(--font-size-s);
      color: color-mix(in srgb, var(--color-foreground), transparent 40%);
    }
  }

  &--divider {
    border: none;
    border-top: var(--border-width, 1px) solid var(--color-border, currentColor);
    margin: 0;
    opacity: 0.2;
  }

  &__radio-group {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  &__radio-label {
    font-size: var(--font-size-s);
    font-weight: 500;
  }

  &__radio-required {
    color: var(--color-error, red);
    margin-left: 2px;
  }

  &__radio-error {
    font-size: var(--font-size-xs);
    color: var(--color-error, red);
  }

  &__radio-hint {
    font-size: var(--font-size-xs);
    color: color-mix(in srgb, var(--color-foreground), transparent 40%);
  }
}
</style>
