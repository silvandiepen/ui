<template>
  <div :class="bemm()">
    <label v-if="props.label" :class="bemm('label')">
      {{ props.label }}
    </label>
    <span v-if="props.instructions" :class="bemm('description')">
      {{ props.instructions }}
    </span>
    <div :class="bemm('controls')">
      <div :class="bemm('column',  {
				'day': true,
				'active': dayOptionsActive,
				'inactive': !dayOptionsActive,
			})">
        <div  :class="bemm('options')">
          <InputText
            v-model="daySearch"
            type="text"
            :class="bemm('input')"
            placeholder="Day"
            :reset="true"
            @focus="dayOptionsActive = true"
            @change="handleDayInput"
            @reset="handleResetDay"
          />
          <ul :class="bemm('option-list')" v-if="dayOptionsActive">
            <li
              v-for="day in filteredDays"
              :key="day.value"
              :class="
                bemm('option', {
                  active: day.value === dayValue,
                })
              "
              @click="selectDay(day)"
            >
              {{ day.label }}
            </li>
          </ul>
        </div>
      </div>
      <div :class="bemm('column', {
				'month': true,
				'active': monthOptionsActive,
				'inactive': !monthOptionsActive,
			})">
        <div :class="bemm('options')">
          <InputText
            v-model="monthSearch"
            type="text"
            :class="bemm('input')"
            placeholder="Month"
            :reset="true"
            @focus="monthOptionsActive = true"
            @change="handleMonthInput"
            @reset="handleResetMonth"
          />
          <ul :class="bemm('option-list')"  v-if="monthOptionsActive" >
            <li
              v-for="month in filteredMonths"
              :key="month.value"
              :class="
                bemm('option', {
                  active: month.value === monthValue,
                })
              "
              @click="selectMonth(month)"
            >
              {{ month.label }}
            </li>
          </ul>
        </div>
      </div>
      <div :class="bemm('column', {
				'year': true,
				'active': yearOptionsActive,
				'inactive': !yearOptionsActive,
			})">
        <div  :class="bemm('options')">
          <InputText
            v-model="yearSearch"
            type="text"
            :class="bemm('input')"
            placeholder="Year"
            :reset="true"
            @focus="yearOptionsActive = true"
            @change="handleYearInput"
            @reset="handleResetYear"
          />
          <ul :class="bemm('option-list')" v-if="yearOptionsActive">
            <li
              v-for="year in filteredYears"
              :key="year.value"
              :class="bemm('option', { active: year.value === yearValue })"
              @click="selectYear(year)"
            >
              {{ year.label }}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div v-if="props.error.length" :class="bemm('errors')">
      <div v-for="err in props.error" :key="err" :class="bemm('error')">
        {{ err }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from "vue";
import { ref, computed, watch, shallowRef } from "vue";
import InputText from "../InputText/InputText.vue";
import { useBemm } from "bemm";
import type { SelectOption } from "./InputBirthday.model";
import {
  createDayOptions,
  createMonthNames,
  createMonthOptions,
  createYearOptions,
  filterOptionsBySearch,
  getConstrainedDayOptions,
  getConstrainedMonthOptions,
  getConstrainedYearOptions,
  optionExists,
} from "./InputBirthday.utils";

const bemm = useBemm("input-birthday", {
	includeBaseClass: true,
});

const props = defineProps({
  label: {
    type: String,
    default: "",
  },
  modelValue: {
    type: String,
    default: "",
  },
  value: {
    type: String,
    default: "",
  },
  locale: {
    type: String,
    default: "en-US",
  },
  instructions: {
    type: String,
    default: "",
  },
  error: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
});

const emit = defineEmits(["update:modelValue", "input", "reset"]);

const yearValue = ref<string | null>(null);
const monthValue = ref<string | null>(null);
const dayValue = ref<string | null>(null);

const yearSearch = ref("");
const monthSearch = ref("");
const daySearch = ref("");

// Get localized month names using Intl

const monthNames = ref<string[]>([]);

const yearOptions = shallowRef<SelectOption[]>([]);
const yearOptionsActive = ref(!props.modelValue && !props.value);

const monthOptions = shallowRef<SelectOption[]>([]);
const monthOptionsActive = ref(!props.modelValue && !props.value);

const dayOptions = shallowRef<SelectOption[]>([]);
const dayOptionsActive = ref(!props.modelValue && !props.value);

const selectedYear = computed<number | null>(() => {
  if (!yearValue.value) return null;
  const year = Number(yearValue.value);
  return Number.isNaN(year) ? null : year;
});

const selectedMonth = computed<number | null>(() => {
  if (!monthValue.value) return null;
  const month = Number(monthValue.value);
  return Number.isNaN(month) ? null : month;
});

const selectedDay = computed<number | null>(() => {
  if (!dayValue.value) return null;
  const day = Number(dayValue.value);
  return Number.isNaN(day) ? null : day;
});

const constrainedYearOptions = computed<SelectOption[]>(() => {
  return getConstrainedYearOptions(yearOptions.value, {
    year: selectedYear.value,
    month: selectedMonth.value,
    day: selectedDay.value,
  });
});

const constrainedMonthOptions = computed<SelectOption[]>(() => {
  return getConstrainedMonthOptions(monthOptions.value, {
    year: selectedYear.value,
    month: selectedMonth.value,
    day: selectedDay.value,
  });
});

const constrainedDayOptions = computed<SelectOption[]>(() => {
  return getConstrainedDayOptions(dayOptions.value, {
    year: selectedYear.value,
    month: selectedMonth.value,
    day: selectedDay.value,
  });
});

const filteredYears = computed<SelectOption[]>(() => {
  return filterOptionsBySearch(constrainedYearOptions.value, yearSearch.value);
});

const filteredMonths = computed<SelectOption[]>(() => {
  return filterOptionsBySearch(constrainedMonthOptions.value, monthSearch.value);
});

const filteredDays = computed<SelectOption[]>(() => {
  return filterOptionsBySearch(constrainedDayOptions.value, daySearch.value);
});

// Computed date string in YYYY-MM-DD format
const dateString = computed(() => {
  if (!yearValue.value || !monthValue.value || !dayValue.value) return "";

  const year = yearValue.value.padStart(4, "0");
  const month = monthValue.value.padStart(2, "0");
  const day = dayValue.value.padStart(2, "0");

  return `${year}-${month}-${day}`;
});

let lastEmittedDate = "";

watch(dateString, (newValue) => {
  if (newValue !== lastEmittedDate) {
    lastEmittedDate = newValue;
    emit("update:modelValue", newValue);
    emit("input", newValue);
  }
});

watch(
  [constrainedYearOptions, constrainedMonthOptions, constrainedDayOptions],
  () => {
    if (yearValue.value && !optionExists(constrainedYearOptions.value, yearValue.value)) {
      yearValue.value = null;
      yearSearch.value = "";
      yearOptionsActive.value = true;
    }

    if (monthValue.value && !optionExists(constrainedMonthOptions.value, monthValue.value)) {
      monthValue.value = null;
      monthSearch.value = "";
      monthOptionsActive.value = true;
    }

    if (dayValue.value && !optionExists(constrainedDayOptions.value, dayValue.value)) {
      dayValue.value = null;
      daySearch.value = "";
      dayOptionsActive.value = true;
    }
  },
  { immediate: true }
);

const handleResetDay = () => {
  dayValue.value = null;
  daySearch.value = "";
  dayOptionsActive.value = true;
};

const handleResetMonth = () => {
  monthValue.value = null;
  monthSearch.value = "";
  monthOptionsActive.value = true;
};

const handleResetYear = () => {
  yearValue.value = null;
  yearSearch.value = "";
  yearOptionsActive.value = true;
};

// Watch for external value changes
watch(
  () => props.modelValue || props.value,
  (newValue) => {
    const date = new Date(newValue);
    if (isNaN(date.getTime())) {
      dayOptionsActive.value = true;
      monthOptionsActive.value = true;
      yearOptionsActive.value = true;
      return;
    }

    yearValue.value = date.getFullYear().toString();
    monthValue.value = (date.getMonth() + 1).toString();
    dayValue.value = date.getDate().toString();

    yearSearch.value = yearValue.value;
    monthSearch.value = monthNames.value[date.getMonth()] || "";
    daySearch.value = dayValue.value;

    dayOptionsActive.value = false;
    monthOptionsActive.value = false;
    yearOptionsActive.value = false;
  },
  { immediate: true }
);

const handleYearInput = () => {
  const matches = filteredYears.value;
  if (matches.length === 1) {
    const match = matches[0] as SelectOption;
    selectYear(match);
    yearOptionsActive.value = false;
  }
};

const handleMonthInput = () => {
  const matches = filteredMonths.value;
  if (matches.length === 1) {
    const match = matches[0] as SelectOption;
    selectMonth(match);
    monthOptionsActive.value = false;
  }
};

const handleDayInput = () => {
  const matches = filteredDays.value;
  if (matches.length === 1) {
    const match = matches[0] as SelectOption;
    selectDay(match);
    dayOptionsActive.value = false;
  }
};

const selectYear = (year: SelectOption) => {
  yearOptionsActive.value = false;
  yearValue.value = year.value;
  yearSearch.value = year.label;
};

const selectMonth = (month: SelectOption) => {
  monthOptionsActive.value = false;
  monthValue.value = month.value;
  monthSearch.value = month.label;
};

const selectDay = (day: SelectOption) => {
  dayOptionsActive.value = false;
  dayValue.value = day.value;
  daySearch.value = day.label;
};

const initOptions = () => {
  monthNames.value = createMonthNames(props.locale);
  yearOptions.value = createYearOptions(new Date().getFullYear());
  monthOptions.value = createMonthOptions(monthNames.value);
  dayOptions.value = createDayOptions();
};

initOptions();
</script>

<style lang="scss">
@use '../Form/Form.scss' as form;
@use '../../../styles/mixins' as m;

.input-birthday {
	$b: &;
  @include form.inputBase();

  @include m.component-props((
    'option-font-size': '0.875em',
    'options-max-height': '10em',
  ), 'input-birthday');

  &__controls {
    display: flex;
    justify-content: space-between;
    gap: var(--space-s);
    align-items: flex-start;
  }

  &__column {
    flex: 1;

		&--active #{$b}__options{
				// border: 1px solid red;
			}
		&--inactive #{$b}__options{
			padding: 0;
			overflow: visible;
			}
  }

	&__control{
		position: sticky;
		top: 0;
	}

  &__input {
    width: 100%;
    padding: 0;
    border: none;
    background: transparent;
    color: inherit;
    font: inherit;
		position: sticky;
		top: 0;

    --sizing: 0.8;

    &:focus {
      outline: none;
    }
  }

  &__options {
    width: 100%;
    height: fit-content;
    max-height: var(--int-input-birthday-options-max-height);
    border: none;
		scrollbar-width: thin;
    scrollbar-color: var(--color-primary) transparent;
		position: relative;
    border-radius: var(--border-radius);
    background-color: var(--color-background);

		padding: var(--space-xs);

      overflow: auto;


  }

  &__option-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
  }

  &__option {
    padding: var(--space-xs);
    font-size: var(--int-input-birthday-option-font-size);
    cursor: pointer;
		border-radius: var(--border-radius);

    &:hover {
      background-color: var(--color-accent);
    }

    &--active {
      background-color: color-mix(in srgb, var(--color-primary), transparent 50%);

      &:hover {
        background-color: color-mix(in srgb, var(--color-primary), transparent 75%);
      }
    }
  }
}
</style>
