export interface HeaderSearchProps {
  /**
   * Enable automatic focus when the search shell expands.
   * @default true
   */
  autoFocus?: boolean

  /**
   * Accessible label for the clear action.
   * @default 'Clear search'
   */
  clearLabel?: string

  /**
   * Clear the current query when the shell closes.
   * @default true
   */
  clearOnClose?: boolean

  /**
   * Collapse the shell when escape is pressed inside the input.
   * @default true
   */
  closeOnEscape?: boolean

  /**
   * Collapse the shell when the user clicks outside of it.
   * @default true
   */
  closeOnOutsideClick?: boolean

  /**
   * Leading icon used for the trigger button and expanded input shell.
   * @default 'button-search2'
   */
  iconName?: string

  /**
   * Maximum width of the expanded shell.
   * @default '36rem'
   */
  maxWidth?: string

  /**
   * Current search query.
   * @default ''
   */
  modelValue?: string

  /**
   * Accessible label for the collapsed trigger button.
   * @default 'Search'
   */
  openLabel?: string

  /**
   * Keep the panel visible even when the query is still empty.
   * @default false
   */
  showPanelOnEmptyQuery?: boolean

  /**
   * Placeholder copy rendered in the expanded input.
   * @default ''
   */
  placeholder?: string
}

export interface HeaderSearchEmits {
  clear: []
  close: []
  keydown: [event: KeyboardEvent]
  open: []
  'update:modelValue': [value: string]
}

export interface HeaderSearchExposed {
  clearSearch: () => void
  closeSearch: () => void
  focusInput: () => void
  openSearch: () => void
}
