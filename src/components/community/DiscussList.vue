<template>
  <div class="space-y-4">
    <div 
      v-for="discussion in discussions" 
      :key="discussion.id"
      class="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow cursor-pointer"
      @click="$router.push(`/community/${discussion.id}`)"
    >
      <div class="flex justify-between items-start">
        <div>
          <h3 class="text-lg font-medium">{{ discussion.title }}</h3>
          <p class="text-sm text-gray-500 mt-1">
            作者: {{ discussion.author }} | {{ formatDate(discussion.createdAt) }}
          </p>
        </div>
        <span class="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
          {{ discussion.replies }} 回复
        </span>
      </div>
      
      <p class="mt-2 text-gray-700">{{ discussion.content }}</p>
      
      <div class="mt-3 flex justify-end">
        <button 
          @click="$emit('reply', discussion.id)"
          class="text-sm text-blue-500 hover:text-blue-700"
        >
          回复
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  discussions: {
    type: Array,
    required: true,
    default: () => []
  }
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}
</script>
