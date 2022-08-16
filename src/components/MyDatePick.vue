<script setup lang="ts">
import { ref, Ref } from 'vue'
import { CalendarIcon } from '@heroicons/vue/outline'
import parseDate from 'date-fns/parse'
import formatDate from 'date-fns/format'
import MyCalendarButton from './MyCalendarButton.vue'

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
function handleDateChange(value: string) {
  emits('update:modelValue', value)
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
</script>

<template>
  <div class="mt-1 relative rounded-md shadow-sm">
    <input
      type="text"
      class="block w-full pl-2 pr-10 sm:text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
      :value="modelValue"
      @change="handleTextChange"
      @keydown="handleKey"
    />
    <div class="absolute inset-y-0 right-1 flex items-center">
      <MyCalendarButton
        :format="props.format"
        :modelValue="modelValue"
        @update:model-value="handleDateChange"
      />
    </div>
  </div>
</template>
