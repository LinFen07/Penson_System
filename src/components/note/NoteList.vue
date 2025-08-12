<template>
  <div class="w-1/3 border-r border-gray-200 flex flex-col transition-all duration-300" :class="{'max-md:w-[120px]': isMobile}">
    <!-- 搜索框 -->
    <div class="p-2 border-b border-gray-100">
      <input
        v-model="localSearchQuery"
        type="text"
        placeholder="搜索笔记..."
        class="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
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
          class="text-xs border-none bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
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
    
    <!-- 笔记列表容器 -->
    <div class="flex-1 flex flex-col overflow-hidden border-b border-gray-100">
      <!-- 实际滚动区域 -->
      <div class="flex-1 overflow-y-auto scrollbar-visible" :style="{ minHeight: 0, height: '100%' }">
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
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { EnhancedNote } from '@/types/note'
import { formatDate } from '@/utils/note'

const props = defineProps<{
  notes: EnhancedNote[]
  activeNoteId: string | null
  searchQuery: string
  selectedTag: string
  allTags: string[]
  sortType: string
}>()

const emit = defineEmits<{
  (e: 'select-note', id: string): void
  (e: 'search', query: string): void
  (e: 'change-tag', tag: string): void
  (e: 'change-sort', type: string): void
  (e: 'create-new-note'): void
}>()

const localSearchQuery = ref(props.searchQuery)
const localSelectedTag = ref(props.selectedTag)
const localSortType = ref(props.sortType)

const isMobile = computed(() => {
  return window.innerWidth <= 768
})

watch(isMobile, (newVal) => {
  // 窗口大小变化时的处理逻辑
})

watch([
  () => props.searchQuery,
  () => props.selectedTag,
  () => props.sortType
], ([newSearch, newTag, newSort]) => {
  localSearchQuery.value = newSearch
  localSelectedTag.value = newTag
  localSortType.value = newSort
}, { immediate: true })

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
/* 始终可见的滚动条样式 */
::v-deep .scrollbar-visible {
  scrollbar-width: thin; /* Firefox */
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  /* 确保滚动容器有明确的高度限制 */
  height: 100%;
}

/* 滚动条轨道 - 轻微背景色使其始终可见 */
::v-deep .scrollbar-visible::-webkit-scrollbar-track {
  background-color: rgba(240, 240, 240, 0.8);
  border-radius: 6px;
}

::v-deep .scrollbar-visible::-moz-scrollbar-track {
  background-color: rgba(240, 240, 240, 0.8);
  border-radius: 6px;
}

/* 滚动条滑块 - 更明显的颜色 */
::v-deep .scrollbar-visible::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.7);
  border-radius: 6px;
  border: 1px solid transparent;
  background-clip: padding-box;
  transition: background-color 0.2s ease;
}

::v-deep .scrollbar-visible::-moz-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.7);
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

/* 滑块悬停效果 */
::v-deep .scrollbar-visible::-webkit-scrollbar-thumb:hover,
::v-deep .scrollbar-visible::-moz-scrollbar-thumb:hover {
  background-color: rgba(107, 114, 128, 0.8);
}

::v-deep .scrollbar-visible::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  ::v-deep .scrollbar-visible::-webkit-scrollbar {
    width: 6px;
  }
  
  .max-md\:w-\[120px\] .text-xs,
  .max-md\:w-\[120px\] select {
    font-size: 10px;
  }
  
  .max-md\:w-\[120px\] .p-3 {
    padding: 2px 4px;
  }
}
</style>
