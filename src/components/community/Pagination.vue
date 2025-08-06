<template>
  <div class="mt-8 flex justify-center">
    <nav class="flex items-center space-x-1">
      <button 
        @click="$emit('change-page', currentPage - 1)"
        :disabled="currentPage === 1"
        class="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <i class="fa fa-chevron-left text-xs"></i>
      </button>
      <template v-for="page in totalPages" :key="page">
        <button 
          @click="$emit('change-page', page)"
          :class="currentPage === page ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'"
          class="px-3 py-1 rounded border"
        >
          {{ page }}
        </button>
      </template>
      <button 
        @click="$emit('change-page', currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <i class="fa fa-chevron-right text-xs"></i>
      </button>
    </nav>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  currentPage: { type: Number, required: true },
  totalPages: { type: Number, required: true }
})

const emit = defineEmits(['change-page'])
</script>