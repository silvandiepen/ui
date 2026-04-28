<!-- InputSelect.vue -->
<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useBemm } from 'bemm';
import InputBase from '../Form/InputBase.vue'
import InputCustomSelect from '../InputCustomSelect/InputCustomSelect.vue'
import type { AcceptedOptions, OptionGroup, Option, InputSelectProps, InputSelectEmits } from './InputSelect.model'
import type { CustomOption } from '../InputCustomSelect/InputCustomSelect.model'
import { Size } from '../../../types'

// Define a normalized option group type where all options are Option objects
interface NormalizedOptionGroup {
	title: string
	options: Option[]
}

// Change the type to allow null
const model = defineModel<string | null>({
	default: undefined,
});

const props = withDefaults(defineProps<InputSelectProps>(), {
	value: '',
	label: '',
	description: '',
	error: () => [],
	size: Size.MEDIUM,
	allowNull: false,
	nullLabel: 'Please select...',
	disabled: false,
	options: () => [],
	filterable: false,
	searchable: false,
});

const emit = defineEmits<InputSelectEmits>()

const block = 'input-select';
const bemm = useBemm(block);

const toOptions = (option: string | Option): Option => {
	if (typeof option === 'string') {
		return {
			label: option,
			value: option,
		};
	} else if (option && typeof option === 'object' && ('label' in option || 'value' in option)) {
		return {
			label: option.label || option.value || '',
			value: option.value || option.label || '',
			disabled: option.disabled,
			icon: option.icon
		};
	} else {
		console.warn('Invalid option format:', option);
		return {
			label: String(option),
			value: String(option),
		};
	}
};

const hasOptionGroups = (options: AcceptedOptions): boolean => {
	if (!options || !Array.isArray(options)) return false;
	return options.some((option) => {
		return typeof option === 'object' && 'title' in option && 'options' in option;
	});
};

const hasGroups = ref(hasOptionGroups(props.options));
const isFilterable = computed(() => props.filterable || props.searchable)

const optionsObject = computed<Option[] | NormalizedOptionGroup[]>(() => {
	if (hasOptionGroups(props.options)) {
		return (props.options as OptionGroup[]).map((group: OptionGroup): NormalizedOptionGroup => {
			return {
				title: group.title,
				options: group.options.map((option: string | Option) => toOptions(option)),
			};
		});
	}

	return (props.options as string[] | Option[]).map((option: string | Option) => toOptions(option));
});

const filterableOptions = computed<CustomOption[]>(() => {
	return (optionsObject.value as Option[] | NormalizedOptionGroup[]).flatMap((entry) => {
		if ('title' in entry) {
			return entry.options.map((option) => ({
				...option,
				indent: 1,
			}));
		}

		return entry;
	});
});

const handleChange = (value: string | null) => {
	const finalValue = props.allowNull && value === '' ? null : value;
	emit('change', finalValue);
};
</script>

<template>
	<InputCustomSelect
		v-if="isFilterable"
		v-model="model"
		:label="label"
		:description="description"
		:error="error"
		:size="size"
		:allow-null="allowNull"
		:null-label="nullLabel"
		:disabled="disabled"
		:options="filterableOptions"
		:placeholder="placeholder || nullLabel"
		searchable
		:test-id="testId"
		@change="handleChange"
		@touched="$emit('touched', $event)"
		@focus="$emit('focus', $event)"
		@blur="$emit('blur', $event)"
	/>
	<InputBase
		v-else-if="model !== undefined"
		v-model="model"
		:block="block"
		:label="label"
		:description="description"
		:error="error"
		:size="size"
		:disabled="disabled"
		:test-id="testId"
		@change="handleChange"
		@touched="$emit('touched', $event)"
	>
		<template #control="{ id, value: inputValue, disabled, controlTestId, handleInput }">
			<select
				:id="id"
				:value="inputValue ?? ''"
				:class="bemm('control')"
				:data-test-id="controlTestId"
				:disabled="disabled"
				@input="handleInput"
				@change="handleInput"
			>
				<option
					v-if="allowNull"
					value=""
				>
					{{ nullLabel }}
				</option>

				<template v-if="!hasGroups">
					<option
						v-for="option in optionsObject as Option[]"
						:key="option.value"
						:value="option.value"
					>
						{{ option.label }}
					</option>
				</template>

				<template v-if="hasGroups">
					<optgroup
						v-for="group in optionsObject as NormalizedOptionGroup[]"
						:key="group.title"
						:label="group.title"
					>
						<option
							v-for="option in group.options"
							:key="option.value"
							:value="option.value"
						>
							{{ option.label }}
						</option>
					</optgroup>
				</template>
			</select>
		</template>
	</InputBase>
	<InputBase
		v-else
		:value="props.modelValue ?? ''"
		:block="block"
		:label="label"
		:description="description"
		:error="error"
		:size="size"
		:disabled="disabled"
		:test-id="testId"
		@change="handleChange"
		@touched="$emit('touched', $event)"
	>
		<template #control="{ id, value: inputValue, disabled, controlTestId, handleInput }">
			<select
				:id="id"
				:value="inputValue ?? ''"
				:class="bemm('control')"
				:data-test-id="controlTestId"
				:disabled="disabled"
				@change="
					(e) => {
						handleInput(e);
						handleChange((e.target as HTMLSelectElement).value || null);
					}
				"
			>
				<option
					v-if="allowNull"
					value=""
				>
					{{ nullLabel }}
				</option>

				<template v-if="!hasGroups">
					<option
						v-for="option in optionsObject as Option[]"
						:key="option.value"
						:value="option.value"
					>
						{{ option.label }}
					</option>
				</template>

				<template v-if="hasGroups">
					<optgroup
						v-for="group in optionsObject as NormalizedOptionGroup[]"
						:key="group.title"
						:label="group.title"
					>
						<option
							v-for="option in group.options"
							:key="option.value"
							:value="option.value"
						>
							{{ option.label }}
						</option>
					</optgroup>
				</template>
			</select>
		</template>
	</InputBase>
</template>

<style lang="scss">
@use '../Form/Form.scss' as form;

.input-select {
	@include form.inputBase();
	@include form.inputSelect();

	&__control {
		appearance: none;
		background-image: url('data:image/svg+xml,<svg id="chevron-down" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72"><polyline points="13.95 27.23 36.23 49.5 58.5 27.23" style="fill: none; stroke: currentColor; stroke-linejoin: round; stroke-width:4" /></svg> ');
		background-repeat: no-repeat;
		background-position: right 0.7rem top 50%;
		background-size: 1em auto;
	}
}
</style>
