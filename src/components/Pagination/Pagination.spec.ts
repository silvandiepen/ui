import { mount } from '@vue/test-utils';
import Pagination from '@/components/ui/Pagination/Pagination.vue';
import { describe, expect, it } from 'vitest';

const i18nMocks = {
	$t: (key: string) => key,
};

describe('Pagination', () => {
	it('emits current page update when page number is clicked', async () => {
		const wrapper = mount(Pagination, {
			props: {
				currentPage: 2,
				pageSize: 10,
				total: 100,
				layout: 'pager',
			},
			global: {
				mocks: i18nMocks,
				stubs: {
					Button: true,
					InputSelect: true,
					InputNumber: true,
				},
			},
		});

		await wrapper
			.findAll('.ar-pagination__button')
			.find((item) => item.text() === '3')
			?.trigger('click');

		expect(wrapper.emitted('current-change')?.[0]).toEqual([3]);
		expect(wrapper.emitted('update:currentPage')?.[0]).toEqual([3]);
	});

	it('emits size updates and keeps page in range', async () => {
		const wrapper = mount(Pagination, {
			props: {
				currentPage: 10,
				pageSize: 10,
				total: 100,
				pageSizes: [25, 50],
				layout: 'sizes, prev, pager, next',
			},
			global: {
				mocks: i18nMocks,
				stubs: {
					Button: true,
				},
			},
		});

		await wrapper.findComponent({ name: 'SelectInput' }).vm.$emit('change', 50);

		expect(wrapper.emitted('size-change')?.[0]).toEqual([50]);
		expect(wrapper.emitted('update:pageSize')?.[0]).toEqual([50]);
		expect(wrapper.emitted('update:perPage')?.[0]).toEqual([50]);
		expect(wrapper.emitted('current-change')?.[0]).toEqual([2]);
	});

	it('normalizes string-based page props and keeps active page', () => {
		const wrapper = mount(Pagination, {
			props: {
				currentPage: '3' as any,
				pageSize: '25' as any,
				total: 200,
				layout: 'sizes, pager',
			},
			global: {
				mocks: i18nMocks,
				stubs: {
					Button: true,
				},
			},
		});

		expect(wrapper.find('.ar-pagination__button--active').text()).toBe('3');
	});

	it('passes current page value to the go-to input', () => {
		const wrapper = mount(Pagination, {
			props: {
				currentPage: 4,
				pageSize: 10,
				total: 100,
				layout: 'jumper',
			},
			global: {
				mocks: i18nMocks,
				stubs: {
					Button: true,
					InputSelect: true,
					InputNumber: {
						props: ['modelValue'],
						template: '<div class="test-jumper-value">{{ modelValue }}</div>',
					},
				},
			},
		});

		expect(wrapper.find('.test-jumper-value').text()).toBe('4');
	});
});
