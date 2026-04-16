<template>
	<div :class="dataListClasses" ref="rootRef">
		<div :class="bemm('content')">
			<div :class="bemm('scroller')">
				<div :class="bemm('grid')" :style="gridStyles">
					<div :class="bemm('header')">
						<div
							v-if="selectable"
							:class="bemm('cell', ['header', 'checkbox'])"
						>
							<InputCheckbox
								v-if="!selectionDisabled"
								:class="bemm('checkbox')"
								:model-value="allSelected"
								@update:model-value="(value) => setAllSelection(Boolean(value))"
							/>
						</div>
						<button
							v-for="column in visibleColumns"
							:key="column.key"
							type="button"
							:data-col-key="column.key"
							:class="
								bemm('cell', [
									'header',
									column.sortable ? 'sortable' : '',
									isSortedColumn(column) ? 'sorted' : '',
									column.align || 'left',
									column.headerClassName || '',
								])
							"
							@click.stop.prevent="handleHeaderClick(column)"
						>
							<span :class="bemm('header-label')">
								<slot :name="`header-${column.key}`" :column="column">
									{{ column.label }}
								</slot>
							</span>
							<span v-if="column.sortable" :class="bemm('sort')">
								<Icon
									:name="Icons.CHEVRON_DOWN"
									:class="
										bemm('sort-icon', [
											isSortedColumn(column) ? 'active' : 'inactive',
											sortState.column?.key === column.key
												? sortState.order
												: '',
										])
									"
								/>
							</span>
							<span
								v-if="isColumnResizable(column)"
								:class="bemm('resize-handle')"
								role="separator"
								aria-orientation="vertical"
								:aria-label="`Resize ${column.label}`"
								@mousedown.stop.prevent="startColumnResize(column, $event)"
								@click.stop
							/>
						</button>
					</div>

					<div v-if="hasData" :class="bemm('body')">
						<div
							v-for="(row, rowIndex) in data"
							:key="rowKeyValue(row, rowIndex)"
							:class="[
								bemm('row', [
									rowClickable ? 'clickable' : '',
									isRowSelected(row, rowIndex) ? 'selected' : '',
									isRouteRowActive(row, rowIndex) ? 'active' : '',
									selectionDisabled && selectionDisabled(row, rowIndex)
										? 'selection-disabled'
										: '',
								]),
								resolveRowClassName(row, rowIndex),
							]"
							:style="resolveRowStyle(row, rowIndex)"
							@click="onRowClick($event, row, rowIndex)"
							@contextmenu.prevent="onRowContextMenu($event, row)"
						>
							<div
								v-if="selectable"
								:class="bemm('cell', ['checkbox', 'row-checkbox'])"
							>
								<InputCheckbox
									:class="bemm('checkbox')"
									:model-value="isRowSelected(row, rowIndex)"
									:disabled="
										selectionDisabled ? selectionDisabled(row, rowIndex) : false
									"
										@update:model-value="
											(value) => setRowSelection(row, Boolean(value), rowIndex)
										"
									@mousedown.stop
									@mouseup.stop
									@click.stop
								/>
							</div>
							<div
								v-for="column in visibleColumns"
								:key="`${rowKeyValue(row, rowIndex)}-${column.key}`"
								:data-col-key="column.key"
								:class="
									bemm('cell', [column.align || 'left', column.className || ''])
								"
							>
								<slot
									:name="`cell-${column.key}`"
									:row="row"
									:row-index="rowIndex"
									:column="column"
									:value="row[column.key]"
								>
									<InputToggle
										v-if="column.type === FieldType.SWITCH"
										:model-value="Boolean(resolveColumnValue(row, column))"
										:disabled="isColumnDisabled(row, column)"
										@click.stop
										@update:model-value="
											(value) => onCellValueChange(Boolean(value), row, column, rowIndex)
										"
									/>
									<Field
										v-else-if="column.type"
										:type="column.type || FieldType.TEXT"
										:value="resolveColumnValue(row, column)"
										:format="column.format"
										:copyable="column.copyable"
										:true-label="column.trueLabel"
										:false-label="column.falseLabel"
										:prefix="column.prefix"
										:max-chars="column.maxChars"
									/>
									<span v-else>
										{{ resolveColumnValue(row, column) }}
									</span>
								</slot>
							</div>
							<div
								v-if="hasColumnMenu"
								:class="bemm('cell', ['settings'])"
								aria-hidden="true"
							></div>
							<div v-if="hasRowActions" :class="bemm('cell', ['actions'])">
								<DropdownMenu
									v-if="rowActions(row).length"
									align="right"
									:items="rowActions(row)"
									:close-on-select="true"
									@select="handleRowAction($event, row)"
								>
									<template #trigger="{ toggle }">
										<Button
											:class="bemm('row-actions-trigger')"
											variant="default"
											size="small"
											:icon="Icons.THREE_DOTS_HORIZONTAL"
											data-row-click-stop
											@click.stop="toggle"
										/>
									</template>
								</DropdownMenu>
							</div>
						</div>
					</div>
					<div v-else :class="bemm('empty')">
						<slot name="empty">{{ t('common.table.noData') }}</slot>
					</div>
				</div>
			</div>

			<footer v-if="showPagination" :class="bemm('footer')">
				<p v-if="showRange" :class="bemm('range')">
					{{ rangeLabel }}
				</p>
				<Pagination
					:current-page="currentPage"
					:page-size="perPage"
					:total="total"
					:page-sizes="pageSizes"
					:layout="paginationLayout"
					@size-change="onSizeChange"
					@current-change="onCurrentChange"
				/>
			</footer>
		</div>
		<div v-if="loading" :class="bemm('loading-overlay')" aria-live="polite">
			<LoaderSpinner :size="40" :padding="0" />
		</div>

		<div v-if="hasColumnMenu" :class="bemm('header-settings')">
			<DropdownMenu align="right" :items="[]" :close-on-select="false">
				<template #menu="{ closeMenu }">
					<div :class="bemm('column-menu')">
						<DraggableVisibilityMenu
							:items="columnMenuItems"
							@update:items="handleColumnMenuUpdate"
						/>
						<div :class="bemm('column-menu-footer')">
							<Button
								v-if="hasResettableColumnPreferences"
								size="small"
								variant="outline"
								:class="bemm('column-menu-reset')"
								@click="resetColumnPreferences(closeMenu)"
								:icon="Icons.ARROW_HEADED_RELOAD_LEFT_RIGHT"
								:tooltip="t('common.actions.resetToDefault')"
							/>
							<Button
								size="small"
								variant="outline"
								:class="bemm('column-menu-visibility-toggle')"
								@click="toggleAllColumnsVisibility"
								:icon="areAllColumnsVisible ? Icons.INVISIBLE : Icons.VISIBLE"
								:tooltip="allVisibilityToggleTooltip"
							/>
						</div>
					</div>
				</template>
				<template #trigger="{ toggle }">
					<Button size="small" :icon="Icons.FILE_COLUMNS" @click="toggle" />
				</template>
			</DropdownMenu>
		</div>
	</div>
</template>

<script lang="ts" setup>
import {
	computed,
	getCurrentInstance,
	inject,
	onBeforeUnmount,
	onMounted,
	PropType,
	ref,
	type StyleValue,
	watch,
} from 'vue';
import { useI18n } from 'vue-i18n';
import { routeLocationKey } from 'vue-router';
import { useBemm } from 'bemm';
import {
	DEFAULT_TABLE_PAGE_SIZE,
	DEFAULT_TABLE_PAGE_SIZES,
} from '@/constants/pagination';
import { LoaderSpinner } from '@/common';
import { Icons } from '@/types';
import { Icon } from '@/components/ui/Icon';
import { DropdownItem, DropdownMenu } from '@/components/ui/Dropdown';
import { Button } from '@/components/ui/Button';
import { Pagination } from '@/components/ui/Pagination';
import { InputCheckbox, InputToggle } from '@/components/ui/Form';
import { Field, FieldType } from '@/components/ui/Field';
import { DraggableVisibilityMenu } from '@/components/ui/DraggableVisibilityMenu';
import type {
	DataListColumn,
	DataListColumnVisibility,
	DataListColumnWidth,
	DataListRow,
	DataListRowClassNameFn,
	DataListRowStyleFn,
	DataListSortOrder,
} from './DataList.model';
import {
	resolveColumnValue as resolveColumnValueUtil,
	resolvePathValue,
} from './DataList.utils';
import { useDataList } from './useDataList';
import { useDataListLayout } from './useDataListLayout';
import {
	isInteractiveTarget,
	useDataListInteractions,
} from './useDataListInteractions';
import { useDataListInitialState } from './useDataListInitialState';
import { useDataListPreferences } from './useDataListPreferences';
import { DataListSelectionToolbar } from '@/components/ui/DataListSelectionToolbar';
import { toolbarService } from '@/components/ui/Toolbar';
import { useSettingsStore } from '@/stores/settings';

const props = defineProps({
	columns: {
		type: Array as PropType<DataListColumn[]>,
		default: () => [],
	},
	autoWidth: {
		type: Boolean,
		default: true,
	},
	autoWidthSample: {
		type: Number,
		default: 15,
	},
	autoWidthMax: {
		type: Number,
		default: 200,
	},
	columnVisibility: {
		type: Array as PropType<DataListColumnVisibility[]>,
		default: null,
	},
	columnWidths: {
		type: Array as PropType<DataListColumnWidth[]>,
		default: null,
	},
	columnOrder: {
		type: Array as PropType<string[] | null>,
		default: null,
	},
	sortProp: {
		type: String,
		default: '',
	},
	sortOrder: {
		type: String as PropType<DataListSortOrder>,
		default: '',
	},
	preferencesKey: {
		type: String,
		default: '',
	},
	data: {
		type: Array as PropType<DataListRow[]>,
		default: () => [],
	},
	rowKey: {
		type: [String, Function] as PropType<
			string | ((row: DataListRow) => string | number)
		>,
		default: 'id',
	},
	selectable: {
		type: Boolean,
		default: false,
	},
	selectionDisabled: {
		type: Function as PropType<(row: DataListRow, index: number) => boolean>,
		default: null,
	},
	rowClickable: {
		type: Boolean,
		default: true,
	},
	rowClassName: {
		type: [Function, String] as PropType<DataListRowClassNameFn | string>,
		default: '',
	},
	rowStyle: {
		type: [Function, Object, Array, String] as PropType<
			DataListRowStyleFn | StyleValue
		>,
		default: undefined,
	},
	total: {
		type: Number,
		default: 0,
	},
	currentPage: {
		type: Number,
		default: 1,
	},
	perPage: {
		type: Number,
		default: DEFAULT_TABLE_PAGE_SIZE,
	},
	pageSizes: {
		type: Array as PropType<number[]>,
		default: () => [...DEFAULT_TABLE_PAGE_SIZES],
	},
	paginationLayout: {
		type: String,
		default: 'sizes, prev, pager, next, jumper',
	},
	enablePagination: {
		type: Boolean,
		default: false,
	},
	showRange: {
		type: Boolean,
		default: true,
	},
	loading: {
		type: Boolean,
		default: false,
	},
	contextMenuItems: {
		type: [Array, Function] as PropType<
			DropdownItem[] | ((row: DataListRow) => DropdownItem[])
		>,
		default: null,
	},
	selectionActions: {
		type: [Array, Function] as PropType<
			DropdownItem[] | ((rows: DataListRow[]) => DropdownItem[])
		>,
		default: null,
	},
	selectionLabelKey: {
		type: String,
		default: '',
	},
	toggleSelectionOnRowClick: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits([
	'row-click',
	'selection-change',
	'sort-change',
	'update:perPage',
	'update:currentPage',
	'update:columnVisibility',
	'update:columnWidths',
	'update:columnOrder',
	'context-action',
	'bulk-action',
	'cell-change',
]);
const { t } = useI18n();

const bemm = useBemm('ui-data-list', {
	return: 'string',
	includeBaseClass: true,
});

const settingsStore = useSettingsStore();
const app = getCurrentInstance();
const injectedRoute = inject(routeLocationKey, null);
type RouteLike = {
	$route?: {
		name?: string | symbol | null;
		path?: string;
		query?: Record<string, unknown>;
	};
};
const resolveRoute = () => {
	if (injectedRoute) {
		return injectedRoute as RouteLike['$route'];
	}

	const proxy = app?.proxy as unknown as Record<string, unknown> | undefined;
	if (proxy && Reflect.has(proxy, '$route')) {
		return (proxy as RouteLike).$route || null;
	}

	return (app?.appContext?.config?.globalProperties?.$route ?? null) as
		| RouteLike['$route']
		| null;
};
const {
	preferencesStateKey,
	selectionStateKey,
	initialSort,
	initialColumnOrder,
	initialColumnVisibility,
	initialColumnWidths,
	initialPerPage,
	initialSelectionRows,
	selectionPanelOpen,
} = useDataListInitialState({
	props,
	settingsStore,
	route: resolveRoute() || undefined,
});

const rootRef = ref<HTMLElement | null>(null);
const {
	hasData,
	sortState,
	visibleColumns,
	orderedColumns,
	hasColumnMenu,
	hasRowActions,
	setColumnOrder,
	setColumnsVisibility,
	rowKeyValue,
	hasSelection,
	selectedRows,
	selectedCount,
	allSelected,
	isRowSelected,
	setRowSelection,
	setAllSelection,
	clearAllSelection,
	deselectSelectedRow,
	replaceSelection,
	rangeLabel,
	handleHeaderClick,
	isSortedColumn,
	resolveRowClassName,
	onSizeChange,
	onCurrentChange,
	selectionActionItems,
	onRowContextMenu,
	closeContextMenu,
	buildContextMenuItems,
} = useDataList(props, emit, {
	initialSort,
	initialColumnOrder,
	initialColumnVisibility,
});

onMounted(() => {
	if (initialSelectionRows.length > 0) {
		replaceSelection(initialSelectionRows, { emit: false });
	}

	if (initialPerPage !== null && initialPerPage !== props.perPage) {
		emit('update:perPage', initialPerPage);
	}

	if (!initialSort) {
		return;
	}

	emit('sort-change', {
		column: {
			...initialSort.column,
			order: initialSort.order,
		},
		prop: initialSort.column.key,
		order: initialSort.order,
	});
});

/**
 * Normalizes width entries by removing duplicates and invalid numeric values.
 */
const normalizeColumnWidthList = (
	columnWidths: DataListColumnWidth[]
): DataListColumnWidth[] => {
	const seen = new Set<string>();
	const normalized: DataListColumnWidth[] = [];

	(columnWidths || []).forEach((entry) => {
		if (!entry?.key || seen.has(entry.key)) {
			return;
		}

		const width = Number(entry.width);
		if (!Number.isFinite(width) || width <= 0) {
			return;
		}

		seen.add(entry.key);
		normalized.push({
			key: entry.key,
			width: Math.round(width),
		});
	});

	return normalized;
};

/**
 * Performs stable equality check for normalized width lists.
 */
const isSameColumnWidthList = (
	a: DataListColumnWidth[],
	b: DataListColumnWidth[]
): boolean =>
	a.length === b.length &&
	a.every((entry, index) => {
		const compare = b[index];
		return (
			Boolean(compare) &&
			entry.key === compare.key &&
			Math.round(entry.width) === Math.round(compare.width)
		);
	});

/**
 * Resolves a cell value from row + column configuration.
 */
const resolveColumnValue = (row: DataListRow, column: DataListColumn) =>
	resolveColumnValueUtil(row, column);

/**
 * Returns whether a column supports resize interactions.
 */
const isColumnResizable = (column: DataListColumn): boolean =>
	column.resizable !== false;

const dataListClasses = computed(() =>
	bemm('', [
		hasSelection.value ? 'selection' : '',
		props.loading ? 'loading' : '',
		isResizingColumn.value ? 'resizing' : '',
	])
);

const normalizeRouteQueryId = (value: unknown): string => {
	if (Array.isArray(value)) {
		const firstValue = value.find(
			(entry) => entry !== null && entry !== undefined
		);
		return firstValue === null || firstValue === undefined
			? ''
			: String(firstValue);
	}

	return value === null || value === undefined ? '' : String(value);
};

const activeRouteRowId = computed(() =>
	normalizeRouteQueryId(
		resolveRoute()?.query?.id ||
			(typeof window !== 'undefined'
				? new URLSearchParams(window.location.search).get('id')
				: '')
	)
);

const isRouteRowActive = (row: DataListRow, rowIndex: number): boolean => {
	if (!activeRouteRowId.value) {
		return false;
	}

	const key = rowKeyValue(row, rowIndex);
	return String(key) === activeRouteRowId.value;
};

const resolveRowStyle = (row: DataListRow, rowIndex: number) => {
	if (typeof props.rowStyle === 'function') {
		return props.rowStyle({ row, rowIndex });
	}

	return props.rowStyle;
};

const selectableRef = computed(() => props.selectable);
const hasRowActionsRef = computed(() => hasRowActions.value);
const externalColumnWidths = computed<DataListColumnWidth[] | null>(() =>
	Array.isArray(props.columnWidths)
		? normalizeColumnWidthList(props.columnWidths)
		: null
);
const {
	gridStyles,
	startColumnResize,
	resetColumnWidths,
	isResizingColumn,
	columnWidths,
} = useDataListLayout(
	props,
	rootRef,
	orderedColumns,
	visibleColumns,
	selectableRef,
	hasRowActionsRef,
	hasColumnMenu,
	{
		initialColumnWidths,
		externalColumnWidths,
	}
);

const {
	columnMenuItems,
	hasResettableColumnPreferences,
	areAllColumnsVisible,
	allVisibilityToggleTooltip,
	handleColumnMenuUpdate,
	toggleAllColumnsVisibility,
	resetColumnPreferences,
	setSelectionPanelOpen,
} = useDataListPreferences({
	props,
	settingsStore,
	t,
	preferencesStateKey,
	sortState,
	orderedColumns,
	visibleColumns,
	setColumnOrder,
	setColumnsVisibility,
	selectionStateKey,
	selectedRows,
	selectedCount,
	selectionPanelOpen,
	onResetColumnWidths: () => {
		if (Array.isArray(props.columnWidths)) {
			emit('update:columnWidths', []);
			return;
		}
		resetColumnWidths();
	},
});

const defaultColumnWidths = computed<DataListColumnWidth[]>(() => []);

watch(columnWidths, (nextColumnWidths) => {
	if (!Array.isArray(props.columnWidths)) {
		return;
	}

	const normalized = normalizeColumnWidthList(nextColumnWidths);
	if (isSameColumnWidthList(normalized, externalColumnWidths.value || [])) {
		return;
	}

	emit('update:columnWidths', normalized);
});

watch(
	() =>
		[
			preferencesStateKey.value,
			columnWidths.value,
			defaultColumnWidths.value,
		] as const,
	([preferencesKey, nextColumnWidths, defaultWidths]) => {
		if (!preferencesKey || !settingsStore) {
			return;
		}

		const normalized = normalizeColumnWidthList(nextColumnWidths);
		if (!normalized.length) {
			settingsStore.clearColumnWidths(preferencesKey);
			return;
		}

		if (isSameColumnWidthList(normalized, defaultWidths)) {
			settingsStore.clearColumnWidths(preferencesKey);
			return;
		}

		settingsStore.setColumnWidths(preferencesKey, normalized);
	},
	{ deep: true }
);

const rowActions = (row: DataListRow) => buildContextMenuItems(row);

/**
 * Resolves disabled state for switch-like column controls.
 */
const isColumnDisabled = (row: DataListRow, column: DataListColumn) => {
	if (typeof column.disabled === 'function') {
		return Boolean(column.disabled(row));
	}
	return Boolean(column.disabled);
};

/**
 * Emits normalized cell edit events.
 */
const onCellValueChange = (
	value: unknown,
	row: DataListRow,
	column: DataListColumn,
	rowIndex: number
) => {
	column.onChange?.(value, row, column, rowIndex);
	emit('cell-change', { value, row, column, rowIndex });
};

/**
 * Handles row action execution and event emission.
 */
const handleRowAction = (item: DropdownItem, row: DataListRow) => {
	if (item.disabled) return;
	emit('context-action', { item, row });
};

const showSelectionActions = computed(
	() => selectionActionItems.value.length > 0
);
const selectionToolbarId = `data-list-selection-${crypto.randomUUID()}`;

/**
 * Selects all rows in the current page.
 */
const selectAllCurrentPage = () => {
	setAllSelection(true);
};

/**
 * Clears all selected rows.
 */
const deselectAllRows = () => {
	clearAllSelection();
};

const paginationVisibilityThreshold = computed(() => {
	const normalized = (props.pageSizes || [])
		.map((size) => Number(size))
		.filter((size) => Number.isFinite(size) && size > 0);

	if (!normalized.length) {
		return Math.max(1, Number(props.perPage) || DEFAULT_TABLE_PAGE_SIZE);
	}

	return Math.min(...normalized);
});

const showPagination = computed(
	() =>
		Boolean(props.enablePagination) &&
		Number(props.total) > paginationVisibilityThreshold.value
);

/**
 * Executes bulk actions with selected rows.
 */
const handleBulkAction = (item: DropdownItem) => {
	if (item.disabled) return;
	emit('bulk-action', { item, rows: selectedRows.value });
};

/**
 * Resolves the label shown for a row in the selection toolbar.
 */
const resolveSelectionLabel = (row: DataListRow, index: number) => {
	if (!props.selectionLabelKey) {
		return '';
	}

	const resolvedValue = resolvePathValue(row, props.selectionLabelKey);
	if (resolvedValue === null || resolvedValue === undefined) {
		return '';
	}

	const text = String(resolvedValue).trim();
	if (text) {
		return text;
	}

	return `#${index + 1}`;
};

/**
 * Handles row removal from toolbar selection list.
 */
const handleDeselectRowFromToolbar = (row: DataListRow) => {
	deselectSelectedRow(row);
};

const selectionRowsForToolbar = computed(() => {
	if (selectedRows.value.length) {
		return selectedRows.value;
	}

	if (!selectedCount.value || !selectionStateKey.value || !settingsStore) {
		return [];
	}

	return settingsStore.getDataListSelection(selectionStateKey.value);
});

const selectionToolbarProps = computed(() => ({
	selectedCount: selectedCount.value,
	selectedRows: selectionRowsForToolbar.value,
	panelOpen: selectionPanelOpen.value,
	resolveLabel: resolveSelectionLabel,
	selectionActions: selectionActionItems.value,
	showActions: showSelectionActions.value,
	disableSelectAllPage: allSelected.value,
	onSelectAllPage:
		typeof props.selectionDisabled === 'function'
			? undefined
			: selectAllCurrentPage,
	onDeselectAll: deselectAllRows,
	onDeselectRow: handleDeselectRowFromToolbar,
	onPanelOpenChange: setSelectionPanelOpen,
	onActionSelect: handleBulkAction,
}));

watch(
	() => hasSelection.value,
	(hasSelectionNow) => {
		if (!hasSelectionNow) {
			toolbarService.hide(selectionToolbarId);
			return;
		}

		toolbarService.show({
			id: selectionToolbarId,
			component: DataListSelectionToolbar,
			props: selectionToolbarProps.value,
		});
	},
	{ immediate: true }
);

watch(
	selectionToolbarProps,
	(nextProps) => {
		if (!hasSelection.value) {
			return;
		}

		toolbarService.update(selectionToolbarId, {
			props: nextProps,
		});
	},
	{ deep: true }
);

onBeforeUnmount(() => {
	toolbarService.hide(selectionToolbarId);
});

const rowClickableRef = computed(() => props.rowClickable);
const { onRowClick: emitRowClick } = useDataListInteractions(
	{ rowClickable: rowClickableRef },
	emit,
	closeContextMenu
);

const onRowClick = (event: MouseEvent, row: DataListRow, rowIndex: number) => {
	if (
		props.toggleSelectionOnRowClick &&
		props.selectable &&
		!isInteractiveTarget(event.target)
	) {
		setRowSelection(row, !isRowSelected(row, rowIndex), rowIndex);
	}

	emitRowClick(event, row);
};
</script>

<style lang="scss">
.ui-data-list {
	$b: &;
	display: flex;
	flex-direction: column;
	gap: var(--space-s);
	position: relative;

	--int-datalist-cell-padding: var(
		--datalist-cell-padding,
		var(--space-s) var(--space)
	);
	--int-datalist-font-size: var(--datalist-font-size, var(--font-size-s));
	--int-datalist-border-color: var(
		--datalist-border-color,
		color-mix(in srgb, var(--color-foreground), transparent 90%)
	);
	--int-datalist-border-radius: var(
		--datalist-border-radius,
		var(--border-radius)
	);
	--int-datalist-header-background: var(
		--datalist-header-background,
		color-mix(in srgb, var(--color-foreground), transparent 95%)
	);
	--int-datalist-header-text-color: var(
		--datalist-header-text-color,
		var(--color-foreground)
	);

	border-radius: var(--border-radius);
	border: 1px solid
		var(--datalist-table-border-color, var(--int-datalist-border-color));
	box-shadow: 0 0 10px 0
		color-mix(
			in srgb,
			var(--datalist-table-border-color, var(--int-datalist-border-color)),
			transparent 50%
		);

	&__content {
		transition:
			filter 180ms ease,
			opacity 180ms ease;
	}

	&__loading-overlay {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		pointer-events: none;
		z-index: 5;
	}

	&__scroller {
		max-width: 100%;
		overflow-x: auto;
		overflow-y: hidden;
		scrollbar-width: thin;
		scrollbar-color: color-mix(
				in srgb,
				var(--color-foreground),
				transparent 80%
			)
			transparent;
		// scrollbar-width: none;
		// border: 1px solid red;
	}

	&__grid {
		min-width: 100%;
		width: max-content;
	}

	&__header,
	&__row {
		display: grid;
		grid-template-columns: var(--data-list-columns);
		gap: var(--space-s);
		align-items: center;
		width: 100%;
	}

	&__header {
		border-bottom: 1px solid var(--int-datalist-border-color);
		padding: 0 0 var(--space-xs);
		border-radius: var(--int-datalist-border-radius)
			var(--int-datalist-border-radius) 0 0;
		color: var(--int-datalist-header-text-color);
		position: sticky;
		top: 0;
		z-index: 2;
	}

	&__body {
		display: flex;
		flex-direction: column;
	}

	&__row {
		--int-datalist-row-accent: var(--datalist-row-accent, transparent);
		border-bottom: 1px solid var(--int-datalist-border-color);
		cursor: pointer;
		transition:
			box-shadow 0.2s ease,
			background-color 120ms ease;
		box-shadow: inset 4px 0 0 0
			color-mix(in srgb, var(--int-datalist-row-accent), transparent 50%);

		#{$b}__cell {
			&:first-child {
				box-shadow: inset 4px 0 0 0
					color-mix(in srgb, var(--int-datalist-row-accent), transparent 50%);
			}
		}

		&:hover {
			// box-shadow: inset 4px 0 0 0 color-mix(in srgb, var(--int-datalist-row-accent), transparent 25%);
		}

		&:last-child {
			border-bottom: 0;
		}

		&--clickable:hover {
			background: color-mix(in srgb, var(--color-secondary), transparent 94%);
		}

		&:hover .ui-data-list__cell--row-checkbox {
			opacity: 1;
			pointer-events: auto;
		}

		&--selected {
			background: color-mix(in srgb, var(--color-secondary), transparent 90%);
		}

		&--active {
			background: color-mix(in srgb, var(--color-secondary), transparent 90%);
		}

		&--selection-disabled {
			opacity: 0.5;
		}
	}

	&__cell {
		display: flex;
		align-items: center;
		gap: var(--space-xs);
		min-width: 0;
		word-break: break-word;
		overflow-wrap: anywhere;
		font-size: var(--int-datalist-font-size);
		padding: var(--int-datalist-cell-padding);

		&--header {
			font-weight: 600;
			background: transparent;
			border: none;
			padding: var(--int-datalist-cell-padding);
			text-align: left;
			color: inherit;
			position: relative;
			width: 100%;
			justify-content: flex-start;
		}

		&--sortable {
			cursor: pointer;
		}

		&--checkbox {
			justify-content: center;
			width: 28px;
			--field-min-width: 0px;
		}

		&--row-checkbox {
			opacity: 0;
			pointer-events: none;
			transition: opacity 120ms ease;
			--field-min-width: 0px;

			position: sticky;
			left: 0;
			z-index: 10;
		}

		&--settings {
			justify-content: flex-end;
			width: 32px;
		}

		&--actions {
			justify-content: flex-end;
			width: 40px;
			position: sticky;
			right: 0;
			z-index: 1;
			background: transparent;
		}

		&--left {
			justify-content: flex-start;
			text-align: left;
		}
		&--center {
			justify-content: center;
			text-align: center;
		}
		&--right {
			justify-content: flex-end;
			text-align: right;
		}
	}

	&__header-label {
		display: inline-flex;
		align-items: center;
		gap: var(--space-xxs);
		min-width: 0;
	}

	&__resize-handle {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		width: var(--space-s);
		cursor: col-resize;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		touch-action: none;
		opacity: 0;
		pointer-events: none;
		transition: opacity 120ms ease;
	}

	&__resize-handle::before {
		content: '';
		width: 2px;
		height: 58%;
		border-radius: 999px;
		background: color-mix(in srgb, var(--color-foreground), transparent 72%);
		transition: background-color 120ms ease;
	}

	&__resize-handle:hover::before {
		background: color-mix(in srgb, var(--color-secondary), transparent 25%);
	}

	&__cell--header:hover &__resize-handle,
	&--resizing &__resize-handle {
		opacity: 1;
		pointer-events: auto;
	}

	&--resizing {
		user-select: none;
		cursor: col-resize;
	}

	&__header-settings {
		position: absolute;
		right: var(--space-xs);
		top: var(--space-xs);
		z-index: 3;
		align-self: start;
		margin-left: auto;
	}

	&__column-menu {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	&__column-menu-footer {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: var(--space-xs);
		padding-top: var(--space-xs);
		border-top: 1px solid
			color-mix(in srgb, var(--color-foreground), transparent 90%);
	}

	&__column-menu-reset,
	&__column-menu-visibility-toggle {
		width: auto;
	}

	&--selection {
		.ui-data-list__cell--row-checkbox {
			opacity: 1;
			pointer-events: auto;
		}
	}

	&--loading {
		.ui-data-list__content {
			filter: blur(2px);
			opacity: 0.25;
			pointer-events: none;
		}
	}

	&__row-actions-trigger {
		pointer-events: none;
		transition: transform 0.25s ease-in-out;
		font-size: var(--font-size);
		transform: scale(0);
	}

	&__row:hover .ui-data-list__row-actions-trigger {
		transform: scale(1);
		pointer-events: auto;
	}

	&__sort {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 1.1em;
		line-height: 1;
	}

	&__sort-icon {
		font-size: 1em;
		transform-origin: center;
		transition:
			color 140ms ease,
			transform 140ms ease,
			opacity 140ms ease;

		&--active {
			color: var(--color-secondary);
			opacity: 1;
		}

		&--inactive {
			color: color-mix(in srgb, var(--color-foreground), transparent 58%);
			opacity: 0.65;
			transform: scale(0.9);
		}

		&--ascending {
			transform: rotate(180deg) scale(1.08);
		}

		&--descending {
			transform: rotate(0deg) scale(1.08);
		}
	}

	&__footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-s);
		flex-wrap: wrap;
		padding: var(--space);
	}

	&__range {
		margin: 0;
		font-size: var(--font-size-s);
		color: color-mix(in srgb, var(--color-foreground), transparent 35%);
	}

	&__empty {
		text-align: center;
		color: color-mix(in srgb, var(--color-foreground), transparent 45%);
		padding: var(--space-s);
	}

	&__checkbox {
		// --checkbox-size: 0.85em;
	}

	&__checkbox .ui-field {
		min-width: 0;
		gap: 0;
	}

	&__checkbox .ui-field__container {
		gap: 0;
	}

	&__checkbox .ui-field__control {
		min-height: 0;
	}
}
</style>
