<template>
  <div class="lg:hidden bg-white rounded-lg shadow-sm p-3 mb-6 overflow-x-auto">
    <div class="flex space-x-2 min-w-max pb-1">
      <button 
        v-for="(item, key) in categories" :key="key"
        @click="$emit('change-category', key)"
        :class="activeCategory === key ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
        class="px-4 py-2 rounded-full text-sm transition-colors whitespace-nowrap"
      >
        {{ item.shortLabel }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  activeCategory: {
    type: String,
    default: 'all'
  }
})

const emit = defineEmits(['change-category'])

// 移动端简化分类标签
const categories = {
  all: { shortLabel: '全部' },
  tech: { shortLabel: '技术' },
  question: { shortLabel: '求助' },
  share: { shortLabel: '分享' },
  offtopic: { shortLabel: '闲聊' }
}
</script>