<script setup lang="ts">
import { ref, watch } from 'vue'
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import MyDatePick from './components/MyDatePick.vue'

const dateValue = ref('2022/2/2')
watch(dateValue, val => {
  console.log('date changed to ', val)
})
</script>

<template>
  <div class="p-4">
    <img alt="Vue logo" src="./assets/logo.png" />
    <h1 class="text-red-500">Built in date picker</h1>

    <div class="border border-red-600">
      <MyDatePick v-model="dateValue" />
      <MyDatePick v-model="dateValue" />
      <MyDatePick v-model="dateValue" />

      variable value = {{ dateValue }}
    </div>
  </div>
</template>
