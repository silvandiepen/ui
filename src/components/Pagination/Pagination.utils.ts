export type PaginationItem = number | 'ellipsis-start' | 'ellipsis-end';

export const parsePaginationLayout = (layout: string): string[] =>
	(layout || '')
		.split(',')
		.map((token) => token.trim())
		.filter(Boolean);

const range = (start: number, end: number): number[] => {
	if (end < start) {
		return [];
	}
	return Array.from({ length: end - start + 1 }, (_, idx) => start + idx);
};

export const buildVisiblePages = (
	totalPages: number,
	currentPage: number,
	siblingCount = 1,
	boundaryCount = 1
): PaginationItem[] => {
	if (totalPages <= 0) {
		return [];
	}

	const safeTotal = Math.max(1, totalPages);
	const safeCurrent = Math.min(Math.max(1, currentPage), safeTotal);
	const safeSibling = Math.max(0, siblingCount);
	const safeBoundary = Math.max(0, boundaryCount);

	const totalNumbers = safeSibling * 2 + 3 + safeBoundary * 2;
	if (safeTotal <= totalNumbers) {
		return range(1, safeTotal);
	}

	const startPages = range(1, safeBoundary);
	const endPages = range(safeTotal - safeBoundary + 1, safeTotal);

	const siblingsStart = Math.max(
		Math.min(
			safeCurrent - safeSibling,
			safeTotal - safeBoundary - safeSibling * 2 - 1
		),
		safeBoundary + 2
	);

	const siblingsEnd = Math.min(
		Math.max(safeCurrent + safeSibling, safeBoundary + safeSibling * 2 + 2),
		safeTotal - safeBoundary - 1
	);

	const items: PaginationItem[] = [...startPages];

	if (siblingsStart > safeBoundary + 2) {
		items.push('ellipsis-start');
	} else if (safeBoundary + 1 < safeTotal - safeBoundary) {
		items.push(safeBoundary + 1);
	}

	items.push(...range(siblingsStart, siblingsEnd));

	if (siblingsEnd < safeTotal - safeBoundary - 1) {
		items.push('ellipsis-end');
	} else if (safeTotal - safeBoundary > safeBoundary) {
		items.push(safeTotal - safeBoundary);
	}

	items.push(...endPages);

	return items;
};
