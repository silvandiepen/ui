<template>
	<div v-if="!isCoordinateMode" ref="triggerRef" :class="bemm('trigger')">
		<slot
			name="trigger"
			:is-open="isOpen"
			:toggle="toggle"
			:open="open"
			:close="close"
			:close-menu="close"
		/>
	</div>

	<Teleport v-if="isOpen" to="body">
		<div
			:class="bemm('backdrop')"
			@click="close"
			@contextmenu.prevent="close"
		/>

		<div
			ref="menuRef"
			:class="bemm()"
			:style="menuStyle"
			role="menu"
			tabindex="-1"
			@keydown.esc="close"
			@keydown.up.prevent="focusPrev"
			@keydown.down.prevent="focusNext"
		>
			<slot
				v-if="hasMenuSlot && !isCoordinateMode"
				name="menu"
				:close-menu="close"
				:close="close"
				:is-open="isOpen"
			/>

			<template v-else>
				<template v-for="(option, index) in menuOptions" :key="index">
					<hr
						v-if="option.type === 'divider'"
						:class="bemm('divider')"
					/>
					<button
						v-else
						:class="
							bemm('item', [
								(option as DropdownItem).disabled ? 'disabled' : '',
								(option as DropdownItem).color
									? `color-${(option as DropdownItem).color}`
									: '',
							])
						"
						:disabled="(option as DropdownItem).disabled"
						role="menuitem"
						@click="onSelect(option as DropdownItem)"
					>
						<span :class="bemm('item-icon')">
							<Icon
								v-if="(option as DropdownItem).icon"
								:name="(option as DropdownItem).icon as string"
							/>
						</span>
						<span :class="bemm('item-label')">
							{{ (option as DropdownItem).label }}
						</span>
					</button>
				</template>
			</template>
		</div>
	</Teleport>
</template>

<script lang="ts" setup>
import {
	computed,
	nextTick,
	onMounted,
	onUnmounted,
	ref,
	useSlots,
	watch,
} from 'vue';
import { useBemm } from 'bemm';
import { Icon } from '../Icon';
import type { DropdownItem, DropdownOption } from './Dropdown.model';

defineOptions({ name: 'DropdownMenu' });

const props = withDefaults(
	defineProps<{
		options?: DropdownOption[];
		items?: DropdownItem[];
		x?: number;
		y?: number;
		align?: 'left' | 'right';
		openUp?: boolean;
		closeOnSelect?: boolean;
	}>(),
	{
		options: () => [],
		items: () => [],
		x: undefined,
		y: undefined,
		align: 'left',
		openUp: false,
		closeOnSelect: true,
	}
);

const emit = defineEmits<{
	(e: 'select', item: DropdownItem): void;
	(e: 'close'): void;
}>();

const slots = useSlots();
const bemm = useBemm('sil-dropdown-menu', {
	return: 'string',
	includeBaseClass: true,
});
const triggerRef = ref<HTMLElement | null>(null);
const menuRef = ref<HTMLElement | null>(null);
const internalOpen = ref(false);
const adjustedX = ref(0);
const adjustedY = ref(0);

const isCoordinateMode = computed(
	() => typeof props.x === 'number' && typeof props.y === 'number'
);
const isOpen = computed(() =>
	isCoordinateMode.value ? true : internalOpen.value
);
const hasMenuSlot = computed(() => Boolean(slots.menu));
const menuOptions = computed<DropdownOption[]>(() =>
	props.options.length ? props.options : props.items
);

const menuStyle = computed(() => ({
	position: 'fixed' as const,
	left: `${adjustedX.value}px`,
	top: `${adjustedY.value}px`,
	zIndex: 9999,
}));

const open = async () => {
	if (isCoordinateMode.value) {
		return;
	}

	internalOpen.value = true;
	await nextTick();
	updatePosition();
	menuRef.value?.focus();
};

const close = () => {
	if (!isOpen.value || isCoordinateMode.value) {
		if (isCoordinateMode.value) {
			emit('close');
		}
		return;
	}

	internalOpen.value = false;
	emit('close');
};

const toggle = async () => {
	if (isOpen.value) {
		close();
		return;
	}

	await open();
};

const updatePosition = () => {
	const menuElement = menuRef.value;
	if (!menuElement) {
		return;
	}

	const rect = menuElement.getBoundingClientRect();
	const viewportWidth = window.innerWidth;
	const viewportHeight = window.innerHeight;

	let x = 0;
	let y = 0;

	if (isCoordinateMode.value) {
		x = props.align === 'right' ? (props.x ?? 0) - rect.width : (props.x ?? 0);
		y = props.openUp ? (props.y ?? 0) - rect.height : (props.y ?? 0);
	} else {
		const triggerRect = triggerRef.value?.getBoundingClientRect();
		if (!triggerRect) {
			return;
		}

		x =
			props.align === 'right'
				? triggerRect.right - rect.width
				: triggerRect.left;
		y = props.openUp
			? triggerRect.top - rect.height - 4
			: triggerRect.bottom + 4;
	}

	adjustedX.value = Math.max(8, Math.min(x, viewportWidth - rect.width - 8));
	adjustedY.value = Math.max(8, Math.min(y, viewportHeight - rect.height - 8));
};

function onSelect(item: DropdownItem) {
	if (item.disabled) {
		return;
	}

	item.action?.(item);
	emit('select', item);

	if (props.closeOnSelect) {
		if (isCoordinateMode.value) {
			emit('close');
			return;
		}

		internalOpen.value = false;
		emit('close');
	}
}

function getItemButtons(): HTMLButtonElement[] {
	return Array.from(
		menuRef.value?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ?? []
	);
}

function focusNext() {
	const buttons = getItemButtons();
	if (!buttons.length) {
		return;
	}

	const activeElement = document.activeElement as HTMLButtonElement | null;
	const index = buttons.indexOf(activeElement as HTMLButtonElement);
	buttons[(index + 1 + buttons.length) % buttons.length]?.focus();
}

function focusPrev() {
	const buttons = getItemButtons();
	if (!buttons.length) {
		return;
	}

	const activeElement = document.activeElement as HTMLButtonElement | null;
	const index = buttons.indexOf(activeElement as HTMLButtonElement);
	buttons[(index - 1 + buttons.length) % buttons.length]?.focus();
}

function onWindowChange() {
	if (!isOpen.value) {
		return;
	}

	nextTick(updatePosition);
}

watch(
	() => [props.x, props.y, props.align, props.openUp, props.options, props.items],
	() => {
		if (!isOpen.value) {
			return;
		}

		nextTick(updatePosition);
	},
	{ deep: true }
);

watch(isOpen, async (nextOpen) => {
	if (!nextOpen) {
		return;
	}

	await nextTick();
	updatePosition();
	menuRef.value?.focus();
});

onMounted(() => {
	window.addEventListener('resize', onWindowChange);
	window.addEventListener('scroll', onWindowChange, true);
});

onUnmounted(() => {
	window.removeEventListener('resize', onWindowChange);
	window.removeEventListener('scroll', onWindowChange, true);
});
</script>

<style lang="scss">
.sil-dropdown-menu {
	$b: &;

	background: var(--color-background);
	border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 88%);
	border-radius: var(--border-radius-l);
	box-shadow: var(--shadow-l);
	min-width: 160px;
	padding: var(--space-xs);
	display: flex;
	flex-direction: column;
	gap: 2px;
	outline: none;

	&__trigger {
		display: inline-flex;
	}

	&__backdrop {
		position: fixed;
		inset: 0;
		z-index: 9998;
		cursor: default;
	}

	&__divider {
		border: none;
		border-top: 1px solid color-mix(in srgb, var(--color-foreground), transparent 90%);
		margin: var(--space-xs) 0;
	}

	&__item {
		display: flex;
		align-items: center;
		gap: var(--space-s);
		padding: var(--space-xs) var(--space-s);
		border: none;
		background: transparent;
		border-radius: var(--border-radius);
		cursor: pointer;
		font-size: var(--font-size-s);
		color: var(--color-foreground);
		text-align: left;
		width: 100%;
		transition: background-color 0.12s ease;

		&:hover,
		&:focus {
			background: color-mix(in srgb, var(--color-foreground), transparent 92%);
			outline: none;
		}

		&--disabled,
		&:disabled {
			opacity: 0.4;
			cursor: not-allowed;
			pointer-events: none;
		}

		@each $color in (primary, secondary, tertiary, info, warning, success, error, dark, light) {
			&--color-#{$color} {
				color: var(--color-#{$color});

				&:hover,
				&:focus {
					background: color-mix(in srgb, var(--color-#{$color}), transparent 88%);
				}
			}
		}
	}

	&__item-icon {
		display: inline-flex;
		align-items: center;
		width: 1.1em;
		flex-shrink: 0;
		font-size: var(--font-size-s);
		opacity: 0.7;
	}

	&__item-label {
		white-space: nowrap;
		line-height: 1.4;
	}
}
</style>
