<!-- InputNumber.vue -->
<template>
	<InputBase
		v-if="model !== undefined"
		v-model="model"
		:block="block"
		:label="label"
		type="text"
		:min="min"
		:max="max"
		:step="step"
		:disabled="disabled"
		:parse-value="parseValue"
		:format-value="formatValue"
		:error="errors"
		@change="emit('change', $event)"
		@touched="emit('touched', $event)"
	/>
	<InputBase
		v-else
		:value="props.modelValue"
		:block="block"
		:label="label"
		type="text"
		:min="min"
		:max="max"
		:step="step"
		:disabled="disabled"
		:parse-value="parseValue"
		:format-value="formatValue"
		:error="errors"
		@change="emit('change', $event)"
		@touched="emit('touched', $event)"
	/>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from '../../../composables/useI18n';
import InputBase from '../Form/InputBase.vue'
import type { InputNumberProps, InputNumberEmits } from './InputNumber.model'
import { parseNumericValue, formatNumericValue } from './InputNumber.model'

const model = defineModel<number>({
	default: undefined,
})

const props = withDefaults(defineProps<InputNumberProps>(), {
	label: '',
	step: 1,
	disabled: false,
	controls: true,
	formatThousands: false
})

const emit = defineEmits<InputNumberEmits>()
const { t } = useI18n()

const block = 'input-number';
const errors = ref<string[]>([]);

const parseValue = (value: string): number | undefined => {
	const parsed = parseNumericValue(value, props.decimals)

	// Check for multiple numbers in input
	const matches = value.replace(/[^\d.-]/g, '').match(/-?\d+\.?\d*/g)
	if (matches && matches.length > 1) {
		errors.value = [t('validation.onlyOneNumberAllowed')]
	} else {
		errors.value = []
	}

	return parsed
}

const formatValue = (value: number | undefined): string => {
	return formatNumericValue(value, props.decimals, props.formatThousands)
}
</script>

<style lang="scss">
@use '../Form/Form.scss' as form;

.input-number {
	@include form.inputBase();

	&--no-controls {
		input {
			appearance: none;
		}
	}
}
</style>
