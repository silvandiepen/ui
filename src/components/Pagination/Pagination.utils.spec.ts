import {
	buildVisiblePages,
	parsePaginationLayout,
} from '@/components/ui/Pagination/Pagination.utils';
import { describe, expect, it } from 'vitest';

describe('Pagination utils', () => {
	it('builds compact page items with ellipsis', () => {
		expect(buildVisiblePages(30, 15)).toEqual([
			1,
			'ellipsis-start',
			14,
			15,
			16,
			'ellipsis-end',
			30,
		]);
	});

	it('returns full range for small page counts', () => {
		expect(buildVisiblePages(5, 3)).toEqual([1, 2, 3, 4, 5]);
	});

	it('parses layout tokens', () => {
		expect(parsePaginationLayout('sizes, prev, pager, next, jumper')).toEqual([
			'sizes',
			'prev',
			'pager',
			'next',
			'jumper',
		]);
	});
});
