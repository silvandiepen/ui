<template>
	<Tooltip :disabled="!hasTooltip" v-bind="tooltipBindings">
		<span
			v-bind="$attrs"
			:class="bemm('', [color, size])"
			:style="`--chip-color: var(--color-${color})`"
		>
			<Icon v-if="icon" :name="icon" :class="bemm('icon')" />
			<slot></slot>
			<button
				v-if="removable"
				type="button"
				:class="bemm('remove')"
				@click.stop="$emit('remove')"
			>
				<Icon :name="removeIcon" :class="bemm('remove-icon')" />
			</button>
		</span>
		<template v-if="$slots.tooltip" #content>
			<slot name="tooltip"></slot>
		</template>
	</Tooltip>
</template>

<script lang="ts" setup>
import { computed, PropType, useSlots } from 'vue';
import { useBemm } from 'bemm';
import { Icon, IconType } from '@/components/ui/Icon';
import { Color, Size } from '@/types';
import { Icons } from '@/types';
import { TooltipWrapper as Tooltip } from '@/components/ui/Tooltip';
import type { TooltipOptions } from '@/components/ui/Tooltip';

defineOptions({
	inheritAttrs: false,
});

const props = defineProps({
	color: {
		type: String as PropType<Color>,
		default: Color.PRIMARY,
	},
	icon: {
		type: String as PropType<IconType>,
		default: null,
	},
	size: {
		type: String as PropType<Size>,
		default: Size.MEDIUM,
	},
	removable: {
		type: Boolean,
		default: false,
	},
	removeIcon: {
		type: String as PropType<IconType>,
		default: Icons.MULTIPLY_M,
	},
	tooltip: {
		type: [String, Object] as PropType<string | TooltipOptions>,
		default: null,
	},
});
const slots = useSlots();
const bemm = useBemm('chip', {
	return: 'string',
	includeBaseClass: true,
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
@use '../../styles/mixins' as m;

.chip {
	@include m.component-props((
		'background-color': 'color-mix(in srgb, var(--chip-color), var(--color-background) 95%)',
		'text-color': 'color-mix(in srgb, var(--chip-color), var(--color-foreground) 50%)',
		'border-color': 'color-mix(in srgb, var(--chip-color), var(--color-background) 90%)',
	), 'chip');

	--color-default: var(--color-primary);

	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	font-size: var(--font-size-m);
	border-radius: var(--border-radius);
	background-color: var(--int-chip-background-color);
	color: var(--int-chip-text-color);
	border: 1px solid var(--int-chip-border-color);
	padding: var(--space-xs) var(--space-s);

	display: flex;
	gap: var(--space-s);
	align-items: center;

	&--small {
		font-size: var(--font-size-s);
		padding: var(--space-xs) var(--space-s);
	}
	&--large {
		font-size: var(--font-size-l);
		padding: var(--space);
	}

	&__icon {
		font-size: var(--font-size-s);
		opacity: 0.5;
	}

	&__remove {
		border: 0;
		background: transparent;
		padding: 0;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		color: inherit;
		opacity: 0.7;
	}

	&__remove:hover {
		opacity: 1;
	}

	&__remove-icon {
		font-size: var(--font-size-s);
	}
}
</style>
