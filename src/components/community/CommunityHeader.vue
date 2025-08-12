<template>
  <header class="bg-white border-b p-4 flex justify-between items-center shadow-sm z-10">
    <div class="flex items-center">
      <h1 class="text-xl font-semibold text-gray-800">社区讨论</h1>
      <span class="ml-3 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
        {{ topicCount }} 个话题
      </span>
    </div>
    
    <div class="flex space-x-3 items-center">
      <!-- 搜索框 -->
      <div class="relative hidden md:block max-w-[200px] lg:max-w-[300px]">
        <input 
          type="text" 
          v-model="searchQuery"
          placeholder="搜索话题..." 
          class="w-full pl-9 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        >
        <i class="fa fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
      </div>
      
      <!-- 发布按钮 -->
      <button 
        @click="$emit('publish-click')"
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center"
      >
        <i class="fa fa-plus-circle mr-2"></i>
        <span class="hidden sm:inline">发布新话题</span>
        <span class="sm:hidden">发布</span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { useVModel } from '@vueuse/core'

const props = defineProps({
  topicCount: {
    type: Number,
    default: 0
  },
  searchQuery: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['publish-click', 'update:searchQuery'])
const searchQuery = useVModel(props, 'searchQuery', emit)
</script>