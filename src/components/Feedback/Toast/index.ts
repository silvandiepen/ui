import { NotificationType } from '../../../types';
import { toastService, type ToastOptions } from './Toast.service';

export * from './Toast.model';
export * from './Toast.service';
export { default as Toast } from './Toast.vue';

export const toast = (options: ToastOptions) => toastService.show(options);

export const toastError = (options: ToastOptions) =>
  toastService.show({
    ...options,
    type: NotificationType.ERROR,
  });

export const toastWarning = (options: ToastOptions) =>
  toastService.show({
    ...options,
    type: NotificationType.WARNING,
  });

export const toastInfo = (options: ToastOptions) =>
  toastService.show({
    ...options,
    type: NotificationType.INFO,
  });
