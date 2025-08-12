<template>
  <!-- 移除弹窗相关功能，作为普通一个嵌入式的编辑器组件 -->
  <div class="bg-white rounded-xl shadow border border-gray-200 flex flex-col">
    <!-- 标题栏 -->
    <div class="h-8 bg-gray-100 rounded-t-xl flex items-center px-2 text-sm text-gray-600 select-none">
      笔记编辑
    </div>

    <!-- 内容区 -->
    <div class="flex-1 flex flex-col min-h-0">
      <!-- 标题 + 标签 -->
      <div class="p-3 border-b border-gray-100">
        <input
          v-if="activeNote"
          v-model="activeNote.title"
          type="text"
          placeholder="笔记标题..."
          class="w-full px-2 py-1 text-lg font-medium border-none outline-none focus:ring-1 focus:ring-blue-500"
          @input="handleTitleChange"
        />
        <div class="flex items-center justify-between mt-2 flex-wrap gap-2">
          <div class="flex items-center">
            <select
              v-if="activeNote"
              v-model="activeNote.tag"
              class="text-sm border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
              @change="handleTagChange"
            >
              <option value="">无分类</option>
              <option v-for="tag in allTags" :key="tag" :value="tag">{{ tag }}</option>
              <option value="new">+ 新建分类</option>
            </select>
            <input
              v-if="showNewTagInput"
              v-model="newTagName"
              type="text"
              placeholder="输入新分类..."
              class="ml-2 text-sm border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
              @blur="handleNewTagBlur"
              @keyup.enter="handleNewTagEnter"
            />
          </div>
          <div class="text-xs text-gray-500">
            <span v-if="lastSavedTime">最近保存: {{ formatTime(lastSavedTime) }}</span>
            <span v-else-if="activeNote">自动保存中...</span>
          </div>
        </div>
      </div>

      <!-- 工具栏 -->
      <div class="p-1 bg-gray-50 border-b border-gray-200 flex items-center space-x-1 flex-wrap">
        <button @click="formatText('bold')" class="p-1 hover:bg-gray-200 rounded" title="加粗 (Ctrl+B)"><b>B</b></button>
        <button @click="formatText('italic')" class="p-1 hover:bg-gray-200 rounded" title="斜体 (Ctrl+I)"><i>I</i></button>
        <button @click="formatText('underline')" class="p-1 hover:bg-gray-200 rounded" title="下划线 (Ctrl+U)"><u>U</u></button>
        <div class="h-4 border-r border-gray-300 mx-1"></div>
        <button @click="formatText('heading')" class="p-1 hover:bg-gray-200 rounded" title="标题"><b>H</b></button>
        <button @click="formatText('list')" class="p-1 hover:bg-gray-200 rounded" title="列表"><span>• 列表</span></button>
        <button @click="formatText('link')" class="p-1 hover:bg-gray-200 rounded" title="链接"><span>🔗 链接</span></button>
        <div class="h-4 border-r border-gray-300 mx-1"></div>
        <button @click="clearFormatting" class="p-1 hover:bg-gray-200 rounded text-xs" title="清除格式">清除格式</button>
      </div>

      <!-- Markdown 编辑器 -->
      <MarkdownEditor
        :activeNote="activeNote"
        @update-note="emit('update-note', $event)"
        @save-note="emit('save-note')"
        ref="editorRef"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import type { EnhancedNote } from '@/types/note'
import { formatTime } from '@/utils/note'
import MarkdownEditor from './MarkdownEditor.vue'

/* ---------------- props & emits ---------------- */
const props = defineProps<{
  activeNote: EnhancedNote | undefined
  allTags: string[]
}>()

const emit = defineEmits<{
  (e: 'save-note'): void
  (e: 'update-note', payload: EnhancedNote): void
  (e: 'add-new-tag', tag: string): void
}>()

/* ---------------- 移除了弹窗拖动 & 拉伸相关代码 ---------------- */

/* ---------------- 原有编辑逻辑保留 ---------------- */
const showNewTagInput = ref(false)
const newTagName = ref('')
const lastSavedTime = ref<Date | null>(null)

const handleTitleChange = () => {
  if (props.activeNote) {
    emit('update-note', { ...props.activeNote })
    emit('save-note')
    lastSavedTime.value = new Date()
  }
}

const handleTagChange = (e: Event) => {
  const value = (e.target as HTMLSelectElement).value
  if (value === 'new') {
    showNewTagInput.value = true
    nextTick(() => {
      const input = document.querySelector('input[placeholder="输入新分类..."]') as HTMLInputElement
      input?.focus()
    })
  } else {
    showNewTagInput.value = false
    if (props.activeNote) {
      emit('update-note', { ...props.activeNote })
      emit('save-note')
    }
  }
}

const handleNewTagBlur = () => {
  if (newTagName.value) {
    emit('add-new-tag', newTagName.value)
    if (props.activeNote) {
      props.activeNote.tag = newTagName.value
      emit('update-note', { ...props.activeNote })
    }
  }
  newTagName.value = ''
  showNewTagInput.value = false
}

const handleNewTagEnter = () => handleNewTagBlur()

const editorRef = ref<any>()

const formatText = (type: string) => editorRef.value?.formatText?.(type)
const clearFormatting = () => editorRef.value?.clearFormatting?.()

// 清理事件监听（原弹窗相关）
onMounted(() => {
  // 移除了拖拽相关的事件监听
})

onUnmounted(() => {
  // 移除了拖拽相关的事件解绑
})
</script>

<style scoped>
/* 移除了弹窗相关的样式 */
</style>