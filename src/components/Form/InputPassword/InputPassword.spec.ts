import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import InputPassword from './InputPassword.vue';

describe('InputPassword', () => {
	it('toggles the input type when the visibility icon is clicked', async () => {
		const wrapper = mount(InputPassword, {
			props: {
				label: 'Password',
			},
			global: {
				stubs: {
					Icon: {
						template: '<span class="icon-stub" />',
					},
				},
			},
		});

		const input = wrapper.get('input');
		const toggle = wrapper.get('.input-password__toggle');

		expect(input.attributes('type')).toBe('password');
		expect(toggle.attributes('aria-label')).toBe('Show password');
		expect(toggle.attributes('aria-pressed')).toBe('false');

		await toggle.trigger('click');

		expect(input.attributes('type')).toBe('text');
		expect(toggle.attributes('aria-label')).toBe('Hide password');
		expect(toggle.attributes('aria-pressed')).toBe('true');
	});
});
