import { computed, getCurrentInstance, onBeforeUnmount, ref, watch } from 'vue';
import { DEFAULT_TABLE_PAGE_SIZE } from '@/constants/pagination';
import { Color, Icons } from '@/types';
import type {
	DataListColumn,
	DataListColumnVisibility,
	DataListRow,
	DataListRowClassNameFn,
	DataListSortOrder,
	DataListSortState,
} from './DataList.model';
import type { DropdownItem } from '@/components/ui/Dropdown/Dropdown.model';
import {
	contextMenuService,
	createContextMenuInstanceId,
} from '@/components/ui/ContextMenu';

/**
 * Subset of DataList props used to manage table state in this composable.
 */
type DataListProps = {
	columns: DataListColumn[];
	columnVisibility?: DataListColumnVisibility[] | null;
	columnOrder?: string[] | null;
	sortProp?: string;
	sortOrder?: DataListSortOrder;
	data: DataListRow[];
	rowKey: string | ((row: DataListRow) => string | number);
	selectable: boolean;
	rowClassName: DataListRowClassNameFn | string;
	total: number;
	currentPage: number;
	perPage: number;
	selectionActions?:
		| DropdownItem[]
		| ((rows: DataListRow[]) => DropdownItem[])
		| null;
	contextMenuItems?:
		| DropdownItem[]
		| ((row: DataListRow) => DropdownItem[])
		| null;
};

/**
 * Local emit signature for DataList update events.
 */
type EmitFn = (...args: any[]) => void;

/**
 * Core DataList behavior composable.
 * Handles sorting, column visibility/order, row selection, pagination events,
 * and context-menu state.
 */
export const useDataList = (
	props: DataListProps,
	emit: EmitFn,
	options?: {
		initialSort?: DataListSortState | null;
		initialColumnOrder?: string[] | null;
		initialColumnVisibility?: DataListColumnVisibility[] | null;
	}
) => {
	const rows = computed<DataListRow[]>(() =>
		Array.isArray(props.data) ? props.data : []
	);
	const hasData = computed(() => rows.value.length > 0);
	const resolveSortColumn = (sortProp?: string): DataListColumn =>
		props.columns.find((column) => column.key === sortProp) ||
		props.columns[0] || { key: '', label: '' };

	const sortState = ref<DataListSortState>({
		column: options?.initialSort?.column || resolveSortColumn(props.sortProp),
		order: options?.initialSort?.order || props.sortOrder || '',
	});

	/**
	 * Normalizes configured column order by deduplicating known keys and appending
	 * any columns not explicitly listed.
	 */
	const normalizeColumnOrder = (
		order: string[] | null | undefined,
		columns: DataListColumn[]
	): string[] => {
		const knownKeys = new Set(columns.map((column) => column.key));
		const normalized: string[] = [];

		(order || []).forEach((key) => {
			if (knownKeys.has(key) && !normalized.includes(key)) {
				normalized.push(key);
			}
		});

		columns.forEach((column) => {
			if (!normalized.includes(column.key)) {
				normalized.push(column.key);
			}
		});

		return normalized;
	};

	const localColumnOrder = ref<string[]>(
		normalizeColumnOrder(
			options?.initialColumnOrder || props.columnOrder,
			props.columns
		)
	);

	watch(
		() => [props.sortProp, props.sortOrder, props.columns] as const,
		([sortProp, sortOrder]) => {
			if (!sortProp && !sortOrder) {
				return;
			}

			sortState.value = {
				column: resolveSortColumn(sortProp),
				order: sortOrder || '',
			};
		}
	);

	watch(
		() => [props.columnOrder, props.columns] as const,
		([columnOrder, columns]) => {
			if (Array.isArray(columnOrder)) {
				localColumnOrder.value = normalizeColumnOrder(columnOrder, columns);
				return;
			}

			localColumnOrder.value = normalizeColumnOrder(
				localColumnOrder.value,
				columns
			);
		}
	);

	watch(
		() => props.columns,
		(columns) => {
			if (Array.isArray(props.columnVisibility)) {
				return;
			}

			const next: Record<string, boolean> = {};
			columns.forEach((column) => {
				if (
					Object.prototype.hasOwnProperty.call(
						localVisibility.value,
						column.key
					)
				) {
					next[column.key] = localVisibility.value[column.key];
					return;
				}

				next[column.key] = column.visible ?? true;
			});

			localVisibility.value = next;
		},
		{ deep: true }
	);

	/**
	 * Builds the initial local visibility map from optional persisted entries
	 * and column defaults.
	 */
	const buildInitialVisibility = (
		columns: DataListColumn[],
		initialColumnVisibility?: DataListColumnVisibility[] | null
	): Record<string, boolean> => {
		const initialVisibility: Record<string, boolean> = {};

		(initialColumnVisibility || []).forEach((entry) => {
			if (!entry?.key) {
				return;
			}

			initialVisibility[entry.key] = Boolean(entry.visible);
		});

		columns.forEach((column) => {
			if (Object.prototype.hasOwnProperty.call(initialVisibility, column.key)) {
				return;
			}
			initialVisibility[column.key] = column.visible ?? true;
		});

		return initialVisibility;
	};

	const localVisibility = ref<Record<string, boolean>>(
		buildInitialVisibility(props.columns, options?.initialColumnVisibility)
	);

	const orderedColumns = computed(() => {
		const normalizedOrder = normalizeColumnOrder(
			Array.isArray(props.columnOrder)
				? props.columnOrder
				: localColumnOrder.value,
			props.columns
		);
		const columnsByKey = new Map(
			props.columns.map((column) => [column.key, column])
		);

		return normalizedOrder
			.map((key) => columnsByKey.get(key))
			.filter((column): column is DataListColumn => Boolean(column));
	});

	const visibleColumns = computed(() => {
		const visibilityMap: Record<string, boolean> = {};
		if (Array.isArray(props.columnVisibility)) {
			props.columnVisibility.forEach((entry) => {
				visibilityMap[entry.key] = entry.visible;
			});
		}

		return orderedColumns.value.filter((column) => {
			if (Array.isArray(props.columnVisibility)) {
				return visibilityMap[column.key] ?? column.visible ?? true;
			}
			if (
				Object.prototype.hasOwnProperty.call(localVisibility.value, column.key)
			) {
				return localVisibility.value[column.key];
			}
			return column.visible ?? true;
		});
	});

	const hasColumnMenu = computed(() => props.columns.length > 0);

	/**
	 * Applies a new column order in controlled (`columnOrder`) or uncontrolled mode.
	 */
	const setColumnOrder = (nextOrder: string[]) => {
		const normalized = normalizeColumnOrder(nextOrder, props.columns);

		if (Array.isArray(props.columnOrder)) {
			emit('update:columnOrder', normalized);
			return;
		}

		localColumnOrder.value = normalized;
	};

	/**
	 * Applies explicit visibility values for a set of columns.
	 */
	const setColumnsVisibility = (nextVisibility: DataListColumnVisibility[]) => {
		const nextByKey = new Map(
			(nextVisibility || [])
				.filter((entry) => Boolean(entry?.key))
				.map((entry) => [entry.key, Boolean(entry.visible)])
		);

		if (Array.isArray(props.columnVisibility)) {
			const next = props.columns.map((column) => {
				const current = props.columnVisibility?.find(
					(entry) => entry.key === column.key
				);
				return {
					key: column.key,
					visible:
						nextByKey.get(column.key) ??
						current?.visible ??
						column.visible ??
						true,
				};
			});
			emit('update:columnVisibility', next);
			return;
		}

		const nextLocalVisibility: Record<string, boolean> = {};
		props.columns.forEach((column) => {
			if (nextByKey.has(column.key)) {
				nextLocalVisibility[column.key] = Boolean(nextByKey.get(column.key));
				return;
			}

			nextLocalVisibility[column.key] =
				localVisibility.value[column.key] ?? column.visible ?? true;
		});

		localVisibility.value = nextLocalVisibility;
	};

	/**
	 * Toggles visibility for a single column key.
	 */
	const toggleColumn = (columnKey: string) => {
		if (Array.isArray(props.columnVisibility)) {
			const next = props.columns.map((column) => {
				const current = props.columnVisibility?.find(
					(entry) => entry.key === column.key
				);
				const visible =
					column.key === columnKey
						? !(current?.visible ?? column.visible ?? true)
						: (current?.visible ?? column.visible ?? true);
				return { key: column.key, visible };
			});
			emit('update:columnVisibility', next);
			return;
		}
		const current =
			localVisibility.value[columnKey] ??
			props.columns.find((c) => c.key === columnKey)?.visible ??
			true;
		localVisibility.value = {
			...localVisibility.value,
			[columnKey]: !current,
		};
	};

	const columnMenuItems = computed<DropdownItem[]>(() =>
		orderedColumns.value.map((column) => {
			const isVisible = visibleColumns.value.some(
				(item) => item.key === column.key
			);
			return {
				type: 'item' as const,
				key: column.key,
				label: column.label,
				icon: isVisible ? Icons.UI_VISIBLE_L : Icons.UI_INVISIBLE_L,
				color: isVisible ? Color.FOREGROUND : Color.GRAY,
				value: column.key,
				action: () => toggleColumn(column.key),
			};
		})
	);

	/**
	 * Resolves the stable key value used for rendering and selection tracking.
	 */
	const rowKeyValue = (row: DataListRow, index: number): string | number => {
		if (typeof props.rowKey === 'function') {
			return props.rowKey(row);
		}
		return (
			((row as Record<string, unknown>)?.[props.rowKey] as string | number) ??
			index
		);
	};

	const selectedKeys = ref<Set<string | number>>(new Set());
	const selectedRowMap = ref<Map<string | number, DataListRow>>(new Map());
	const selectedRows = computed<DataListRow[]>(() =>
		Array.from(selectedKeys.value)
			.map((key) => selectedRowMap.value.get(key))
			.filter((row): row is DataListRow => Boolean(row))
	);
	const selectedCount = computed(() => selectedKeys.value.size);
	const hasSelection = computed(() => selectedCount.value > 0);

	watch(
		rows,
		(nextRows) => {
			if (!selectedKeys.value.size) {
				return;
			}

			const nextSelectedRowMap = new Map(selectedRowMap.value);
			nextRows.forEach((row, idx) => {
				const key = rowKeyValue(row, idx);
				if (selectedKeys.value.has(key)) {
					nextSelectedRowMap.set(key, row);
				}
			});
			selectedRowMap.value = nextSelectedRowMap;
		},
		{ deep: true }
	);

	const allSelected = computed(() => {
		if (!props.selectable || rows.value.length === 0) {
			return false;
		}
		return rows.value.every((row, idx) =>
			selectedKeys.value.has(rowKeyValue(row, idx))
		);
	});

	const isRowSelected = (row: DataListRow, index?: number) => {
		const key = rowKeyValue(row, index ?? 0);
		return selectedKeys.value.has(key);
	};

	/**
	 * Emits the current selected rows to the parent.
	 */
	const emitSelection = () => {
		emit('selection-change', selectedRows.value);
	};

	/**
	 * Sets a row's selection state.
	 */
	const setRowSelection = (
		row: DataListRow,
		checked: boolean,
		index?: number
	) => {
		const key = rowKeyValue(row, index ?? 0);
		if (checked) {
			selectedKeys.value.add(key);
			selectedRowMap.value.set(key, row);
		} else {
			selectedKeys.value.delete(key);
			selectedRowMap.value.delete(key);
		}
		selectedKeys.value = new Set(selectedKeys.value);
		selectedRowMap.value = new Map(selectedRowMap.value);
		emitSelection();
	};

	/**
	 * Toggles selection for an individual row.
	 */
	const toggleRowSelection = (row: DataListRow, index?: number) => {
		setRowSelection(row, !isRowSelected(row, index), index);
	};

	/**
	 * Selects or deselects all currently loaded rows.
	 */
	const setAllSelection = (checked: boolean) => {
		rows.value.forEach((row, idx) => {
			const key = rowKeyValue(row, idx);
			if (checked) {
				selectedKeys.value.add(key);
				selectedRowMap.value.set(key, row);
				return;
			}

			selectedKeys.value.delete(key);
			selectedRowMap.value.delete(key);
		});

		selectedKeys.value = new Set(selectedKeys.value);
		selectedRowMap.value = new Map(selectedRowMap.value);
		emitSelection();
	};

	/**
	 * Clears all selected rows.
	 */
	const clearAllSelection = () => {
		selectedKeys.value.clear();
		selectedRowMap.value.clear();
		selectedKeys.value = new Set(selectedKeys.value);
		selectedRowMap.value = new Map(selectedRowMap.value);
		emitSelection();
	};

	/**
	 * Deselects a specific selected row reference.
	 */
	const deselectSelectedRow = (row: DataListRow) => {
		let keyToRemove: string | number | null = null;

		for (const [key, selectedRow] of selectedRowMap.value.entries()) {
			if (selectedRow === row) {
				keyToRemove = key;
				break;
			}
		}

		if (keyToRemove === null) {
			const inferredKey = rowKeyValue(row, 0);
			if (selectedKeys.value.has(inferredKey)) {
				keyToRemove = inferredKey;
			}
		}

		if (keyToRemove === null) {
			return;
		}

		selectedKeys.value.delete(keyToRemove);
		selectedRowMap.value.delete(keyToRemove);
		selectedKeys.value = new Set(selectedKeys.value);
		selectedRowMap.value = new Map(selectedRowMap.value);
		emitSelection();
	};

	/**
	 * Replaces the full current selection list.
	 */
	const replaceSelection = (
		nextRows: DataListRow[],
		options?: { emit?: boolean }
	) => {
		selectedKeys.value.clear();
		selectedRowMap.value.clear();

		(nextRows || []).forEach((row, index) => {
			const key = rowKeyValue(row, index);
			selectedKeys.value.add(key);
			selectedRowMap.value.set(key, row);
		});

		selectedKeys.value = new Set(selectedKeys.value);
		selectedRowMap.value = new Map(selectedRowMap.value);
		if (options?.emit !== false) {
			emitSelection();
		}
	};

	/**
	 * Toggles all rows selected/unselected.
	 */
	const toggleAllSelection = () => {
		setAllSelection(!allSelected.value);
	};

	const rangeLabel = computed(() => {
		const total = Number(props.total) || 0;
		const size = Number(props.perPage) || DEFAULT_TABLE_PAGE_SIZE;
		const page = Number(props.currentPage) || 1;
		const from = total === 0 ? 0 : (page - 1) * size + 1;
		const to = Math.min(from + size - 1, total);
		return `Showing ${from}-${to} of ${total}`;
	});

	/**
	 * Updates sort state from a sortable header click and emits normalized payload.
	 */
	const handleHeaderClick = (column: DataListColumn) => {
		if (!column.sortable) return;
		const isSame = sortState.value.column?.key === column.key;
		const nextOrder: DataListSortOrder =
			isSame && sortState.value.order === 'ascending'
				? 'descending'
				: 'ascending';

		sortState.value = { column, order: nextOrder };
		emit('sort-change', {
			column: {
				...column,
				order: nextOrder,
			},
			prop: column.key,
			order: nextOrder,
		});
	};

	/**
	 * Returns whether the provided column is currently sorted.
	 */
	const isSortedColumn = (column: DataListColumn) =>
		Boolean(
			sortState.value.column?.key === column.key && sortState.value.order
		);

	/**
	 * Resolves row classes from static string or callback prop.
	 */
	const resolveRowClassName = (row: DataListRow, rowIndex: number) => {
		if (typeof props.rowClassName === 'function') {
			return props.rowClassName({ row, rowIndex });
		}
		if (typeof props.rowClassName === 'string') {
			return props.rowClassName;
		}
		return '';
	};

	/**
	 * Emits updates when page size changes.
	 */
	const onSizeChange = (size: number) => {
		emit('update:perPage', size);
	};

	/**
	 * Emits updates when current page changes.
	 */
	const onCurrentChange = (page: number) => {
		emit('update:currentPage', page);
	};

	const vm = getCurrentInstance()?.proxy as {
		$t?: (key: string, params?: Record<string, unknown>) => string;
	} | null;

	const translate = (key: string, fallback: string) => {
		const translated = vm?.$t?.(key);
		if (typeof translated === 'string' && translated.trim().length > 0) {
			return translated;
		}
		return fallback;
	};

	/**
	 * Builds context-menu items for a row from static or function prop sources.
	 */
	const buildBaseContextMenuItems = (row: DataListRow) => {
		if (typeof props.contextMenuItems === 'function') {
			return props.contextMenuItems(row) || [];
		}
		return props.contextMenuItems || [];
	};

	const buildSelectionActionItems = () => {
		if (typeof props.selectionActions === 'function') {
			return props.selectionActions(selectedRows.value) || [];
		}
		return props.selectionActions || [];
	};

	const resolveRowIndex = (row: DataListRow) =>
		rows.value.findIndex((candidate) => candidate === row);

	const isRowCurrentlySelected = (row: DataListRow) => {
		const rowIndex = resolveRowIndex(row);
		return rowIndex >= 0
			? isRowSelected(row, rowIndex)
			: isRowSelected(row, undefined);
	};

	const toggleRowSelectionFromContextAction = (row: DataListRow) => {
		if (!props.selectable) {
			return;
		}

		const rowIndex = resolveRowIndex(row);
		const nextChecked = !isRowCurrentlySelected(row);
		setRowSelection(row, nextChecked, rowIndex >= 0 ? rowIndex : undefined);
	};

	/**
	 * Builds context-menu items for a row from static/function props and enriches
	 * them with row selection toggles when bulk actions are available.
	 */
	const buildContextMenuItems = (row: DataListRow) => {
		const baseItems = buildBaseContextMenuItems(row);
		if (!baseItems.length) {
			return baseItems;
		}

		const hasBulkSelectionActions = buildSelectionActionItems().length > 0;
		if (!props.selectable || !hasBulkSelectionActions) {
			return baseItems;
		}

		const rowSelected = isRowCurrentlySelected(row);

		const selectionToggleAction: DropdownItem = {
			label: rowSelected
				? translate('common.actions.deselect', 'Deselect')
				: translate('common.actions.select', 'Select'),
			value: rowSelected ? 'deselect-row' : 'select-row',
			type: 'item',
			icon: rowSelected ? Icons.UI_MULTIPLY_M : Icons.UI_CHECK_L,
			action: () => toggleRowSelectionFromContextAction(row),
		};

		return [...baseItems, selectionToggleAction];
	};

	const selectionActionItems = computed(() => buildSelectionActionItems());

	const hasRowActions = computed(() => Boolean(props.contextMenuItems));

	const contextMenuInstanceId = createContextMenuInstanceId('datalist-context');
	const contextMenuRow = ref<DataListRow | null>(null);

	const onRowContextMenu = (event: MouseEvent, row: DataListRow) => {
		const items = buildContextMenuItems(row);
		if (!items.length) return;
		contextMenuRow.value = row;
		contextMenuService.open({
			id: contextMenuInstanceId,
			items,
			position: 'fixed',
			x: event.clientX,
			y: event.clientY,
			align: 'left',
			openUp: false,
			fullWidth: true,
			closeOnSelect: true,
			anchor:
				event.currentTarget instanceof HTMLElement ? event.currentTarget : null,
			onSelect: handleContextAction,
			onClose: () => {
				contextMenuRow.value = null;
			},
		});
	};

	/**
	 * Executes a context action and emits the normalized `context-action` event.
	 */
	const handleContextAction = (item: DropdownItem) => {
		if (!contextMenuRow.value) return;
		if (item.disabled) return;
		item.action?.(item);
		emit('context-action', { item, row: contextMenuRow.value });
	};

	/**
	 * Closes the row context-menu.
	 */
	const closeContextMenu = () => {
		contextMenuService.close(contextMenuInstanceId);
		contextMenuRow.value = null;
	};

	if (getCurrentInstance()) {
		onBeforeUnmount(() => {
			closeContextMenu();
		});
	}

	return {
		hasData,
		sortState,
		visibleColumns,
		orderedColumns,
		hasColumnMenu,
		setColumnOrder,
		setColumnsVisibility,
		toggleColumn,
		columnMenuItems,
		rowKeyValue,
		selectedKeys,
		selectedRows,
		selectedCount,
		hasSelection,
		allSelected,
		isRowSelected,
		setRowSelection,
		toggleRowSelection,
		setAllSelection,
		clearAllSelection,
		deselectSelectedRow,
		replaceSelection,
		toggleAllSelection,
		rangeLabel,
		handleHeaderClick,
		isSortedColumn,
		resolveRowClassName,
		onSizeChange,
		onCurrentChange,
		handleContextAction,
		selectionActionItems,
		onRowContextMenu,
		closeContextMenu,
		buildContextMenuItems,
		hasRowActions,
	};
};
