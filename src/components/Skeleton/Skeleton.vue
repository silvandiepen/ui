<template>
	<span
		:class="className"
		:style="cssVars"
		:data-test-id="testId"
		aria-hidden="true"
	/>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useBemm } from 'bemm';
import type { SkeletonProps } from './Skeleton.model';

const props = withDefaults(defineProps<SkeletonProps>(), {
	width: '100%',
	height: 16,
	shape: 'rect',
	animated: true,
});

const bemm = useBemm('ui-skeleton', {
	return: 'string',
	includeBaseClass: true,
});

const toUnit = (value: string | number): string =>
	typeof value === 'number' ? `${value}px` : value;

const cssVars = computed<Record<string, string>>(() => ({
	'--skeleton-width': toUnit(props.width),
	'--skeleton-height': toUnit(props.height),
}));

const className = computed(() =>
	bemm('', {
		animated: props.animated,
		[props.shape]: true,
	})
);
</script>

<style lang="scss">
@use '../../styles/mixins' as m;

.ui-skeleton {
	position: relative;
	display: block;
	width: var(--skeleton-width);
	height: var(--skeleton-height);
	overflow: hidden;
	background: color-mix(in srgb, var(--color-foreground), transparent 95%);
	border-radius: var(--border-radius);

	&--pill {
		border-radius: m.p('border-radius-round', 999px);
	}

	&--circle {
		border-radius: m.p('border-radius-round', 999px);
	}

	&--animated::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(
			90deg,
			transparent 0%,
			color-mix(in srgb, var(--color-background), transparent 35%) 50%,
			transparent 100%
		);
		transform: translateX(-100%);
		animation: arSkeletonShimmer 1.2s ease-in-out infinite;
	}
}

@keyframes arSkeletonShimmer {
	to {
		transform: translateX(100%);
	}
}
</style>
