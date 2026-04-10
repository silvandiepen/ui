import Tabs from './Tabs.vue';
import TabPane from './TabPane.vue';
import TabNavigation from './TabNavigation.vue';
import { useTabsRoot, useTabPane } from './useTabs';

export { Tabs, TabPane, TabNavigation, useTabsRoot, useTabPane };
export type {
	TabIdentifier,
	TabPaneItem,
	TabPaneProps,
	TabNavigationItem,
	TabsClassValue,
	TabsContext,
	TabsRootProps,
} from './Tabs.model';
