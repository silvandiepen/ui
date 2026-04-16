import { describe, expect, it } from "vitest";
import {
  createDayOptions,
  createMonthNames,
  createMonthOptions,
  createYearOptions,
  getConstrainedDayOptions,
  getConstrainedMonthOptions,
  getConstrainedYearOptions,
  isValidDateSelection,
} from "./InputBirthday.utils";

const monthName = (month: number): string => {
  return new Intl.DateTimeFormat("en-US", { month: "long" }).format(new Date(2000, month - 1, 1));
};

const isLeapYear = (year: number): boolean => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

describe("InputBirthday utils", () => {
  it("limits day options when month is selected first", () => {
    const dayOptions = createDayOptions();

    const filteredDays = getConstrainedDayOptions(dayOptions, {
      year: null,
      month: 4,
      day: null,
    });

    const dayValues = filteredDays.map((day) => day.value);
    expect(dayValues).toContain("30");
    expect(dayValues).not.toContain("31");
  });

  it("limits month options to months with 31 days when day 31 is selected first", () => {
    const monthOptions = createMonthOptions(createMonthNames("en-US"));

    const filteredMonths = getConstrainedMonthOptions(monthOptions, {
      year: null,
      month: null,
      day: 31,
    });

    expect(filteredMonths.map((month) => month.label)).toEqual([1, 3, 5, 7, 8, 10, 12].map(monthName));
  });

  it("limits year options to leap years for February 29", () => {
    const yearOptions = createYearOptions(2026);

    const filteredYears = getConstrainedYearOptions(yearOptions, {
      year: null,
      month: 2,
      day: 29,
    });

    const years = filteredYears.map((year) => Number(year.value));
    expect(years).toContain(2024);
    expect(years).not.toContain(2023);
    expect(years.every((year) => isLeapYear(year))).toBe(true);
  });

  it("validates impossible dates as invalid", () => {
    expect(
      isValidDateSelection({
        year: 2023,
        month: 2,
        day: 29,
      })
    ).toBe(false);

    expect(
      isValidDateSelection({
        year: 2024,
        month: 2,
        day: 29,
      })
    ).toBe(true);
  });
});
