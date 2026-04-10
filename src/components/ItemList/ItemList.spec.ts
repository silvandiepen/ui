import { mount } from '@vue/test-utils';
import ItemList from '@/components/ui/ItemList/ItemList.vue';
import { describe, expect, it, vi } from 'vitest';

const buttonStub = {
	props: ['color', 'disabled', 'icon', 'size', 'status', 'variant'],
	emits: ['click'],
	template:
		'<button class="ar-button" :data-color="color" :data-status="status" :data-icon="icon" @click="$emit(\'click\', $event)"><slot /></button>',
};

describe('ItemList', () => {
	it('emits select and runs item action', async () => {
		const action = vi.fn();
		const item = { label: 'Open', action };
		const wrapper = mount(ItemList, {
			props: {
				items: [item],
			},
			global: {
				stubs: {
					Button: buttonStub,
					Icon: true,
				},
			},
		});

		await wrapper.find('.ar-item-list__item').trigger('click');

		expect(action).toHaveBeenCalled();
		expect(wrapper.emitted('select')?.[0]).toEqual([item]);
	});

	it('emits action payload for item action buttons', async () => {
		const action = vi.fn();
		const item = {
			label: 'Row',
			actions: [{ label: 'Edit', action }],
		};
		const wrapper = mount(ItemList, {
			props: {
				items: [item],
			},
			global: {
				stubs: {
					Button: buttonStub,
					Icon: true,
				},
			},
		});

		await wrapper.find('.ar-item-list__actions .ar-button').trigger('click');

		expect(action).toHaveBeenCalledWith(item);
		expect(wrapper.emitted('action')?.[0]?.[0]).toEqual({
			item,
			action: item.actions[0],
		});
	});

	it('does not emit select for disabled items', async () => {
		const wrapper = mount(ItemList, {
			props: {
				items: [{ label: 'Disabled', disabled: true }],
			},
			global: {
				stubs: {
					Button: buttonStub,
					Icon: true,
				},
			},
		});

		await wrapper.find('.ar-item-list__item').trigger('click');
		expect(wrapper.emitted('select')).toBeUndefined();
	});

	it('adds the hover-actions modifier and forwards action color props', () => {
		const wrapper = mount(ItemList, {
			props: {
				showActionsOnHover: true,
				items: [
					{
						label: 'Role',
						actions: [{ icon: 'trash', color: 'error' }],
					},
				],
			},
			global: {
				stubs: {
					Button: buttonStub,
					Icon: true,
				},
			},
		});

		expect(wrapper.classes()).toContain('ar-item-list--actions-on-hover');
		expect(
			wrapper.find('.ar-item-list__actions .ar-button').attributes('data-color')
		).toBe('error');
	});
});
