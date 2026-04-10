import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { toolbarService } from '@/components/ui/Toolbar';

const ToolbarContent = {
	name: 'ToolbarContent',
	template: '<div>Toolbar Content</div>',
};

describe('toolbarService', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		toolbarService.clear();
	});

	afterEach(() => {
		toolbarService.clear();
		vi.runOnlyPendingTimers();
		vi.useRealTimers();
	});

	it('shows and updates toolbar content', () => {
		const id = toolbarService.show({
			id: 'selection-toolbar',
			component: ToolbarContent,
			props: { count: 1 },
		});

		expect(id).toBe('selection-toolbar');
		expect(toolbarService.toolbar.value?.id).toBe('selection-toolbar');
		expect(toolbarService.toolbar.value?.props.count).toBe(1);
		expect(toolbarService.toolbars.value).toHaveLength(1);

		toolbarService.update('selection-toolbar', {
			props: { count: 2 },
		});

		expect(toolbarService.toolbar.value?.props.count).toBe(2);
	});

	it('keeps multiple toolbars visible at the same time', () => {
		toolbarService.show({
			id: 'selection-toolbar-a',
			component: ToolbarContent,
			props: { count: 1 },
		});
		toolbarService.show({
			id: 'selection-toolbar-b',
			component: ToolbarContent,
			props: { count: 2 },
		});

		expect(toolbarService.toolbars.value.map((toolbar) => toolbar.id)).toEqual([
			'selection-toolbar-a',
			'selection-toolbar-b',
		]);
		expect(toolbarService.toolbar.value?.id).toBe('selection-toolbar-b');
	});

	it('hides toolbar by id', () => {
		toolbarService.show({
			id: 'selection-toolbar-a',
			component: ToolbarContent,
		});
		toolbarService.show({
			id: 'selection-toolbar-b',
			component: ToolbarContent,
		});
		expect(toolbarService.toolbars.value).toHaveLength(2);

		toolbarService.hide('selection-toolbar-a');
		expect(
			toolbarService.toolbars.value.find(
				(toolbar) => toolbar.id === 'selection-toolbar-a'
			)?.state.closing
		).toBe(true);
		expect(
			toolbarService.toolbars.value.find(
				(toolbar) => toolbar.id === 'selection-toolbar-b'
			)?.state.closing
		).toBe(false);

		vi.advanceTimersByTime(180);
		expect(toolbarService.toolbars.value.map((toolbar) => toolbar.id)).toEqual([
			'selection-toolbar-b',
		]);
	});
});
