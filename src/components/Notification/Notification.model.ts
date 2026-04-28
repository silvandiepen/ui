import type { TestIdProps } from "../../types";

export type NotificationVariant = 'success' | 'error' | 'warning' | 'info';

export interface NotificationProps {
  testId?: TestIdProps['testId'];
  message: string;
  type?: NotificationVariant;
  dismissible?: boolean;
  dismissLabel?: string;
  showIcon?: boolean;
}
