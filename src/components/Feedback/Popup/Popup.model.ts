import { type Slot, type Component } from 'vue';
import type { Colors } from '../../../types';

export const PopupPosition = {
	CENTER: 'center',
	LEFT: 'left',
	RIGHT: 'right',
};

export type PopupPosition = (typeof PopupPosition)[keyof typeof PopupPosition];

export interface PopupAction {
	id: string;
	label: string;
	icon?: string;
	type?: 'default' | 'outline' | 'ghost';
	color?: Colors;
	disabled?: boolean;
	loading?: boolean;
	action: () => void;
}

export interface PopupOptions {
	component: Component | Slot | string | undefined;
	footer?: Component;
	header?: Component;
	actions?: PopupAction[];
	props?: Record<string, unknown>;
	onClose?: () => void;
	onCallback?: (data: Record<string, unknown>) => void;
	title?: string;
	description?: string;
	config?: {
		background?: boolean;
		position?: 'center' | 'bottom' | 'top';
		canClose?: boolean;
		width?: string;
		closingTimeout?: number;
	};
	id?: string;
	closePopups?: boolean;
	slots?: Record<string, Slot>;
	on?: Record<string, (...args: unknown[]) => void>;
}

export interface PopupInstance {
	id: string;
	component: Component;
	footer?: Component;
	header?: Component;
	actions?: PopupAction[];
	title: string;
	description: string;
	props: Record<string, unknown>;
	onClose?: () => void;
	onCallback?: (data: Record<string, unknown>) => void;
	openedTime: number;
	slots?: Record<string, Slot>;
	events?: Record<string, (...args: unknown[]) => void>;
	config: {
		canClose?: boolean;
		hasBackground: boolean;
		position: string;
		width: string;
		closingTimeout: number;
	};
	state: {
		closing: boolean;
	};
}
