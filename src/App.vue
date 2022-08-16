<script setup lang="ts">
import { ref, watch } from 'vue'
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import MyDatePick from './components/MyDatePick.vue'
import MyCalendar from './components/MyCalendar.vue'

const dateValue = ref('2022/2/2')
watch(dateValue, val => {
  console.log('date changed to ', val)
})
</script>

<template>
  <div class="p-4">
    <!-- <img alt="Vue logo" src="./assets/logo.png" /> -->

    variable value = {{ dateValue }}

    <div class="border border-red-600">
      <input type="date" />
    </div>
    <div class="border border-red-600">
      <MyDatePick v-model="dateValue" format="yyyy/MM/dd" />
    </div>

    <div class="border border-red-600">
      <MyCalendar v-model="dateValue" format="yyyy/MM/dd" />
    </div>
  </div>
</template>
