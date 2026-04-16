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
      :aria-label="item.label"
			:aria-selected="isActive(item)"
			:class="
				bemm('button', { active: isActive(item), disabled: item.disabled })
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
			<span v-if="!props.iconOnly || !item.icon" :class="bemm('button-label')">{{ item.label }}</span>
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
import type { TabNavigationAlign, TabNavigationItem, TabNavigationVariant } from './Tabs.model';
import { Size } from '../../types';

defineOptions({
	name: 'ArTabNavigation',
});

const props = withDefaults(
	defineProps<{
		value?: string | number | null;
		items?: TabNavigationItem[];
		vertical?: boolean;
		size?: Size;
		variant?: TabNavigationVariant;
		iconOnly?: boolean;
		align?: TabNavigationAlign;
		stretch?: boolean;
	}>(),
	{
		value: null,
		items: () => [],
		vertical: false,
		size: Size.MEDIUM,
		variant: 'pills',
		iconOnly: false,
		align: 'left',
		stretch: false,
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
const indicatorTop = ref(0);
const indicatorHeight = ref(0);
const hoverLeft = ref(0);
const hoverWidth = ref(0);
const hoverTop = ref(0);
const hoverHeight = ref(0);
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
	const root = rootRef.value;
	if (!root) return;

	const activeButton = root.querySelector(
		'.ui-tab-nav__button--active'
	) as HTMLElement | null;
	if (!activeButton) return;

	if (props.vertical) {
		indicatorTop.value = activeButton.offsetTop;
		indicatorHeight.value = activeButton.offsetHeight;
	} else {
		indicatorLeft.value = activeButton.offsetLeft;
		indicatorWidth.value = activeButton.offsetWidth;
	}
};

const setHover = (event: MouseEvent) => {
	const target = event.currentTarget as HTMLElement | null;
	if (!target) return;

	if (props.vertical) {
		hoverTop.value = target.offsetTop;
		hoverHeight.value = target.offsetHeight;
	} else {
		hoverLeft.value = target.offsetLeft;
		hoverWidth.value = target.offsetWidth;
	}
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
		[`variant-${props.variant}`]: true,
		[`align-${props.align}`]: true,
		stretch: props.stretch,
		[`size-${props.size}`]: !!props.size,
		'icon-only': props.iconOnly,
	})
);

const showIndicator = computed(() =>
	props.items.length > 0 &&
	(props.vertical ? indicatorHeight.value > 0 : indicatorWidth.value > 0)
);
const showHover = computed(() =>
	props.items.length > 0 &&
	hasHover.value &&
	(props.vertical ? hoverHeight.value > 0 : hoverWidth.value > 0)
);

const activeItem = computed(() =>
	props.items.find((item) => String(item.id) === String(activeId.value))
);

const hoverItem = computed(() =>
	props.items.find((item) => String(item.id) === String(hoverId.value))
);

const indicatorStyles = computed(() => {
	const pillsColor = activeItem.value?.color
		? `var(--color-${activeItem.value.color})`
		: 'var(--theme-color, var(--color-secondary))';
	const indicatorColor = props.variant === 'underline'
		? 'var(--tab-navigation-underline-indicator-color)'
		: pillsColor;

	if (props.vertical) {
		return {
			height: `${indicatorHeight.value}px`,
			transform: `translateY(${indicatorTop.value}px)`,
			background: indicatorColor,
		};
	}

	return {
		width: `${indicatorWidth.value}px`,
		transform: `translateX(${indicatorLeft.value}px)`,
		background: indicatorColor,
	};
});

const hoverStyles = computed(() => {
	const bg = hoverItem.value?.color
		? `color-mix(in srgb, var(--color-${hoverItem.value.color}), transparent 84%)`
		: 'var(--color-background)';

	if (props.vertical) {
		return { height: `${hoverHeight.value}px`, transform: `translateY(${hoverTop.value}px)`, background: bg, opacity: 1 };
	}

	return { width: `${hoverWidth.value}px`, transform: `translateX(${hoverLeft.value}px)`, background: bg, opacity: 1 };
});

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

watch([() => props.size, () => props.variant], () => {
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
  // Internal — set by component logic, not intended for project override
  --int-tab-navigation-border-radius: 999em;
  --int-tab-navigation-font-size: var(--font-size);
  --int-tab-navigation-icon-size: 1.25em;
  --int-tab-navigation-pills-button-padding-y: var(--space-s);
  --int-tab-navigation-pills-button-padding-x: var(--space);
  --int-tab-navigation-underline-padding-y: var(--space-m);
  --int-tab-navigation-underline-padding-x: var(--space-s);

  // Public — override these in your project to customise the component
  --tab-navigation-pills-padding: var(--space-xs);
  --tab-navigation-pills-background: color-mix(in srgb, var(--color-foreground), transparent 94%);
  --tab-navigation-pills-button-inactive-color: color-mix(in srgb, var(--color-foreground), transparent 35%);
  --tab-navigation-pills-button-active-color: var(--color-secondary-contrast);
  --tab-navigation-underline-inactive-color: color-mix(in srgb, var(--color-foreground), transparent 50%);
  --tab-navigation-underline-active-color: var(--color-foreground);
  --tab-navigation-underline-baseline-color: color-mix(in srgb, var(--color-foreground), transparent 84%);
  --tab-navigation-underline-indicator-height: 2px;
  --tab-navigation-underline-indicator-color: var(--color-primary);

	$b: &;
	position: relative;
	display: inline-flex;
	width: fit-content;
	padding: var(--space-xs);
  gap: 0;
	border-radius: var(--int-tab-navigation-border-radius);
	background: color-mix(in srgb, var(--color-foreground), transparent 94%);
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

  &--align-left {
    width: 100%;
    justify-content: flex-start;
  }

  &--align-center {
    width: 100%;
    justify-content: center;
  }

  &--align-right {
    width: 100%;
    justify-content: flex-end;
  }

  &--stretch {
    width: 100%;
  }

  &--stretch #{$b}__button {
    flex: 1 1 0;
  }

	&--vertical {
		display: flex;
		flex-direction: column;
		width: auto;
		padding: 0;
		border-radius: 0;
		background: transparent;
	}

	@at-root #{$b}--vertical#{$b}--align-left   { align-items: flex-start; }
	@at-root #{$b}--vertical#{$b}--align-center { align-items: center; }
	@at-root #{$b}--vertical#{$b}--align-right  { align-items: flex-end; }

	&__indicator {
		position: absolute;
		left: 0;
		inset-block: var(--border-radius);
		z-index: 0;
		border-radius: var(--int-tab-navigation-border-radius);
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
		border-radius: var(--int-tab-navigation-border-radius);
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
		border-radius: var(--int-tab-navigation-border-radius);
		background: transparent;
		color: color-mix(in srgb, var(--color-foreground), transparent 35%);
		font-weight: var(--font-weight-medium);
		font-size: var(--int-tab-navigation-font-size);
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

	}

  &--size-small {
    --int-tab-navigation-font-size: var(--font-size-sm);
    --int-tab-navigation-icon-size: 1em;
    --int-tab-navigation-pills-button-padding-y: var(--space-xs);
    --int-tab-navigation-pills-button-padding-x: var(--space-s);
    --int-tab-navigation-underline-padding-y: var(--space-s);
    --int-tab-navigation-underline-padding-x: var(--space-xs);
  }

  &--size-large {
    --int-tab-navigation-font-size: var(--font-size-lg);
    --int-tab-navigation-icon-size: 1.5em;
    --int-tab-navigation-pills-button-padding-y: var(--space-m);
    --int-tab-navigation-pills-button-padding-x: var(--space-l);
    --int-tab-navigation-underline-padding-y: var(--space-l);
    --int-tab-navigation-underline-padding-x: var(--space-m);
  }

  &--variant-pills {
    padding: var(--tab-navigation-pills-padding);
    border-radius: 999em;
    background: var(--tab-navigation-pills-background);
  }

  &--variant-pills #{$b}__button {
    padding: var(--int-tab-navigation-pills-button-padding-y) var(--int-tab-navigation-pills-button-padding-x);
    color: var(--tab-navigation-pills-button-inactive-color);
  }

  &--variant-pills #{$b}__button--active {
    color: var(--tab-navigation-pills-button-active-color);
  }

  &--variant-underline {
    padding: 0;
    border-radius: 0;
    background: transparent;
    margin: 0;
  }

  &--variant-underline::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 1px;
    background: var(--tab-navigation-underline-baseline-color);
    pointer-events: none;
  }

  &--variant-underline #{$b}__button {
    padding: var(--int-tab-navigation-underline-padding-y) var(--int-tab-navigation-underline-padding-x);
    border-radius: 0;
    color: var(--tab-navigation-underline-inactive-color);
  }

  &--variant-underline #{$b}__button--active {
    color: var(--tab-navigation-underline-active-color);
  }

  &--variant-underline #{$b}__indicator {
    top: auto;
    bottom: 0;
    height: var(--tab-navigation-underline-indicator-height);
    border-radius: 999em;
  }

  &--variant-underline #{$b}__hover {
    display: none;
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
		width: var(--int-tab-navigation-icon-size);
		height: var(--int-tab-navigation-icon-size);
		opacity: 0.33;
	}

	&--icon-only &__button-icon {
		opacity: 1;
	}

	&--icon-only &__button {
		aspect-ratio: 1;
		padding: var(--int-tab-navigation-pills-button-padding-y);
	}

	&--icon-only &__button-badge {
		position: absolute;
		top: 0;
		right: 0;
		transform: translate(-100%, 100%);
		min-width: 1em;
		height: 1em;
		padding-inline: 0.25em;
		font-size: var(--font-size-xs);
	}

	&--vertical #{$b}__button {
		border-radius: var(--border-radius);
	}

	&--vertical #{$b}__indicator {
		inset-block: auto;
		top: 0;
		left: 0;
		right: 0;
		width: 100%;
		height: 0;
		transition:
			transform 260ms var(--cubic-bezier),
			height 260ms var(--cubic-bezier);
	}

	&--vertical #{$b}__hover {
		inset-block: auto;
		top: 0;
		left: 0;
		right: 0;
		width: 100%;
		height: 0;
		transition:
			transform 260ms var(--cubic-bezier),
			height 260ms var(--cubic-bezier);
	}

	@at-root #{$b}--vertical#{$b}--variant-underline #{$b}__indicator {
		left: auto;
		right: 0;
		width: var(--tab-navigation-underline-indicator-height);
	}
}
</style>
