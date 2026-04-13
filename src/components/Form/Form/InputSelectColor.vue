<template>
	<div :class="blockClasses">
		<label
			v-if="label"
			:class="bemm('label')"
			:for="controlId"
			@click="handleCollapse()"
		>
			{{ label }}
			<Chip>
				<template #pre-content
					><span
						v-if="value"
						:class="['dot', bemm('dot')]"
						:style="`--dot-color: var(--color-${value})`" /></template
				>{{ value ? value : 'none' }}
			</Chip>
		</label>

		<div
			v-if="description"
			:class="bemm('description')"
		>
			{{ description }}
		</div>
		<div :class="bemm('control-container')">
			<div :class="[bemm('control-item', ['', 'clear', '' === value ? 'active' : ''])]">
				<input
					v-if="clearable"
					v-model="internalValue"
					:class="bemm('control-input')"
					type="radio"
					:name="controlId"
					:value="''"
				/>
				<div
					:class="bemm('control-preview')"
					@click="selectColor('')"
				/>
				<label
					v-if="clearable"
					:class="bemm('control-label')"
					:for="controlId"
				>
					Clear
				</label>
			</div>
			<div
				v-for="(color, index) in options"
				:key="color.value"
				:style="`--input-select-color: var(--color-${color.value});`"
				:class="[bemm('control-item', ['', color.value, color.value === value ? 'active' : ''])]"
			>
				<div
					:class="bemm('control-preview')"
					@click="selectColor(color.value)"
				/>
				<input
					:id="`${controlId}-${index}`"
					v-model="internalValue"
					:class="bemm('control-input')"
					type="radio"
					:name="controlId"
					:value="color.value"
				/>
				<label
					:for="`${controlId}-${index}`"
					:class="bemm('control-label')"
				>
					{{ color.label }}
				</label>
			</div>
		</div>
		<div :class="bemm('errors')">
			<div
				v-for="err in error"
				:key="err"
				:class="bemm('error')"
			>
				{{ err }}
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useBemm } from 'bemm';
import { ref, watch, computed, type PropType } from 'vue';
import Chip from '../Chip/Chip.vue';
import { type CollapseOptions, collapseOptions } from './options';
import { useId } from '../../../composables/useId';

const bemm = useBemm('input-select-color');

interface ColorOptions {
	label: string;
	value: string;
}

const props = defineProps({
	value: {
		type: String as PropType<string>,
		default: '',
	},
	options: {
		type: Array as PropType<ColorOptions[]>,
		required: true,
	},
	label: {
		type: String,
		default: '',
	},
	id: {
		type: String,
		default: '',
	},
	clearable: {
		type: Boolean,
		default: false,
	},
	description: {
		type: String,
		default: '',
	},
	collapse: {
		type: Object as PropType<Partial<CollapseOptions>>,
		default: () => ({}),
	},
	error: {
		type: Array as PropType<string[]>,
		default: () => [],
	},
});

const selectColor = (color: string) => {
	internalValue.value = color;
	emitChange();
};

const controlId = ref(props.id || useId());

const modelValue = defineModel({
	type: String,
	default: ''
});

const internalValue = computed({
	get: () => modelValue.value || props.value || '',
	set: (value) => {
		modelValue.value = value;
		emit('update:value', value);
		emit('update:modelValue', value);
	}
});

const emit = defineEmits(['update:value', 'change', 'update:modelValue']);
const emitChange = () => {
	emit('change', internalValue.value);
};

const blockClasses = computed(() => {
	return [bemm(), isCollapsed.value ? bemm('', 'collapsed') : ''];
});

// Collapse Options
const isCollapsed = ref(false);
const handleCollapse = () => {
	const { collapse } = collapseOptions(props.collapse);

	if (!collapse) return;
	isCollapsed.value = !isCollapsed.value;
};

watch(
	() => props.value,
	() => {
		const { collapse, auto, delay } = collapseOptions(props.collapse);
		if (collapse && auto) {
			setTimeout(() => {
				isCollapsed.value = true;
			}, delay);
		}
	}
);
</script>

<style lang="scss">
@use 'Form' as form;

.input-select-color {
	@include form.inputBase();
	@include form.inputSelectColor();
}
</style>
