<template>
  <div class="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
    <div class="flex justify-between items-start mb-4">
      <div>
        <p class="text-gray-500 text-sm">{{ title }}</p>
        <h3 class="text-3xl font-bold mt-1">{{ value }}</h3>
      </div>
      <div class="w-10 h-10 rounded-full flex items-center justify-center" :class="iconBgColor">
        <i :class="iconClass"></i>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
 import { defineProps } from 'vue'

interface Props {
  title: string
  value: string | number
  iconClass: string
  iconBgColor: string
}

defineProps<Props>()
</script>
