import { ref } from 'vue';
import { Icons } from 'open-icon';
import type { ToastPosition, ToastType } from './Toast.model';
import { ToastSettings } from './Toast.model';
import { NotificationType } from '../../../types';

type IconValue = (typeof Icons)[keyof typeof Icons];

export interface ToastOptions {
	message: string;
	title?: string;
	icon?: IconValue;
	duration?: number;
	position?: ToastPosition;
	type?: ToastType;
	dismissible?: boolean;
	onClose?: () => void;
	id?: string;
	closable?: boolean;
	action?: {
		label: string;
		handler: () => void;
	};
}

const defaulToastOptions: Partial<ToastOptions> = {
	duration: 2000,
	position: ToastSettings.Position.TOP,
	type: NotificationType.INFO,
};

export interface ToastInstance {
	id: string;
	message: string;
	title: string;
	icon: IconValue | null;
	duration: number;
	position: ToastPosition;
	type: ToastType;
	onClose?: () => void;
	dismissible: boolean;
	openedTime: number;
	state: {
		closing: boolean;
	};
}

const useToastService = () => {
	const toasts = ref<ToastInstance[]>([]);

	const showToast = (opts: ToastOptions) => {
		const options = { ...defaulToastOptions, ...opts } as ToastOptions;
		const id = options.id || crypto.randomUUID();

		const newToast: ToastInstance = {
			id,
			message: options.message,
			title: options.title || '',
			icon: options.icon || null,
			duration: options.duration || 2000,
			position: options.position || 'top',
			type: options.type || NotificationType.INFO,
			onClose: options.onClose,
			openedTime: Date.now(),
			dismissible: options.dismissible || false,
			state: {
				closing: false,
			},
		};

		toasts.value.push(newToast);

		if (options.duration) {
			setTimeout(() => {
				hideToast(id);
			}, options.duration);
		}

		return id;
	};

	const hideToast = (id: string) => {
		const toast = toasts.value.find((t) => t.id === id);
		if (toast) {
			toast.state.closing = true;
			setTimeout(() => {
				toast.onClose?.();
				toasts.value = toasts.value.filter((t) => t.id !== id);
			}, 300); // Short animation duration for closing
		}
	};

	const hideAllToasts = () => {
		toasts.value.forEach((toast) => hideToast(toast.id));
	};

	// Convenience methods for common toast types
	const error = (message: string, options?: Omit<ToastOptions, 'message' | 'type'>) => {
		return showToast({
			...options,
			message,
			type: NotificationType.ERROR,
			dismissible: options?.dismissible ?? options?.closable ?? true,
			duration: options?.duration ?? 5000,
		});
	};

	const success = (message: string, options?: Omit<ToastOptions, 'message' | 'type'>) => {
		return showToast({
			...options,
			message,
			type: NotificationType.SUCCESS,
			dismissible: options?.dismissible ?? options?.closable ?? true,
			duration: options?.duration ?? 3000,
		});
	};

	const warning = (message: string, options?: Omit<ToastOptions, 'message' | 'type'>) => {
		return showToast({
			...options,
			message,
			type: NotificationType.WARNING,
			dismissible: options?.dismissible ?? options?.closable ?? true,
			duration: options?.duration ?? 4000,
		});
	};

	const info = (message: string, options?: Omit<ToastOptions, 'message' | 'type'>) => {
		return showToast({
			...options,
			message,
			type: NotificationType.INFO,
			dismissible: options?.dismissible ?? options?.closable ?? true,
			duration: options?.duration ?? 3000,
		});
	};

	return {
		toasts,
		show: showToast,
		hide: hideToast,
		hideAll: hideAllToasts,
		error,
		success,
		warning,
		info,
	};
};

export const toastService = useToastService();
export type ToastService = ReturnType<typeof useToastService>;
