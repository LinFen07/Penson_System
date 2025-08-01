<template>
  <div class="flex-1 flex flex-col min-h-0">
    <div class="p-3 border-b border-gray-100">
      <input
        v-if="activeNote"
        v-model="activeNote.title"
        type="text"
        placeholder="笔记标题..."
        class="w-full px-2 py-1 text-lg font-medium border-none outline-none focus:ring-1 focus:ring-blue-500"
        @input="handleTitleChange"
      >
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
          >
        </div>
        <div class="text-xs text-gray-500">
          <span v-if="lastSavedTime">最近保存: {{ formatTime(lastSavedTime) }}</span>
          <span v-else-if="activeNote">自动保存中...</span>
        </div>
      </div>
    </div>
    <div class="flex-1 overflow-hidden flex min-h-0">
      <div class="flex-1 flex flex-col overflow-hidden border-r border-gray-200 min-h-0">
        <div class="p-1 bg-gray-50 border-b border-gray-200 flex items-center space-x-1 flex-wrap">
          <button @click="formatText('bold')" class="p-1 hover:bg-gray-200 rounded" title="加粗 (Ctrl+B)">
            <b>B</b>
          </button>
          <button @click="formatText('italic')" class="p-1 hover:bg-gray-200 rounded" title="斜体 (Ctrl+I)">
            <i>I</i>
          </button>
          <button @click="formatText('underline')" class="p-1 hover:bg-gray-200 rounded" title="下划线 (Ctrl+U)">
            <u>U</u>
          </button>
          <div class="h-4 border-r border-gray-300 mx-1"></div>
          <button @click="formatText('heading')" class="p-1 hover:bg-gray-200 rounded" title="标题">
            <b>H</b>
          </button>
          <button @click="formatText('list')" class="p-1 hover:bg-gray-200 rounded" title="列表">
            <span>• 列表</span>
          </button>
          <button @click="formatText('link')" class="p-1 hover:bg-gray-200 rounded" title="链接">
            <span>🔗 链接</span>
          </button>
          <div class="h-4 border-r border-gray-300 mx-1"></div>
          <button @click="clearFormatting" class="p-1 hover:bg-gray-200 rounded text-xs" title="清除格式">
            清除格式
          </button>
        </div>
        <div class="flex-1 overflow-y-auto p-3">
          <div 
            v-if="activeNote"
            v-html="formattedContent"
            class="outline-none min-h-[100px] line-clamp-none break-words"
            contenteditable
            @input="handleContentChange"
            @focus="isEditing = true"
            @blur="isEditing = false"
            ref="editorRef"
          ></div>
          <div v-else class="flex items-center justify-center h-full text-gray-400">
            选择或创建笔记开始编辑
          </div>
        </div>
      </div>
      
      <!-- 预览区域 -->
      <div 
        class="w-1/3 overflow-y-auto bg-gray-50 p-3 min-h-0 transition-all duration-300"
        v-if="showPreview"
      >
        <h4 class="text-sm font-medium mb-2">预览</h4>
        <div v-if="activeNote" class="prose prose-sm max-w-none">
          <div v-html="formattedContent"></div>
        </div>
        <div v-else class="text-gray-500 text-sm">请选择或创建笔记</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import type { EnhancedNote } from '@/types/note'
import { formatTime } from '@/utils/note'

const props = defineProps<{
  activeNote: EnhancedNote | undefined
  allTags: string[]
  showPreview: boolean
}>()

const emit = defineEmits(['save-note', 'update-note', 'add-new-tag'])

// 编辑器状态
const showNewTagInput = ref(false)
const newTagName = ref('')
const isEditing = ref(false)
const lastSavedTime = ref<Date | null>(null)
const editorRef = ref<HTMLElement | null>(null) // 编辑器DOM引用

// 格式化内容计算属性（核心修复：确保顺序正确）
const formattedContent = computed<string>(() => {
  if (!props.activeNote) return ''
  
  // 保留原始文本顺序，先处理换行符
  let content = props.activeNote.content
    .replace(/\n/g, '<br>') // 确保换行符正确转换，不破坏顺序
  
  // 按优先级处理格式（从简单到复杂，避免嵌套冲突）
  content = content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')       // 加粗
    .replace(/\*(.*?)\*/g, '<em>$1</em>')                   // 斜体
    .replace(/__(.*?)__/g, '<u>$1</u>')                     // 下划线
    .replace(/^# (.*?)$/gm, '<h3 class="text-lg font-bold mt-2 mb-1">$1</h3>') // 标题
    .replace(/^- (.*?)$/gm, '<li class="ml-4">$1</li>')     // 列表项
  
  // 修复列表包裹逻辑（非贪婪匹配，避免跨块嵌套）
  if (content.includes('<li>')) {
    content = content.replace(/(<li>.*?<\/li>)+?/gs, '<ul class="list-disc mb-2">$&</ul>')
  }
  
  // 处理链接（最后处理，避免干扰其他格式）
  content = content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="text-blue-500 underline">$1</a>')
  
  return content
})

// 处理标题变化
const handleTitleChange = () => {
  if (props.activeNote) {
    emit('update-note', { ...props.activeNote })
    emit('save-note')
    lastSavedTime.value = new Date()
  }
}

// 处理内容变化（核心修复：使用textContent保留原始顺序）
const handleContentChange = (e: Event) => {
  if (props.activeNote) {
    const editableDiv = e.target as HTMLElement
    // 使用textContent而非innerText，避免样式影响文本顺序
    const updatedContent = editableDiv.textContent || ''
    const updatedNote = { 
      ...props.activeNote, 
      content: updatedContent 
    }
    emit('update-note', updatedNote)
    emit('save-note')
  }
}

// 处理标签变化
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

// 处理新标签输入
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

const handleNewTagEnter = () => {
  handleNewTagBlur()
}

// 文本格式化（核心修复：光标位置控制）
const formatText = (type: string) => {
  if (!props.activeNote || !isEditing.value || !editorRef.value) return
  
  const selection = window.getSelection()
  if (!selection) return

  // 保存当前光标位置
  const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null
  
  // 定义占位文本和格式化规则
  const formatRules: Record<string, { placeholder: string; wrapper: [string, string] }> = {
    bold: { placeholder: '加粗文本', wrapper: ['**', '**'] },
    italic: { placeholder: '斜体文本', wrapper: ['*', '*'] },
    underline: { placeholder: '下划线文本', wrapper: ['__', '__'] },
    heading: { placeholder: '标题文本', wrapper: ['# ', ''] },
    list: { placeholder: '列表项', wrapper: ['- ', ''] },
    link: { placeholder: '链接文本', wrapper: ['[', '](https://example.com)'] }
  }

  const { placeholder, wrapper } = formatRules[type]
  const [prefix, suffix] = wrapper
  const selectedText = selection.toString() || placeholder
  
  // 插入格式化文本
  document.execCommand('insertText', false, prefix + selectedText + suffix)
  
  // 修复光标位置（移至格式化文本末尾，避免倒序插入）
  nextTick(() => {
    if (range && editorRef.value) {
      const newRange = document.createRange()
      // 找到最后插入的文本节点并定位光标
      newRange.setStartAfter(selection.focusNode || editorRef.value)
      newRange.collapse(true)
      selection.removeAllRanges()
      selection.addRange(newRange)
    }
    
    // 更新内容（使用textContent确保顺序）
    const updatedNote = { 
      ...props.activeNote, 
      content: editorRef.value?.textContent || ''
    }
    emit('update-note', updatedNote)
    emit('save-note')
  })
}

// 清除格式
const clearFormatting = () => {
  if (!props.activeNote || !isEditing.value || !editorRef.value) return
  
  document.execCommand('removeFormat', false)
  
  // 重置为纯文本，确保顺序正确
  const updatedNote = { 
    ...props.activeNote, 
    content: editorRef.value.textContent || ''
  }
  emit('update-note', updatedNote)
  emit('save-note')
}

// 快捷键处理
const handleKeydown = (e: KeyboardEvent) => {
  if (!isEditing.value) return
  
  // 阻止默认行为，避免浏览器快捷键冲突
  if (e.ctrlKey && ['b', 'i', 'u', 's'].includes(e.key)) {
    e.preventDefault()
  }
  
  // Ctrl+B 加粗
  if (e.ctrlKey && e.key === 'b') {
    formatText('bold')
  }
  // Ctrl+I 斜体
  if (e.ctrlKey && e.key === 'i') {
    formatText('italic')
  }
  // Ctrl+U 下划线
  if (e.ctrlKey && e.key === 'u') {
    formatText('underline')
  }
  // Ctrl+S 保存
  if (e.ctrlKey && e.key === 's') {
    emit('save-note')
    lastSavedTime.value = new Date()
  }
}

// 生命周期钩子
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
/* 富文本预览样式增强 */
.prose h3 {
  font-size: 1.2em;
  margin: 0.5em 0;
  color: #1a1a1a;
}

.prose ul {
  margin: 0.5em 0;
  padding-left: 1.5em;
  list-style-type: disc;
}

.prose li {
  margin: 0.25em 0;
}

.prose a {
  color: #3b82f6;
  text-decoration: underline;
}

.prose strong {
  font-weight: 600;
}

.prose em {
  font-style: italic;
}

/* 编辑区域样式优化 */
[contenteditable] {
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
  overflow-wrap: break-word;
  min-height: 100px;
}

[contenteditable]:focus {
  outline: 1px solid #93c5fd;
  border-radius: 2px;
}

/* 响应式调整 - 避免嵌套中的特殊字符 */
@media (max-width: 768px) {
  .w-1\/3 { /* 对/进行转义，避免解析错误 */
    width: 100% !important;
    border-top: 1px solid #e2e8f0;
  }
  
  .flex-1.overflow-hidden.flex {
    flex-direction: column;
  }
}

/* 全屏模式样式 - 扁平化嵌套，避免解析混乱 */
:deep(.mode-fullpage) .dialog-header {
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

:deep(.mode-fullpage) .flex-1.overflow-y-auto.p-3 {
  padding: 1rem;
}

:deep(.mode-fullpage) .w-1\/3:last-child { /* 转义/，并扁平化嵌套 */
  display: none;
}

/* 弹窗模式样式 - 扁平化嵌套 */
:deep(.mode-dialog) .p-3 {
  padding: 0.75rem !important;
}
</style>