<template>
	<div :class="[bemm(), bemm('', `months-${months}`)]">
		<div :class="bemm('header')">
			<Button
				:class="bemm('nav-button')"
				:icon="Icons.ARROW_LEFT"
				:iconOnly="true"
				:size="ButtonSize.SMALL"
				:variant="ButtonVariant.GHOST"
				@click="previousMonth"
			/>
			<div :class="bemm('header-selectors')">
				<label :class="bemm('selector-label')">
					<span :class="bemm('selector-caption')">Month</span>
					<select :class="bemm('selector')" :value="currentMonthIndex" @change="onMonthChange">
						<option v-for="monthOption in monthOptions" :key="monthOption.value" :value="monthOption.value">
							{{ monthOption.label }}
						</option>
					</select>
				</label>

				<label :class="bemm('selector-label')">
					<span :class="bemm('selector-caption')">Year</span>
					<select :class="bemm('selector')" :value="currentYear" @change="onYearChange">
						<option v-for="year in yearOptions" :key="year" :value="year">
							{{ year }}
						</option>
					</select>
				</label>
			</div>
			<Button
				:class="bemm('nav-button')"
				:icon="Icons.ARROW_RIGHT"
				:iconOnly="true"
				:size="ButtonSize.SMALL"
				:variant="ButtonVariant.GHOST"
				@click="nextMonth"
			/>
		</div>

		<div :class="bemm('grid')">
			<div v-for="monthOffset in monthOffsets" :key="monthOffset" :class="bemm('month')">
				<div v-if="months === 2" :class="bemm('month-label')">
					{{ getMonthLabel(monthOffset) }}
				</div>
				<div :class="bemm('weekdays')">
					<div
						v-for="day in weekDays"
						:key="day"
						:class="bemm('weekday')"
					>
						{{ day }}
					</div>
				</div>
				<div :class="bemm('days')">
					<div
						v-for="{ date, isCurrentMonth, isToday: isTodayValue, isSelected, isAvailable, isInRange, isRangeStart, isRangeEnd } in getCalendarDays(monthOffset)"
						:key="date.toISOString()"
						:class="[
							bemm('day', {
								'current-month': isCurrentMonth,
								'today': isTodayValue,
								'selected': isSelected,
								'unavailable': !isAvailable,
								'in-range': isInRange,
								'range-start': isRangeStart,
								'range-end': isRangeEnd,
							}),
						]"
						@click="selectDate(date)"
					>
						{{ date.getDate() }}
					</div>
				</div>
			</div>
		</div>

		<div v-if="actionButtons.length" :class="bemm('actions')">
			<Button
				v-for="actionButton in actionButtons"
				:key="actionButton.id"
				:class="bemm('action-button')"
				:size="ButtonSize.SMALL"
				:variant="ButtonVariant.GHOST"
				@click="runAction(actionButton)"
			>
				{{ actionButton.label }}
			</Button>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, type PropType } from 'vue';
import { useBemm } from 'bemm';
import {
	findFirstAvailableDate,
	getWeekDays,
	isAvailableDate,
	isDateBlocked,
	isDateInRanges,
	isDateWithinBounds,
	isSelectedDate,
	isToday,
	toDateKey,
} from './DatePicker.utils';
import type {
	DatePickerActionButton,
	DatePickerModelValue,
	DatePickerOptions,
	DatePickerSelectionMode,
	DatePickerMonths,
} from './DatePicker.model';
import { ButtonSize, ButtonVariant } from '../../Button/Button.model';
import { Icons } from '../../../types';
import Button from '../../Button/Button.vue';

interface DayInfo {
	date: Date;
	isCurrentMonth: boolean;
	isToday: boolean;
	isSelected: boolean;
	isAvailable: boolean;
	isInRange: boolean;
	isRangeStart: boolean;
	isRangeEnd: boolean;
}

const block = 'date-picker';
const bemm = useBemm(block, { includeBaseClass: true });

const props = withDefaults(
	defineProps<{
		modelValue?: DatePickerModelValue;
		locale?: string;
		availableDates?: (Date | [Date, Date])[];
		blockedDates?: Date[];
		blockedRanges?: [Date, Date][];
		minDate?: Date;
		maxDate?: Date;
		selectionMode?: DatePickerSelectionMode;
		actionButtons?: DatePickerActionButton[];
		navigateToFirstAvailableDate?: boolean;
		months?: DatePickerMonths;
	}>(),
	{
		modelValue: null,
		locale: 'en-US',
		availableDates: () => [],
		blockedDates: () => [],
		blockedRanges: () => [],
		minDate: undefined,
		maxDate: undefined,
		selectionMode: 'single',
		actionButtons: () => [],
		navigateToFirstAvailableDate: true,
		months: 1,
	}
);

const emit = defineEmits<{
	'update:modelValue': [value: DatePickerModelValue];
	change: [value: DatePickerModelValue];
}>();

const resolveInitialCurrentDate = (): Date => {
	if (!props.modelValue) {
		return new Date();
	}

	if (typeof props.modelValue === 'string') {
		return new Date(props.modelValue);
	}

	if (Array.isArray(props.modelValue)) {
		if (props.modelValue[0]) {
			return new Date(props.modelValue[0]);
		}
		return new Date();
	}

	const candidate = props.modelValue.start || props.modelValue.end;
	return candidate ? new Date(candidate) : new Date();
};

const currentDate = ref(resolveInitialCurrentDate());
const weekDays = ref(getWeekDays({ locale: props.locale }));

onMounted(() => {
	if (props.availableDates.length > 0 && props.navigateToFirstAvailableDate) {
		const firstAvailable = findFirstAvailableDate(props.availableDates, new Date());
		if (firstAvailable) {
			currentDate.value = firstAvailable;
		}
	}
});

const selectedDate = computed<Date | null>(() => {
	if (!props.modelValue || Array.isArray(props.modelValue) || typeof props.modelValue === 'object') {
		return null;
	}

	return new Date(props.modelValue);
});

const selectedDates = computed<Date[]>(() => {
	if (!Array.isArray(props.modelValue)) {
		return [];
	}
	return props.modelValue.map((value) => new Date(value));
});

const selectedRange = computed<{ start: Date | null; end: Date | null }>(() => {
	if (!props.modelValue || typeof props.modelValue !== 'object' || Array.isArray(props.modelValue)) {
		return { start: null, end: null };
	}

	return {
		start: props.modelValue.start ? new Date(props.modelValue.start) : null,
		end: props.modelValue.end ? new Date(props.modelValue.end) : null,
	};
});

const actionButtons = computed(() => props.actionButtons || []);

const currentMonthYear = computed(() => {
	return currentDate.value.toLocaleDateString(props.locale, {
		month: 'long',
		year: 'numeric',
	});
});

const currentMonthIndex = computed(() => currentDate.value.getMonth());
const currentYear = computed(() => currentDate.value.getFullYear());

const monthOptions = computed(() => {
	return Array.from({ length: 12 }, (_, monthIndex) => ({
		value: monthIndex,
		label: new Date(2024, monthIndex, 1).toLocaleDateString(props.locale, { month: 'long' }),
	}));
});

const yearOptions = computed(() => {
	const center = currentDate.value.getFullYear();
	return Array.from({ length: 121 }, (_, index) => center - 60 + index);
});

const monthOffsets = computed(() => Array.from({ length: props.months }, (_, i) => i));

const getMonthLabel = (offset: number): string => {
	const d = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + offset, 1);
	return d.toLocaleDateString(props.locale, { month: 'long', year: 'numeric' });
};

const getCalendarDays = (monthOffset: number): DayInfo[] => {
	const year = currentDate.value.getFullYear();
	const month = currentDate.value.getMonth() + monthOffset;
	const firstDay = new Date(year, month, 1);
	const lastDay = new Date(year, month + 1, 0);
	const days: DayInfo[] = [];

	const prevMonthDays = firstDay.getDay();
	for (let i = prevMonthDays - 1; i >= 0; i--) {
		const date = new Date(year, month, -i);
		const dayIsAvailable = isDaySelectable(date);
		days.push({
			date,
			isCurrentMonth: false,
			isToday: isToday(date),
			isSelected: isDaySelected(date),
			isAvailable: dayIsAvailable,
			isInRange: isDayInRange(date),
			isRangeStart: isRangeBoundary(date, 'start'),
			isRangeEnd: isRangeBoundary(date, 'end'),
		});
	}

	for (let i = 1; i <= lastDay.getDate(); i++) {
		const date = new Date(year, month, i);
		const dayIsAvailable = isDaySelectable(date);
		days.push({
			date,
			isCurrentMonth: true,
			isToday: isToday(date),
			isSelected: isDaySelected(date),
			isAvailable: dayIsAvailable,
			isInRange: isDayInRange(date),
			isRangeStart: isRangeBoundary(date, 'start'),
			isRangeEnd: isRangeBoundary(date, 'end'),
		});
	}

	const remainingDays = 42 - days.length;
	for (let i = 1; i <= remainingDays; i++) {
		const date = new Date(year, month + 1, i);
		const dayIsAvailable = isDaySelectable(date);
		days.push({
			date,
			isCurrentMonth: false,
			isToday: isToday(date),
			isSelected: isDaySelected(date),
			isAvailable: dayIsAvailable,
			isInRange: isDayInRange(date),
			isRangeStart: isRangeBoundary(date, 'start'),
			isRangeEnd: isRangeBoundary(date, 'end'),
		});
	}

	return days;
};

const previousMonth = (): void => {
	currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1);
};

const nextMonth = (): void => {
	currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1);
};

const onMonthChange = (event: Event) => {
	const nextMonth = Number((event.target as HTMLSelectElement).value);
	currentDate.value = new Date(currentDate.value.getFullYear(), nextMonth, 1);
};

const onYearChange = (event: Event) => {
	const nextYear = Number((event.target as HTMLSelectElement).value);
	currentDate.value = new Date(nextYear, currentDate.value.getMonth(), 1);
};

const selectDate = (date: Date): void => {
	if (!isDaySelectable(date)) {
		return;
	}

	const formattedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split('T')[0];

	if (props.selectionMode === 'multiple') {
		const current = [...(Array.isArray(props.modelValue) ? props.modelValue : [])];
		const index = current.findIndex((value) => toDateKey(new Date(value)) === toDateKey(date));

		if (index >= 0) {
			current.splice(index, 1);
		} else {
			current.push(formattedDate);
		}

		emit('update:modelValue', current);
		emit('change', current);
		return;
	}

	if (props.selectionMode === 'range') {
		const currentRange =
			props.modelValue && typeof props.modelValue === 'object' && !Array.isArray(props.modelValue)
				? props.modelValue
				: { start: '', end: '' };

		const hasStart = Boolean(currentRange.start);
		const hasEnd = Boolean(currentRange.end);

		if (!hasStart || (hasStart && hasEnd)) {
			const nextRange = { start: formattedDate, end: '' };
			emit('update:modelValue', nextRange);
			emit('change', nextRange);
			return;
		}

		const startDate = new Date(`${currentRange.start}T00:00:00`);
		const endDate = new Date(`${formattedDate}T00:00:00`);
		if (endDate < startDate) {
			const swappedRange = { start: formattedDate, end: currentRange.start || '' };
			emit('update:modelValue', swappedRange);
			emit('change', swappedRange);
			return;
		}

		const nextRange = { start: currentRange.start || '', end: formattedDate };
		emit('update:modelValue', nextRange);
		emit('change', nextRange);
		return;
	}

	emit('update:modelValue', formattedDate);
	emit('change', formattedDate);
};

const emitValue = (value: DatePickerModelValue) => {
	emit('update:modelValue', value);
	emit('change', value);
};

const dateToIso = (date: Date) => {
	return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split('T')[0];
};

const applyDateForMode = (date: Date) => {
	const iso = dateToIso(date);
	currentDate.value = new Date(date.getFullYear(), date.getMonth(), 1);

	if (props.selectionMode === 'multiple') {
		emitValue([iso]);
		return;
	}

	if (props.selectionMode === 'range') {
		emitValue({ start: iso, end: iso });
		return;
	}

	emitValue(iso);
};

const runAction = (actionButton: DatePickerActionButton) => {
	if (actionButton.value !== undefined) {
		emitValue(actionButton.value);
		return;
	}

	if (actionButton.onClick) {
		const result = actionButton.onClick({
			currentDate: new Date(currentDate.value),
			selectionMode: props.selectionMode,
		});

		if (result instanceof Date) {
			applyDateForMode(result);
			return;
		}

		if (result !== undefined) {
			emitValue(result);
		}
		return;
	}

	switch (actionButton.action) {
		case 'today':
			applyDateForMode(new Date());
			break;
		case 'next-week': {
			const nextWeek = new Date();
			nextWeek.setDate(nextWeek.getDate() + 7);
			applyDateForMode(nextWeek);
			break;
		}
		case 'next-month': {
			const nextMonth = new Date();
			nextMonth.setMonth(nextMonth.getMonth() + 1);
			applyDateForMode(nextMonth);
			break;
		}
		case 'clear':
			if (props.selectionMode === 'multiple') {
				emitValue([]);
				return;
			}

			if (props.selectionMode === 'range') {
				emitValue({ start: '', end: '' });
				return;
			}

			emitValue('');
			break;
		default:
			break;
	}
};

function isDaySelectable(date: Date): boolean {
	const available = isAvailableDate(date, props.availableDates);
	const withinBounds = isDateWithinBounds(date, props.minDate, props.maxDate);
	const blocked = isDateBlocked(date, props.blockedDates, props.blockedRanges);
	return available && withinBounds && !blocked;
}

function isDaySelected(date: Date): boolean {
	if (props.selectionMode === 'multiple') {
		return selectedDates.value.some((selected) => isSelectedDate(date, selected));
	}

	if (props.selectionMode === 'range') {
		const start = selectedRange.value.start;
		const end = selectedRange.value.end;
		return Boolean((start && isSelectedDate(date, start)) || (end && isSelectedDate(date, end)));
	}

	return isSelectedDate(date, selectedDate.value);
}

function isDayInRange(date: Date): boolean {
	if (props.selectionMode !== 'range') {
		return false;
	}

	const { start, end } = selectedRange.value;
	if (!start || !end) {
		return false;
	}

	return isDateInRanges(date, [[start, end]]);
}

function isRangeBoundary(date: Date, boundary: 'start' | 'end'): boolean {
	if (props.selectionMode !== 'range') {
		return false;
	}

	const target = boundary === 'start' ? selectedRange.value.start : selectedRange.value.end;
	if (!target) {
		return false;
	}

	return isSelectedDate(date, target);
}
</script>

<style lang="scss">
.date-picker {
	background-color: var(--color-background);
	border-radius: var(--border-radius);
	padding: var(--space);

	&__header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--space-xs);
		padding: var(--space-xs) 0 var(--space-s);
		margin-bottom: var(--space-xs);
		border-bottom: 1px solid color-mix(in srgb, var(--color-foreground), transparent 88%);
	}

	&__month-label {
		font-weight: 600;
		font-size: 0.8em;
		text-align: center;
		padding-bottom: var(--space-xs);
		color: color-mix(in srgb, var(--color-foreground), transparent 30%);
	}

	&__grid {
		display: grid;
		gap: var(--space);
	}

	&--months-2 &__grid {
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space);
		border-collapse: collapse;
	}

	&--months-2 &__month + &__month {
		border-left: 1px solid color-mix(in srgb, var(--color-foreground), transparent 88%);
		padding-left: var(--space);
	}

	&__month {
		display: contents;

		.date-picker--months-2 & {
			display: flex;
			flex-direction: column;
		}
	}

	&__month-label {
		.date-picker--months-1 & {
			display: none;
		}
	}

	&__month-label {
		font-weight: 600;
		font-size: 0.8em;
		text-align: center;
		padding-bottom: var(--space-xs);
		color: color-mix(in srgb, var(--color-foreground), transparent 30%);
	}

	&__header-selectors {
		display: inline-flex;
		align-items: center;
		gap: var(--space-xs);
	}

	&__selector-label {
		display: grid;
		gap: 0.15rem;
	}

	&__selector-caption {
		font-size: 0.65rem;
		color: color-mix(in srgb, var(--color-foreground), transparent 40%);
		padding-left: 0.2rem;
	}

	&__selector {
		border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 82%);
		background: color-mix(in srgb, var(--color-background), var(--color-primary) 2%);
		border-radius: calc(var(--border-radius) * 0.7);
		padding: 0.25rem 0.45rem;
		font-size: 0.75rem;
		color: inherit;
		min-width: 6.75rem;
		cursor: pointer;

		&:focus-visible {
			outline: 2px solid color-mix(in srgb, var(--color-primary), transparent 25%);
			outline-offset: 1px;
		}
	}

	&__weekdays {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		text-align: center;
		opacity: 0.4;
		font-size: 0.7em;
		font-weight: 600;
		margin-bottom: var(--space-xs);
	}

	&__weekday {
		padding: var(--space-xs);
	}

	&__days {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: var(--space-xs);
	}

	&__day {
		aspect-ratio: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		border-radius: var(--border-radius);
		font-size: var(--font-size-s);
		transition: all var(--transition-duration) var(--transition-timing);
		opacity: 0.25;
		line-height: 2.5;

		&:hover {
			background: color-mix(in srgb, var(--color-primary), transparent 90%);
			box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary), transparent 58%) inset;
			transform: scale(1.04);
		}

		&--unavailable {
			opacity: 0.1;
			pointer-events: none;
		}

		&--current-month {
			color: var(--color-text);
			opacity: 1;
		}

		&--today {
			box-shadow: 0 0 2px 0 color-mix(in srgb, var(--color-secondary), var(--color-background) 25%) inset;
		}

		&--selected {
			background-color: var(--color-primary);
			color: var(--color-background);
			font-weight: bold;
			box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary), transparent 35%) inset;
		}

		&--in-range {
			background: color-mix(in srgb, var(--color-primary), transparent 86%);
			opacity: 1;
		}

		&--range-start,
		&--range-end {
			background-color: var(--color-primary);
			color: var(--color-background);
			font-weight: bold;
		}
	}

	&__actions {
		margin-top: var(--space-s);
		display: flex;
		gap: var(--space-xs);
		flex-wrap: wrap;
	}
}
</style>
