import { ref } from 'vue';
import type { DropdownItem } from '@/components/ui/Dropdown';

export type ContextMenuState = {
	id: string;
	items: DropdownItem[];
	position: 'fixed';
	x: number;
	y: number;
	align?: 'left' | 'right';
	openUp?: boolean;
	fullWidth?: boolean;
	anchor?: HTMLElement | null;
	closeOnSelect?: boolean;
	onSelect?: (item: DropdownItem) => void;
	onClose?: () => void;
};

const menu = ref<ContextMenuState | null>(null);

const closeMenu = (id?: string) => {
	if (!menu.value) {
		return;
	}

	if (id && menu.value.id !== id) {
		return;
	}

	const activeMenu = menu.value;
	menu.value = null;
	activeMenu.onClose?.();
};

export const contextMenuService = {
	menu,
	open(nextMenu: ContextMenuState) {
		if (menu.value?.id && menu.value.id !== nextMenu.id) {
			closeMenu();
		}

		menu.value = nextMenu;
	},
	close(id?: string) {
		closeMenu(id);
	},
	clear() {
		closeMenu();
	},
	select(item: DropdownItem) {
		if (!menu.value || item.disabled) {
			return;
		}

		item.action?.(item);
		menu.value.onSelect?.(item);

		if (menu.value?.closeOnSelect !== false) {
			closeMenu();
		}
	},
};

export const createContextMenuInstanceId = (prefix = 'context-menu') =>
	`${prefix}-${crypto.randomUUID()}`;
