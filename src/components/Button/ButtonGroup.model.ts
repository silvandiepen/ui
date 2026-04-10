/**
 * ButtonGroup component type definitions and interfaces
 */

export const ButtonGroupDirection = {
  ROW: 'row',
  COLUMN: 'column'
} as const;
export type ButtonGroupDirection = (typeof ButtonGroupDirection)[keyof typeof ButtonGroupDirection];

export const ButtonGroupGap = {
  NONE: 'none',
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large'
} as const;
export type ButtonGroupGap = (typeof ButtonGroupGap)[keyof typeof ButtonGroupGap];

export const ButtonGroupAlign = {
  START: 'start',
  CENTER: 'center',
  END: 'end',
  STRETCH: 'stretch'
} as const;
export type ButtonGroupAlign = (typeof ButtonGroupAlign)[keyof typeof ButtonGroupAlign];

export const ButtonGroupJustify = {
  START: 'start',
  CENTER: 'center',
  END: 'end',
  BETWEEN: 'between',
  AROUND: 'around'
} as const;
export type ButtonGroupJustify = (typeof ButtonGroupJustify)[keyof typeof ButtonGroupJustify];

/**
 * Props interface for ButtonGroup component
 */
export interface ButtonGroupProps {
  /** Direction of button layout */
  direction?: ButtonGroupDirection | 'row' | 'column';
  /** Whether buttons should fill available width */
  fluid?: boolean;
  /** Gap size between buttons */
  gap?: ButtonGroupGap | 'none' | 'small' | 'medium' | 'large';
  /** Vertical alignment of buttons */
  align?: ButtonGroupAlign | 'start' | 'center' | 'end' | 'stretch';
  /** Horizontal justification of buttons */
  justify?: ButtonGroupJustify | 'start' | 'center' | 'end' | 'between' | 'around';
  /** Whether to wrap buttons on overflow */
  wrap?: boolean;
}