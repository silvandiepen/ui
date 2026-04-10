import {
	resolveColumnValue,
	resolvePathValue,
} from '@/components/ui/DataList/DataList.utils';

describe('DataList utils', () => {
	it('resolves nested path values', () => {
		const row = { meta: { status: { name: 'Open' } } };
		expect(resolvePathValue(row, 'meta.status.name')).toBe('Open');
	});

	it('returns undefined for missing path', () => {
		const row = { meta: { status: { name: 'Open' } } };
		expect(resolvePathValue(row, 'meta.status.label')).toBeUndefined();
	});

	it('resolves column value by valueKey', () => {
		const row = { meta: { status: { name: 'Open' } } };
		const column = {
			key: 'status',
			label: 'Status',
			valueKey: 'meta.status.name',
		};
		expect(resolveColumnValue(row, column)).toBe('Open');
	});

	it('resolves column value by key when valueKey missing', () => {
		const row = { status: 'Open' };
		const column = { key: 'status', label: 'Status' };
		expect(resolveColumnValue(row, column)).toBe('Open');
	});
});
