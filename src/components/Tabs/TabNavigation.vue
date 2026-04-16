<template>
	<div ref="rootRef" :class="wrapperClasses" role="tablist">
		<span
			v-if="showHover"
			:class="bemm('hover')"
			:style="hoverStyles"
			aria-hidden="true"
		></span>
		<span
			v-if="showIndicator"
			:class="bemm('indicator')"
			:style="indicatorStyles"
			aria-hidden="true"
		></span>

		<button
			v-for="item in props.items"
			:key="String(item.id)"
			:data-tab-id="String(item.id)"
			type="button"
			role="tab"
			:disabled="item.disabled"
			:aria-selected="isActive(item)"
			:class="
				bemm('button', { active: isActive(item), disabled: item.disabled, size })
			"
			:style="
				item.color
					? {
							'--int-tab-item-color': `var(--color-${item.color})`,
						}
					: {}
			"
			@mouseenter="setHover"
			@click="select(item)"
		>
			<Icon :class="bemm('button-icon')" v-if="item.icon" :name="item.icon" />
			<span :class="bemm('button-label')">{{ item.label }}</span>
			<span
				v-if="item.badge !== undefined && item.badge !== null"
				:class="bemm('button-badge')"
			>
				{{ item.badge }}
			</span>
		</button>
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
import { Icon } from '@/components/ui/Icon';
import type { TabNavigationItem } from './Tabs.model';
import { Size } from '../../types';

defineOptions({
	name: 'ArTabNavigation',
});

const props = withDefaults(
	defineProps<{
		value?: string | number | null;
		items?: TabNavigationItem[];
		vertical?: boolean;
		centered?: boolean;
		size?: Size;
	}>(),
	{
		value: null,
		items: () => [],
		vertical: false,
		centered: false,
		size: Size.MEDIUM,
	}
);

const emit = defineEmits<{
	(e: 'input', value: string | number): void;
	(e: 'change', value: string | number, item: TabNavigationItem): void;
}>();

const bemm = useBemm('ui-tab-nav', {
	return: 'string',
	includeBaseClass: true,
});

const rootRef = ref<HTMLElement | null>(null);
const activeId = ref<string | number | null>(props.value);
const indicatorLeft = ref(0);
const indicatorWidth = ref(0);
const hoverLeft = ref(0);
const hoverWidth = ref(0);
const hasHover = ref(false);
const hoverId = ref<string | number | null>(null);

const resolveInitialActiveId = () => {
	if (props.value !== null && props.value !== undefined) {
		activeId.value = props.value;
		return;
	}

	const firstEnabled = props.items.find((item) => !item.disabled);
	activeId.value = firstEnabled ? firstEnabled.id : null;
};

const updateIndicator = () => {
	if (props.vertical) {
		indicatorLeft.value = 0;
		indicatorWidth.value = 0;
		return;
	}

	const root = rootRef.value;
	if (!root) return;

	const activeButton = root.querySelector(
		'.ui-tab-nav__button--active'
	) as HTMLElement | null;
	if (!activeButton) return;

	indicatorLeft.value = activeButton.offsetLeft;
	indicatorWidth.value = activeButton.offsetWidth;
};

const setHover = (event: MouseEvent) => {
	if (props.vertical) return;
	const target = event.currentTarget as HTMLElement | null;
	if (!target) return;

	hoverLeft.value = target.offsetLeft;
	hoverWidth.value = target.offsetWidth;
	hoverId.value = target.dataset.tabId ?? null;
	hasHover.value = true;
};

const clearHover = () => {
	hasHover.value = false;
	hoverId.value = null;
};

const isActive = (item: TabNavigationItem) =>
	String(item.id) === String(activeId.value);

const select = (item: TabNavigationItem) => {
	if (item.disabled) return;
	activeId.value = item.id;
	emit('input', item.id);
	emit('change', item.id, item);
	nextTick(updateIndicator);
};

const wrapperClasses = computed(() =>
	bemm('', {
		vertical: props.vertical,
		centered: props.centered,
	})
);

const showIndicator = computed(
	() => !props.vertical && props.items.length > 0 && indicatorWidth.value > 0
);
const showHover = computed(
	() =>
		!props.vertical &&
		props.items.length > 0 &&
		hasHover.value &&
		hoverWidth.value > 0
);

const activeItem = computed(() =>
	props.items.find((item) => String(item.id) === String(activeId.value))
);

const hoverItem = computed(() =>
	props.items.find((item) => String(item.id) === String(hoverId.value))
);

const indicatorStyles = computed(() => {
	const activeColor = activeItem.value?.color
		? `var(--color-${activeItem.value.color})`
		: 'var(--theme-color, var(--color-secondary))';

	return {
		width: `${indicatorWidth.value}px`,
		transform: `translateX(${indicatorLeft.value}px)`,
		background: activeColor,
	};
});

const hoverStyles = computed(() => ({
	width: `${hoverWidth.value}px`,
	transform: `translateX(${hoverLeft.value}px)`,
	background: hoverItem.value?.color
		? `color-mix(in srgb, var(--color-${hoverItem.value.color}), transparent 84%)`
		: 'var(--color-background)',
	opacity: 1,
}));

watch(
	() => props.value,
	(newVal) => {
		activeId.value = newVal ?? null;
		nextTick(updateIndicator);
	}
);

watch(
	() => props.items,
	() => {
		if (
			activeId.value === null ||
			!props.items.some((item) => String(item.id) === String(activeId.value))
		) {
			resolveInitialActiveId();
		}
		nextTick(updateIndicator);
	},
	{ deep: true }
);

watch(activeId, () => {
	nextTick(updateIndicator);
});

onMounted(() => {
	resolveInitialActiveId();
	nextTick(updateIndicator);
	window.addEventListener('resize', updateIndicator);
	rootRef.value?.addEventListener('mouseleave', clearHover);
});

onBeforeUnmount(() => {
	window.removeEventListener('resize', updateIndicator);
	rootRef.value?.removeEventListener('mouseleave', clearHover);
});
</script>

<style lang="scss">
.ui-tab-nav {
	--tab-border-radius: 999em;

	$b: &;
	position: relative;
	display: inline-flex;
	width: fit-content;
	padding: var(--space-s);
	border-radius: var(--tab-border-radius);
	background: color-mix(in srgb, var(--color-foreground), transparent 95%);
	isolation: isolate;

	max-width: 100%;
	overflow-x: auto;

	scrollbar-width: none;
	scrollbar-color: transparent transparent;
	scroll-snap-type: mandatory x proximity;

	margin: auto;

	// @media screen and (max-width: 960px) {
	//   --tab-border-radius: var(--border-radius);
	// }

	&--centered {
		margin-inline: auto;
	}

	&--vertical {
		display: flex;
		flex-direction: column;
		width: auto;
		padding: 0;
		border-radius: 0;
		background: transparent;
	}

	&__indicator {
		position: absolute;
		left: 0;
		inset-block: var(--border-radius);
		z-index: 0;
		border-radius: var(--tab-border-radius);
		will-change: transform, width;
		transition:
			transform 260ms var(--cubic-bezier),
			width 260ms var(--cubic-bezier);
	}

	&__hover {
		position: absolute;
		left: 0;
		inset-block: var(--border-radius);
		z-index: 0;
		border-radius: var(--tab-border-radius);
		will-change: transform, width;
		transition:
			transform 260ms var(--cubic-bezier),
			width 260ms var(--cubic-bezier);
	}

	&__button {
		--int-tab-item-color: var(--color-foreground);
		position: relative;
		z-index: 1;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-xs);
		padding: var(--space-s) var(--space);
		border: 0;
		border-radius: var(--tab-border-radius);
		background: transparent;
		color: color-mix(
			in srgb,
			var(--int-tab-item-color),
			var(--color-foreground) 40%
		);
		font-weight: var(--font-weight-medium);
		font-size: var(--font-size);
		white-space: nowrap;
		cursor: pointer;
		transition: color 180ms ease;

		@media screen and (max-width: 960px) {
			flex-direction: column;
			padding: var(--space-s);
		}

		&:focus {
			outline: none;
		}
		&:hover {
		}

		&--active {
			color: var(--color-secondary-contrast);
		}

		&--disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}

		&--small{
			font-size: var(--font-size-sm);
			padding: var(--space-xs) var(--space-s);
		}
		&--medium{
			font-size: var(--font-size);
			padding: var(--space-s) var(--space);
		}
		&--large{
			font-size: var(--font-size-lg);
			padding: var(--space-m) var(--space-l);
		}
	}

	&__button-label {
		@media screen and (max-width: 960px) {
			font-size: var(--font-size-xs);
		}
	}

	&__button-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 1.4rem;
		height: 1.4rem;
		padding-inline: 0.4rem;
		border-radius: 999em;
		background: color-mix(in srgb, currentColor, transparent 86%);
		color: inherit;
		font-size: var(--font-size-xs);
		font-weight: var(--font-weight-semibold);
		line-height: 1;
	}

	&__button-icon {
		opacity: 0.33;
	}

	&--vertical #{$b}__button {
		border-radius: var(--border-radius);
	}
}
</style>
