<!-- InputTextArea.vue -->
<template>
	<InputBase
		v-if="model !== undefined"
		v-model="model"
		:block="block"
		:label="label"
		:description="description"
		:disabled="disabled"
		@change="handleChange"
		@touched="$emit('touched', $event)"
	>
		<template #control="{ id, value: inputValue, disabled, handleInput }">
			<textarea
				:id="id"
				ref="control"
				:value="inputValue"
				:style="textareaStyle"
				:class="[bemm('control'), { 'no-resize': !allowResize }]"
				:placeholder="placeholder"
				:disabled="disabled"
				@input="
					(e) => {
						handleInput(e);
						if (autoGrow) handleAutoGrow(e.target as HTMLTextAreaElement);
					}
				"
			/>
		</template>
	</InputBase>
	<InputBase
		v-else
		:value="model"
		:block="block"
		:label="label"
		:description="description"
		:disabled="disabled"
		@change="handleChange"
		@touched="$emit('touched', $event)"
	>
		<template #control="{ id, value: inputValue, disabled, handleInput }">
			<textarea
				:id="id"
				ref="control"
				:value="inputValue"
				:style="textareaStyle"
				:class="[bemm('control'), { 'no-resize': !allowResize }]"
				:placeholder="placeholder"
				:disabled="disabled"
				@input="
					(e) => {
						handleInput(e);
						if (autoGrow) handleAutoGrow(e.target as HTMLTextAreaElement);
						emit('change', (e.target as HTMLTextAreaElement).value);
					}
				"
			/>
		</template>
	</InputBase>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed } from 'vue';
import { useBemm } from 'bemm';
import InputBase from '../Form/InputBase.vue'

const model = defineModel<string>({
	default: undefined,
});

import type { InputTextAreaProps, InputTextAreaEmits } from './InputTextArea.model'

const props = withDefaults(defineProps<InputTextAreaProps>(), {
	value: '',
	label: '',
	placeholder: '',
	autoGrow: true,
	allowResize: false,
	minRows: 3,
	maxRows: 10,
	disabled: false,
});

const emit = defineEmits<InputTextAreaEmits>()

const block = 'input-textarea';
const bemm = useBemm(block);
const control = ref<HTMLTextAreaElement>();

const controlHeight = ref(0);
const lineHeight = ref(0);

// Calculate base styles including line height and min/max heights
const textareaStyle = computed(() => {
	const styles: Record<string, string> = {
		height: `${controlHeight.value}px`,
	};

	if (props.minRows && lineHeight.value) {
		styles.minHeight = `${props.minRows * lineHeight.value}px`;
	}

	if (props.maxRows && lineHeight.value) {
		styles.maxHeight = `${props.maxRows * lineHeight.value}px`;
	}

	return styles;
});

const handleAutoGrow = (element: HTMLTextAreaElement) => {
	// Reset height to auto to get proper scrollHeight
	element.style.height = 'auto';

	// Get the line height if we haven't yet
	if (!lineHeight.value) {
		const computedStyle = window.getComputedStyle(element);
		lineHeight.value = parseInt(computedStyle.lineHeight);
	}

	// Calculate new height
	let newHeight = element.scrollHeight;

	// Apply min/max constraints
	if (props.minRows && lineHeight.value) {
		const minHeight = props.minRows * lineHeight.value;
		newHeight = Math.max(newHeight, minHeight);
	}

	if (props.maxRows && lineHeight.value) {
		const maxHeight = props.maxRows * lineHeight.value;
		newHeight = Math.min(newHeight, maxHeight);
	}

	controlHeight.value = newHeight;
};

const handleChange = (value: string) => {
	emit('change', value);
};

onMounted(() => {
	if (control.value) {
		// Get initial line height
		const computedStyle = window.getComputedStyle(control.value);
		lineHeight.value = parseInt(computedStyle.lineHeight);

		// Set initial height based on minRows
		controlHeight.value = props.minRows * lineHeight.value;

		// If there's initial content, adjust height accordingly
		if (model.value) {
			handleAutoGrow(control.value);
		}
	}
});
</script>

<style lang="scss">
@use '../Form/Form.scss' as form;
@use '../../../styles/mixins' as m;

.input-textarea {
	@include form.inputBase();

	@include m.component-props((
    'control-font-size': '1em',
    'control-padding-y': '0.75em',
    'control-padding-x': '1em',
  ), 'input-textarea');

	&__control {
		font-size: var(--int-input-textarea-control-font-size);
		font-family: inherit;
		padding: var(--int-input-textarea-control-padding-y) var(--int-input-textarea-control-padding-x);
		width: 100%;
		box-sizing: border-box;
		overflow-y: auto;
		resize: vertical;

		&.no-resize {
			resize: none;
		}
	}
}
</style>
