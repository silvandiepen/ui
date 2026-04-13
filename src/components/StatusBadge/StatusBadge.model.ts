import { Status } from "../../types";

export type StatusBadgeTone = "default" | Status;

export interface StatusBadgeProps {
  label: string;
  tone?: StatusBadgeTone;
}
