import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import DL from '@/components/ui/Display/DL.vue';

describe('DL', () => {
	it('passes tooltip text to the shared tooltip wrapper', () => {
		const wrapper = mount(DL, {
			props: {
				label: 'Last login',
				value: '2026-03-11T10:00:00.000Z',
				tooltip: 'Helpful tooltip',
			},
			global: {
				stubs: {
					Tooltip: {
						name: 'Tooltip',
						props: ['text', 'disabled'],
						template:
							'<div class="tooltip-wrapper-stub" :data-text="text" :data-disabled="disabled"><slot /></div>',
					},
					Icon: true,
					Chip: true,
					ChipGroup: true,
				},
			},
		});

		const tooltip = wrapper.findComponent({ name: 'Tooltip' });

		expect(tooltip.props('text')).toBe('Helpful tooltip');
	});
});
