<template>
  <div class="w-1/3 border-r border-gray-200 flex flex-col transition-all duration-300" :class="{'max-md:w-[120px]': isMobile}">
    <!-- 搜索框 -->
    <div class="p-2 border-b border-gray-100">
      <input
        v-model="localSearchQuery"
        type="text"
        placeholder="搜索笔记..."
        class="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none outline-none focus:ring-1 focus:ring-blue-500 transition-all"
        @input="handleSearch"
        aria-label="搜索笔记"
      >
    </div>
    
    <!-- 筛选和排序区域 -->
    <div class="flex items-center justify-between p-2 border-b border-gray-100">
      <div class="flex items-center">
        <span class="text-xs text-gray-500 mr-2">分类</span>
        <select 
          v-model="localSelectedTag"
          class="text-xs border-none bg-transparent transparentparent focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
          @change="handleTagChange"
          aria-label="选择分类"
        >
          <option value="">全部</option>
          <option v-for="tag in allTags" :key="tag" :value="tag">{{ tag }}</option>
        </select>
      </div>
      
      <div class="flex items-center">
        <span class="text-xs text-gray-500 mr-2">排序</span>
        <select 
          v-model="localSortType"
          class="text-xs border-none bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
          @change="handleSortChange"
          aria-label="选择排序方式"
        >
          <option value="latest">最新更新</option>
          <option value="oldest">最早更新</option>
          <option value="title">按标题</option>
        </select>
      </div>
    </div>
    
    <!-- 笔记列表 -->
    <div class="flex-1 overflow-y-auto min-h-0">
      <template v-if="notes.length > 0">
        <div 
          v-for="note in notes" 
          :key="note.id"
          class="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-all duration-200 transform hover:translate-x-1"
          :class="{ 'bg-blue-50': activeNoteId === note.id }"
          @click="handleNoteSelect(note.id)"
          :aria-selected="activeNoteId === note.id"
        >
          <div class="text-sm font-medium truncate">
            {{ note.title || note.content.substring(0, 15) || '新建笔记' }}
          </div>
          <div class="flex items-center mt-1 flex-wrap gap-2">
            <span class="text-xs text-gray-500">
              {{ formatDate(note.updatedAt) }}
            </span>
            <span 
              v-if="note.tag" 
              class="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-full"
            >
              {{ note.tag }}
            </span>
          </div>
        </div>
      </template>
      
      <div v-else class="p-4 text-center text-gray-500 text-sm">
        <div class="flex flex-col items-center gap-2">
          <i class="fa fa-file-text-o text-gray-300" aria-hidden="true"></i>
          <p>没有找到笔记</p>
          <button 
            class="text-blue-500 text-xs hover:underline"
            @click="$emit('create-new-note')"
          >
            创建新笔记
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { EnhancedNote } from '@/types/note'
import { formatDate } from '@/utils/note'

// 定义Props类型
const props = defineProps<{
  notes: EnhancedNote[]
  activeNoteId: string | null
  searchQuery: string
  selectedTag: string
  allTags: string[]
  sortType: string
}>()

// 定义Emit类型
const emit = defineEmits<{
  (e: 'select-note', id: string): void
  (e: 'search', query: string): void
  (e: 'change-tag', tag: string): void
  (e: 'change-sort', type: string): void
  (e: 'create-new-note'): void
}>()

// 本地状态
const localSearchQuery = ref(props.searchQuery)
const localSelectedTag = ref(props.selectedTag)
const localSortType = ref(props.sortType)

// 响应式判断是否为移动设备
const isMobile = computed(() => {
  return window.innerWidth <= 768
})

// 监听窗口大小变化
watch(isMobile, (newVal) => {
  // 可以在这里添加窗口大小变化时的额外逻辑
})

// 同步Props到本地状态
watch([
  () => props.searchQuery,
  () => props.selectedTag,
  () => props.sortType
], ([newSearch, newTag, newSort]) => {
  localSearchQuery.value = newSearch
  localSelectedTag.value = newTag
  localSortType.value = newSort
}, { immediate: true })

// 事件处理函数
const handleSearch = (e: Event) => {
  const value = (e.target as HTMLInputElement).value
  emit('search', value)
}

const handleTagChange = () => {
  emit('change-tag', localSelectedTag.value)
}

const handleSortChange = () => {
  emit('change-sort', localSortType.value)
}

const handleNoteSelect = (id: string) => {
  emit('select-note', id)
}
</script>

<style scoped>
/* 使用Tailwind的响应式前缀替代自定义媒体查询 */
/* 移除了!important，使用CSS优先级和Tailwind的响应式类实现相同效果 */
</style>
