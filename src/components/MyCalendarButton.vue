<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  inheritAttrs: false
})
</script>
<script lang="ts" setup>
import { ref, computed, onBeforeUnmount, nextTick, useAttrs } from 'vue'
import { CalendarIcon } from '@heroicons/vue/outline'
import tippy, { hideAll, Instance, Props, Placement } from 'tippy.js'
import { FocusTrap } from '@headlessui/vue'
import parseDate from 'date-fns/parse'
import formatDate from 'date-fns/format'
import MyCalendar from './MyCalendar.vue'

const props = withDefaults(
  defineProps<{
    modelValue: string
    format?: string
    disabled?: boolean
    placement?: Placement
    preferCustom?: boolean
  }>(),
  { format: 'yyyy-MM-dd', placement: 'bottom-start' }
)
const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
const attrs = useAttrs()

const isOpen = ref(false)
const button = ref<HTMLButtonElement>()
const popup = ref<HTMLDivElement>()
const calendar = ref<typeof MyCalendar>()
const useNativePicker = computed(() => {
  return !props.preferCustom && 'showPicker' in HTMLInputElement.prototype
})
const nativePicker = ref<HTMLInputElement>()

let tippyInstance = undefined as Instance<Props> | undefined

onBeforeUnmount(() => {
  tippyInstance?.destroy()
})

function showPicker() {
  if (useNativePicker.value && nativePicker.value) {
    const picker = nativePicker.value as any
    try {
      const date = parseDate(props.modelValue, props.format, new Date())
      picker.value = formatDate(date, 'yyyy-MM-dd')
    } catch (err) {}
    picker.showPicker()
  } else if (!isOpen.value) {
    isOpen.value = true
    nextTick(() => {
      configureTippyInstance()
      if (popup.value) tippyInstance?.setContent(popup.value)
    })
  }
}
function hidePicker() {
  isOpen.value = false
  tippyInstance?.unmount()
}
function configureTippyInstance() {
  if (!tippyInstance) {
    if (button.value) {
      tippyInstance = tippy(button.value)
      tippyInstance.disable()
    }
  }
  if (!tippyInstance) return

  tippyInstance.enable()
  tippyInstance.setProps({
    trigger: 'manual',
    placement: props.placement,
    allowHTML: true,
    arrow: false,
    interactive: true,
    appendTo: document.body,
    hideOnClick: false,
    onShow: instance => {
      hideAll({ exclude: instance })
      nextTick(() => {
        if (calendar.value) calendar.value.focus()
      })
    },
    onClickOutside: (instance, event) => {
      isOpen.value = false
      instance.unmount()
    }
  })
  tippyInstance.show()
}

function handleDateUpdate(value: string) {
  isOpen.value = false
  if (button.value) button.value.focus()
  emits('update:modelValue', value)
}
function handleNativeChange(e: Event) {
  const input = e.target as HTMLInputElement
  if (input) {
    if (input.value) {
      const date = parseDate(input.value, 'yyyy-MM-dd', new Date())
      const text = formatDate(date, props.format)
      handleDateUpdate(text)
    } else {
      handleDateUpdate('')
    }
  }
}

defineExpose({ showPicker })
</script>
<template>
  <div class="inline-flex items-center justify-center relative">
    <input
      v-if="useNativePicker"
      tabindex="-1"
      type="date"
      class="absolute top-0 left-0 right-0 bottom-0 opacity-0 -z-10"
      ref="nativePicker"
      :disabled="props.disabled"
      min="1000-1-1"
      max="9999-12-31"
      @change="handleNativeChange"
    />
    <button
      type="button"
      class="inline-flex items-center px-1 py-1 text-xs font-medium rounded text-gray-700 enabled:hover:bg-gray-50 focus:outline-none enabled:focus:ring-2 enabled:focus:ring-offset-2 enabled:focus:ring-blue-500"
      @click="showPicker"
      :disabled="props.disabled"
      ref="button"
      v-bind="attrs"
    >
      <CalendarIcon class="h-5 w-5" aria-hidden="true" />
      <span class="sr-only">Show calendar</span>
    </button>
  </div>
  <div
    v-if="isOpen"
    ref="popup"
    class="rounded-lg border border-gray-200 bg-white text-sm shadow-lg"
    style="width: 340px"
    @keydown.esc="hidePicker"
  >
    <focus-trap>
      <MyCalendar
        :model-value="props.modelValue"
        :format="props.format"
        @update:model-value="handleDateUpdate"
        ref="calendar"
      />
    </focus-trap>
  </div>
</template>
