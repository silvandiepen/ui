import type { BirthdaySelection, SelectOption } from "./InputBirthday.model";

export const FALLBACK_LEAP_YEAR = 2000;
export const MIN_YEAR = 1900;

export const createMonthNames = (locale: string): string[] => {
  const formatter = new Intl.DateTimeFormat(locale, { month: "long" });
  return Array.from({ length: 12 }, (_, index) => formatter.format(new Date(2000, index, 1)));
};

export const createYearOptions = (maxYear: number, minYear: number = MIN_YEAR): SelectOption[] => {
  const years: SelectOption[] = [];
  for (let year = maxYear; year >= minYear; year -= 1) {
    years.push({
      label: year.toString(),
      value: year.toString(),
    });
  }
  return years;
};

export const createMonthOptions = (monthNames: string[]): SelectOption[] => {
  return Array.from({ length: 12 }, (_, index) => ({
    label: monthNames[index] || "",
    value: (index + 1).toString(),
  }));
};

export const createDayOptions = (): SelectOption[] => {
  return Array.from({ length: 31 }, (_, index) => ({
    label: (index + 1).toString(),
    value: (index + 1).toString(),
  }));
};

export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month, 0).getDate();
};

export const isValidDateSelection = (selection: BirthdaySelection): boolean => {
  const { year, month, day } = selection;
  if (!month || !day) return true;
  if (!year) {
    return day <= getDaysInMonth(FALLBACK_LEAP_YEAR, month);
  }
  return day <= getDaysInMonth(year, month);
};

export const getConstrainedYearOptions = (
  yearOptions: SelectOption[],
  selection: BirthdaySelection
): SelectOption[] => {
  return yearOptions.filter((year) =>
    isValidDateSelection({
      year: Number(year.value),
      month: selection.month,
      day: selection.day,
    })
  );
};

export const getConstrainedMonthOptions = (
  monthOptions: SelectOption[],
  selection: BirthdaySelection
): SelectOption[] => {
  return monthOptions.filter((month) =>
    isValidDateSelection({
      year: selection.year,
      month: Number(month.value),
      day: selection.day,
    })
  );
};

export const getConstrainedDayOptions = (
  dayOptions: SelectOption[],
  selection: BirthdaySelection
): SelectOption[] => {
  return dayOptions.filter((day) =>
    isValidDateSelection({
      year: selection.year,
      month: selection.month,
      day: Number(day.value),
    })
  );
};

export const filterOptionsBySearch = (options: SelectOption[], searchValue: string): SelectOption[] => {
  if (!searchValue) return options;
  const search = searchValue.toLowerCase();
  return options.filter((option) => option.label.toLowerCase().startsWith(search));
};

export const optionExists = (options: SelectOption[], value: string | null): boolean => {
  if (!value) return false;
  return options.some((option) => option.value === value);
};
