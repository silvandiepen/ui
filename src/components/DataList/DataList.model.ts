import type { StyleValue } from 'vue';

export type DataListRow = Record<string, unknown>;

export type DataListRowClassNameFn = (payload: {
	row: DataListRow;
	rowIndex: number;
}) => string | string[] | Record<string, boolean> | undefined;

export type DataListRowStyleFn = (payload: {
	row: DataListRow;
	rowIndex: number;
}) => StyleValue | undefined;

export type DataListColumn = {
	key: string;
	label: string;
	sortable?: boolean;
	minWidth?: number;
	maxWidth?: number;
	width?: number | string;
	resizable?: boolean;
	align?: 'left' | 'center' | 'right';
	headerClassName?: string;
	className?: string;
	visible?: boolean;
	noWrap?: boolean;
	type?: string;
	valueKey?: string;
	format?: string | ((value: unknown) => string);
	copyable?: boolean;
	trueLabel?: string;
	falseLabel?: string;
	prefix?: string;
	maxChars?: number;
	disabled?: boolean | ((row: DataListRow) => boolean);
	onChange?: (
		value: unknown,
		row: DataListRow,
		column: DataListColumn,
		rowIndex: number
	) => void;
};

export type DataListColumnVisibility = {
	key: string;
	visible: boolean;
};

export type DataListColumnWidth = {
	key: string;
	width: number;
};

export type DataListSortOrder = 'ascending' | 'descending' | '';

export type DataListSortState = {
	column: DataListColumn;
	order: DataListSortOrder;
};

export type DataListValue =
	| string
	| number
	| boolean
	| Record<string, unknown>
	| Date;
