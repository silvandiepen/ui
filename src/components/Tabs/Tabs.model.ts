import type { InjectionKey } from 'vue';
import type { Colors } from '@/types';
import type { ButtonVariant } from '@/components/ui/Button';
import type { CardProps } from '@/components/ui/Card/Card.model';

export type TabsClassValue = string | Record<string, boolean>;

export type TabIdentifier = string | number | null | undefined;

export type TabPaneItem = {
	id?: TabIdentifier;
	title?: string;
	icon?: string;
	active: boolean;
	_props?: {
		id?: TabIdentifier;
	};
};

export type TabsContext = {
	addTab: (tab: TabPaneItem) => void;
	removeTab: (tab: TabPaneItem) => void;
};

export type TabsRootProps = {
	type?: string;
	activeTab?: string;
	value?: string;
	tabNavWrapperClasses?: TabsClassValue;
	tabNavClasses?: TabsClassValue;
	tabContentClasses?: TabsClassValue;
	vertical?: boolean;
	activeVariant?: ButtonVariant;
	inactiveVariant?: ButtonVariant;
	color?: Colors;
	contentCardVariant?: CardProps['variant'];
};

export type TabsRootEmit = {
	(e: 'tab-click', value: TabIdentifier): void;
	(e: 'input', value: TabIdentifier): void;
};

export type TabPaneProps = {
	title?: string;
	id?: string | number | null;
	icon?: string;
};

export type TabNavigationItem = {
	id: string | number;
	label: string;
	icon?: string;
	badge?: string | number;
	color?: string;
	disabled?: boolean;
};

export type TabNavigationVariant = 'pills' | 'underline';
export type TabNavigationAlign = 'left' | 'center' | 'right';

export const tabsContextKey: InjectionKey<TabsContext> = Symbol('tabsContext');
