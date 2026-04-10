export type NotificationVariant = 'success' | 'error' | 'warning' | 'info';

export interface NotificationProps {
  message: string;
  type?: NotificationVariant;
  dismissible?: boolean;
  dismissLabel?: string;
}
