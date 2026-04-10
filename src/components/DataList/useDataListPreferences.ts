import { computed, watch, type Ref } from 'vue';
import type {
	DataListColumn,
	DataListColumnVisibility,
	DataListRow,
	DataListSortState,
} from './DataList.model';
import type { DraggableVisibilityMenuItem } from '@/components/ui/DraggableVisibilityMenu';

type DataListSettingsStore = {
	getColumnOrder: (key: string) => string[] | null;
	getColumnVisibility: (key: string) => DataListColumnVisibility[] | null;
	getColumnWidths: (
		key: string
	) => Array<{ key: string; width: number }> | null;
	setSort: (
		key: string,
		payload: { prop: string; order: DataListSortState['order'] }
	) => void;
	clearSort: (key: string) => void;
	setColumnOrder: (key: string, order: string[]) => void;
	clearColumnOrder: (key: string) => void;
	setColumnVisibility: (
		key: string,
		visibility: DataListColumnVisibility[]
	) => void;
	clearColumnVisibility: (key: string) => void;
	setPerPage: (key: string, perPage: number) => void;
	clearPerPage: (key: string) => void;
	setDataListSelection: (key: string, rows: DataListRow[]) => void;
	clearDataListSelection: (key: string) => void;
	setDataListSelectionPanelOpen: (key: string, isOpen: boolean) => void;
	clearColumnWidths: (key: string) => void;
};

type DataListPreferenceProps = {
	preferencesKey: string;
	columns: DataListColumn[];
	pageSizes: number[];
	perPage: number;
};

type UseDataListPreferencesOptions = {
	props: DataListPreferenceProps;
	settingsStore: DataListSettingsStore | null;
	t: (key: string) => string;
	preferencesStateKey: Ref<string>;
	sortState: Ref<DataListSortState>;
	orderedColumns: Ref<DataListColumn[]>;
	visibleColumns: Ref<DataListColumn[]>;
	setColumnOrder: (order: string[]) => void;
	setColumnsVisibility: (visibility: DataListColumnVisibility[]) => void;
	selectionStateKey: Ref<string>;
	selectedRows: Ref<DataListRow[]>;
	selectedCount: Ref<number>;
	selectionPanelOpen: Ref<boolean>;
	onResetColumnWidths: () => void;
};

/**
 * Normalizes visibility entries by removing duplicates and invalid keys.
 */
const normalizeColumnVisibilityList = (
	columnVisibility: DataListColumnVisibility[]
): DataListColumnVisibility[] => {
	const seen = new Set<string>();
	const normalized: DataListColumnVisibility[] = [];

	(columnVisibility || []).forEach((entry) => {
		if (!entry?.key || seen.has(entry.key)) {
			return;
		}

		seen.add(entry.key);
		normalized.push({
			key: entry.key,
			visible: Boolean(entry.visible),
		});
	});

	return normalized;
};

/**
 * Performs stable equality checks for normalized visibility arrays.
 */
const isSameColumnVisibility = (
	a: DataListColumnVisibility[],
	b: DataListColumnVisibility[]
): boolean =>
	a.length === b.length &&
	a.every((entry, index) => {
		const compare = b[index];
		return (
			Boolean(compare) &&
			entry.key === compare.key &&
			Boolean(entry.visible) === Boolean(compare.visible)
		);
	});

/**
 * Manages DataList preference persistence and column settings menu state/actions.
 */
export const useDataListPreferences = ({
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
	onResetColumnWidths,
}: UseDataListPreferencesOptions) => {
	/**
	 * Returns whether a column is currently visible.
	 */
	const isColumnVisible = (columnKey: string) =>
		visibleColumns.value.some((column) => column.key === columnKey);

	const orderedColumnKeys = computed(() =>
		orderedColumns.value.map((column) => column.key)
	);

	const defaultColumnVisibility = computed<DataListColumnVisibility[]>(() =>
		normalizeColumnVisibilityList(
			props.columns.map((column) => ({
				key: column.key,
				visible: column.visible ?? true,
			}))
		)
	);

	const currentColumnVisibility = computed<DataListColumnVisibility[]>(() =>
		normalizeColumnVisibilityList(
			props.columns.map((column) => ({
				key: column.key,
				visible: isColumnVisible(column.key),
			}))
		)
	);

	/**
	 * Persists selection-toolbar panel state for the active key.
	 */
	const setSelectionPanelOpen = (isOpen: boolean) => {
		selectionPanelOpen.value = isOpen;
		const key = selectionStateKey.value;
		if (!key || !settingsStore) {
			return;
		}
		settingsStore.setDataListSelectionPanelOpen(key, isOpen);
	};

	watch(
		() =>
			[
				preferencesStateKey.value,
				sortState.value.column?.key || '',
				sortState.value.order,
			] as const,
		([preferencesKey, sortProp, sortOrder]) => {
			if (!preferencesKey || !settingsStore) {
				return;
			}

			if (!sortOrder || !sortProp) {
				settingsStore.clearSort(preferencesKey);
				return;
			}

			settingsStore.setSort(preferencesKey, {
				prop: sortProp,
				order: sortOrder,
			});
		}
	);

	watch(
		[
			() => preferencesStateKey.value,
			orderedColumnKeys,
			() => props.columns.map((column) => column.key),
		],
		([preferencesKey, columnOrder, defaultColumnOrder]) => {
			if (!preferencesKey || !settingsStore) {
				return;
			}
			if (!defaultColumnOrder.length) {
				return;
			}

			if (!columnOrder.length) {
				settingsStore.clearColumnOrder(preferencesKey);
				return;
			}

			const isDefaultOrder =
				columnOrder.length === defaultColumnOrder.length &&
				columnOrder.every((key, index) => key === defaultColumnOrder[index]);

			if (isDefaultOrder) {
				settingsStore.clearColumnOrder(preferencesKey);
				return;
			}

			settingsStore.setColumnOrder(preferencesKey, columnOrder);
		}
	);

	watch(
		[
			() => preferencesStateKey.value,
			currentColumnVisibility,
			defaultColumnVisibility,
		],
		([preferencesKey, columnVisibility, defaultVisibility]) => {
			if (!preferencesKey || !settingsStore) {
				return;
			}
			if (!defaultVisibility.length) {
				return;
			}

			if (!columnVisibility.length) {
				settingsStore.clearColumnVisibility(preferencesKey);
				return;
			}

			if (isSameColumnVisibility(columnVisibility, defaultVisibility)) {
				settingsStore.clearColumnVisibility(preferencesKey);
				return;
			}

			settingsStore.setColumnVisibility(preferencesKey, columnVisibility);
		}
	);

	watch(
		() => [preferencesStateKey.value, props.perPage, props.pageSizes] as const,
		([preferencesKey, perPage, pageSizes]) => {
			if (!preferencesKey || !settingsStore) {
				return;
			}

			const normalizedPerPage = Number(perPage);
			if (!Number.isFinite(normalizedPerPage) || normalizedPerPage <= 0) {
				settingsStore.clearPerPage(preferencesKey);
				return;
			}

			const normalizedPageSizes = (pageSizes || [])
				.map((size) => Number(size))
				.filter((size) => Number.isFinite(size) && size > 0);
			const defaultPerPage = normalizedPageSizes.length
				? Math.min(...normalizedPageSizes)
				: 10;

			if (normalizedPerPage === defaultPerPage) {
				settingsStore.clearPerPage(preferencesKey);
				return;
			}

			settingsStore.setPerPage(preferencesKey, normalizedPerPage);
		}
	);

	watch(
		() =>
			[
				selectionStateKey.value,
				selectedRows.value,
				selectedCount.value,
			] as const,
		([stateKey, rows, count]) => {
			if (!stateKey || !settingsStore) {
				return;
			}

			if (!count) {
				settingsStore.clearDataListSelection(stateKey);
				selectionPanelOpen.value = false;
				return;
			}

			if (rows.length) {
				settingsStore.setDataListSelection(stateKey, rows);
			}
			settingsStore.setDataListSelectionPanelOpen(
				stateKey,
				selectionPanelOpen.value
			);
		},
		{ deep: true }
	);

	const columnMenuItems = computed<DraggableVisibilityMenuItem[]>(() =>
		orderedColumns.value.map((column) => ({
			key: column.key,
			label: column.label,
			visible: isColumnVisible(column.key),
		}))
	);

	/**
	 * Applies draggable menu changes (order and visibility).
	 */
	const handleColumnMenuUpdate = (items: DraggableVisibilityMenuItem[]) => {
		setColumnOrder(items.map((item) => item.key));
		setColumnsVisibility(
			items.map((item) => ({
				key: item.key,
				visible: item.visible,
			}))
		);
	};

	const hasResettableColumnPreferences = computed(() => {
		const key = preferencesStateKey.value;
		if (!key || !settingsStore) {
			return false;
		}

		return Boolean(
			settingsStore.getColumnOrder(key)?.length ||
			settingsStore.getColumnVisibility(key)?.length ||
			settingsStore.getColumnWidths(key)?.length
		);
	});

	const areAllColumnsVisible = computed(() =>
		orderedColumns.value.every((column) => isColumnVisible(column.key))
	);

	const allVisibilityToggleTooltip = computed(() =>
		areAllColumnsVisible.value
			? `${t('common.actions.hide')} ${t('common.labels.all')}`
			: `${t('common.actions.show')} ${t('common.labels.all')}`
	);

	/**
	 * Toggles all columns between hidden and visible.
	 */
	const toggleAllColumnsVisibility = () => {
		const shouldShowAll = !areAllColumnsVisible.value;
		setColumnsVisibility(
			orderedColumns.value.map((column) => ({
				key: column.key,
				visible: shouldShowAll,
			}))
		);
	};

	/**
	 * Resets this table's persisted column preferences to defaults.
	 */
	const resetColumnPreferences = (closeMenu?: () => void) => {
		const preferencesKey = preferencesStateKey.value;
		if (!preferencesKey || !settingsStore) {
			closeMenu?.();
			return;
		}

		const defaultOrder = props.columns.map((column) => column.key);
		setColumnOrder(defaultOrder);
		setColumnsVisibility(defaultColumnVisibility.value);

		onResetColumnWidths();
		settingsStore.clearColumnWidths(preferencesKey);
		settingsStore.clearColumnOrder(preferencesKey);
		settingsStore.clearColumnVisibility(preferencesKey);

		closeMenu?.();
	};

	return {
		columnMenuItems,
		hasResettableColumnPreferences,
		areAllColumnsVisible,
		allVisibilityToggleTooltip,
		handleColumnMenuUpdate,
		toggleAllColumnsVisibility,
		resetColumnPreferences,
		setSelectionPanelOpen,
	};
};
