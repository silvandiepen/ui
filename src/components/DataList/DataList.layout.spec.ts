import {
	buildGridTemplate,
	resolveColumnTemplate,
} from '@/components/ui/DataList/DataList.layout';

describe('DataList layout helpers', () => {
	it('builds grid template with selectable and settings columns', () => {
		const template = buildGridTemplate([{ key: 'name', label: 'Name' }], {
			selectable: true,
			hasColumnMenu: true,
			hasRowActions: false,
			autoWidth: false,
			autoWidthMax: 200,
			autoWidths: {},
			resizedWidths: {},
		});
		expect(template.startsWith('32px')).toBe(true);
		expect(template.endsWith('32px')).toBe(true);
	});

	it('uses measured width when autoWidth is enabled', () => {
		const template = resolveColumnTemplate(
			{ key: 'name', label: 'Name', minWidth: 120 },
			{
				selectable: false,
				hasColumnMenu: false,
				hasRowActions: false,
				autoWidth: true,
				autoWidthMax: 200,
				autoWidths: { name: 180 },
				resizedWidths: {},
			}
		);
		expect(template).toBe('180px');
	});

	it('supports fractional fixed widths', () => {
		const template = resolveColumnTemplate(
			{ key: 'name', label: 'Name', width: '2fr' },
			{
				selectable: false,
				hasColumnMenu: false,
				hasRowActions: false,
				autoWidth: true,
				autoWidthMax: 200,
				autoWidths: { name: 180 },
				resizedWidths: {},
			}
		);
		expect(template).toBe('2fr');
	});

	it('converts numeric string widths to px', () => {
		const template = resolveColumnTemplate(
			{ key: 'name', label: 'Name', width: '180' },
			{
				selectable: false,
				hasColumnMenu: false,
				hasRowActions: false,
				autoWidth: true,
				autoWidthMax: 200,
				autoWidths: {},
				resizedWidths: {},
			}
		);
		expect(template).toBe('180px');
	});

	it('prefers resized width over fixed or measured widths', () => {
		const template = resolveColumnTemplate(
			{ key: 'name', label: 'Name', width: '2fr' },
			{
				selectable: false,
				hasColumnMenu: false,
				hasRowActions: false,
				autoWidth: true,
				autoWidthMax: 200,
				autoWidths: { name: 180 },
				resizedWidths: { name: 240 },
			}
		);
		expect(template).toBe('240px');
	});
});
