import { describe, expect, it, vi } from 'vitest';
import { useDataListInitialState } from '@/components/ui/DataList/useDataListInitialState';
import type {
	DataListColumn,
	DataListColumnVisibility,
	DataListColumnWidth,
	DataListRow,
	DataListSortState,
} from '@/components/ui/DataList/DataList.model';

describe('useDataListInitialState', () => {
	const columns: DataListColumn[] = [
		{ key: 'name', label: 'Name' },
		{ key: 'status', label: 'Status' },
	];

	it('resolves all initial values from store when preferences key is provided', () => {
		const mockSort: DataListSortState = {
			column: columns[0],
			order: 'ascending',
		};
		const mockVisibility: DataListColumnVisibility[] = [
			{ key: 'name', visible: true },
			{ key: 'status', visible: false },
		];
		const mockWidths: DataListColumnWidth[] = [{ key: 'name', width: 240 }];
		const mockRows: DataListRow[] = [{ id: 1, name: 'John' }];

		const settingsStore = {
			getSort: vi.fn(() => ({ prop: 'name', order: 'ascending' })),
			getColumnOrder: vi.fn(() => ['status', 'name']),
			getColumnVisibility: vi.fn(() => mockVisibility),
			getColumnWidths: vi.fn(() => mockWidths),
			getPerPage: vi.fn(() => 50),
			getDataListSelection: vi.fn(() => mockRows),
			getDataListSelectionPanelOpen: vi.fn(() => true),
		};

		const state = useDataListInitialState({
			props: {
				preferencesKey: 'data-list-test',
				sortProp: '',
				sortOrder: '',
				columnOrder: null,
				columnVisibility: null,
				columnWidths: null,
				columns,
			},
			settingsStore,
			route: { name: 'dashboard' },
		});

		expect(state.preferencesStateKey.value).toBe('data-list-test');
		expect(state.selectionStateKey.value).toBe('data-list-test');
		expect(state.initialSort).toEqual(mockSort);
		expect(state.initialColumnOrder).toEqual(['status', 'name']);
		expect(state.initialColumnVisibility).toEqual(mockVisibility);
		expect(state.initialColumnWidths).toEqual(mockWidths);
		expect(state.initialPerPage).toBe(50);
		expect(state.initialSelectionRows).toEqual(mockRows);
		expect(state.selectionPanelOpen.value).toBe(true);
	});

	it('builds selection key from route when preferences key is empty', () => {
		const state = useDataListInitialState({
			props: {
				preferencesKey: '',
				sortProp: '',
				sortOrder: '',
				columnOrder: null,
				columnVisibility: null,
				columnWidths: null,
				columns,
			},
			settingsStore: null,
			route: { path: '/history/cases' },
		});

		expect(state.preferencesStateKey.value).toBe(
			'data-list-selection:/history/cases:name|status'
		);
		expect(state.selectionStateKey.value).toBe(
			'data-list-selection:/history/cases:name|status'
		);
		expect(state.initialSort).toBeNull();
		expect(state.initialColumnOrder).toBeNull();
		expect(state.initialColumnVisibility).toBeNull();
		expect(state.initialColumnWidths).toBeNull();
		expect(state.initialPerPage).toBeNull();
		expect(state.initialSelectionRows).toEqual([]);
		expect(state.selectionPanelOpen.value).toBe(false);
	});
});
