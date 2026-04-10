import { Colors, Status } from '@/types';
import type { IconNameOrString } from '@/components/ui/Icon/Icon.model';

export type ItemListLink = string | Record<string, unknown>;

export type ItemListAction = {
	key?: string | number;
	label?: string;
	icon?: IconNameOrString;
	to?: ItemListLink | null;
	href?: string | null;
	target?: string;
	disabled?: boolean;
	color?: Colors;
	status?: Status | null;
	action?: (item: ItemListItem) => void;
};

export type ItemListItem = {
	key?: string | number;
	label: string;
	description?: string;
	meta?: string;
	icon?: IconNameOrString;
	to?: ItemListLink | null;
	href?: string | null;
	target?: string;
	disabled?: boolean;
	active?: boolean;
	color?: Colors;
	status?: Status | null;
	action?: () => void;
	actions?: ItemListAction[];
};
