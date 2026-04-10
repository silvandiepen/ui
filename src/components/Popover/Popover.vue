<template>
	<div
		:class="bemm('', [isOpen ? 'open' : '', disabled ? 'disabled' : ''])"
		v-click-outside="close"
		@click.stop
	>
		<div :class="bemm('trigger')" @click.stop="handleTriggerClick">
			<slot
				name="trigger"
				:is-open="isOpen"
				:toggle="toggle"
				:open="open"
				:close="close"
			>
				<slot
					name="reference"
					:is-open="isOpen"
					:toggle="toggle"
					:open="open"
					:close="close"
				></slot>
			</slot>
		</div>

		<div v-if="isOpen" :class="panelClasses" :style="panelStyle" @click.stop>
			<header v-if="title" :class="bemm('title')">{{ title }}</header>
			<div :class="bemm('content')" @click="closeIfNeeded">
				<slot
					:is-open="isOpen"
					:toggle="toggle"
					:open="open"
					:close="close"
				></slot>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed, ref, useSlots, watch } from 'vue';
import { useBemm } from 'bemm';
import type { PopoverPlacement } from './Popover.model';

defineOptions({
	name: 'ArPopover',
});

const props = withDefaults(
	defineProps<{
		modelValue?: boolean;
		placement?: PopoverPlacement;
		title?: string;
		width?: number | string;
		trigger?: 'click';
		disabled?: boolean;
		closeOnContentClick?: boolean;
	}>(),
	{
		modelValue: undefined,
		placement: 'bottom',
		title: '',
		width: undefined,
		trigger: 'click',
		disabled: false,
		closeOnContentClick: false,
	}
);

const emit = defineEmits<{
	(e: 'update:modelValue', value: boolean): void;
	(e: 'change', value: boolean): void;
}>();
const slots = useSlots();

const bemm = useBemm('ar-popover', {
	return: 'string',
	includeBaseClass: true,
});

const internalOpen = ref(false);

const isControlled = computed(() => typeof props.modelValue === 'boolean');
const isOpen = computed(() =>
	isControlled.value ? Boolean(props.modelValue) : internalOpen.value
);

watch(
	() => props.modelValue,
	(value) => {
		if (typeof value === 'boolean') {
			internalOpen.value = value;
		}
	}
);

const setOpen = (value: boolean) => {
	if (props.disabled) {
		return;
	}
	if (!isControlled.value) {
		internalOpen.value = value;
	}
	emit('update:modelValue', value);
	emit('change', value);
};

const open = () => setOpen(true);
const close = () => setOpen(false);
const toggle = () => setOpen(!isOpen.value);

const closeIfNeeded = () => {
	if (props.closeOnContentClick) {
		close();
	}
};

const handleTriggerClick = () => {
	if (slots.trigger) {
		return;
	}
	if (props.trigger === 'click') {
		toggle();
	}
};

const panelClasses = computed(() =>
	bemm('panel', [props.placement, isOpen.value ? 'open' : ''])
);

const panelStyle = computed(() => {
	if (props.width === undefined || props.width === null || props.width === '') {
		return undefined;
	}
	const width =
		typeof props.width === 'number' ? `${props.width}px` : String(props.width);
	return { width };
});
</script>

<style lang="scss">
.ar-popover {
	position: relative;
	display: inline-flex;

	&__panel {
		position: absolute;
		z-index: 30;
		background: var(--color-background);
		border: 1px solid
			color-mix(in srgb, var(--color-foreground), transparent 86%);
		border-radius: var(--border-radius);
		box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
		padding: var(--space-s);
		min-width: 180px;
	}

	&__panel--bottom {
		top: calc(100% + var(--space-xs));
		left: 0;
	}

	&__panel--top {
		bottom: calc(100% + var(--space-xs));
		left: 0;
	}

	&__panel--left {
		right: calc(100% + var(--space-xs));
		top: 0;
	}

	&__panel--right {
		left: calc(100% + var(--space-xs));
		top: 0;
	}

	&__title {
		font-size: var(--font-size-s);
		font-weight: 600;
		margin-bottom: var(--space-xs);
	}

	&__content {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	&--disabled {
		opacity: 0.6;
		pointer-events: none;
	}
}
</style>
