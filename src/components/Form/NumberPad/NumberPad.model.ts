import { Icons } from 'open-icon'
import type { TestIdProps } from "../../../types";

export interface NumberPadProps {
  /**
   * Stable test id rendered on the root and interesting child elements
   */
  testId?: TestIdProps['testId']

  /**
   * Show the clear/backspace button
   */
  showClear?: boolean

  /**
   * Show the submit/confirm button
   */
  showSubmit?: boolean

  /**
   * Disable all buttons
   */
  disabled?: boolean

  /**
   * Disable only the clear button
   */
  disableClear?: boolean

  /**
   * Disable only the submit button
   */
  disableSubmit?: boolean

  /**
   * Shuffle the numbers randomly
   */
  shuffle?: boolean

  /**
   * Size variant
   */
  size?: 'small' | 'medium' | 'large'

  /**
   * Visual variant
   */
  variant?: 'default' | 'compact' | 'rounded' | 'flat'

  /**
   * Icon to use for the clear button
   */
  clearIcon?: (typeof Icons)[keyof typeof Icons] | string;

  /**
   * Icon to use for the submit button
   */
  submiIcon?: (typeof Icons)[keyof typeof Icons] | string;
}

export interface NumberPadEmits {
  /**
   * Emitted when a number is clicked
   */
  'number': [value: string]

  /**
   * Emitted when the clear button is clicked
   */
  'clear': []

  /**
   * Emitted when the submit button is clicked
   */
  'submit': []
}
