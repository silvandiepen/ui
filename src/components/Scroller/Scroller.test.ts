import { mount } from '@vue/test-utils';
import Scroller from './Scroller.vue';

describe('Scroller', () => {
	it('renders horizontal mode when horizontal prop is set', () => {
		const wrapper = mount(Scroller, {
			props: {
				horizontal: true,
			},
			slots: {
				default: '<div class="item">Item</div>',
			},
		});

		expect(wrapper.classes()).toContain('ar-scroller--horizontal');
		expect(wrapper.find('.ar-scroller__track').exists()).toBe(true);
	});

	it('renders vertical mode by default', () => {
		const wrapper = mount(Scroller, {
			slots: {
				default: '<div class="item">Item</div>',
			},
		});

		expect(wrapper.classes()).toContain('ar-scroller--vertical');
	});

	it('applies explicit css height', () => {
		const wrapper = mount(Scroller, {
			props: {
				height: '320px',
			},
			slots: {
				default: '<div class="item">Item</div>',
			},
		});

		expect(wrapper.attributes('style')).toContain('height: 320px');
	});
});
