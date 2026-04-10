import { describe, expect, it, vi } from 'vitest';
import { nextTick, ref } from 'vue';
import { useDataListPreferences } from '@/components/ui/DataList/useDataListPreferences';
import type {
	DataListColumn,
	DataListColumnVisibility,
	DataListSortState,
} from '@/components/ui/DataList/DataList.model';

describe('useDataListPreferences', () => {
	const columns: DataListColumn[] = [
		{ key: 'name', label: 'Name', visible: true },
		{ key: 'status', label: 'Status', visible: true },
	];

	const createStore = () => ({
		getColumnOrder: vi.fn(() => ['status', 'name']),
		getColumnVisibility: vi.fn(() => [
			{ key: 'name', visible: true },
			{ key: 'status', visible: false },
		]),
		getColumnWidths: vi.fn(() => [{ key: 'name', width: 220 }]),
		setSort: vi.fn(),
		clearSort: vi.fn(),
		setColumnOrder: vi.fn(),
		clearColumnOrder: vi.fn(),
		setColumnVisibility: vi.fn(),
		clearColumnVisibility: vi.fn(),
		setPerPage: vi.fn(),
		clearPerPage: vi.fn(),
		setDataListSelection: vi.fn(),
		clearDataListSelection: vi.fn(),
		setDataListSelectionPanelOpen: vi.fn(),
		clearColumnWidths: vi.fn(),
	});

	it('applies menu updates and reset actions', () => {
		const settingsStore = createStore();
		const setColumnOrder = vi.fn();
		const setColumnsVisibility = vi.fn();
		const onResetColumnWidths = vi.fn();

		const sortState = ref<DataListSortState>({
			column: columns[0],
			order: 'ascending',
		});
		const orderedColumns = ref(columns);
		const visibleColumns = ref(columns);
		const selectionStateKey = ref('table-test');
		const selectedRows = ref([]);
		const selectedCount = ref(0);
		const selectionPanelOpen = ref(false);

		const prefs = useDataListPreferences({
			props: {
				preferencesKey: 'table-test',
				columns,
				pageSizes: [10, 20, 50],
				perPage: 20,
			},
			settingsStore,
			t: (key) => key,
			preferencesStateKey: ref('table-test'),
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
		});

		prefs.handleColumnMenuUpdate([
			{ key: 'status', label: 'Status', visible: true },
			{ key: 'name', label: 'Name', visible: false },
		]);

		expect(setColumnOrder).toHaveBeenCalledWith(['status', 'name']);
		expect(setColumnsVisibility).toHaveBeenCalledWith([
			{ key: 'status', visible: true },
			{ key: 'name', visible: false },
		]);

		prefs.resetColumnPreferences();
		expect(setColumnOrder).toHaveBeenCalledWith(['name', 'status']);
		expect(setColumnsVisibility).toHaveBeenCalledWith([
			{ key: 'name', visible: true },
			{ key: 'status', visible: true },
		]);
		expect(onResetColumnWidths).toHaveBeenCalledTimes(1);
		expect(settingsStore.clearColumnWidths).toHaveBeenCalledWith('table-test');
		expect(settingsStore.clearColumnOrder).toHaveBeenCalledWith('table-test');
		expect(settingsStore.clearColumnVisibility).toHaveBeenCalledWith(
			'table-test'
		);
	});

	it('persists sort and selection changes', async () => {
		const settingsStore = createStore();
		const sortState = ref<DataListSortState>({
			column: columns[0],
			order: '',
		});
		const orderedColumns = ref(columns);
		const visibleColumns = ref(columns);
		const selectionStateKey = ref('table-test');
		const selectedRows = ref([]);
		const selectedCount = ref(0);
		const selectionPanelOpen = ref(false);

		const prefs = useDataListPreferences({
			props: {
				preferencesKey: 'table-test',
				columns,
				pageSizes: [10, 20, 50],
				perPage: 20,
			},
			settingsStore,
			t: (key) => key,
			preferencesStateKey: ref('table-test'),
			sortState,
			orderedColumns,
			visibleColumns,
			setColumnOrder: vi.fn(),
			setColumnsVisibility: vi.fn(),
			selectionStateKey,
			selectedRows,
			selectedCount,
			selectionPanelOpen,
			onResetColumnWidths: vi.fn(),
		});

		sortState.value = {
			column: columns[1],
			order: 'descending',
		};
		await nextTick();

		expect(settingsStore.setSort).toHaveBeenCalledWith('table-test', {
			prop: 'status',
			order: 'descending',
		});

		selectedRows.value = [{ id: '1', name: 'John' }];
		selectedCount.value = 1;
		await nextTick();

		expect(settingsStore.setDataListSelection).toHaveBeenCalledWith(
			'table-test',
			selectedRows.value
		);

		prefs.setSelectionPanelOpen(true);
		expect(selectionPanelOpen.value).toBe(true);
		expect(settingsStore.setDataListSelectionPanelOpen).toHaveBeenCalledWith(
			'table-test',
			true
		);
	});

	it('toggles all column visibility based on current visible set', () => {
		const settingsStore = createStore();
		const orderedColumns = ref(columns);
		const visibleColumns = ref<DataListColumn[]>([columns[0]]);
		const setColumnsVisibility = vi.fn();

		const prefs = useDataListPreferences({
			props: {
				preferencesKey: 'table-test',
				columns,
				pageSizes: [10, 20, 50],
				perPage: 25,
			},
			settingsStore,
			t: (key) => key,
			preferencesStateKey: ref('table-test'),
			sortState: ref({
				column: columns[0],
				order: 'ascending',
			}),
			orderedColumns,
			visibleColumns,
			setColumnOrder: vi.fn(),
			setColumnsVisibility,
			selectionStateKey: ref('table-test'),
			selectedRows: ref([]),
			selectedCount: ref(0),
			selectionPanelOpen: ref(false),
			onResetColumnWidths: vi.fn(),
		});

		expect(prefs.areAllColumnsVisible.value).toBe(false);
		prefs.toggleAllColumnsVisibility();

		expect(setColumnsVisibility).toHaveBeenCalledWith([
			{ key: 'name', visible: true },
			{ key: 'status', visible: true },
		]);
	});
});
