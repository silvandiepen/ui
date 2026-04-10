import type { Component } from 'vue';

export type ToolbarPosition = 'bottom';

export interface ToolbarConfig {
	position: ToolbarPosition;
	offset: string;
	zIndex: number;
}

export interface ToolbarOptions {
	id?: string;
	component: Component;
	props?: Record<string, unknown>;
	config?: Partial<ToolbarConfig>;
	onClose?: () => void;
}

export interface ToolbarUpdate {
	component?: Component;
	props?: Record<string, unknown>;
	config?: Partial<ToolbarConfig>;
}

export interface ToolbarInstance {
	id: string;
	component: Component;
	props: Record<string, unknown>;
	config: ToolbarConfig;
	onClose?: () => void;
	state: {
		closing: boolean;
		closeRevision: number;
	};
}

export const ToolbarConfigDefault: ToolbarConfig = {
	position: 'bottom',
	offset: 'var(--space)',
	zIndex: 70,
};
