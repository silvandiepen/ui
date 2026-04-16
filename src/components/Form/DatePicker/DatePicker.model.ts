export type DatePickerSelectionMode = 'single' | 'multiple' | 'range'

export type DatePickerModelValue =
	| string
	| string[]
	| {
			start?: string;
			end?: string;
	  }
	| null

export interface DatePickerActionContext {
	currentDate: Date;
	selectionMode: DatePickerSelectionMode;
}

export interface DatePickerActionButton {
	id: string;
	label: string;
	action?: 'today' | 'next-week' | 'next-month' | 'clear';
	value?: DatePickerModelValue;
	onClick?: (context: DatePickerActionContext) => DatePickerModelValue | Date | null | void;
}

export type DatePickerMonths = 1 | 2

export interface DatePickerOptions {
	navigateToFirstAvailableDate: boolean;
	locale: string;
	dateFormat: string;
	availableDates: (Date | [Date, Date])[];
	blockedDates: Date[];
	blockedRanges: [Date, Date][];
	minDate?: Date;
	maxDate?: Date;
	selectionMode: DatePickerSelectionMode;
	actionButtons: DatePickerActionButton[];
	months: DatePickerMonths;
}

export const DefaultDatePickerOptions: DatePickerOptions = {
	navigateToFirstAvailableDate: true,
	locale: 'en-US',
	dateFormat: 'yyyy-MM-dd',
	availableDates: [],
	blockedDates: [],
	blockedRanges: [],
	minDate: undefined,
	maxDate: undefined,
	selectionMode: 'single',
	actionButtons: [],
	months: 1,
};
