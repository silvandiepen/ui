import type { PaginationItem } from './Pagination.utils';

export type PaginationProps = {
	currentPage?: number;
	value?: number;
	pageSize?: number;
	perPage?: number;
	total?: number;
	pageSizes?: number[];
	layout?: string;
	showNumbers?: boolean;
	siblingCount?: number;
	boundaryCount?: number;
};

export type PaginationEmit = {
	(e: 'current-change', value: number): void;
	(e: 'size-change', value: number): void;
	(e: 'input', value: number): void;
	(e: 'update:currentPage', value: number): void;
	(e: 'update:pageSize', value: number): void;
	(e: 'update:perPage', value: number): void;
};

export type { PaginationItem };
