export const toDateKey = (date: Date): string => {
	const normalized = new Date(date.getFullYear(), date.getMonth(), date.getDate());
	return normalized.toISOString().split('T')[0];
};

export const isToday = (date: Date): boolean => {
	const today = new Date();
	return date.toDateString() === today.toDateString();
};

export const isSelectedDate = (date: Date, selectedDate: Date | null): boolean => {
	if (!selectedDate) return false;
	return selectedDate.toDateString() === date.toDateString();
};

export const isAvailableDate = (date: Date, availableDates: (Date | [Date, Date])[]): boolean => {
	if (!availableDates.length) {
		return true;
	}

	return availableDates.some((available) => {
		// If available is a single date
		if (available instanceof Date) {
			return date.toDateString() === available.toDateString();
		}
		// If available is a date range [start, end]
		const [start, end] = available;
		return date >= start && date <= end;
	});
};

export const isDateInRanges = (date: Date, ranges: [Date, Date][]): boolean => {
	const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());

	return ranges.some(([start, end]) => {
		const normalizedStart = new Date(start.getFullYear(), start.getMonth(), start.getDate());
		const normalizedEnd = new Date(end.getFullYear(), end.getMonth(), end.getDate());
		return target >= normalizedStart && target <= normalizedEnd;
	});
};

export const isDateBlocked = (
	date: Date,
	blockedDates: Date[] = [],
	blockedRanges: [Date, Date][] = [],
): boolean => {
	const blockedByDate = blockedDates.some((blockedDate) => toDateKey(blockedDate) === toDateKey(date));
	if (blockedByDate) return true;

	return isDateInRanges(date, blockedRanges);
};

export const isDateWithinBounds = (date: Date, minDate?: Date, maxDate?: Date): boolean => {
	const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());

	if (minDate) {
		const normalizedMin = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
		if (target < normalizedMin) {
			return false;
		}
	}

	if (maxDate) {
		const normalizedMax = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
		if (target > normalizedMax) {
			return false;
		}
	}

	return true;
};

export const getWeekDays = ({
	locale = 'en-US',
	format = 'short',
}: {
	locale?: string;
	format?: 'short' | 'long';
}): string[] => {
	const formatter = new Intl.DateTimeFormat(locale, { weekday: format });
	const weekDays = [];
	for (let day = 0; day < 7; day++) {
		const date = new Date(Date.UTC(2021, 5, day));
		weekDays.push(formatter.format(date));
	}
	return weekDays;
};

export const findFirstAvailableDate = (dates: (Date | [Date, Date])[], after: Date): Date | null => {
	return dates.reduce((earliest: Date | null, dateOrRange) => {
		const checkDate = dateOrRange instanceof Date ? dateOrRange : dateOrRange[0];
		if (checkDate >= after && (!earliest || checkDate < earliest)) {
			return checkDate;
		}
		return earliest;
	}, null);
};
