<template>
  <div class="bg-white rounded-lg shadow-sm p-8 text-center mt-6">
    <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <i class="fa fa-comments text-2xl text-gray-400"></i>
    </div>
    <h3 class="text-lg font-medium text-gray-900 mb-2">{{ text }}</h3>
    <p class="text-gray-500 mb-4">{{ subtext }}</p>
    <button 
      @click="$emit('action-click')"
      class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
    >
      {{ actionText }}
    </button>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  text: { type: String, required: true },
  subtext: { type: String, default: '' },
  actionText: { type: String, default: '操作' }
})

const emit = defineEmits(['action-click'])
</script>