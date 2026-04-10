export type StatusBadgeTone = "neutral" | "success" | "warning" | "danger" | "accent";

export interface StatusBadgeProps {
  label: string;
  tone?: StatusBadgeTone;
}
