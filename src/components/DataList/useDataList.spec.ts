import { useDataList } from '@/components/ui/DataList/useDataList';
import { contextMenuService } from '@/components/ui/ContextMenu';
import { nextTick, reactive } from 'vue';
import type { DropdownItem } from '@/components/ui/Dropdown/Dropdown.model';

const baseColumns = [
	{ key: 'name', label: 'Name', sortable: true },
	{ key: 'status', label: 'Status' },
];

const baseData = [
	{ id: 1, name: 'Alpha', status: 'Open' },
	{ id: 2, name: 'Beta', status: 'Closed' },
];

describe('useDataList', () => {
	it('filters columns based on columnVisibility', () => {
		const emit = jest.fn();
		const { visibleColumns } = useDataList(
			{
				columns: baseColumns,
				columnVisibility: [{ key: 'status', visible: false }],
				data: baseData,
				rowKey: 'id',
				selectable: false,
				rowClassName: '',
				total: 2,
				currentPage: 1,
				perPage: 25,
				contextMenuItems: null,
			},
			emit
		);

		expect(visibleColumns.value.map((c) => c.key)).toEqual(['name']);
	});

	it('toggles columns locally when columnVisibility is not provided', () => {
		const emit = jest.fn();
		const { visibleColumns, toggleColumn } = useDataList(
			{
				columns: baseColumns,
				columnVisibility: null,
				data: baseData,
				rowKey: 'id',
				selectable: false,
				rowClassName: '',
				total: 2,
				currentPage: 1,
				perPage: 25,
				contextMenuItems: null,
			},
			emit
		);

		expect(visibleColumns.value.map((c) => c.key)).toEqual(['name', 'status']);
		toggleColumn('status');
		expect(visibleColumns.value.map((c) => c.key)).toEqual(['name']);
	});

	it('emits update:columnVisibility when toggling with external visibility', () => {
		const emit = jest.fn();
		const { toggleColumn } = useDataList(
			{
				columns: baseColumns,
				columnVisibility: [{ key: 'status', visible: true }],
				data: baseData,
				rowKey: 'id',
				selectable: false,
				rowClassName: '',
				total: 2,
				currentPage: 1,
				perPage: 25,
				contextMenuItems: null,
			},
			emit
		);

		toggleColumn('status');
		expect(emit).toHaveBeenCalledWith('update:columnVisibility', [
			{ key: 'name', visible: true },
			{ key: 'status', visible: false },
		]);
	});

	it('handles selection and emits selection-change', () => {
		const emit = jest.fn();
		const { setRowSelection, allSelected, setAllSelection, hasSelection } =
			useDataList(
				{
					columns: baseColumns,
					columnVisibility: null,
					data: baseData,
					rowKey: 'id',
					selectable: true,
					rowClassName: '',
					total: 2,
					currentPage: 1,
					perPage: 25,
					contextMenuItems: null,
				},
				emit
			);

		setRowSelection(baseData[0], true, 0);
		expect(emit).toHaveBeenCalledWith('selection-change', [baseData[0]]);
		expect(hasSelection.value).toBe(true);
		expect(allSelected.value).toBe(false);

		setAllSelection(true);
		expect(allSelected.value).toBe(true);
	});

	it('keeps selection across pages and supports clearing only current page selection', async () => {
		const emit = jest.fn();
		const props = reactive({
			columns: baseColumns,
			columnVisibility: null,
			data: [...baseData],
			rowKey: 'id',
			selectable: true,
			rowClassName: '',
			total: 4,
			currentPage: 1,
			perPage: 2,
			selectionActions: null,
			contextMenuItems: null,
		});
		const { setRowSelection, setAllSelection, selectedCount, selectedRows } =
			useDataList(props, emit);

		setRowSelection(baseData[0], true, 0);
		expect(selectedCount.value).toBe(1);
		expect(selectedRows.value).toEqual([baseData[0]]);

		props.data = [{ id: 3, name: 'Gamma', status: 'Open' }];
		await nextTick();

		setAllSelection(true);
		expect(selectedCount.value).toBe(2);
		expect(
			selectedRows.value.map((row) => (row as Record<string, unknown>).id)
		).toEqual([1, 3]);

		setAllSelection(false);
		expect(selectedCount.value).toBe(1);
		expect(
			selectedRows.value.map((row) => (row as Record<string, unknown>).id)
		).toEqual([1]);
	});

	it('emits sort-change for sortable columns and toggles ASC/DESC', () => {
		const emit = jest.fn();
		const { handleHeaderClick } = useDataList(
			{
				columns: baseColumns,
				columnVisibility: null,
				data: baseData,
				rowKey: 'id',
				selectable: false,
				rowClassName: '',
				total: 2,
				currentPage: 1,
				perPage: 25,
				contextMenuItems: null,
			},
			emit
		);

		handleHeaderClick(baseColumns[0]);
		handleHeaderClick(baseColumns[0]);
		handleHeaderClick(baseColumns[0]);

		const sortOrders = emit.mock.calls
			.filter(([event]) => event === 'sort-change')
			.map(([, payload]) => payload.order);

		expect(sortOrders).toEqual(['ascending', 'descending', 'ascending']);
	});

	it('uses external sort props as initial sort state', () => {
		const emit = jest.fn();
		const { sortState } = useDataList(
			{
				columns: baseColumns,
				columnVisibility: null,
				sortProp: 'name',
				sortOrder: 'descending',
				data: baseData,
				rowKey: 'id',
				selectable: false,
				rowClassName: '',
				total: 2,
				currentPage: 1,
				perPage: 25,
				selectionActions: null,
				contextMenuItems: null,
			},
			emit
		);

		expect(sortState.value.column.key).toBe('name');
		expect(sortState.value.order).toBe('descending');
	});

	it('reorders visible columns', () => {
		const emit = jest.fn();
		const { visibleColumns, setColumnOrder } = useDataList(
			{
				columns: baseColumns,
				columnVisibility: null,
				columnOrder: null,
				data: baseData,
				rowKey: 'id',
				selectable: false,
				rowClassName: '',
				total: 2,
				currentPage: 1,
				perPage: 25,
				contextMenuItems: null,
			},
			emit
		);

		setColumnOrder(['status', 'name']);
		expect(visibleColumns.value.map((column) => column.key)).toEqual([
			'status',
			'name',
		]);
	});

	it('keeps persisted visibility when columns register after init', async () => {
		const emit = jest.fn();
		const props = reactive({
			columns: [] as typeof baseColumns,
			columnVisibility: null,
			data: baseData,
			rowKey: 'id',
			selectable: false,
			rowClassName: '',
			total: 2,
			currentPage: 1,
			perPage: 25,
			contextMenuItems: null,
		});

		const { visibleColumns } = useDataList(props, emit, {
			initialColumnVisibility: [
				{ key: 'name', visible: true },
				{ key: 'status', visible: false },
			],
		});

		props.columns = [...baseColumns];
		await nextTick();

		expect(visibleColumns.value.map((column) => column.key)).toEqual(['name']);
	});

	it('builds context menu and emits context-action', () => {
		contextMenuService.clear();
		const emit = jest.fn();
		const items: DropdownItem[] = [
			{ label: 'Open', value: 'open', type: 'item', action: jest.fn() },
		];
		const { onRowContextMenu } = useDataList(
			{
				columns: baseColumns,
				columnVisibility: null,
				data: baseData,
				rowKey: 'id',
				selectable: false,
				rowClassName: '',
				total: 2,
				currentPage: 1,
				perPage: 25,
				contextMenuItems: items,
			},
			emit
		);

		const event = new MouseEvent('contextmenu', { clientX: 10, clientY: 20 });
		Object.defineProperty(event, 'currentTarget', {
			value: document.createElement('div'),
			configurable: true,
		});
		onRowContextMenu(event, baseData[0]);
		expect(contextMenuService.menu.value).toBeTruthy();
		contextMenuService.select(items[0]);
		expect(emit).toHaveBeenCalledWith('context-action', {
			item: items[0],
			row: baseData[0],
		});
		expect(contextMenuService.menu.value).toBeNull();
	});

	it('adds select/deselect row action when selection and bulk actions are enabled', () => {
		const emit = jest.fn();
		const { buildContextMenuItems, selectedRows } = useDataList(
			{
				columns: baseColumns,
				columnVisibility: null,
				data: baseData,
				rowKey: 'id',
				selectable: true,
				rowClassName: '',
				total: 2,
				currentPage: 1,
				perPage: 25,
				contextMenuItems: [
					{ label: 'Open', value: 'open', type: 'item', action: jest.fn() },
				],
				selectionActions: [
					{ label: 'Delete', value: 'delete', type: 'item', action: jest.fn() },
				],
			},
			emit
		);

		const initialItems = buildContextMenuItems(baseData[0]);
		const selectAction = initialItems.find(
			(item) => item.value === 'select-row'
		);
		expect(selectAction?.label).toBe('Select');

		selectAction?.action?.(selectAction);
		expect(selectedRows.value).toEqual([baseData[0]]);

		const selectedItems = buildContextMenuItems(baseData[0]);
		const deselectAction = selectedItems.find(
			(item) => item.value === 'deselect-row'
		);
		expect(deselectAction?.label).toBe('Deselect');

		deselectAction?.action?.(deselectAction);
		expect(selectedRows.value).toEqual([]);
	});

	it('resolves row class name', () => {
		const emit = jest.fn();
		const { resolveRowClassName } = useDataList(
			{
				columns: baseColumns,
				columnVisibility: null,
				data: baseData,
				rowKey: 'id',
				selectable: false,
				rowClassName: 'is-row',
				total: 2,
				currentPage: 1,
				perPage: 25,
				contextMenuItems: null,
			},
			emit
		);

		expect(resolveRowClassName(baseData[0], 0)).toBe('is-row');
	});
});
