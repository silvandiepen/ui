import { mount } from '@vue/test-utils';
import TabNavigation from '@/components/ui/Tabs/TabNavigation.vue';

jest.mock('@/components/ui/Icon', () => ({
	Icon: {
		name: 'Icon',
		render() {
			return null;
		},
	},
}));

describe('TabNavigation', () => {
	it('emits input and change when selecting an enabled tab', async () => {
		const wrapper = mount(TabNavigation, {
			propsData: {
				items: [
					{ id: 'a', label: 'A' },
					{ id: 'b', label: 'B' },
				],
				value: 'a',
			},
		});

		await wrapper.findAll('.ar-tab-nav__button')[1].trigger('click');

		expect(wrapper.emitted('input')?.[0]).toEqual(['b']);
		expect(wrapper.emitted('change')?.[0]).toEqual([
			'b',
			{ id: 'b', label: 'B' },
		]);
	});

	it('does not emit when disabled tab is clicked', async () => {
		const wrapper = mount(TabNavigation, {
			propsData: {
				items: [
					{ id: 'a', label: 'A' },
					{ id: 'b', label: 'B', disabled: true },
				],
				value: 'a',
			},
		});

		await wrapper.findAll('.ar-tab-nav__button')[1].trigger('click');

		expect(wrapper.emitted('input')).toBeUndefined();
		expect(wrapper.emitted('change')).toBeUndefined();
	});
});
