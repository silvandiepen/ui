import { reactive } from 'vue';

export interface PopupOptions {
  id?: string;
  component?: any;
  props?: Record<string, any>;
  position?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  backdrop?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
}

interface PopupState {
  popups: Map<string, PopupOptions>;
}

const state = reactive<PopupState>({
  popups: new Map()
});

export const PopupService = {
  open(options: PopupOptions) {
    const id = options.id || `popup-${Date.now()}`;
    state.popups.set(id, { ...options, id });
    return id;
  },

  close(id: string) {
    state.popups.delete(id);
  },

  closeAll() {
    state.popups.clear();
  },

  gePopup(id: string) {
    return state.popups.get(id);
  },

  getAllPopups() {
    return Array.from(state.popups.values());
  }
};

// Export with lowercase alias for compatibility
export const popupService = PopupService;
