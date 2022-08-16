<script lang="ts" setup>
import { ref, computed, watch, nextTick } from 'vue'
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/vue/solid'
import parseDate from 'date-fns/parse'
import formatDate from 'date-fns/format'
import startOfWeek from 'date-fns/startOfWeek'
import startOfMonth from 'date-fns/startOfMonth'
import addDays from 'date-fns/addDays'
import subDays from 'date-fns/subDays'
import addMonths from 'date-fns/addMonths'
import subMonths from 'date-fns/subMonths'
import addYears from 'date-fns/addYears'
import subYears from 'date-fns/subYears'
import {
  getDecade,
  isSameDay,
  getNextCompId,
  getWeekdayName,
  getMonthName,
  machineFormat
} from './calendarUtil'

const props = withDefaults(
  defineProps<{
    modelValue: string
    format?: string
  }>(),
  { format: 'yyyy-MM-dd' }
)

const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const today = new Date()
const currentDate = ref(new Date()) // for current month display
const selectedDate = ref(undefined as undefined | Date) // for final selection

const idStart = getNextCompId()

const displayMode = ref('day' as 'day' | 'month' | 'year')
const prevBtnText = computed(() => {
  switch (displayMode.value) {
    case 'day':
      return 'Previous month'
    case 'month':
      return 'Previous year'
    case 'year':
      return 'Prevous decade'
  }
  return ''
})
const nextBtnText = computed(() => {
  switch (displayMode.value) {
    case 'day':
      return 'Next month'
    case 'month':
      return 'Next year'
    case 'year':
      return 'Next decade'
  }
  return ''
})
const headerTitleText = computed(() => {
  switch (displayMode.value) {
    case 'day':
      return `${currentMonth.value} ${currentYear.value}`
    case 'month':
      return currentYear.value
    case 'year':
      const decade = getDecade(currentDate.value)
      return `${decade} - ${decade + 9}`
  }
  return ''
})
const headerToolTip = computed(() => {
  switch (displayMode.value) {
    case 'day':
      return 'Change month'
    case 'month':
      return 'Change year'
  }
})

const isAtMinDate = computed(() => {
  switch (displayMode.value) {
    case 'day':
      return (
        currentDate.value.getFullYear() < 2 && currentDate.value.getMonth() < 1
      )
    case 'month':
      return currentDate.value.getFullYear() < 2
    case 'year':
      return currentDate.value.getFullYear() < 10
  }
  return false
})
const isAtMaxDate = computed(() => {
  switch (displayMode.value) {
    case 'day':
      return (
        currentDate.value.getFullYear() >= 9999 &&
        currentDate.value.getMonth() >= 11
      )
    case 'month':
      return currentDate.value.getFullYear() >= 9999
    case 'year':
      return currentDate.value.getFullYear() >= 9990
  }
  return false
})

const daysOfWeek = computed(() => {
  const days = [] as string[]
  let startDate = startOfWeek(currentDate.value)
  for (let i = 0; i < 7; i++) {
    days.push(getWeekdayName(addDays(startDate, i), true))
  }
  return days
})

const currentYear = computed(() => {
  return currentDate.value.getFullYear()
})
const currentMonth = computed(() => {
  return getMonthName(currentDate.value, false)
})
const dispDays = computed(() => {
  const days = [] as Date[]

  const monthStart = startOfMonth(currentDate.value)
  const startDate = startOfWeek(monthStart)

  let day = startDate

  for (let i = 0; i < 42; i++) {
    days.push(day)
    day = addDays(day, 1)
  }
  return days
})

const dispMonths = computed(() => {
  const months = []
  let day = new Date(
    currentDate.value.getFullYear(),
    0,
    currentDate.value.getDate()
  )
  for (let i = 0; i < 16; i++) {
    months.push(day)
    day = addMonths(day, 1)
  }
  return months
})

const dispYears = computed(() => {
  const years = []

  // assume year 0 starts at top left,
  // then positions of each decade (year xxx0)
  // is index 0, 2, 0, 2 (even=0, odd=2)
  const decadeYr = getDecade(currentDate.value)
  const decadeDigit = Math.floor((decadeYr / 10) % 10)
  const offset = decadeDigit % 2 === 0 ? 0 : 2

  let day = new Date(
    decadeYr - offset,
    currentDate.value.getMonth(),
    currentDate.value.getDate()
  )
  for (let i = 0; i < 16; i++) {
    years.push(day)
    day = addYears(day, 1)
  }
  return years
})

watch(
  () => props.modelValue,
  val => {
    if (val) {
      try {
        selectedDate.value = currentDate.value = parseDate(
          val,
          props.format || 'yyyy-MM-dd',
          new Date()
        )
      } catch (err) {}
    }
    displayMode.value = 'day'
  },
  { immediate: true }
)
watch(selectedDate, val => {
  let text = ''
  if (val) {
    try {
      text = formatDate(val, props.format || 'yyyy-MM-dd')
    } catch (err) {}
  }
  emits('update:modelValue', text)
  displayMode.value = 'day'
})

function showPrev() {
  switch (displayMode.value) {
    case 'day':
      currentDate.value = subMonths(currentDate.value, 1)
      break
    case 'month':
      currentDate.value = subYears(currentDate.value, 1)
      break
    case 'year':
      currentDate.value = subYears(currentDate.value, 10)
      break
  }
}
function showNext() {
  switch (displayMode.value) {
    case 'day':
      currentDate.value = addMonths(currentDate.value, 1)
      break
    case 'month':
      currentDate.value = addYears(currentDate.value, 1)
      break
    case 'year':
      currentDate.value = addYears(currentDate.value, 10)
      break
  }
}
function clearDate() {
  selectedDate.value = undefined
}
function useToday() {
  selectedDate.value = currentDate.value = today
}
function isCurrentMonth(date: Date) {
  return date.getMonth() === currentDate.value.getMonth()
}
function isCurrentYear(date: Date) {
  return date.getFullYear() === currentDate.value.getFullYear()
}
function isCurrentDecade(date: Date) {
  return getDecade(date) === getDecade(currentDate.value)
}
function getDayClass(day: Date, dayIdx: number) {
  let css = 'py-1.5 focus:z-10 focus:outline-none '
  if (isSameDay(day, selectedDate.value)) {
    css +=
      'bg-blue-200 text-blue-800 font-medium focus:bg-blue-100 focus:ring-1 focus:ring-blue-600 '
  } else if (isSameDay(day, currentDate.value)) {
    css += 'focus:bg-gray-100 focus:ring-1 focus:ring-blue-600 '
  } else if (isCurrentMonth(day)) {
    css += 'bg-white text-gray-900 focus:bg-gray-100 hover:bg-gray-100 '
  } else {
    css += 'bg-gray-50 text-gray-400 focus:bg-gray-100 hover:bg-gray-100 '
  }

  if (dayIdx === 0) css += 'rounded-tl-lg '
  if (dayIdx === 6) css += 'rounded-tr-lg '
  if (dayIdx === dispDays.value.length - 7) css += 'rounded-bl-lg'
  if (dayIdx === dispDays.value.length - 1) css += 'rounded-br-lg'

  return css
}
function getMonthClass(day: Date, dayIdx: number) {
  let css = 'py-5 focus:z-10 focus:outline-none '
  if (isSameDay(day, selectedDate.value)) {
    css +=
      'bg-blue-200 text-blue-800 font-medium focus:bg-blue-100 focus:ring-1 focus:ring-blue-600 '
  } else if (isSameDay(day, currentDate.value)) {
    css += 'focus:bg-gray-100 focus:ring-1 focus:ring-blue-600 '
  } else if (isCurrentYear(day)) {
    css += 'bg-white text-gray-900 focus:bg-gray-100 hover:bg-gray-100 '
  } else {
    css += 'bg-gray-50 text-gray-400 focus:bg-gray-100 hover:bg-gray-100 '
  }

  if (dayIdx === 0) css += 'rounded-tl-lg '
  if (dayIdx === 3) css += 'rounded-tr-lg '
  if (dayIdx === dispMonths.value.length - 4) css += 'rounded-bl-lg'
  if (dayIdx === dispMonths.value.length - 1) css += 'rounded-br-lg'

  return css
}
function getYearClass(day: Date, dayIdx: number) {
  let css = 'py-5 focus:z-10 focus:outline-none '
  if (isSameDay(day, selectedDate.value)) {
    css +=
      'bg-blue-200 text-blue-800 font-medium focus:bg-blue-100 focus:ring-1 focus:ring-blue-600 '
  } else if (isSameDay(day, currentDate.value)) {
    css += 'focus:bg-gray-100 focus:ring-1 focus:ring-blue-600 '
  } else if (isCurrentDecade(day)) {
    css += 'bg-white text-gray-900 focus:bg-gray-100 hover:bg-gray-100 '
  } else {
    css += 'bg-gray-50 text-gray-400 focus:bg-gray-100 hover:bg-gray-100 '
  }

  if (dayIdx === 0) css += 'rounded-tl-lg '
  if (dayIdx === 3) css += 'rounded-tr-lg '
  if (dayIdx === dispYears.value.length - 4) css += 'rounded-bl-lg'
  if (dayIdx === dispYears.value.length - 1) css += 'rounded-br-lg'

  return css
}

function chooseMonth(day: Date) {
  currentDate.value = day
  displayMode.value = 'day'
  nextTick(focus)
}
function chooseYear(day: Date) {
  currentDate.value = day
  displayMode.value = 'month'
  nextTick(focus)
}

const keyTravelMaps = {
  day: {
    ArrowUp: day => subDays(day, 7),
    ArrowDown: day => addDays(day, 7),
    ArrowLeft: day => subDays(day, 1),
    ArrowRight: day => addDays(day, 1),
    PageUp: day => subMonths(day, 1),
    PageDown: day => addMonths(day, 1)
  },
  month: {
    ArrowUp: day => subMonths(day, 4),
    ArrowDown: day => addMonths(day, 4),
    ArrowLeft: day => subMonths(day, 1),
    ArrowRight: day => addMonths(day, 1),
    PageUp: day => subMonths(day, 12),
    PageDown: day => addMonths(day, 12)
  },
  year: {
    ArrowUp: day => subYears(day, 4),
    ArrowDown: day => addYears(day, 4),
    ArrowLeft: day => subYears(day, 1),
    ArrowRight: day => addYears(day, 1),
    PageUp: day => subYears(day, 10),
    PageDown: day => addYears(day, 10)
  }
} as Record<string, Record<string, (d: Date) => Date>>

function handleTraversal(e: KeyboardEvent) {
  let prevent = false
  const func = keyTravelMaps[displayMode.value][e.key]
  if (func) {
    currentDate.value = func(currentDate.value)
    e.preventDefault()
    nextTick(focus)
  }
}

function handleHeaderClick() {
  switch (displayMode.value) {
    case 'day':
      displayMode.value = 'month'
      break
    case 'month':
      displayMode.value = 'year'
      break
  }
}

/**
 * Focuses on the calender entry button.
 */
function focus() {
  const idToFocus = `${idStart}-${
    displayMode.value
  }btn-${currentDate.value.getTime()}`
  // console.log('try to focus on', idToFocus)
  const btn = document.getElementById(idToFocus)
  if (btn) {
    // console.log('should focus')
    btn.focus()
  }
}

defineExpose({ focus, displayMode })
</script>
<template>
  <div class="p-4">
    <div class="text-center" style="min-height: 380px; min-width: 300px">
      <div class="flex items-center">
        <h2 class="flex-auto font-semibold text-gray-600 text-left p-1.5">
          <button
            type="button"
            class="flex flex-none items-center justify-center p-1.5 text-gray-600 enabled:hover:text-gray-700 focus:outline-none focus:ring-1 rounded focus:ring-blue-600"
            @click="handleHeaderClick"
            :disabled="displayMode === 'year'"
            :title="headerToolTip"
          >
            {{ headerTitleText }}
          </button>
        </h2>
        <button
          type="button"
          class="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 enabled:hover:text-gray-500 focus:outline-none focus:ring-1 rounded focus:ring-blue-600"
          @click="showPrev"
          :disabled="isAtMinDate"
          :title="prevBtnText"
        >
          <span class="sr-only">{{ prevBtnText }}</span>
          <ChevronUpIcon class="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          class="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 enabled:hover:text-gray-500 focus:outline-none focus:ring-1 rounded focus:ring-blue-600"
          @click="showNext"
          :disabled="isAtMaxDate"
          :title="nextBtnText"
        >
          <span class="sr-only">{{ nextBtnText }}</span>
          <ChevronDownIcon class="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      <div
        class="isolate mt-6 grid grid-cols-4 gap-px rounded-lg bg-gray-200 text-sm shadow ring-1 ring-gray-200"
        v-if="displayMode === 'year'"
      >
        <button
          v-for="(year, dayIdx) in dispYears"
          :key="year.getTime()"
          :id="`${idStart}-yearbtn-${year.getTime()}`"
          type="button"
          :class="getYearClass(year, dayIdx)"
          @click="chooseYear(year)"
          @keydown="handleTraversal"
          :tabindex="isSameDay(year, currentDate) ? 0 : -1"
        >
          <time
            :datetime="year.getFullYear().toString()"
            :class="[
              isSameDay(year, today) && 'bg-blue-600 font-semibold text-white',
              'mx-auto flex h-7 w-7 items-center justify-center rounded-full'
            ]"
          >
            {{ year.getFullYear() }}
          </time>
        </button>
      </div>
      <div
        class="isolate mt-6 grid grid-cols-4 gap-px rounded-lg bg-gray-200 text-sm shadow ring-1 ring-gray-200"
        v-if="displayMode === 'month'"
      >
        <button
          v-for="(month, dayIdx) in dispMonths"
          :key="month.getTime()"
          :id="`${idStart}-monthbtn-${month.getTime()}`"
          type="button"
          :class="getMonthClass(month, dayIdx)"
          @click="chooseMonth(month)"
          @keydown="handleTraversal"
          :tabindex="isSameDay(month, currentDate) ? 0 : -1"
        >
          <time
            :datetime="machineFormat(month, true, true)"
            :class="[
              isSameDay(month, today) && 'bg-blue-600 font-semibold text-white',
              'mx-auto flex h-7 w-7 items-center justify-center rounded-full'
            ]"
          >
            {{ getMonthName(month, true) }}
          </time>
        </button>
      </div>
      <div
        class="mt-4 grid grid-cols-7 text-xs leading-6 text-gray-700"
        v-if="displayMode === 'day'"
      >
        <div v-for="d in daysOfWeek" :key="d">{{ d }}</div>
      </div>
      <div
        class="isolate mt-2 grid grid-cols-7 gap-px rounded-lg bg-gray-200 text-sm shadow ring-1 ring-gray-200"
        v-if="displayMode === 'day'"
      >
        <button
          v-for="(day, dayIdx) in dispDays"
          :key="day.getTime()"
          :id="`${idStart}-daybtn-${day.getTime()}`"
          type="button"
          :class="getDayClass(day, dayIdx)"
          @click="selectedDate = day"
          @keydown="handleTraversal"
          :tabindex="isSameDay(day, currentDate) ? 0 : -1"
        >
          <time
            :datetime="machineFormat(day, true, true, true)"
            :class="[
              isSameDay(day, today) && 'bg-blue-600 font-semibold text-white',
              'mx-auto flex h-7 w-7 items-center justify-center rounded-full'
            ]"
          >
            {{ day.getDate() }}
          </time>
        </button>
      </div>
      <div class="mt-2 flex items-center text-sm" v-if="displayMode === 'day'">
        <button
          type="button"
          class="ml-2 flex flex-none items-center justify-center p-1.5 text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-1 rounded focus:ring-blue-600"
          @click="clearDate"
        >
          Clear
        </button>

        <button
          type="button"
          class="ml-auto flex flex-none items-center justify-center p-1.5 text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-1 rounded focus:ring-blue-600"
          @click="useToday"
        >
          Today
        </button>
      </div>
    </div>
  </div>
</template>
