<template>
  <InputBase
    :value="displayValue"
    :block="block"
    :label="label"
    :placeholder="placeholder"
    :description="description"
    :instructions="instructions"
    :disabled="disabled"
    :error="error"
    :size="size"
    type="text"
    :controls="false"
    :reset="false"
  >
    <template #control="{ id, disabled: controlDisabled, placeholder: templatePlaceholder }">
      <Popover
        v-model="isDatePickerOpen"
        :class="bemm('popover')"
        :disabled="controlDisabled"
        placement="bottom"
        :width="popoverWidth"
        :close-on-content-click="false"
      >
        <template #trigger>
          <div :class="bemm('trigger')">
            <input
              :id="id"
              ref="control"
              :value="displayValue"
              :class="bemm('control')"
              :placeholder="templatePlaceholder"
              type="text"
              :disabled="controlDisabled"
              readonly
            />

            <button
              type="button"
              :class="bemm('calendar-button')"
              :disabled="controlDisabled"
              aria-label="Open calendar"
            >
              <Icon :name="Icons.UI_CALENDAR" />
            </button>
          </div>
        </template>

        <DatePicker
          :model-value="selectedDateValue"
          :locale="resolvedOptions.locale"
          :available-dates="resolvedAvailableDates"
          :blocked-dates="resolvedOptions.blockedDates"
          :blocked-ranges="resolvedOptions.blockedRanges"
          :min-date="resolvedOptions.minDate"
          :max-date="resolvedOptions.maxDate"
          :selection-mode="resolvedOptions.selectionMode"
          :action-buttons="resolvedOptions.actionButtons"
          :navigate-to-first-available-date="resolvedOptions.navigateToFirstAvailableDate"
          :months="months"
          @update:model-value="handleDateSelect"
        />
      </Popover>
    </template>
  </InputBase>
</template>

<script lang="ts" setup>
import { computed, ref, watch, type PropType } from 'vue'
import { useBemm } from 'bemm'

import { DatePicker } from '../DatePicker'
import {
  DefaultDatePickerOptions,
  type DatePickerModelValue,
  type DatePickerOptions,
} from '../DatePicker/DatePicker.model'
import InputBase from '../Form/InputBase.vue'
import { Popover } from '../../Popover'
import Icon from '../../Icon/Icon.vue'
import { Icons, Size } from '../../../types'

const block = 'input-calendar'
const bemm = useBemm(block)

const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  instructions: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  error: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  dateFormat: {
    type: String,
    default: 'YYYY-MM-DD',
  },
  size: {
    type: String as PropType<Size>,
    default: Size.MEDIUM,
  },
  availableDates: {
    type: Array as PropType<([Date, Date] | Date)[]>,
    default: () => [],
  },
  options: {
    type: Object as PropType<Partial<DatePickerOptions>>,
    default: () => ({}),
  },
  months: {
    type: Number as PropType<1 | 2>,
    default: 1,
    validator: (value: number) => value === 1 || value === 2,
  },
})

type InputCalendarValue =
  | Date
  | Date[]
  | {
      start: Date | null
      end: Date | null
    }
  | null

const modelValue = defineModel<InputCalendarValue>()

const emit = defineEmits<{
  'update:modelValue': [value: InputCalendarValue]
  change: [value: InputCalendarValue]
}>()

const control = ref<HTMLInputElement | null>(null)
const isDatePickerOpen = ref(false)
const internalValue = ref<InputCalendarValue>(modelValue.value ?? null)

const resolvedOptions = computed(() => ({ ...DefaultDatePickerOptions, ...props.options }))
const resolvedAvailableDates = computed(() =>
  props.availableDates.length ? props.availableDates : resolvedOptions.value.availableDates
)

const popoverWidth = computed(() => props.months === 2 ? '38rem' : '18.5rem')

const displayValue = computed(() => {
  if (!internalValue.value) return ''

  if (Array.isArray(internalValue.value)) {
    if (!internalValue.value.length) return ''

    if (internalValue.value.length <= 2) {
      return internalValue.value.map((date) => formatDate(date, props.dateFormat)).join(', ')
    }

    return `${internalValue.value.length} dates selected`
  }

  if (typeof internalValue.value === 'object' && !(internalValue.value instanceof Date)) {
    const start = internalValue.value.start ? formatDate(internalValue.value.start, props.dateFormat) : ''
    const end = internalValue.value.end ? formatDate(internalValue.value.end, props.dateFormat) : ''

    if (!start && !end) return ''
    if (start && !end) return `${start} -`
    if (!start && end) return `- ${end}`
    return `${start} - ${end}`
  }

  return formatDate(internalValue.value, props.dateFormat)
})

const selectedDateValue = computed<DatePickerModelValue>(() => {
  if (!internalValue.value) return ''

  if (Array.isArray(internalValue.value)) {
    return internalValue.value.map((date) => toIsoDate(date))
  }

  if (typeof internalValue.value === 'object' && !(internalValue.value instanceof Date)) {
    return {
      start: internalValue.value.start ? toIsoDate(internalValue.value.start) : '',
      end: internalValue.value.end ? toIsoDate(internalValue.value.end) : '',
    }
  }

  return toIsoDate(internalValue.value)
})

const handleDateSelect = (value: DatePickerModelValue) => {
  if (!value || (Array.isArray(value) && value.length === 0)) {
    internalValue.value = null
    emit('update:modelValue', null)
    emit('change', null)
    isDatePickerOpen.value = false
    return
  }

  if (typeof value === 'string') {
    const selectedDate = new Date(`${value}T00:00:00`)
    internalValue.value = selectedDate
    emit('update:modelValue', selectedDate)
    emit('change', selectedDate)
    isDatePickerOpen.value = false
    return
  }

  if (Array.isArray(value)) {
    const selectedDates = value.map((iso) => new Date(`${iso}T00:00:00`))
    internalValue.value = selectedDates
    emit('update:modelValue', selectedDates)
    emit('change', selectedDates)
    isDatePickerOpen.value = false
    return
  }

  const rangeValue = {
    start: value.start ? new Date(`${value.start}T00:00:00`) : null,
    end: value.end ? new Date(`${value.end}T00:00:00`) : null,
  }

  internalValue.value = rangeValue
  emit('update:modelValue', rangeValue)
  emit('change', rangeValue)
  isDatePickerOpen.value = false
}

watch(
  () => modelValue.value,
  (newValue) => {
    internalValue.value = newValue ?? null
  }
)

const toIsoDate = (date: Date) => {
  const adjusted = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return adjusted.toISOString().split('T')[0]
}

const formatDate = (date: Date, format: string) => {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const normalized = format.toUpperCase()

  if (normalized === 'YYYY-MM-DD') return `${yyyy}-${mm}-${dd}`
  if (normalized === 'YYYY-DD-MM') return `${yyyy}-${dd}-${mm}`
  if (normalized === 'DD-MM-YYYY') return `${dd}-${mm}-${yyyy}`
  if (normalized === 'MM-DD-YYYY') return `${mm}-${dd}-${yyyy}`

  return date.toLocaleDateString()
}
</script>

<style lang="scss">
@use '../Form/Form.scss' as form;

.input-calendar {
  @include form.inputBase();

  &__popover.ui-popover,
  &__popover .ui-popover__trigger,
  &__popover .ui-popover__trigger > * {
    width: 100%;
    display: block;
  }

  &__trigger {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
  }

  &__control {
    width: 100%;
    padding-right: calc(var(--space) * 2.7);
    cursor: pointer;
    text-overflow: ellipsis;
  }

  &__calendar-button {
    position: absolute;
    right: calc(var(--space) * 0.45);
    top: 50%;
    transform: translateY(-50%);
    z-index: 4;
    border: 0;
    background: transparent;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: color-mix(in srgb, var(--color-foreground), transparent 24%);
    padding: calc(var(--space) * 0.25);
    border-radius: 999px;
    transition: background 140ms ease, color 140ms ease;

    &:hover {
      color: currentColor;
      background: color-mix(in srgb, var(--color-foreground), transparent 92%);
    }

    &:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: 1px;
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }
}
</style>
