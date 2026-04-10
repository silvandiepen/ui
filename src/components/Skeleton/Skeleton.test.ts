import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Skeleton from './Skeleton.vue';

describe('Skeleton', () => {
	it('renders with numeric dimensions converted to px', () => {
		const wrapper = mount(Skeleton, {
			props: {
				width: 120,
				height: 24,
			},
		});

		expect(wrapper.attributes('style')).toContain('--skeleton-width: 120px;');
		expect(wrapper.attributes('style')).toContain('--skeleton-height: 24px;');
	});

	it('applies shape and animation modifiers', () => {
		const wrapper = mount(Skeleton, {
			props: {
				shape: 'pill',
				animated: true,
			},
		});

		expect(wrapper.classes()).toContain('ar-skeleton--pill');
		expect(wrapper.classes()).toContain('ar-skeleton--animated');
	});
});
