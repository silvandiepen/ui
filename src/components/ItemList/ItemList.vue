<template>
	<div :class="bemm('', [showActionsOnHover ? 'actions-on-hover' : ''])">
		<ul v-if="items.length" :class="bemm('list')">
			<li
				v-for="(item, index) in items"
				:key="itemKey(item, index)"
				:class="
					bemm('row', [
						item.active ? 'active' : '',
						item.disabled ? 'disabled' : '',
					])
				"
			>
				<component
					:is="resolveComponent(item)"
					:class="bemm('item')"
					:to="item.to || null"
					:href="item.href || null"
					:target="item.target || null"
					:type="resolveComponent(item) === 'button' ? 'button' : null"
					@click="handleSelect(item)"
				>
					<span v-if="item.icon" :class="bemm('icon')">
						<Icon :name="item.icon" />
					</span>

					<span :class="bemm('content')">
						<span :class="bemm('label')">{{ item.label }}</span>
						<span v-if="item.description" :class="bemm('description')">
							{{ item.description }}
						</span>
					</span>

					<span v-if="item.meta" :class="bemm('meta')">{{ item.meta }}</span>
				</component>

				<div
					v-if="item.actions && item.actions.length"
					:class="bemm('actions')"
				>
					<template v-for="(action, actionIndex) in item.actions">
						<Button
							v-if="action.label"
							:key="`${actionKey(item, action, actionIndex)}-label`"
							variant="ghost"
							size="small"
							:icon="action.icon"
							:color="action.color"
							:status="action.status"
							:disabled="Boolean(action.disabled)"
							@click.stop="handleActionClick(item, action)"
						>
							{{ action.label }}
						</Button>
						<Button
							v-else
							:key="`${actionKey(item, action, actionIndex)}-icon`"
							variant="ghost"
							size="small"
							:icon="action.icon"
							:color="action.color"
							:status="action.status"
							:disabled="Boolean(action.disabled)"
							@click.stop="handleActionClick(item, action)"
						/>
					</template>
				</div>
			</li>
		</ul>
		<p v-else :class="bemm('empty')">{{ emptyText }}</p>
	</div>
</template>

<script lang="ts" setup>
import { toRefs } from 'vue';
import { useBemm } from 'bemm';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import type { ItemListItem, ItemListAction } from './ItemList.model';

defineOptions({
	name: 'ArItemList',
});

const props = withDefaults(
	defineProps<{
		items?: ItemListItem[];
		emptyText?: string;
		showActionsOnHover?: boolean;
	}>(),
	{
		items: () => [],
		emptyText: 'No items found',
		showActionsOnHover: false,
	}
);
const { items, emptyText, showActionsOnHover } = toRefs(props);

const emit = defineEmits<{
	(e: 'select', item: ItemListItem): void;
	(e: 'action', payload: { item: ItemListItem; action: ItemListAction }): void;
}>();

const bemm = useBemm('ar-item-list', {
	return: 'string',
	includeBaseClass: true,
});

const itemKey = (item: ItemListItem, index: number) =>
	item.key ?? `${item.label}-${index}`;

const actionKey = (item: ItemListItem, action: ItemListAction, index: number) =>
	action.key ?? `${item.label}-${action.label || action.icon || index}`;

const resolveComponent = (item: ItemListItem) => {
	if (item.to) {
		return 'router-link';
	}
	if (item.href) {
		return 'a';
	}
	return 'button';
};

const handleSelect = (item: ItemListItem) => {
	if (item.disabled) {
		return;
	}
	item.action?.();
	emit('select', item);
};

const handleActionClick = (item: ItemListItem, action: ItemListAction) => {
	if (action.disabled) {
		return;
	}
	action.action?.(item);
	emit('action', { item, action });
};
</script>

<style lang="scss">
.ar-item-list {
	$b: &;

	&__list {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	&__row {
		display: flex;
		align-items: center;
		gap: var(--space-s);
		border: 1px solid
			color-mix(in srgb, var(--color-foreground), transparent 86%);
		border-radius: var(--border-radius);
		background: var(--color-background);
		transition:
			border-color 150ms ease,
			background-color 150ms ease;

		&:hover {
			border-color: color-mix(in srgb, var(--color-secondary), transparent 55%);
			background: color-mix(in srgb, var(--color-secondary), transparent 96%);
		}

		&--active {
			border-color: color-mix(in srgb, var(--color-secondary), transparent 35%);
			background: color-mix(in srgb, var(--color-secondary), transparent 92%);
		}

		&--disabled {
			opacity: 0.6;
			pointer-events: none;
		}
	}

	&__item {
		display: flex;
		align-items: center;
		gap: var(--space-s);
		flex: 1;
		width: 100%;
		padding: var(--space-s) var(--space);
		border: 0;
		background: transparent;
		text-decoration: none;
		color: inherit;
		text-align: left;
		cursor: pointer;
	}

	&__icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-size: var(--font-size-m);
		color: var(--color-secondary);
	}

	&__content {
		display: flex;
		flex-direction: column;
		gap: 2px;
		flex: 1;
		min-width: 0;
	}

	&__label {
		font-weight: var(--font-weight-medium);
		line-height: 1.3;
	}

	&__description {
		font-size: var(--font-size-s);
		color: color-mix(in srgb, var(--color-foreground), transparent 40%);
		line-height: 1.3;
	}

	&__meta {
		font-size: var(--font-size-s);
		color: color-mix(in srgb, var(--color-foreground), transparent 35%);
	}

	&__actions {
		display: inline-flex;
		gap: var(--space-xxs);
		padding-right: var(--space-s);
	}

	&--actions-on-hover {
		#{$b}__actions {
			opacity: 0;
			pointer-events: none;
			transform: translateX(4px);
			transition:
				opacity 150ms ease,
				transform 150ms ease;
		}

		#{$b}__row:hover #{$b}__actions,
		#{$b}__row:focus-within #{$b}__actions {
			opacity: 1;
			pointer-events: auto;
			transform: translateX(0);
		}
	}

	&__empty {
		text-align: center;
		color: color-mix(in srgb, var(--color-foreground), transparent 45%);
		padding: var(--space) var(--space-s);
		margin: 0;
	}
}
</style>
