import { Colors } from "../../types"

export enum AlertVariant {
  DEFAULT = Colors.PRIMARY,
  INFO = Colors.INFO,
  SUCCESS = Colors.SUCCESS,
  WARNING = Colors.WARNING,
  ERROR = Colors.ERROR,
}

export interface AlertProps {
  variant?: AlertVariant
  title?: string
  description?: string
  dismissible?: boolean
  icon?: string
}
