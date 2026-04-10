import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';
import { useDataListInteractions } from '@/components/ui/DataList/useDataListInteractions';

const mountHarness = (emit: jest.Mock, rowClickable = true) => {
	let handler: ((event: MouseEvent, row: { id: number }) => void) | null = null;
	mount(
		defineComponent({
			name: 'UseDataListInteractionsHarness',
			setup() {
				const { onRowClick } = useDataListInteractions(
					{ rowClickable: { value: rowClickable } as any },
					emit,
					jest.fn()
				);
				handler = onRowClick;
				return () => null;
			},
		})
	);
	return handler as (event: MouseEvent, row: { id: number }) => void;
};

describe('useDataListInteractions', () => {
	it('prevents row-click for interactive targets', () => {
		const emit = jest.fn();
		const onRowClick = mountHarness(emit);

		const button = document.createElement('button');
		const event = new MouseEvent('click');
		Object.defineProperty(event, 'target', { value: button });
		onRowClick(event, { id: 1 });
		expect(emit).not.toHaveBeenCalled();
	});

	it('emits row-click for non-interactive targets', () => {
		const emit = jest.fn();
		const onRowClick = mountHarness(emit);

		const div = document.createElement('div');
		const event = new MouseEvent('click');
		Object.defineProperty(event, 'target', { value: div });
		onRowClick(event, { id: 1 });
		expect(emit).toHaveBeenCalledWith('row-click', { id: 1 });
	});
});
