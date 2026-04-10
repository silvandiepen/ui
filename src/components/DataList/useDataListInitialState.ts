import { computed, ref } from 'vue';
import type {
	DataListColumn,
	DataListColumnVisibility,
	DataListColumnWidth,
	DataListRow,
	DataListSortState,
} from './DataList.model';

type DataListSettingsStore = {
	getSort: (
		key: string
	) => { prop: string; order: DataListSortState['order'] } | null;
	getColumnOrder: (key: string) => string[] | null;
	getColumnVisibility: (key: string) => DataListColumnVisibility[] | null;
	getColumnWidths: (key: string) => DataListColumnWidth[] | null;
	getPerPage: (key: string) => number | null;
	getDataListSelection: (key: string) => DataListRow[];
	getDataListSelectionPanelOpen: (key: string) => boolean;
};

type DataListInitialStateProps = {
	preferencesKey: string;
	sortProp: string;
	sortOrder: DataListSortState['order'];
	columnOrder?: string[] | null;
	columnVisibility?: DataListColumnVisibility[] | null;
	columnWidths?: DataListColumnWidth[] | null;
	columns: DataListColumn[];
};

type RouteLike = {
	name?: string | symbol | null;
	path?: string;
};

type UseDataListInitialStateOptions = {
	props: DataListInitialStateProps;
	settingsStore: DataListSettingsStore | null;
	route?: RouteLike;
};

/**
 * Resolves initial DataList state from persisted preferences/local memory.
 */
export const useDataListInitialState = ({
	props,
	settingsStore,
	route,
}: UseDataListInitialStateOptions) => {
	const fallbackStateKey = computed(() => {
		const routeName =
			typeof route?.name === 'string'
				? route.name
				: typeof route?.path === 'string'
					? route.path
					: '';
		if (!routeName) {
			return '';
		}

		const columnSignature = (props.columns || [])
			.map((column) => column.key)
			.join('|');
		return `data-list-selection:${routeName}:${columnSignature}`;
	});

	const preferencesStateKey = computed(
		() => props.preferencesKey || fallbackStateKey.value
	);
	const selectionStateKey = computed(
		() => props.preferencesKey || fallbackStateKey.value
	);

	const resolveInitialSort = (): DataListSortState | null => {
		const key = preferencesStateKey.value;
		if (props.sortProp || props.sortOrder || !key) {
			return null;
		}
		if (!settingsStore) {
			return null;
		}

		const savedSort = settingsStore.getSort(key);
		if (!savedSort) {
			return null;
		}

		const column = props.columns.find((item) => item.key === savedSort.prop);
		if (!column) {
			return null;
		}

		return {
			column,
			order: savedSort.order,
		};
	};

	const resolveInitialColumnOrder = (): string[] | null => {
		const key = preferencesStateKey.value;
		if (Array.isArray(props.columnOrder) || !key) {
			return null;
		}
		if (!settingsStore) {
			return null;
		}

		return settingsStore.getColumnOrder(key);
	};

	const resolveInitialColumnVisibility = ():
		| DataListColumnVisibility[]
		| null => {
		const key = preferencesStateKey.value;
		if (Array.isArray(props.columnVisibility) || !key) {
			return null;
		}
		if (!settingsStore) {
			return null;
		}

		return settingsStore.getColumnVisibility(key);
	};

	const resolveInitialColumnWidths = (): DataListColumnWidth[] | null => {
		const key = preferencesStateKey.value;
		if (Array.isArray(props.columnWidths) || !key) {
			return null;
		}
		if (!settingsStore) {
			return null;
		}

		return settingsStore.getColumnWidths(key);
	};

	const resolveInitialPerPage = (): number | null => {
		const key = preferencesStateKey.value;
		if (!key || !settingsStore) {
			return null;
		}

		const savedPerPage = settingsStore.getPerPage(key);
		if (
			typeof savedPerPage !== 'number' ||
			!Number.isFinite(savedPerPage) ||
			savedPerPage <= 0
		) {
			return null;
		}

		return savedPerPage;
	};

	const resolveInitialSelectionRows = (): DataListRow[] => {
		const key = selectionStateKey.value;
		if (!key || !settingsStore) {
			return [];
		}

		return settingsStore.getDataListSelection(key);
	};

	const resolveInitialSelectionPanelOpen = (): boolean => {
		const key = selectionStateKey.value;
		if (!key || !settingsStore) {
			return false;
		}

		return settingsStore.getDataListSelectionPanelOpen(key);
	};

	const initialSort = resolveInitialSort();
	const initialColumnOrder = resolveInitialColumnOrder();
	const initialColumnVisibility = resolveInitialColumnVisibility();
	const initialColumnWidths = resolveInitialColumnWidths();
	const initialPerPage = resolveInitialPerPage();
	const initialSelectionRows = resolveInitialSelectionRows();
	const selectionPanelOpen = ref(resolveInitialSelectionPanelOpen());

	return {
		preferencesStateKey,
		selectionStateKey,
		initialSort,
		initialColumnOrder,
		initialColumnVisibility,
		initialColumnWidths,
		initialPerPage,
		initialSelectionRows,
		selectionPanelOpen,
	};
};
