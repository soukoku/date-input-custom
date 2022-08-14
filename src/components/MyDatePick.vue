<script setup lang="ts">
import { ref, Ref } from 'vue'
import { CalendarIcon } from '@heroicons/vue/outline'
import { MaskedRange } from 'imask'
// import { IMaskComponent } from 'vue-imask'
import parseDate from 'date-fns/parse'
import formatDate from 'date-fns/format'

const props = withDefaults(
  defineProps<{
    modelValue: string
    min?: string
    max?: string
    disabled?: boolean
    format?: string
  }>(),
  { max: '9999-12-31', format: 'yyyy/MM/dd' }
)

const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const realPicker = ref() as Ref<HTMLInputElement>

const canShowPicker = 'showPicker' in HTMLInputElement.prototype

function showCalendar() {
  const picker = realPicker.value as any
  if (picker) {
    try {
      const date = parseDate(props.modelValue, props.format, new Date())
      picker.value = formatDate(date, 'yyyy-MM-dd')
    } catch (err) {}
    picker.showPicker()
  }
}
function handleDateChange(e: Event) {
  const input = e.target as HTMLInputElement
  if (input) {
    if (input.value) {
      const date = parseDate(input.value, 'yyyy-MM-dd', new Date())
      const text = formatDate(date, props.format)
      console.log('emit from date change', text)
      emits('update:modelValue', text)
    } else {
      emits('update:modelValue', '')
    }
  }
}
function handleKey(e: KeyboardEvent) {
  if (e.key === 'F4' || e.key === ' ') {
    e.preventDefault()
    showCalendar()
  }
}
function handleTextChange(e: Event) {
  const input = e.target as HTMLInputElement
  if (input) {
    // console.log('emit from text change', input.value)
    emits('update:modelValue', input.value.trim())
  }
}

const maskProps = {
  mask: Date,
  pattern: 'MM/dd/yyyy',
  // lazy:false,
  // autofix:true,
  // overwrite:true,
  // min: this.min,
  // max: this.max,
  blocks: {
    MM: {
      mask: MaskedRange,
      from: 1,
      to: 12,
      maxLength: 2
    },
    DD: {
      mask: MaskedRange,
      from: 1,
      to: 31,
      maxLength: 2
    },
    dd: {
      mask: MaskedRange,
      from: 1,
      to: 31,
      maxLength: 2
    },
    YYYY: {
      mask: MaskedRange,
      from: 1000,
      to: 9999,
      maxLength: 4
    },
    yyyy: {
      mask: MaskedRange,
      from: 1000,
      to: 9999,
      maxLength: 4
    }
  }
}
</script>

<template>
  <div class="mt-1 relative rounded-md shadow-sm">
    <!-- <input
      type="date"
      :disabled="props.disabled"
      :min="props.min"
      :max="props.max"
    /> -->
    <input
      tabindex="-1"
      type="date"
      class="absolute top-0 left-0 right-0 bottom-0 opacity-0 -z-10"
      ref="realPicker"
      :disabled="props.disabled"
      :min="props.min"
      :max="props.max"
      @change="handleDateChange"
    />
    <!-- <IMaskComponent
      class="block w-full h-full pl-2 pr-10 sm:text-sm rounded-md focus:outline-none focus:ring-transparent"
      ref="input"
      :value="modelValue"
      @change="handleTextChange"
      @keydown="handleKey"
      v-bind="maskProps"
      :disabled="disabled"
    /> -->
    <input
      type="text"
      class="block w-full pl-2 pr-10 sm:text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
      :value="modelValue"
      @change="handleTextChange"
      @keydown="handleKey"
    />
    <div
      class="absolute inset-y-0 right-1 flex items-center"
      v-if="canShowPicker"
    >
      <button
        type="button"
        class="inline-flex items-center px-1 py-1 text-xs font-medium rounded text-gray-700 enabled:hover:bg-gray-50 focus:outline-none enabled:focus:ring-2 enabled:focus:ring-offset-2 enabled:focus:ring-blue-500"
        @click="showCalendar"
        :disabled="props.disabled"
      >
        <CalendarIcon class="h-5 w-5" aria-hidden="true" />
        <span class="sr-only">Show calendar</span>
      </button>
    </div>
  </div>
</template>
