import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import DataListSelectionToolbar from '@/components/ui/DataListSelectionToolbar/DataListSelectionToolbar.vue';

vi.mock('vue-i18n', async (importOriginal) => {
	const actual = await importOriginal<typeof import('vue-i18n')>();
	return {
		...actual,
		useI18n: () => ({
			t: (key: string, params?: Record<string, unknown>) => {
				if (key === 'common.table.selectedCount') {
					return `${params?.count || 0} selected`;
				}
				return key;
			},
		}),
	};
});

describe('DataListSelectionToolbar', () => {
	it('renders a direct button when there is only one selection action', async () => {
		const onSelectAllPage = vi.fn();
		const onDeselectAll = vi.fn();
		const onDeselectRow = vi.fn();
		const onActionSelect = vi.fn();
		const onPanelOpenChange = vi.fn();
		const deleteAction = {
			label: 'Delete',
			value: 'delete',
			action: vi.fn(),
		};

		const wrapper = mount(DataListSelectionToolbar, {
			props: {
				selectedCount: 2,
				selectedRows: [
					{ id: '1', name: 'Alpha' },
					{ id: '2', name: 'Beta' },
				],
				showActions: true,
				selectionActions: [deleteAction],
				onSelectAllPage,
				onDeselectAll,
				onDeselectRow,
				onActionSelect,
				onPanelOpenChange,
			},
			global: {
				stubs: {
					Button: {
						props: ['tooltip'],
						emits: ['click'],
						template:
							'<button class="btn-stub" :data-tooltip="tooltip" @click="$emit(\'click\', $event)"><slot /></button>',
					},
					DropdownMenu: {
						props: ['items'],
						template:
							'<div><slot name="trigger" :toggle="() => {}" /><button class="dropdown-select" @click="$emit(\'select\', items[0])">Select</button></div>',
					},
					Icon: true,
				},
			},
		});

		expect(wrapper.text()).toContain('2 selected');
		expect(
			wrapper.find('.ui-data-list-selection-toolbar__panel').exists()
		).toBe(false);

		await wrapper
			.find('.ui-data-list-selection-toolbar__summary-button')
			.trigger('click');
		expect(onPanelOpenChange).toHaveBeenCalledWith(true);
		expect(
			wrapper.find('.ui-data-list-selection-toolbar__panel').exists()
		).toBe(true);

		const buttons = wrapper.findAll('.btn-stub');
		await buttons
			.find(
				(button) =>
					button.attributes('data-tooltip') === 'common.table.selectAllPage'
			)
			?.trigger('click');
		await buttons
			.find(
				(button) =>
					button.attributes('data-tooltip') === 'common.table.clearSelection'
			)
			?.trigger('click');
		expect(onSelectAllPage).toHaveBeenCalledTimes(1);
		expect(onDeselectAll).toHaveBeenCalledTimes(1);
		expect(onDeselectRow).toHaveBeenCalledTimes(0);

		await buttons
			.filter(
				(button) =>
					!button.attributes('data-tooltip') &&
					button.attributes('data-tooltip') !== ''
			)
			.at(0)
			?.trigger('click');
		expect(onDeselectRow).toHaveBeenCalledTimes(1);

		await wrapper
			.find('.ui-data-list-selection-toolbar__single-action')
			.trigger('click');
		expect(wrapper.find('.dropdown-select').exists()).toBe(false);
		expect(onActionSelect).toHaveBeenCalledWith(deleteAction);
		expect(deleteAction.action).toHaveBeenCalledWith(deleteAction);

		await wrapper
			.find('.ui-data-list-selection-toolbar__summary-button')
			.trigger('click');
		expect(onPanelOpenChange).toHaveBeenCalledWith(false);
	});

	it('keeps the actions dropdown when there are multiple selection actions', async () => {
		const onActionSelect = vi.fn();

		const wrapper = mount(DataListSelectionToolbar, {
			props: {
				selectedCount: 1,
				selectedRows: [{ id: '1', name: 'Alpha' }],
				showActions: true,
				selectionActions: [
					{ label: 'Delete', value: 'delete' },
					{ label: 'Archive', value: 'archive' },
				],
				onActionSelect,
			},
			global: {
				stubs: {
					Button: {
						props: ['tooltip'],
						emits: ['click'],
						template:
							'<button class="btn-stub" :data-tooltip="tooltip" @click="$emit(\'click\', $event)"><slot /></button>',
					},
					DropdownMenu: {
						props: ['items'],
						template:
							'<div><slot name="trigger" :toggle="() => {}" /><button class="dropdown-select" @click="$emit(\'select\', items[0])">Select</button></div>',
					},
					Icon: true,
				},
			},
		});

		expect(
			wrapper.find('.ui-data-list-selection-toolbar__single-action').exists()
		).toBe(false);

		await wrapper.find('.dropdown-select').trigger('click');

		expect(onActionSelect).toHaveBeenCalledWith({
			label: 'Delete',
			value: 'delete',
		});
	});
});
