<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { CalendarIcon } from '@heroicons/vue/outline'
import tippy, { hideAll, Instance, Props, Placement } from 'tippy.js'
import { FocusTrap } from '@headlessui/vue'
import MyCalendar from './MyCalendar.vue'

const props = withDefaults(
  defineProps<{
    modelValue: string
    format?: string
    disabled?: boolean
    placement?: Placement
  }>(),
  { format: 'yyyy-MM-dd', placement: 'bottom-start' }
)
const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const isOpen = ref(false)
const button = ref<HTMLButtonElement>()
const popup = ref<HTMLDivElement>()
const calendar = ref<typeof MyCalendar>()

let tippyInstance = undefined as Instance<Props> | undefined

onMounted(() => {
  if (button.value) {
    tippyInstance = tippy(button.value)
    tippyInstance.disable()
  }
})
onBeforeUnmount(() => {
  tippyInstance?.destroy()
})

function togglePopup() {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    nextTick(() => {
      configureTippyInstance()
      if (popup.value) tippyInstance?.setContent(popup.value)
    })
  } else {
    tippyInstance?.unmount()
  }
}
function configureTippyInstance() {
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
  if(button.value) button.value.focus()
  emits('update:modelValue', value)
}
</script>
<template>
  <button
    type="button"
    class="inline-flex items-center px-1 py-1 text-xs font-medium rounded text-gray-700 enabled:hover:bg-gray-50 focus:outline-none enabled:focus:ring-2 enabled:focus:ring-offset-2 enabled:focus:ring-blue-500"
    @click="togglePopup"
    :disabled="props.disabled"
    ref="button"
  >
    <CalendarIcon class="h-5 w-5" aria-hidden="true" />
    <span class="sr-only">Show calendar</span>
  </button>
  <div
    v-if="isOpen"
    ref="popup"
    class="rounded-lg border border-gray-200 bg-white text-sm shadow-lg"
    style="width: 340px"
    @keydown.esc="togglePopup"
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
