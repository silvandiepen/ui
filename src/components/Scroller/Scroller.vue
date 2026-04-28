<template>
	<div
		:class="scrollerClasses"
		:style="scrollerStyle"
		:data-test-id="testId"
	>
		<div
			ref="scrollerRef"
			:class="bemm('viewport', [mode])"
			:data-test-id="getTestId(props.testId, 'viewport')"
			@scroll="updateShadows"
		>
			<div
				ref="trackRef"
				:class="bemm('track')"
				:data-test-id="getTestId(props.testId, 'track')"
			>
				<slot />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import {
	computed,
	nextTick,
	onBeforeUnmount,
	onMounted,
	ref,
	watch,
} from 'vue';
import { useBemm } from 'bemm';
import { isNumber, isString } from '@/utils';
import type { ScrollerProps } from './Scroller.model';
import { getTestId } from '../../utils/testId';

const props = withDefaults(defineProps<ScrollerProps>(), {
	horizontal: false,
	vertical: false,
	gap: 'var(--space-s)',
	height: undefined,
});

const bemm = useBemm('ui-scroller', {
	return: 'string',
	includeBaseClass: true,
});

const scrollerRef = ref<HTMLElement | null>(null);
const trackRef = ref<HTMLElement | null>(null);
const canScrollBackward = ref(false);
const canScrollForward = ref(false);
const measuredHeight = ref<number | null>(null);
const resizeObserver = ref<ResizeObserver | null>(null);
const mutationObserver = ref<MutationObserver | null>(null);

const mode = computed(() => {
	if (props.horizontal) return 'horizontal';
	if (props.vertical) return 'vertical';
	return 'vertical';
});

const scrollerClasses = computed(() => [
	bemm('', [
		mode.value,
		canScrollBackward.value ? 'show-backward-gradient' : '',
		canScrollForward.value ? 'show-forward-gradient' : '',
	]),
]);

const scrollerStyle = computed(() => ({
	'--scroller-gap': props.gap,
	height: resolvedHeight.value || undefined,
}));

const resolvedHeight = computed(() => {
	if (isString(props.height) && props.height.trim()) {
		return props.height;
	}
	if (isNumber(props.height) && measuredHeight.value) {
		return `${measuredHeight.value}px`;
	}
	return null;
});

const updateShadows = () => {
	const element = scrollerRef.value;
	if (!element) return;

	if (mode.value === 'horizontal') {
		const maxScroll = Math.max(0, element.scrollWidth - element.clientWidth);
		canScrollBackward.value = element.scrollLeft > 2;
		canScrollForward.value = element.scrollLeft < maxScroll - 2;
		return;
	}

	const maxScroll = Math.max(0, element.scrollHeight - element.clientHeight);
	canScrollBackward.value = element.scrollTop > 2;
	canScrollForward.value = element.scrollTop < maxScroll - 2;
};

const measureHeight = () => {
	if (mode.value !== 'vertical' || !isNumber(props.height)) {
		measuredHeight.value = null;
		return;
	}

	const track = trackRef.value;
	if (!track) {
		measuredHeight.value = null;
		return;
	}

	const itemCount = Math.max(0, Math.floor(props.height));
	if (itemCount === 0) {
		measuredHeight.value = null;
		return;
	}

	const children = Array.from(track.children).filter(
		(child): child is HTMLElement => child instanceof HTMLElement
	);
	const items = children.slice(0, itemCount);
	if (items.length === 0) {
		measuredHeight.value = null;
		return;
	}

	const styles = window.getComputedStyle(track);
	const rowGap = Number.parseFloat(styles.rowGap || styles.gap || '0');
	const gap = Number.isFinite(rowGap) ? rowGap : 0;

	const totalHeight =
		items.reduce(
			(sum, element) => sum + element.getBoundingClientRect().height,
			0
		) +
		gap * Math.max(items.length - 1, 0);

	measuredHeight.value = Math.ceil(totalHeight);
};

onMounted(() => {
	nextTick(() => {
		updateShadows();
		measureHeight();
	});

	if (typeof ResizeObserver !== 'undefined') {
		resizeObserver.value = new ResizeObserver(() => {
			updateShadows();
			measureHeight();
		});
		if (scrollerRef.value) resizeObserver.value.observe(scrollerRef.value);
		if (trackRef.value) resizeObserver.value.observe(trackRef.value);
	}

	if (typeof MutationObserver !== 'undefined' && trackRef.value) {
		mutationObserver.value = new MutationObserver(() => {
			nextTick(() => {
				updateShadows();
				measureHeight();
			});
		});
		mutationObserver.value.observe(trackRef.value, {
			childList: true,
			subtree: true,
		});
	}

	window.addEventListener('resize', updateShadows);
});

onBeforeUnmount(() => {
	window.removeEventListener('resize', updateShadows);
	resizeObserver.value?.disconnect();
	mutationObserver.value?.disconnect();
});

watch(
	() => [props.height, props.horizontal, props.vertical],
	() => {
		nextTick(measureHeight);
	}
);
</script>

<style lang="scss">
.ui-scroller {
	width: 100%;
	height: 100%;
	position: relative;

	&::before,
	&::after {
		content: '';
		position: absolute;
		z-index: 2;
		pointer-events: none;
		opacity: 0;
		transition: opacity 0.2s ease;
	}

	&--show-backward-gradient::before {
		opacity: 1;
	}

	&--show-forward-gradient::after {
		opacity: 1;
	}

	&__track {
		min-width: 100%;
		min-height: 100%;
		display: flex;
		gap: var(--scroller-gap);
	}

	&__viewport {
		width: 100%;
		height: 100%;
		-webkit-overflow-scrolling: touch;
		scrollbar-width: none;
		-ms-overflow-style: none;

		&::-webkit-scrollbar {
			display: none;
		}
	}

	&--horizontal {
		&::before,
		&::after {
			top: 0;
			bottom: 0;
			width: 1.75rem;
		}

		&::before {
			left: 0;
			background: linear-gradient(
				to right,
				var(--color-background),
				color-mix(in srgb, var(--color-background), transparent 100%)
			);
		}

		&::after {
			right: 0;
			background: linear-gradient(
				to left,
				var(--color-background),
				color-mix(in srgb, var(--color-background), transparent 100%)
			);
		}
	}

	&--vertical {
		&::before,
		&::after {
			left: 0;
			right: 0;
			height: 1.75rem;
		}

		&::before {
			top: 0;
			background: linear-gradient(
				to bottom,
				var(--color-background),
				color-mix(in srgb, var(--color-background), transparent 100%)
			);
		}

		&::after {
			bottom: 0;
			background: linear-gradient(
				to top,
				var(--color-background),
				color-mix(in srgb, var(--color-background), transparent 100%)
			);
		}
	}

	&__viewport--horizontal {
		overflow-x: auto;
		overflow-y: hidden;
		scroll-snap-type: x proximity;

		.ui-scroller__track {
			flex-direction: row;
			align-items: stretch;
		}

		.ui-scroller__track > * {
			scroll-snap-align: start;
			scroll-snap-stop: always;
		}
	}

	&__viewport--vertical {
		overflow-y: auto;
		overflow-x: hidden;
		scroll-snap-type: y proximity;

		.ui-scroller__track {
			flex-direction: column;
		}

		.ui-scroller__track > * {
			scroll-snap-align: start;
			scroll-snap-stop: always;
		}
	}
}
</style>
