import type {
	DataListColumn,
	DataListRow,
	DataListValue,
} from './DataList.model';

/**
 * Resolves a nested value from a row using dot notation (for example `merchant.name`).
 *
 * @param row - Source row object.
 * @param path - Dot-notated path to resolve.
 * @returns The resolved value or `undefined` when the path is missing.
 */
export const resolvePathValue = (
	row: DataListRow,
	path: string
): DataListValue | undefined => {
	if (!path) return undefined;
	return path.split('.').reduce<DataListValue | undefined>((acc, key) => {
		if (acc && typeof acc === 'object' && key in acc) {
			return (acc as Record<string, unknown>)[key] as DataListValue;
		}
		return undefined;
	}, row);
};

/**
 * Resolves the display value for a column from a row.
 *
 * @param row - Source row object.
 * @param column - Column descriptor containing `key` and optional `valueKey`.
 * @returns The resolved value used by cell renderers.
 */
export const resolveColumnValue = (
	row: DataListRow,
	column: DataListColumn
): DataListValue | undefined => {
	if (column.valueKey) {
		return resolvePathValue(row, column.valueKey);
	}
	return row[column.key] as DataListValue;
};
