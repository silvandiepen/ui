<template>
	<span
		v-if="isVisible"
		:class="bemm('', [color])"
		:style="color ? `--badge-color: var(--color-${color});` : ''"
	>
		<icon v-if="icon" :name="icon" :class="bemm('icon')"></icon>
		<slot>{{ displayValue }}</slot>
	</span>
</template>

<script lang="ts" setup>
import { computed, PropType } from 'vue';
import { useBemm } from 'bemm';
import { Color, IconNameOrString } from '@/types';
import { Icon } from '@/components/ui/Icon';

type BadgeValue = string | number;

const props = defineProps({
	value: {
		type: [String, Number] as PropType<BadgeValue>,
		default: null,
	},
	color: {
		type: String as PropType<Color | 'default'>,
		default: 'primary',
	},
	icon: {
		type: String as PropType<IconNameOrString>,
		default: null,
	},
});

const bemm = useBemm('ui-badge', {
	return: 'string',
	includeBaseClass: true,
});

const isVisible = computed(() => {
	if (props.value === null || props.value === undefined || props.value === '') {
		return false;
	}
	return true;
});

const displayValue = computed(() => {
	return props.value;
});
</script>

<style lang="scss">
@use '../../styles/mixins' as m;

.ui-badge {
	@include m.component-props((
		'size': '1.5rem',
		'border-radius': '999px',
		'line-height': '1',
		'font-weight': '600',
	), 'ui-badge');

	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-width: var(--int-ui-badge-size);
	height: var(--int-ui-badge-size);
	padding: var(--space-xs) var(--space-s);
	border-radius: var(--int-ui-badge-border-radius);
	font-size: var(--font-size-xs);
	line-height: var(--int-ui-badge-line-height);
	font-weight: var(--int-ui-badge-font-weight);
	background: color-mix(in srgb, var(--badge-color), transparent 85%);
	color: color-mix(in srgb, var(--badge-color), var(--color-foreground) 25%);
	border: 1px solid var(--badge-color);
	flex-shrink: 0;
	gap: var(--space);

	--badge-color: var(--color-primary);

	&--default {
		--badge-color: var(--color-secondary);
	}

	&__icon {
		color: var(--badge-color);
	}
}
</style>
