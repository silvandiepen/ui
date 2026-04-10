import {
	computed,
	inject,
	onBeforeUnmount,
	onMounted,
	provide,
	reactive,
	ref,
	watch,
} from 'vue';
import type {
	TabIdentifier,
	TabPaneItem,
	TabPaneProps,
	TabsRootEmit,
	TabsRootProps,
} from './Tabs.model';
import { tabsContextKey } from './Tabs.model';

export const useTabsRoot = (props: TabsRootProps, emit: TabsRootEmit) => {
	const tabs = ref<TabPaneItem[]>([]);

	const getNavigationId = (tab: TabPaneItem, index: number) =>
		tab?._props?.id ?? tab.id ?? tab.title ?? `tab-${index}`;

	const tabItems = computed(() =>
		tabs.value.map((tab, index) => ({
			id: getNavigationId(tab, index),
			title: tab.title,
			label: tab.title || `Tab ${index + 1}`,
			icon: tab.icon,
		}))
	);

	const activeNavigationId = computed(() => {
		const index = tabs.value.findIndex((tab) => tab.active);
		if (index < 0) return null;
		return getNavigationId(tabs.value[index], index);
	});

	const deactivateTabs = () => {
		tabs.value.forEach((tab) => {
			tab.active = false;
		});
	};

	const activateTab = (tab: TabPaneItem, emitEvent = true) => {
		deactivateTabs();
		tab.active = true;

		if (emitEvent) {
			const id = tab.id ?? tab.title;
			emit('tab-click', id);
			emit('input', id);
		}
	};

	const findAndActivateTab = (identifier: TabIdentifier) => {
		const tabToActivate = tabs.value.find(
			(tab) =>
				(tab.id !== undefined && String(tab.id) === String(identifier)) ||
				tab.title === identifier
		);

		if (tabToActivate) {
			activateTab(tabToActivate, false);
		} else if (tabs.value.length > 0) {
			activateTab(tabs.value[0], false);
		}
	};

	const activateByNavigationId = (id: TabIdentifier) => {
		const foundTab = tabs.value.find(
			(tab, index) => String(getNavigationId(tab, index)) === String(id)
		);
		if (foundTab) {
			activateTab(foundTab);
		}
	};

	const findAndActivateByActiveTab = (identifier?: string) => {
		if (!identifier) return;

		const tabToActivate = tabs.value.find(
			(tab) =>
				String(tab._props?.id) === String(identifier) ||
				String(tab.id) === String(identifier) ||
				tab.title === identifier
		);

		if (tabToActivate) {
			activateTab(tabToActivate, false);
		}
	};

	const addTab = (tab: TabPaneItem) => {
		tabs.value.push(tab);

		if (!props.activeTab && tabs.value.length === 1) {
			tab.active = true;
		}

		if (props.activeTab === tab.id || props.activeTab === tab.title) {
			tab.active = true;
		}
	};

	const removeTab = (tab: TabPaneItem) => {
		const index = tabs.value.indexOf(tab);

		if (tab.active) {
			const nextTab = tabs.value[index + 1] || tabs.value[index - 1];
			if (nextTab) {
				activateTab(nextTab, false);
			}
		}

		if (index > -1) {
			tabs.value.splice(index, 1);
		}

		if (
			tabs.value.length > 0 &&
			!tabs.value.some((tabItem) => tabItem.active)
		) {
			activateTab(tabs.value[0], false);
		}
	};

	provide(tabsContextKey, {
		addTab,
		removeTab,
	});

	onMounted(() => {
		if (props.value) {
			findAndActivateTab(props.value);
		} else if (tabs.value.length > 0) {
			activateTab(tabs.value[0]);
		}
	});

	watch(
		() => props.value,
		(newValue) => {
			findAndActivateTab(newValue);
		}
	);

	watch(
		() => props.activeTab,
		(newValue) => {
			findAndActivateByActiveTab(newValue);
		}
	);

	return {
		tabItems,
		activeNavigationId,
		activateByNavigationId,
	};
};

export const useTabPane = (props: TabPaneProps) => {
	const tabsContext = inject(tabsContextKey, null);

	const tab = reactive<TabPaneItem>({
		id: props.id,
		title: props.title,
		icon: props.icon,
		active: false,
	});

	watch(
		() => props.id,
		(id) => {
			tab.id = id;
		}
	);

	watch(
		() => props.title,
		(title) => {
			tab.title = title;
		}
	);

	watch(
		() => props.icon,
		(icon) => {
			tab.icon = icon;
		}
	);

	onMounted(() => {
		tabsContext?.addTab(tab);
	});

	onBeforeUnmount(() => {
		tabsContext?.removeTab(tab);
	});

	return {
		tab,
	};
};
