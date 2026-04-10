import { computed, markRaw, ref } from 'vue';
import type {
	ToolbarInstance,
	ToolbarOptions,
	ToolbarUpdate,
} from './Toolbar.model';
import { ToolbarConfigDefault } from './Toolbar.model';

const CLOSING_TIMEOUT = 180;

const useToolbarService = () => {
	const toolbars = ref<ToolbarInstance[]>([]);
	const toolbar = computed<ToolbarInstance | null>(
		() => toolbars.value[toolbars.value.length - 1] || null
	);

	const findToolbar = (id: string) =>
		toolbars.value.find((instance) => instance.id === id) || null;

	const show = (opts: ToolbarOptions) => {
		const id = opts.id || crypto.randomUUID();
		const existing = findToolbar(id);
		const config = {
			...ToolbarConfigDefault,
			...(opts.config || {}),
		};

		if (existing) {
			existing.component = markRaw(opts.component);
			existing.props = { ...(opts.props || {}) };
			existing.config = config;
			existing.onClose = opts.onClose;
			existing.state.closing = false;
			existing.state.closeRevision += 1;
			return id;
		}

		toolbars.value = [
			...toolbars.value,
			{
				id,
				component: markRaw(opts.component),
				props: { ...(opts.props || {}) },
				config,
				onClose: opts.onClose,
				state: {
					closing: false,
					closeRevision: 0,
				},
			},
		];

		return id;
	};

	const update = (id: string, updates: ToolbarUpdate) => {
		const instance = findToolbar(id);
		if (!instance) {
			return;
		}

		if (updates.component) {
			instance.component = markRaw(updates.component);
		}
		if (updates.props) {
			instance.props = {
				...instance.props,
				...updates.props,
			};
		}
		if (updates.config) {
			instance.config = {
				...instance.config,
				...updates.config,
			};
		}
	};

	const hideInstance = (instance: ToolbarInstance) => {
		if (instance.state.closing) {
			return;
		}

		instance.state.closing = true;
		instance.state.closeRevision += 1;
		const revision = instance.state.closeRevision;

		setTimeout(() => {
			const active = findToolbar(instance.id);
			if (!active || active.state.closeRevision !== revision) {
				return;
			}

			active.onClose?.();
			toolbars.value = toolbars.value.filter((entry) => entry.id !== active.id);
		}, CLOSING_TIMEOUT);
	};

	const hide = (id?: string) => {
		if (!toolbars.value.length) {
			return;
		}

		if (id) {
			const instance = findToolbar(id);
			if (!instance) {
				return;
			}

			hideInstance(instance);
			return;
		}

		toolbars.value.forEach((instance) => hideInstance(instance));
	};

	const clear = () => {
		if (!toolbars.value.length) {
			return;
		}

		toolbars.value.forEach((instance) => {
			instance.onClose?.();
		});
		toolbars.value = [];
	};

	return {
		toolbar,
		toolbars,
		show,
		update,
		hide,
		clear,
	};
};

export const toolbarService = useToolbarService();
export type ToolbarService = ReturnType<typeof useToolbarService>;
