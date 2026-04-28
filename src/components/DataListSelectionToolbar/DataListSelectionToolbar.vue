<template>
	<div :class="bemm('')" :data-test-id="testId">
		<div :class="bemm('main')" :data-test-id="getTestId(testId, 'main')">
			<div :class="bemm('anchor')" :data-test-id="getTestId(testId, 'anchor')" data-row-click-stop>
				<Icon :name="Icons.CHECK_LIST" :class="bemm('anchor-icon')" :data-test-id="getTestId(testId, 'anchor-icon')" />
				<button
					type="button"
					:class="bemm('summary-button')"
					:aria-expanded="isPanelOpen"
					:data-test-id="getTestId(testId, 'summary-button')"
					data-row-click-stop
					@click.stop.prevent="togglePanel"
				>
					<p :class="bemm('summary')" :data-test-id="getTestId(testId, 'summary')">
						{{ t('common.table.selectedCount', { count: selectedCount }) }}
					</p>
				</button>
				<Transition name="ar-data-list-selection-toolbar-panel">
					<div v-if="isPanelOpen" :class="bemm('panel')" :data-test-id="getTestId(testId, 'panel')">
						<p :class="bemm('panel-title')" :data-test-id="getTestId(testId, 'panel-title')">
							{{ t('common.table.selectedItems') }}
						</p>
						<ul :class="bemm('list')" :data-test-id="getTestId(testId, 'list')">
							<li
								v-for="(row, index) in selectedPreviewRows"
								:key="`selected-row-${index}`"
								:class="bemm('item')"
								:data-test-id="getTestId(testId, `item-${index}`)"
							>
								<div :class="bemm('item-content')" :data-test-id="getTestId(testId, `item-${index}-content`)">
									<Icon :name="Icons.CHECK_L" :class="bemm('item-icon')" :data-test-id="getTestId(testId, `item-${index}-icon`)" />
									<span :class="bemm('item-label')" :data-test-id="getTestId(testId, `item-${index}-label`)">
										{{ resolveSelectedRowLabel(row, index) }}
									</span>
								</div>
								<Button
									variant="ghost"
									size="xsmall"
									:class="bemm('item-remove-button')"
									:icon="Icons.MULTIPLY_M"
									:test-id="getTestId(testId, `item-${index}-remove`)"
									data-row-click-stop
									@click.stop="onDeselectRow?.(row)"
								/>
							</li>
						</ul>
						<p v-if="selectedOverflowCount > 0" :class="bemm('more')" :data-test-id="getTestId(testId, 'more')">
							+{{ selectedOverflowCount }} {{ t('common.table.moreSelected') }}
						</p>
					</div>
				</Transition>
			</div>

			<div :class="bemm('controls')" :data-test-id="getTestId(testId, 'controls')">
				<Button
					v-if="onSelectAllPage"
					variant="ghost"
					size="small"
					:icon="Icons.CHECK_FAT"
					:tooltip="t('common.table.selectAllPage')"
					:disabled="disableSelectAllPage"
					:test-id="getTestId(testId, 'select-all-page')"
					data-row-click-stop
					@click.stop="onSelectAllPage?.()"
				/>
				<Button
					variant="ghost"
					size="small"
					:icon="Icons.MULTIPLY_M"
					:tooltip="t('common.table.clearSelection')"
					:test-id="getTestId(testId, 'clear-selection')"
					data-row-click-stop
					@click.stop="onDeselectAll?.()"
				/>
				<Button
					v-if="singleSelectionAction"
					variant="outline"
					size="small"
					:class="bemm('single-action')"
					:icon="singleSelectionAction.icon"
					:disabled="singleSelectionAction.disabled"
					:test-id="getTestId(testId, 'single-action')"
					data-row-click-stop
					@click.stop="handleSelectionAction(singleSelectionAction)"
				>
					{{ singleSelectionAction.label }}
				</Button>
				<DropdownMenu
					v-else-if="showActions && selectionActions.length > 0"
					align="right"
					:open-up="true"
					:items="selectionActions"
					:close-on-select="true"
					@select="(item) => onActionSelect?.(item)"
				>
					<template #trigger="{ toggle }">
						<Button
							variant="outline"
							size="small"
							:icon="Icons.THREE_DOTS_HORIZONTAL"
							:test-id="getTestId(testId, 'actions-trigger')"
							data-row-click-stop
							@click.stop="toggle"
						>
							{{ t('common.labels.actions') }}
						</Button>
					</template>
				</DropdownMenu>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useBemm } from 'bemm';
import { Button } from '@/components/ui/Button';
import { DropdownMenu } from '@/components/ui/Dropdown';
import { Icon } from '@/components/ui/Icon';
import { Icons } from '@/types';
import { getTestId } from '@/utils';
import type { DataListRow } from '@/components/ui/DataList/DataList.model';
import type { DataListSelectionToolbarProps } from './DataListSelectionToolbar.model';
import type { DropdownItem } from '@/components/ui/Dropdown';

const props = withDefaults(defineProps<DataListSelectionToolbarProps>(), {
	selectionActions: () => [],
	showActions: false,
	disableSelectAllPage: false,
	panelOpen: false,
	previewLimit: 12,
	resolveLabel: undefined,
	onSelectAllPage: undefined,
	onDeselectAll: undefined,
	onDeselectRow: undefined,
	onActionSelect: undefined,
	onPanelOpenChange: undefined,
});

const { t } = useI18n();
const { bemm } = useBemm('ui-data-list-selection-toolbar');
const isPanelOpen = ref(Boolean(props.panelOpen));

const selectedPreviewRows = computed(() =>
	(props.selectedRows || []).slice(0, props.previewLimit)
);
const selectedOverflowCount = computed(() =>
	Math.max(0, props.selectedCount - selectedPreviewRows.value.length)
);
const singleSelectionAction = computed<DropdownItem | null>(() => {
	if (!props.showActions || props.selectionActions.length !== 1) {
		return null;
	}

	return props.selectionActions[0] || null;
});

watch(
	() => props.panelOpen,
	(nextPanelOpen) => {
		isPanelOpen.value = Boolean(nextPanelOpen);
	}
);

const fallbackLabel = (row: DataListRow, index: number) => {
	const entry = row as Record<string, unknown>;
	const values = [
		entry.title,
		entry.name,
		entry.label,
		entry.email,
		entry.reference,
		entry.id,
	];

	for (const value of values) {
		if (value === null || value === undefined) {
			continue;
		}
		const text = String(value).trim();
		if (text) {
			return text;
		}
	}

	return `#${index + 1}`;
};

const resolveSelectedRowLabel = (row: DataListRow, index: number) => {
	if (typeof props.resolveLabel === 'function') {
		const customLabel = props.resolveLabel(row, index);
		if (typeof customLabel === 'string' && customLabel.trim()) {
			return customLabel;
		}
	}
	return fallbackLabel(row, index);
};

const setPanelOpen = (nextOpen: boolean) => {
	isPanelOpen.value = nextOpen;
	props.onPanelOpenChange?.(nextOpen);
};

const togglePanel = () => {
	setPanelOpen(!isPanelOpen.value);
};

const handleSelectionAction = (item: DropdownItem) => {
	if (item.disabled) {
		return;
	}

	props.onActionSelect?.(item);
	item.action?.(item);
};
</script>

<style lang="scss">
.ui-data-list-selection-toolbar {
	display: inline-flex;
	width: auto;

	&__main {
		display: inline-flex;
		align-items: center;
		justify-content: flex-start;
		gap: var(--space);
	}

	&__anchor {
		position: relative;
		display: inline-flex;
		align-items: center;
		gap: var(--space-s);
		min-width: 180px;
		font-size: var(--font-size-l);
	}

	&__anchor-icon {
		font-size: 1em;
		color: color-mix(
			in srgb,
			var(--color-secondary),
			var(--color-foreground) 20%
		);
	}

	&__summary {
		margin: 0;
		font-size: var(--font-size-s);
		color: color-mix(in srgb, var(--color-foreground), transparent 20%);
	}

	&__panel {
		position: absolute;
		left: 0;
		bottom: calc(100% + var(--space-xs));
		min-width: 260px;
		max-width: min(440px, calc(100vw - var(--space) * 2));
		border-radius: var(--border-radius);
		border: 1px solid
			color-mix(in srgb, var(--color-foreground), transparent 80%);
		background: color-mix(in srgb, var(--color-background), transparent 4%);
		box-shadow: 0 14px 34px color-mix(in srgb, var(--color-foreground), transparent 84%);
		padding: var(--space-s);
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
		font-size: var(--font-size-xs);
	}

	&__summary-button {
		background: none;
		border: none;
		padding: 0;
		margin: 0;
		cursor: pointer;
	}

	&__panel-title {
		margin: 0;
		font-size: var(--font-size-s);
		font-weight: 600;
	}

	&__list {
		margin: 0;
		padding: 0;
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: var(--space-s);
		max-height: 240px;
		overflow: auto;
	}

	&__item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-s);
		min-width: 0;
		padding: var(--space-xs);

		border-radius: var(--border-radius-s);
		background-color: color-mix(
			in srgb,
			var(--color-background),
			var(--color-foreground) 4%
		);
		&:hover {
			.ui-data-list-selection-toolbar__item-remove-button {
				opacity: 1;
				transform: scale(1);
			}
		}
	}

	&__item-content {
		display: inline-flex;
		align-items: center;
		gap: var(--space-s);
		min-width: 0;
	}

	&__item-icon {
		font-size: 1.25em;
		background-color: var(--color-background);
		border-radius: 50%;
		padding: var(--space-xs);
		color: var(--color-primary);
	}

	&__item-label {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		color: color-mix(in srgb, var(--color-foreground), transparent 15%);
	}

	&__item-remove-button {
		opacity: 0;
		transform: scale(0.5);
		transition: all 0.25s var(--cubic-bezier);
	}

	&__more {
		margin: 0;
		font-size: var(--font-size-xs);
		color: color-mix(in srgb, var(--color-foreground), transparent 35%);
	}

	&__controls {
		display: inline-flex;
		align-items: center;
		gap: var(--space-xs);
		flex-wrap: wrap;
	}

	@media (max-width: 640px) {
		&__main {
			flex-direction: column;
			align-items: flex-start;
		}

		&__panel {
			max-width: calc(100vw - var(--space-xs) * 2);
		}
	}
}

.ui-data-list-selection-toolbar-panel-enter-active,
.ui-data-list-selection-toolbar-panel-leave-active {
	transition:
		opacity 160ms ease,
		transform 180ms ease;
}

.ui-data-list-selection-toolbar-panel-enter-from,
.ui-data-list-selection-toolbar-panel-leave-to {
	opacity: 0;
	transform: translateY(8px);
}
</style>
