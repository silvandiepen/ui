<template>
	<Tooltip :disabled="!hasTooltip" v-bind="tooltipBindings">
		<dl v-bind="$attrs" :class="bemm()">
			<Icon :name="preIcon" v-if="preIcon" :class="bemm('pre-icon')" />
			<dt :class="bemm('title')">
				<Icon :name="icon" v-if="icon" :class="bemm('icon')" />
				<span :class="bemm('label')">
					{{ label }}
				</span>
			</dt>
			<dd :class="bemm('detail')">
				<template v-if="groupValue">
					<ChipGroup>
						<Chip v-for="(item, index) in groupValue" :key="index">
							{{ item }}
						</Chip>
					</ChipGroup>
				</template>
				<template v-else-if="hasValue">
					{{ scalarValue }}
				</template>
				<slot></slot>
			</dd>
		</dl>
		<template v-if="$slots.tooltip" #content>
			<slot name="tooltip"></slot>
		</template>
	</Tooltip>
</template>

<script lang="ts" setup>
import { computed, PropType, useSlots } from 'vue';
import { useBemm } from 'bemm';
import { Icon } from '@/components/ui/Icon';
import { TooltipWrapper as Tooltip } from '@/components/ui/Tooltip';
import type { TooltipOptions } from '@/components/ui/Tooltip';
import Chip from './Chip.vue';
import ChipGroup from './ChipGroup.vue';
import { IconNameOrString } from '../Icon';

defineOptions({
	inheritAttrs: false,
});

const props = defineProps({
	label: {
		type: String,
		required: true,
	},
	value: {
		type: [String, Number, Array] as PropType<string | number | string[]>,
		required: false,
	},
	icon: {
		type: String as PropType<IconNameOrString>,
		required: false,
	},
	preIcon: {
		type: String as PropType<IconNameOrString>,
		required: false,
	},
	tooltip: {
		type: [String, Object] as PropType<string | TooltipOptions>,
		default: null,
	},
});

const slots = useSlots();
const bemm = useBemm('ar-dl', {
	return: 'string',
	includeBaseClass: true,
});

const groupValue = computed(() => {
	return Array.isArray(props.value) ? props.value : null;
});
const scalarValue = computed(() => {
	return !Array.isArray(props.value) ? props.value : null;
});
const hasValue = computed(() => {
	return scalarValue.value !== null && scalarValue.value !== undefined;
});
const tooltipBindings = computed<TooltipOptions>(() => {
	if (typeof props.tooltip === 'string') {
		return { text: props.tooltip };
	}
	return (props.tooltip || {}) as TooltipOptions;
});
const hasTooltip = computed(() => {
	const tooltipSlot = slots.tooltip?.({});
	if (tooltipSlot?.length) return true;
	if (typeof props.tooltip === 'string') {
		return props.tooltip.trim().length > 0;
	}
	if (!props.tooltip) return false;
	const tooltip = props.tooltip as TooltipOptions;
	return Boolean(tooltip.text || tooltip.html || tooltip.actions?.length);
});
</script>

<style lang="scss">
.ar-dl {
	$b: &;
	margin: 0;
	display: flex;
	gap: var(--space-xs);
	font-size: var(--font-size-s);
	flex-direction: column;
	position: relative;

	&:has(#{$b}__pre-icon) {
		display: grid;
		grid-template:
			'pre-icon title'
			'pre-icon detail';
		grid-template-columns: auto 1fr;
		align-items: start;
	}

	&__title {
		grid-area: title;
		font-weight: var(--font-weight-bold);
		display: flex;
		align-items: center;
		gap: var(--space-xs);
	}

	&__icon {
		grid-area: icon;
		background-color: color-mix(
			in srgb,
			var(--color-theme, var(--color-secondary)),
			transparent 90%
		);
		color: color-mix(
			in srgb,
			var(--color-theme, var(--color-secondary)),
			var(--color-foreground) 50%
		);
		font-size: 1.5em;
		padding: var(--space-xs);
		border-radius: var(--border-radius-s);
		color: var(--color-text-secondary);
	}
	&__pre-icon {
		grid-area: pre-icon;
		background-color: color-mix(
			in srgb,
			var(--color-theme, var(--color-secondary)),
			transparent 90%
		);
		color: color-mix(
			in srgb,
			var(--color-theme, var(--color-secondary)),
			var(--color-foreground) 50%
		);
		font-size: 2.5em;
		margin-right: var(--space-xs);
		padding: var(--space-xs);
		border-radius: var(--border-radius-s);
		color: var(--color-text-secondary);
	}

	&__detail {
		grid-area: detail;
	}

	& + & {
		margin-top: var(--space);
	}
}

.spacer,
.ar-columns {
	.ar-dl {
		margin: 0;
	}
}
</style>
