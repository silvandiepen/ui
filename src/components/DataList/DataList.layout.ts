import type { DataListColumn } from './DataList.model';

type GridOptions = {
	selectable: boolean;
	hasColumnMenu: boolean;
	hasRowActions: boolean;
	autoWidth: boolean;
	autoWidthMax: number;
	autoWidths: Record<string, number>;
	resizedWidths: Record<string, number>;
};

/**
 * Checks whether a column width is explicitly configured.
 */
const hasFixedWidth = (width: DataListColumn['width']) =>
	width !== undefined && width !== null && String(width).trim().length > 0;

/**
 * Converts a width value to a valid CSS width string.
 */
const resolveFixedWidth = (width: DataListColumn['width']) => {
	if (typeof width === 'number') {
		return `${width}px`;
	}
	const normalized = String(width).trim();
	return /^\d+(\.\d+)?$/.test(normalized) ? `${normalized}px` : normalized;
};

/**
 * Resolves the grid-template width value for a single data column.
 */
export const resolveColumnTemplate = (
	column: DataListColumn,
	options: GridOptions
): string => {
	const resizedWidth = options.resizedWidths[column.key];
	if (Number.isFinite(resizedWidth) && resizedWidth > 0) {
		return `${resizedWidth}px`;
	}

	if (hasFixedWidth(column.width)) {
		return resolveFixedWidth(column.width);
	}

	const minWidth = column.minWidth ?? 120;
	const maxWidth =
		column.maxWidth ?? (options.autoWidth ? options.autoWidthMax : null);

	if (options.autoWidth) {
		const measured = options.autoWidths[column.key];
		if (measured) {
			return `${measured}px`;
		}
		const cap = maxWidth ? `${maxWidth}px` : '1fr';
		return `minmax(${minWidth}px, ${cap})`;
	}

	const cap = maxWidth ? `${maxWidth}px` : '1fr';
	return `minmax(${minWidth}px, ${cap})`;
};

/**
 * Builds the full grid-template-columns string for the DataList layout.
 */
export const buildGridTemplate = (
	columns: DataListColumn[],
	options: GridOptions
): string => {
	const columnTemplate = columns
		.map((column) => resolveColumnTemplate(column, options))
		.join(' ');
	return [
		options.selectable ? '32px' : null,
		columnTemplate,
		options.hasColumnMenu ? '32px' : null,
		options.hasRowActions ? '40px' : null,
	]
		.filter(Boolean)
		.join(' ');
};

/**
 * Caps measured auto-width values to the configured maximum width.
 */
export const capMeasuredWidth = (
	width: number,
	column: DataListColumn,
	autoWidthMax: number
): number => {
	const cap = column.maxWidth ?? autoWidthMax;
	return Math.min(width, cap);
};
