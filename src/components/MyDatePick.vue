<script setup lang="ts">
import { ref, Ref } from 'vue'
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

const calButton = ref() as Ref<typeof MyCalendarButton>

function handleDateChange(value: string) {
  emits('update:modelValue', value)
}
function handleKey(e: KeyboardEvent) {
  if (e.key === 'F4' || e.key === ' ') {
    e.preventDefault()

    const picker = calButton.value as any
    if (picker) picker.showPicker()
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
        ref="calButton"
        :format="props.format"
        :modelValue="modelValue"
        @update:model-value="handleDateChange"
        prefer-custom
        placement="bottom-end"
      />
    </div>
  </div>
</template>
