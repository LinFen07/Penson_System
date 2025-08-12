<template>
  <aside class="hidden lg:block w-48 shrink-0">
     <!-- 创作按钮：突出显示，放在顶部 -->
          <button 
            @click="handlePublishClick"
            class="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-full font-medium transition-all shadow-sm hover:shadow self-start"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            <span>发布话题</span>
          </button>
    <div class="bg-white rounded-lg shadow-sm p-4 sticky top-4">
      <h3 class="font-medium text-gray-800 mb-3">话题分类</h3>
      <ul class="space-y-1">
        <li v-for="(item, key) in categories" :key="key">
          <button 
            @click="$emit('change-category', key)"
            :class="activeCategory === key ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'"
            class="w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center"
          >
            <i :class="`${item.icon} mr-2`"></i>{{ item.label }}
          </button>
        </li>
      </ul>
    </div>
  </aside>
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

// 分类数据（组件内部维护，与主页面解耦）
const categories = {
  all: { label: '全部话题', icon: 'fa fa-th-large' },
  tech: { label: '技术讨论', icon: 'fa fa-code' },
  question: { label: '问题求助', icon: 'fa fa-question-circle' },
  share: { label: '经验分享', icon: 'fa fa-lightbulb-o' },
  offtopic: { label: '闲聊灌水', icon: 'fa fa-coffee' }
}
</script>