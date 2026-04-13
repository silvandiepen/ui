import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import DataList from '@/components/ui/DataList/DataList.vue';
import { createPinia, setActivePinia } from 'pinia';
import { useSettingsStore } from '@/stores/settings';
import { createMemoryHistory, createRouter } from 'vue-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const toolbarServiceMock = vi.hoisted(() => ({
	show: vi.fn(),
	update: vi.fn(),
	hide: vi.fn(),
}));

vi.mock('vue-i18n', async (importOriginal) => {
	const actual = await importOriginal<typeof import('vue-i18n')>();
	return {
		...actual,
		useI18n: () => ({
			t: (key: string) => key,
		}),
	};
});

vi.mock('@/components/ui/Icon', () => ({
	Icon: {
		name: 'Icon',
		props: ['name'],
		template: '<i class="icon-stub" :data-name="name" :class="$attrs.class" />',
	},
	Icons: {
		CHEVRON_UP: 'chevron-up',
		CHEVRON_DOWN: 'chevron-down',
		CHECK: 'check',
		CROSS: 'cross',
		LIST_CHECK: 'list-check',
		MENU_DOTS: 'menu-dots',
	},
}));

vi.mock('@/components/ui/Toolbar', () => ({
	toolbarService: toolbarServiceMock,
}));

const columns = [
	{ key: 'name', label: 'Name', sortable: true },
	{ key: 'status', label: 'Status' },
];

const data = [
	{ id: 1, name: 'Alpha', status: 'Open' },
	{ id: 2, name: 'Beta', status: 'Closed' },
];

describe('DataList', () => {
	const dropdownStub = {
		props: ['items'],
		template:
			'<div><slot name="trigger" :toggle="() => {}" /><slot name="menu" :close-menu="() => {}" :is-open="true" /><button v-if="items && items.length" class="dropdown-select" @click="$emit(\'select\', items[0])">Select</button></div>',
	};
	const dropdownActionStub = {
		props: ['items'],
		template:
			'<div><slot name="trigger" :toggle="() => {}" /><button v-for="item in items" :key="String(item.value)" class="dropdown-action-select" :data-value="item.value" @click="$emit(\'select\', item); item.action && item.action(item)">{{ item.label }}</button></div>',
	};

	beforeEach(() => {
		toolbarServiceMock.show.mockClear();
		toolbarServiceMock.update.mockClear();
		toolbarServiceMock.hide.mockClear();
	});

	it('renders rows and emits row-click', async () => {
		const wrapper = mount(DataList, {
			props: {
				columns,
				data,
			},
			global: {
				plugins: [createPinia()],
				mocks: {
					$t: (key: string) => key,
				},
				stubs: {
					DropdownMenu: dropdownStub,
					Pagination: true,
					ArPagination: true,
					Button: true,
					InputCheckbox: {
						template:
							'<input type="checkbox" @change="$emit(\'update:model-value\', $event.target.checked)" />',
					},
				},
			},
		});

		const firstRow = wrapper.findAll('.ui-data-list__row').at(0);
		expect(firstRow.exists()).toBe(true);
		await firstRow.trigger('click');
		expect(wrapper.emitted('row-click')?.[0]).toEqual([data[0]]);
	});

	it('marks row as active when route query id matches row key', async () => {
		const router = createRouter({
			history: createMemoryHistory(),
			routes: [{ path: '/', component: { template: '<div />' } }],
		});
		await router.push({ path: '/', query: { id: '2' } });
		await router.isReady();

		const wrapper = mount(DataList, {
			props: {
				columns,
				data,
			},
			global: {
				plugins: [createPinia(), router],
				mocks: {
					$t: (key: string) => key,
				},
				stubs: {
					DropdownMenu: dropdownStub,
					Pagination: true,
					ArPagination: true,
					Button: true,
					InputCheckbox: {
						template:
							'<input type="checkbox" @change="$emit(\'update:model-value\', $event.target.checked)" />',
					},
				},
			},
		});

		const rows = wrapper.findAll('.ui-data-list__row');
		expect(rows.at(0).classes()).not.toContain('ar-data-list__row--active');
		expect(rows.at(1).classes()).toContain('ar-data-list__row--active');
	});

	it('applies row styles from the rowStyle prop', () => {
		const wrapper = mount(DataList, {
			props: {
				columns,
				data,
				rowStyle: ({ row }: { row: { id: number } }) => ({
					'--datalist-row-accent':
						row.id === 2 ? 'var(--color-warning)' : 'transparent',
				}),
			},
			global: {
				plugins: [createPinia()],
				mocks: {
					$t: (key: string) => key,
				},
				stubs: {
					DropdownMenu: dropdownStub,
					Pagination: true,
					ArPagination: true,
					Button: true,
					InputCheckbox: {
						template:
							'<input type="checkbox" @change="$emit(\'update:model-value\', $event.target.checked)" />',
					},
				},
			},
		});

		const rows = wrapper.findAll('.ui-data-list__row');
		expect(rows.at(0).attributes('style')).toContain(
			'--datalist-row-accent: transparent;'
		);
		expect(rows.at(1).attributes('style')).toContain(
			'--datalist-row-accent: var(--color-warning);'
		);
	});

	it('supports selection and emits selection-change', async () => {
		const wrapper = mount(DataList, {
			props: {
				columns,
				data,
				selectable: true,
			},
			global: {
				plugins: [createPinia()],
				mocks: {
					$t: (key: string) => key,
				},
				stubs: {
					DropdownMenu: dropdownStub,
					Pagination: true,
					ArPagination: true,
					Button: true,
					InputCheckbox: {
						template:
							'<input type="checkbox" @change="$emit(\'update:model-value\', $event.target.checked)" />',
					},
				},
			},
		});

		const checkboxInput = wrapper.findAll('input[type="checkbox"]').at(1);
		expect(checkboxInput.exists()).toBe(true);
		await checkboxInput.setChecked();
		expect(wrapper.emitted('selection-change')?.[0]?.[0]).toEqual([data[0]]);
	});

	it('passes maxChars to text Field columns', () => {
		const wrapper = mount(DataList, {
			props: {
				columns: [
					{
						key: 'name',
						label: 'Name',
						type: 'text',
						maxChars: 5,
					},
				],
				data,
			},
			global: {
				plugins: [createPinia()],
				stubs: {
					ArTooltipWrapper: {
						template: '<div><slot /></div>',
					},
					DropdownMenu: dropdownStub,
					Pagination: true,
					Button: true,
					Field: {
						props: [
							'copyable',
							'falseLabel',
							'format',
							'maxChars',
							'prefix',
							'trueLabel',
							'type',
							'value',
						],
						template:
							'<div class="field-stub" :data-max-chars="String(maxChars)">{{ value }}</div>',
					},
					InputCheckbox: {
						template:
							'<input type="checkbox" @change="$emit(\'update:model-value\', $event.target.checked)" />',
					},
				},
			},
		});

		expect(wrapper.find('.field-stub').attributes('data-max-chars')).toBe('5');
	});

	it('emits sort-change when sortable header clicked', async () => {
		const wrapper = mount(DataList, {
			props: {
				columns,
				data,
			},
			global: {
				plugins: [createPinia()],
				stubs: {
					DropdownMenu: dropdownStub,
					Pagination: true,
					Button: true,
					InputCheckbox: {
						template:
							'<input type="checkbox" @change="$emit(\'update:model-value\', $event.target.checked)" />',
					},
				},
			},
		});

		const header = wrapper.findAll('.ui-data-list__cell--header').at(0);
		expect(header.exists()).toBe(true);

		const sortIcons = wrapper.findAll('.ui-data-list__sort-icon');
		expect(sortIcons).toHaveLength(1);
		expect(sortIcons.at(0).classes()).toContain(
			'ar-data-list__sort-icon--inactive'
		);

		await header.trigger('click');
		expect(wrapper.emitted('sort-change')?.[0]?.[0].prop).toBe('name');
		expect(wrapper.emitted('sort-change')?.[0]?.[0].order).toBe('ascending');
		expect(
			wrapper
				.find('.ui-data-list__sort-icon')
				.classes('ar-data-list__sort-icon--ascending')
		).toBe(true);

		await header.trigger('click');
		expect(wrapper.emitted('sort-change')?.[1]?.[0].order).toBe('descending');
		expect(
			wrapper
				.find('.ui-data-list__sort-icon')
				.classes('ar-data-list__sort-icon--descending')
		).toBe(true);
	});

	it('resizes a column by dragging the header resize handle', async () => {
		const wrapper = mount(DataList, {
			props: {
				columns,
				data,
				autoWidth: false,
			},
			global: {
				plugins: [createPinia()],
				stubs: {
					DropdownMenu: dropdownStub,
					Pagination: true,
					Button: true,
					InputCheckbox: {
						template:
							'<input type="checkbox" @change="$emit(\'update:model-value\', $event.target.checked)" />',
					},
				},
			},
		});

		const header = wrapper.find('[data-col-key="name"]');
		expect(header.exists()).toBe(true);
		Object.defineProperty(header.element, 'getBoundingClientRect', {
			value: () => ({
				width: 160,
				height: 24,
				top: 0,
				left: 0,
				bottom: 24,
				right: 160,
				x: 0,
				y: 0,
				toJSON: () => ({}),
			}),
			configurable: true,
		});

		const handle = header.find('.ui-data-list__resize-handle');
		expect(handle.exists()).toBe(true);
		await handle.trigger('mousedown', { button: 0, clientX: 100 });
		window.dispatchEvent(new MouseEvent('mousemove', { clientX: 140 }));
		window.dispatchEvent(new MouseEvent('mouseup'));
		await nextTick();

		const gridStyle = wrapper.find('.ui-data-list__grid').attributes('style');
		expect(gridStyle).toContain('200px');
	});

	it('loads persisted column widths by preferencesKey', () => {
		const pinia = createPinia();
		setActivePinia(pinia);
		const settingsStore = useSettingsStore();
		settingsStore.setColumnWidths('data-list-width-load-test', [
			{ key: 'name', width: 220 },
		]);

		const wrapper = mount(DataList, {
			props: {
				columns,
				data,
				autoWidth: false,
				preferencesKey: 'data-list-width-load-test',
			},
			global: {
				plugins: [pinia],
				stubs: {
					DropdownMenu: dropdownStub,
					Pagination: true,
					Button: true,
					InputCheckbox: {
						template:
							'<input type="checkbox" @change="$emit(\'update:model-value\', $event.target.checked)" />',
					},
				},
			},
		});

		const gridStyle = wrapper.find('.ui-data-list__grid').attributes('style');
		expect(gridStyle).toContain('220px');
	});

	it('persists resized column widths by preferencesKey', async () => {
		const pinia = createPinia();
		setActivePinia(pinia);
		const settingsStore = useSettingsStore();

		const wrapper = mount(DataList, {
			props: {
				columns,
				data,
				autoWidth: false,
				preferencesKey: 'data-list-width-save-test',
			},
			global: {
				plugins: [pinia],
				stubs: {
					DropdownMenu: dropdownStub,
					Pagination: true,
					Button: true,
					InputCheckbox: {
						template:
							'<input type="checkbox" @change="$emit(\'update:model-value\', $event.target.checked)" />',
					},
				},
			},
		});

		const header = wrapper.find('[data-col-key="name"]');
		Object.defineProperty(header.element, 'getBoundingClientRect', {
			value: () => ({
				width: 150,
				height: 24,
				top: 0,
				left: 0,
				bottom: 24,
				right: 150,
				x: 0,
				y: 0,
				toJSON: () => ({}),
			}),
			configurable: true,
		});

		await header
			.find('.ui-data-list__resize-handle')
			.trigger('mousedown', { button: 0, clientX: 100 });
		window.dispatchEvent(new MouseEvent('mousemove', { clientX: 130 }));
		window.dispatchEvent(new MouseEvent('mouseup'));
		await nextTick();

		expect(settingsStore.getColumnWidths('data-list-width-save-test')).toEqual([
			{ key: 'name', width: 180 },
		]);
	});

	it('supports row actions and emits context-action with row', async () => {
		const wrapper = mount(DataList, {
			props: {
				columns,
				data,
				contextMenuItems: [{ label: 'View', value: 'view' }],
			},
			global: {
				plugins: [createPinia()],
				stubs: {
					DropdownMenu: dropdownStub,
					Pagination: true,
					Button: true,
					InputCheckbox: {
						template:
							'<input type="checkbox" @change="$emit(\'update:model-value\', $event.target.checked)" />',
					},
				},
			},
		});

		const actionButtons = wrapper.findAll('.dropdown-select');
		expect(actionButtons.length).toBeGreaterThan(0);
		await actionButtons.at(0).trigger('click');

		expect(wrapper.emitted('context-action')?.[0]?.[0]).toEqual({
			item: { label: 'View', value: 'view' },
			row: data[0],
		});
	});

	it('opens selection toolbar content and emits bulk-action', async () => {
		const wrapper = mount(DataList, {
			props: {
				columns,
				data,
				selectable: true,
				selectionActions: [{ label: 'Delete', value: 'delete' }],
			},
			global: {
				plugins: [createPinia()],
				stubs: {
					DropdownMenu: dropdownStub,
					Pagination: true,
					Button: true,
					InputCheckbox: {
						props: ['modelValue'],
						template:
							'<input type="checkbox" :checked="modelValue" @change="$emit(\'update:model-value\', $event.target.checked)" />',
					},
				},
			},
		});

		await wrapper.findAll('input[type="checkbox"]').at(1).setChecked();
		expect(toolbarServiceMock.show).toHaveBeenCalled();

		const lastShowCall =
			toolbarServiceMock.show.mock.calls[
				toolbarServiceMock.show.mock.calls.length - 1
			]?.[0];
		expect(lastShowCall?.props?.selectedCount).toBe(1);
		expect(lastShowCall?.props?.disableSelectAllPage).toBe(false);

		await wrapper.findAll('input[type="checkbox"]').at(2).setChecked();
		const lastUpdateCall =
			toolbarServiceMock.update.mock.calls[
				toolbarServiceMock.update.mock.calls.length - 1
			]?.[1];
		expect(lastUpdateCall?.props?.disableSelectAllPage).toBe(true);

		lastShowCall?.props?.onActionSelect?.({ label: 'Delete', value: 'delete' });

		expect(wrapper.emitted('bulk-action')?.[0]?.[0]).toEqual({
			item: { label: 'Delete', value: 'delete' },
			rows: [data[0], data[1]],
		});
	});

	it('selects a row from the row actions dropdown without toggling it twice', async () => {
		const wrapper = mount(DataList, {
			props: {
				columns,
				data,
				selectable: true,
				contextMenuItems: [{ label: 'View', value: 'view' }],
				selectionActions: [{ label: 'Delete', value: 'delete' }],
			},
			global: {
				plugins: [createPinia()],
				mocks: {
					$t: (key: string) => key,
				},
				stubs: {
					DropdownMenu: dropdownActionStub,
					Pagination: true,
					Button: true,
					InputCheckbox: {
						props: ['modelValue'],
						template:
							'<input type="checkbox" :checked="modelValue" @change="$emit(\'update:model-value\', $event.target.checked)" />',
					},
				},
			},
		});

		await wrapper
			.find('.dropdown-action-select[data-value="select-row"]')
			.trigger('click');

		expect(wrapper.emitted('selection-change')?.[0]?.[0]).toEqual([data[0]]);
		expect(toolbarServiceMock.show).toHaveBeenCalled();
	});

	it('loads persisted sort preference by preferencesKey', () => {
		const pinia = createPinia();
		setActivePinia(pinia);
		const settingsStore = useSettingsStore();
		settingsStore.setSort('data-list-test', {
			prop: 'name',
			order: 'descending',
		});

		const wrapper = mount(DataList, {
			props: {
				columns,
				data,
				preferencesKey: 'data-list-test',
			},
			global: {
				plugins: [pinia],
				mocks: {
					$t: (key: string) => key,
				},
				stubs: {
					DropdownMenu: dropdownStub,
					Pagination: true,
					ArPagination: true,
					Button: true,
					InputCheckbox: {
						template:
							'<input type="checkbox" @change="$emit(\'update:model-value\', $event.target.checked)" />',
					},
				},
			},
		});

		expect(
			wrapper
				.find('.ui-data-list__sort-icon')
				.classes('ar-data-list__sort-icon--descending')
		).toBe(true);
		expect(
			wrapper
				.find('.ui-data-list__sort-icon')
				.classes('ar-data-list__sort-icon--active')
		).toBe(true);

		settingsStore.clearSort('data-list-test');
	});

	it('loads persisted column order preference by preferencesKey', () => {
		const pinia = createPinia();
		setActivePinia(pinia);
		const settingsStore = useSettingsStore();
		settingsStore.setColumnOrder('data-list-order-test', ['status', 'name']);

		const wrapper = mount(DataList, {
			props: {
				columns,
				data,
				preferencesKey: 'data-list-order-test',
			},
			global: {
				plugins: [pinia],
				mocks: {
					$t: (key: string) => key,
				},
				stubs: {
					DropdownMenu: dropdownStub,
					Pagination: true,
					ArPagination: true,
					Button: true,
					InputCheckbox: {
						template:
							'<input type="checkbox" @change="$emit(\'update:model-value\', $event.target.checked)" />',
					},
				},
			},
		});

		expect(
			wrapper.findAll('[data-col-key]').at(0).attributes('data-col-key')
		).toBe('status');

		settingsStore.clearColumnOrder('data-list-order-test');
	});

	it('applies default column visibility from column config', () => {
		const wrapper = mount(DataList, {
			props: {
				columns: [
					{ key: 'name', label: 'Name', sortable: true, visible: true },
					{ key: 'status', label: 'Status', visible: false },
				],
				data,
			},
			global: {
				plugins: [createPinia()],
				mocks: {
					$t: (key: string) => key,
				},
				stubs: {
					DropdownMenu: dropdownStub,
					Pagination: true,
					ArPagination: true,
					Button: true,
					InputCheckbox: {
						template:
							'<input type="checkbox" @change="$emit(\'update:model-value\', $event.target.checked)" />',
					},
				},
			},
		});

		const headerKeys = wrapper
			.findAll('.ui-data-list__header [data-col-key]')
			.map((cell) => cell.attributes('data-col-key'));
		expect(headerKeys).toEqual(['name']);
	});

	it('loads persisted column visibility preference by preferencesKey', () => {
		const pinia = createPinia();
		setActivePinia(pinia);
		const settingsStore = useSettingsStore();
		settingsStore.setColumnVisibility('data-list-visibility-test', [
			{ key: 'name', visible: false },
			{ key: 'status', visible: true },
		]);

		const wrapper = mount(DataList, {
			props: {
				columns,
				data,
				preferencesKey: 'data-list-visibility-test',
			},
			global: {
				plugins: [pinia],
				mocks: {
					$t: (key: string) => key,
				},
				stubs: {
					DropdownMenu: dropdownStub,
					Pagination: true,
					ArPagination: true,
					Button: true,
					InputCheckbox: {
						template:
							'<input type="checkbox" @change="$emit(\'update:model-value\', $event.target.checked)" />',
					},
				},
			},
		});

		const headerKeys = wrapper
			.findAll('.ui-data-list__header [data-col-key]')
			.map((cell) => cell.attributes('data-col-key'));
		expect(headerKeys).toEqual(['status']);

		settingsStore.clearColumnVisibility('data-list-visibility-test');
	});

	it('shows reset column preferences button only when table has saved column prefs', async () => {
		const pinia = createPinia();
		setActivePinia(pinia);
		const settingsStore = useSettingsStore();

		const wrapperWithoutPrefs = mount(DataList, {
			props: {
				columns,
				data,
				preferencesKey: 'data-list-reset-visibility-empty',
			},
			global: {
				plugins: [pinia],
				stubs: {
					DropdownMenu: dropdownStub,
					Pagination: true,
					Button: {
						template:
							'<button type="button" @click="$emit(\'click\', $event)"><slot /></button>',
					},
					InputCheckbox: {
						template:
							'<input type="checkbox" @change="$emit(\'update:model-value\', $event.target.checked)" />',
					},
				},
			},
		});

		expect(
			wrapperWithoutPrefs.find('.ui-data-list__column-menu-reset').exists()
		).toBe(false);
		expect(
			wrapperWithoutPrefs
				.find('.ui-data-list__column-menu-visibility-toggle')
				.exists()
		).toBe(true);
		wrapperWithoutPrefs.unmount();

		settingsStore.setColumnOrder('data-list-reset-visibility-filled', [
			'status',
			'name',
		]);

		const wrapperWithPrefs = mount(DataList, {
			props: {
				columns,
				data,
				preferencesKey: 'data-list-reset-visibility-filled',
			},
			global: {
				plugins: [pinia],
				stubs: {
					DropdownMenu: dropdownStub,
					Pagination: true,
					Button: {
						template:
							'<button type="button" @click="$emit(\'click\', $event)"><slot /></button>',
					},
					InputCheckbox: {
						template:
							'<input type="checkbox" @change="$emit(\'update:model-value\', $event.target.checked)" />',
					},
				},
			},
		});

		expect(
			wrapperWithPrefs.find('.ui-data-list__column-menu-reset').exists()
		).toBe(true);
		expect(
			wrapperWithPrefs
				.find('.ui-data-list__column-menu-visibility-toggle')
				.exists()
		).toBe(true);
	});

	it('resets column width/order/visibility for specific datalist preferences key', async () => {
		const pinia = createPinia();
		setActivePinia(pinia);
		const settingsStore = useSettingsStore();
		const key = 'data-list-reset-columns-test';

		settingsStore.setColumnOrder(key, ['status', 'name']);
		settingsStore.setColumnVisibility(key, [
			{ key: 'name', visible: false },
			{ key: 'status', visible: true },
		]);
		settingsStore.setColumnWidths(key, [{ key: 'name', width: 220 }]);

		const wrapper = mount(DataList, {
			props: {
				columns,
				data,
				autoWidth: false,
				preferencesKey: key,
			},
			global: {
				plugins: [pinia],
				stubs: {
					DropdownMenu: dropdownStub,
					Pagination: true,
					Button: {
						template:
							'<button type="button" @click="$emit(\'click\', $event)"><slot /></button>',
					},
					InputCheckbox: {
						template:
							'<input type="checkbox" @change="$emit(\'update:model-value\', $event.target.checked)" />',
					},
				},
			},
		});

		expect(
			wrapper
				.findAll('.ui-data-list__header [data-col-key]')
				.map((cell) => cell.attributes('data-col-key'))
		).toEqual(['status']);

		await wrapper.find('.ui-data-list__column-menu-reset').trigger('click');
		await nextTick();

		expect(settingsStore.getColumnOrder(key)).toBeNull();
		expect(settingsStore.getColumnVisibility(key)).toBeNull();
		expect(settingsStore.getColumnWidths(key)).toBeNull();

		expect(
			wrapper
				.findAll('.ui-data-list__header [data-col-key]')
				.map((cell) => cell.attributes('data-col-key'))
		).toEqual(['name', 'status']);
		expect(
			wrapper.find('.ui-data-list__grid').attributes('style')
		).not.toContain('220px');
	});

	it('toggles all columns visibility from the column menu action', async () => {
		const pinia = createPinia();
		setActivePinia(pinia);

		const wrapper = mount(DataList, {
			props: {
				columns,
				data,
				preferencesKey: 'data-list-toggle-all-columns-test',
			},
			global: {
				plugins: [pinia],
				stubs: {
					DropdownMenu: dropdownStub,
					Pagination: true,
					Button: {
						template:
							'<button type="button" @click="$emit(\'click\', $event)"><slot /></button>',
					},
					InputCheckbox: {
						template:
							'<input type="checkbox" @change="$emit(\'update:model-value\', $event.target.checked)" />',
					},
				},
			},
		});

		expect(
			wrapper
				.findAll('.ui-data-list__header [data-col-key]')
				.map((cell) => cell.attributes('data-col-key'))
		).toEqual(['name', 'status']);

		(
			wrapper.vm as { toggleAllColumnsVisibility: () => void }
		).toggleAllColumnsVisibility();
		await nextTick();

		expect(
			wrapper
				.findAll('.ui-data-list__header [data-col-key]')
				.map((cell) => cell.attributes('data-col-key'))
		).toEqual([]);

		(
			wrapper.vm as { toggleAllColumnsVisibility: () => void }
		).toggleAllColumnsVisibility();
		await nextTick();

		expect(
			wrapper
				.findAll('.ui-data-list__header [data-col-key]')
				.map((cell) => cell.attributes('data-col-key'))
		).toEqual(['name', 'status']);
	});

	it('loads persisted perPage preference by preferencesKey', () => {
		const pinia = createPinia();
		setActivePinia(pinia);
		const settingsStore = useSettingsStore();
		settingsStore.setPerPage('data-list-per-page-test', 50);

		const wrapper = mount(DataList, {
			props: {
				columns,
				data,
				enablePagination: true,
				total: 200,
				perPage: 25,
				preferencesKey: 'data-list-per-page-test',
			},
			global: {
				plugins: [pinia],
				mocks: {
					$t: (key: string) => key,
				},
				stubs: {
					DropdownMenu: dropdownStub,
					Pagination: true,
					ArPagination: true,
					Button: true,
					InputCheckbox: {
						template:
							'<input type="checkbox" @change="$emit(\'update:model-value\', $event.target.checked)" />',
					},
				},
			},
		});

		expect(wrapper.emitted('update:perPage')?.[0]).toEqual([50]);

		settingsStore.clearPerPage('data-list-per-page-test');
	});

	it('persists and clears perPage preference when page size changes', async () => {
		const pinia = createPinia();
		setActivePinia(pinia);
		const settingsStore = useSettingsStore();

		const wrapper = mount(DataList, {
			props: {
				columns,
				data,
				enablePagination: true,
				total: 200,
				perPage: 25,
				preferencesKey: 'data-list-per-page-save-test',
			},
			global: {
				plugins: [pinia],
				mocks: {
					$t: (key: string) => key,
				},
				stubs: {
					DropdownMenu: dropdownStub,
					Pagination: true,
					ArPagination: true,
					Button: true,
					InputCheckbox: {
						template:
							'<input type="checkbox" @change="$emit(\'update:model-value\', $event.target.checked)" />',
					},
				},
			},
		});

		await wrapper.setProps({ perPage: 30 });
		expect(settingsStore.getPerPage('data-list-per-page-save-test')).toBe(30);

		await wrapper.setProps({ perPage: 25 });
		expect(settingsStore.getPerPage('data-list-per-page-save-test')).toBeNull();
	});

	it('hides pagination when total is less than or equal to default page size', () => {
		const wrapper = mount(DataList, {
			props: {
				columns,
				data,
				enablePagination: true,
				total: 10,
				perPage: 25,
			},
			global: {
				plugins: [createPinia()],
				mocks: {
					$t: (key: string) => key,
				},
				stubs: {
					DropdownMenu: dropdownStub,
					Pagination: true,
					ArPagination: true,
					Button: true,
					InputCheckbox: {
						template:
							'<input type="checkbox" @change="$emit(\'update:model-value\', $event.target.checked)" />',
					},
				},
			},
		});

		expect(wrapper.find('.ui-data-list__footer').exists()).toBe(false);
	});

	it('keeps pagination visible when total exceeds default page size even on single page', () => {
		const wrapper = mount(DataList, {
			props: {
				columns,
				data,
				enablePagination: true,
				total: 26,
				perPage: 50,
			},
			global: {
				plugins: [createPinia()],
				mocks: {
					$t: (key: string) => key,
				},
				stubs: {
					DropdownMenu: dropdownStub,
					Pagination: true,
					ArPagination: true,
					Button: true,
					InputCheckbox: {
						template:
							'<input type="checkbox" @change="$emit(\'update:model-value\', $event.target.checked)" />',
					},
				},
			},
		});

		expect(wrapper.find('.ui-data-list__footer').exists()).toBe(true);
	});

	it('restores selection rows and panel-open state from settings memory', async () => {
		const pinia = createPinia();
		setActivePinia(pinia);
		const settingsStore = useSettingsStore();
		const stateKey = 'data-list-selection-restore-test';

		settingsStore.setDataListSelection(stateKey, [data[1]]);
		settingsStore.setDataListSelectionPanelOpen(stateKey, true);

		mount(DataList, {
			props: {
				columns,
				data,
				selectable: true,
				preferencesKey: stateKey,
			},
			global: {
				plugins: [pinia],
				stubs: {
					DropdownMenu: dropdownStub,
					Pagination: true,
					Button: true,
					InputCheckbox: {
						template:
							'<input type="checkbox" @change="$emit(\'update:model-value\', $event.target.checked)" />',
					},
				},
			},
		});

		await nextTick();
		await nextTick();

		const lastShowCall =
			toolbarServiceMock.show.mock.calls[
				toolbarServiceMock.show.mock.calls.length - 1
			]?.[0];

		expect(lastShowCall?.props?.selectedCount).toBe(1);
		expect(lastShowCall?.props?.panelOpen).toBe(true);
		expect(lastShowCall?.props?.selectedRows).toEqual([data[1]]);
	});
});
