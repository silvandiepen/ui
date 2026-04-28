<template>
	<div
		:class="[bemm(), bemm('', direction)]"
		:data-test-id="testId"
	>
		<template v-if="type === 'checkbox'">
			<InputCheckbox
				v-for="option in options"
				:key="option.value"
				:model-value="isSelected(option.value)"
				:label="option.label"
				:disabled="option.disabled || disabled"
				:name="name"
				:test-id="getTestId(props.testId, `option-${String(option.value)}`)"
				@update:model-value="(checked) => toggleOption(option.value, !!checked)"
			/>
		</template>

		<template v-else-if="type === 'toggle'">
			<InputToggle
				v-for="option in options"
				:key="option.value"
				:model-value="isSelected(option.value)"
				:label="option.label"
				:disabled="option.disabled || disabled"
				:name="name"
				:test-id="getTestId(props.testId, `option-${String(option.value)}`)"
				@update:model-value="(checked) => toggleOption(option.value, !!checked)"
			/>
		</template>

		<template v-else>
			<InputRadio
				v-for="option in options"
				:key="option.value"
				:model-value="radioValue"
				:value="String(option.value)"
				:label="option.label"
				:name="radioName"
				:disabled="option.disabled || disabled"
				:test-id="getTestId(props.testId, `option-${String(option.value)}`)"
				@update:model-value="(value) => selectRadio(String(value))"
			/>
		</template>
	</div>
</template>

<script lang="ts" setup>
import { computed, useId } from 'vue'
import { useBemm } from 'bemm'
import InputCheckbox from '../InputCheckbox/InputCheckbox.vue'
import InputRadio from '../InputRadio/InputRadio.vue'
import InputToggle from '../InputToggle/InputToggle.vue'
import type { InputOptionsEmits, InputOptionsProps } from './InputOptions.model'
import { getTestId } from '../../../utils/testId'

const model = defineModel<(string | number)[]>({ default: () => [] })

const props = withDefaults(defineProps<InputOptionsProps>(), {
  type: 'checkbox',
  multiple: true,
  name: '',
  disabled: false,
  direction: 'vertical',
})

const emit = defineEmits<InputOptionsEmits>()

const block = 'input-options'
const bemm = useBemm(block)

const generatedId = useId()

const isSingleSelect = computed(() => props.type === 'radio' || !props.multiple)

const radioName = computed(() => props.name || `input-options-${generatedId}`)

const radioValue = computed(() => {
  const val = model.value[0]
  return val != null ? String(val) : ''
})

const isSelected = (value: string | number): boolean => {
  return model.value.includes(value)
}

const toggleOption = (value: string | number, checked: boolean) => {
  if (isSingleSelect.value) {
    model.value = checked ? [value] : []
  } else {
    if (checked) {
      model.value = [...model.value, value]
    } else {
      model.value = model.value.filter(v => v !== value)
    }
  }

  emit('change', [...model.value])
  emit('touched', true)
}

const selectRadio = (value: string) => {
  const option = props.options.find(o => String(o.value) === value)
  const typedValue = option?.value ?? value

  model.value = value !== '' ? [typedValue] : []
  emit('change', [...model.value])
  emit('touched', true)
}
</script>

<style lang="scss">
.input-options {
  display: flex;
  flex-direction: column;
  gap: var(--space-s);

  &--horizontal {
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
