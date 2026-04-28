import type { Size, TestIdProps } from '../../../types'

export interface Option {
	label: string
	value: string
	disabled?: boolean
	icon?: string
}

export type AcceptedOptions = string[] | Option[] | OptionGroup[]

export interface OptionGroup {
	title: string
	options: (string | Option)[]
}

export interface InputSelectProps {
	/**
	 * Stable test id rendered on the root and interesting child elements
	 */
	testId?: TestIdProps['testId']

	/**
	 * The current selected value
	 */
	modelValue?: string | null
	
	/**
	 * Label text displayed above the select
	 */
	label?: string
	
	/**
	 * Help text displayed below the select
	 */
	description?: string
	
	/**
	 * Available options for selection
	 */
	options: AcceptedOptions
	
	/**
	 * Error messages to display
	 * @default []
	 */
	error?: string[]
	
	/**
	 * Size variant of the select
	 * @default Size.MEDIUM
	 */
	size?: Size
	
	/**
	 * Whether to allow null/empty selection
	 * @default false
	 */
	allowNull?: boolean
	
	/**
	 * Label for the null/empty option
	 * @default 'Please select...'
	 */
	nullLabel?: string
	
	/**
	 * Whether the select is disabled
	 * @default false
	 */
	disabled?: boolean
	
	/**
	 * Placeholder text (when no value selected)
	 */
	placeholder?: string
	
	/**
	 * Whether to allow multiple selections
	 * @default false
	 */
	multiple?: boolean

	/**
	 * Whether to render a searchable select UI instead of the native select
	 * @default false
	 */
	filterable?: boolean

	/**
	 * Legacy alias for filterable
	 * @default false
	 */
	searchable?: boolean
}

export interface InputSelectEmits {
	/**
	 * Emitted when value changes
	 */
	'update:modelValue': [value: string | null | string[]]
	
	/**
	 * Emitted when the select value changes
	 */
	change: [value: string | null | string[]]
	
	/**
	 * Emitted when the select is touched/untouched
	 */
	touched: [value: boolean]
	
	/**
	 * Emitted when select gains focus
	 */
	focus: [event: FocusEvent]
	
	/**
	 * Emitted when select loses focus
	 */
	blur: [event: FocusEvent]
}
