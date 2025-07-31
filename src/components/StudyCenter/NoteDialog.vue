<template>
  <div 
    v-if="visible"
    ref="dialogRef"
    class="fixed z-50 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col"
    :style="{
      left: `${position.x}px`,
      top: `${position.y}px`,
      width: '600px',
      height: '600px'
    }"
  >
    <div 
      class="dialog-header p-3 border-b border-gray-200 flex justify-between items-center cursor-move"
      @mousedown="startDrag"
    >
      <h3 class="font-medium">学习笔记</h3>
      <div class="flex space-x-2">
        <button @click="addNewNote" class="p-1 hover:bg-gray-100 rounded transition-colors" title="新建笔记">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
        </button>
        <button @click="exportNote" class="p-1 hover:bg-gray-100 rounded transition-colors" title="导出笔记" :disabled="!activeNote">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
          </svg>
        </button>
        <button @click="deleteNote" class="p-1 hover:bg-gray-100 rounded transition-colors text-red-500" title="删除笔记" :disabled="!activeNote">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
        </button>
        <button @click="close" class="p-1 hover:bg-gray-100 rounded transition-colors" title="关闭">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>

    <div class="flex flex-1 overflow-hidden">
      <!-- 笔记列表与搜索 -->
      <div class="w-1/3 border-r border-gray-200 flex flex-col">
        <div class="p-2 border-b border-gray-100">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索笔记..."
            class="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
        </div>
        <div class="flex items-center justify-between p-2 border-b border-gray-100">
          <div class="flex items-center">
            <span class="text-xs text-gray-500 mr-2">分类</span>
            <select 
              v-model="selectedTag" 
              class="text-xs border-none bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">全部</option>
              <option v-for="tag in allTags" :key="tag" :value="tag">{{ tag }}</option>
            </select>
          </div>
          <div class="flex items-center">
            <span class="text-xs text-gray-500 mr-2">排序</span>
            <select 
              v-model="sortType" 
              class="text-xs border-none bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500"
              @change="sortNotes"
            >
              <option value="latest">最新更新</option>
              <option value="oldest">最早更新</option>
              <option value="title">按标题</option>
            </select>
          </div>
        </div>
        <div class="flex-1 overflow-y-auto">
          <div 
            v-for="note in sortedFilteredNotes" 
            :key="note.id"
            class="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
            :class="{ 'bg-blue-50': activeNoteId === note.id }"
            @click="selectNote(note.id)"
          >
            <div class="text-sm font-medium truncate">
              {{ note.title || note.content.substring(0, 15) || '新建笔记' }}
            </div>
            <div class="flex items-center mt-1">
              <span class="text-xs text-gray-500 mr-2">
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
          <div v-if="sortedFilteredNotes.length === 0" class="p-4 text-center text-gray-500 text-sm">
            没有找到笔记
          </div>
        </div>
      </div>

      <!-- 笔记编辑器 -->
      <div class="flex-1 flex flex-col">
        <div class="p-3 border-b border-gray-100">
          <input
            v-if="activeNote"
            v-model="activeNote.title"
            type="text"
            placeholder="笔记标题..."
            class="w-full px-2 py-1 text-lg font-medium border-none outline-none focus:ring-1 focus:ring-blue-500"
            @input="handleTitleChange"
          >
          <div class="flex items-center justify-between mt-2">
            <div class="flex items-center">
              <select 
                v-if="activeNote"
                v-model="activeNote.tag" 
                class="text-sm border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                @change="saveNote"
                @input="handleTagChange"
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
                @blur="addNewTag"
                @keyup.enter="addNewTag"
              >
            </div>
            <div class="text-xs text-gray-500">
              <span v-if="lastSavedTime">最近保存: {{ formatTime(lastSavedTime) }}</span>
              <span v-else-if="activeNote">自动保存中...</span>
            </div>
          </div>
        </div>
        <div class="flex-1 overflow-hidden flex">
          <div class="flex-1 flex flex-col overflow-hidden border-r border-gray-100">
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
            <div 
              v-if="activeNote"
              v-html="formattedContent"
              class="flex-1 p-3 outline-none overflow-y-auto"
              contenteditable
              @input="handleContentChange"
              @focus="isEditing = true"
              @blur="isEditing = false"
            ></div>
            <div v-else class="flex-1 flex items-center justify-center text-gray-400">
              选择或创建笔记开始编辑
            </div>
          </div>
          <div class="w-1/3 p-3 overflow-y-auto bg-gray-50">
            <h4 class="text-sm font-medium mb-2">预览</h4>
            <div v-if="activeNote" class="prose prose-sm max-w-none">
              <div v-html="formattedContent"></div>
            </div>
            <div v-else class="text-gray-500 text-sm">请选择或创建笔记</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch,onUnmounted } from 'vue'
import { debounce } from 'lodash' // 需要安装 lodash: pnpm add lodash

// 扩展Note类型，增加标题和分类
interface EnhancedNote {
  id: string
  title: string
  content: string
  tag?: string
  createdAt: Date
  updatedAt: Date
}

// 定义 props 和 emit
const props = defineProps<{ visible: boolean }>()
const emit = defineEmits(['close'])

// 关键：定义 close 方法，用于触发关闭事件
const close = () => {
  emit('close') // 通知父组件关闭对话框
}
// 对话框相关
const dialogRef = ref<HTMLElement | null>(null)
const position = ref({ x: 100, y: 100 })
const dragStartPos = ref({ x: 0, y: 0 })
const isDragging = ref(false)

// 笔记相关
const notes = ref<EnhancedNote[]>([])
const activeNoteId = ref<string | null>(null)
const searchQuery = ref('')
const selectedTag = ref('')
const newTagName = ref('')
const showNewTagInput = ref(false)
const isEditing = ref(false)
const sortType = ref('latest') // latest, oldest, title
const lastSavedTime = ref<Date | null>(null)

// 防抖保存函数（300ms延迟）
const debouncedSaveNote = debounce(() => {
  if (activeNote.value) {
    activeNote.value.updatedAt = new Date()
    saveNotes()
    lastSavedTime.value = new Date()
  }
}, 300)

// 计算属性
const activeNote = computed<EnhancedNote | undefined>(() => {
  return notes.value.find(note => note.id === activeNoteId.value)
})

const filteredNotes = computed<EnhancedNote[]>(() => {
  return notes.value.filter(note => {
    const matchesSearch = 
      !searchQuery.value || 
      note.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesTag = !selectedTag.value || note.tag === selectedTag.value
    
    return matchesSearch && matchesTag
  })
})

const sortedFilteredNotes = computed<EnhancedNote[]>(() => {
  // 复制数组避免修改原数组
  const sorted = [...filteredNotes.value]
  
  // 根据排序类型排序
  switch (sortType.value) {
    case 'latest':
      return sorted.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime())
    case 'title':
      return sorted.sort((a, b) => a.title.localeCompare(b.title))
    default:
      return sorted
  }
})

const allTags = computed<string[]>(() => {
  const tags = new Set<string>()
  notes.value.forEach(note => {
    if (note.tag) tags.add(note.tag)
  })
  return Array.from(tags).sort()
})

const formattedContent = computed<string>(() => {
  if (!activeNote.value) return ''
  
  let content = activeNote.value.content
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/__(.*?)__/g, '<u>$1</u>')
    .replace(/^# (.*?)$/gm, '<h3 class="text-lg font-bold mt-2 mb-1">$1</h3>')
    .replace(/^- (.*?)$/gm, '<li class="ml-4">$1</li>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="text-blue-500 underline">$1</a>')
  
  // 处理无序列表
  if (content.includes('<li>')) {
    content = content.replace(/(<li>.*?<\/li>)+/gs, '<ul class="list-disc mb-2">$&</ul>')
  }
  
  return content
})

// 拖拽方法
const startDrag = (e: MouseEvent) => {
  isDragging.value = true
  dragStartPos.value = {
    x: e.clientX - position.value.x,
    y: e.clientY - position.value.y
  }
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

const onDrag = (e: MouseEvent) => {
  if (!isDragging.value) return
  // 限制拖拽范围在可视区内
  const maxX = window.innerWidth - (dialogRef.value?.offsetWidth || 600)
  const maxY = window.innerHeight - (dialogRef.value?.offsetHeight || 600)
  
  position.value = {
    x: Math.max(0, Math.min(e.clientX - dragStartPos.value.x, maxX)),
    y: Math.max(0, Math.min(e.clientY - dragStartPos.value.y, maxY))
  }
}

const stopDrag = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}

// 笔记操作
const addNewNote = () => {
  const newNote: EnhancedNote = {
    id: Date.now().toString(),
    title: '',
    content: '',
    createdAt: new Date(),
    updatedAt: new Date()
  }
  notes.value.unshift(newNote)
  selectNote(newNote.id)
  saveNotes()
  lastSavedTime.value = new Date()
  
  // 自动聚焦到标题输入框
  nextTick(() => {
    const titleInput = dialogRef.value?.querySelector('input[type="text"].text-lg')
    titleInput?.focus()
  })
}

const selectNote = (id: string) => {
  activeNoteId.value = id
}

const saveNote = () => {
  debouncedSaveNote()
}

// 标题变化处理
const handleTitleChange = () => {
  saveNote()
}

// 内容变化处理
const handleContentChange = (e: Event) => {
  if (activeNote.value) {
    const editableDiv = e.target as HTMLElement
    activeNote.value.content = editableDiv.innerText
    saveNote()
  }
}

// 分类变化处理
const handleTagChange = (e: Event) => {
  const value = (e.target as HTMLSelectElement).value
  if (value === 'new') {
    showNewTagInput.value = true
    nextTick(() => {
      const input = dialogRef.value?.querySelector('input[placeholder="输入新分类..."]') as HTMLInputElement
      input?.focus()
    })
  } else {
    showNewTagInput.value = false
  }
}

// 文本格式化
const formatText = (type: string) => {
  if (!activeNote.value || !isEditing.value) return
  
  const selection = window.getSelection()
  if (!selection?.toString()) {
    // 如果没有选中文本，根据类型插入示例文本
    let placeholder = ''
    switch (type) {
      case 'bold': placeholder = '加粗文本'; break
      case 'italic': placeholder = '斜体文本'; break
      case 'underline': placeholder = '下划线文本'; break
      case 'heading': placeholder = '标题文本'; break
      case 'list': placeholder = '列表项'; break
      case 'link': placeholder = '链接文本'; break
    }
    document.execCommand('insertText', false, placeholder)
    // 重新选中插入的文本，方便用户直接修改
    const range = document.createRange()
    const sel = window.getSelection()
    if (sel) {
      range.setStartBefore(selection.focusNode, selection.focusOffset - placeholder.length)
      range.setEnd(selection.focusNode, selection.focusOffset)
      sel.removeAllRanges()
      sel.addRange(range)
    }
  }

  const selectedText = selection?.toString() || ''
  let formattedText = ''
  
  switch (type) {
    case 'bold':
      formattedText = `**${selectedText}**`
      break
    case 'italic':
      formattedText = `*${selectedText}*`
      break
    case 'underline':
      formattedText = `__${selectedText}__`
      break
    case 'heading':
      formattedText = `# ${selectedText}`
      break
    case 'list':
      formattedText = `- ${selectedText}`
      break
    case 'link':
      formattedText = `[${selectedText || '链接文本'}](https://example.com)`
      break
  }
  
  // 替换选中的文本
  document.execCommand('insertText', false, formattedText)
  
  // 更新笔记内容
  const editableDiv = dialogRef.value?.querySelector('[contenteditable]') as HTMLElement
  if (editableDiv) {
    activeNote.value.content = editableDiv.innerText
    saveNote()
  }
}

// 清除格式
const clearFormatting = () => {
  if (!activeNote.value || !isEditing.value) return
  document.execCommand('removeFormat', false)
  
  // 更新为纯文本
  const editableDiv = dialogRef.value?.querySelector('[contenteditable]') as HTMLElement
  if (editableDiv) {
    activeNote.value.content = editableDiv.innerText
    saveNote()
  }
}

// 删除笔记
const deleteNote = () => {
  if (!activeNoteId.value) return
  
  if (confirm('确定要删除这条笔记吗？此操作不可恢复。')) {
    const index = notes.value.findIndex(note => note.id === activeNoteId.value)
    if (index !== -1) {
      notes.value.splice(index, 1)
      activeNoteId.value = notes.value.length > 0 ? notes.value[0].id : null
      saveNotes()
      lastSavedTime.value = new Date()
    }
  }
}

// 导出笔记
const exportNote = () => {
  if (!activeNote.value) return
  
  // 构建Markdown格式内容
  let content = `# ${activeNote.value.title || '无标题'}\n\n`
  content += `> 最后更新: ${formatDate(activeNote.value.updatedAt, true)}\n\n`
  content += activeNote.value.content
    .replace(/\*\*(.*?)\*\*/g, '**$1**')
    .replace(/\*(.*?)\*/g, '*$1*')
    .replace(/__(.*?)__/g, '__$1__')
    .replace(/^# (.*?)$/gm, '## $1')
    .replace(/^- (.*?)$/gm, '- $1')
  
  const blob = new Blob([content], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${activeNote.value.title || '笔记'}.md`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// 分类管理
const addNewTag = () => {
  if (newTagName.value && !allTags.value.includes(newTagName.value)) {
    if (activeNote.value) {
      activeNote.value.tag = newTagName.value.trim()
      saveNote()
    }
  }
  newTagName.value = ''
  showNewTagInput.value = false
  // 重置选择框状态
  nextTick(() => {
    const select = dialogRef.value?.querySelector('select') as HTMLSelectElement
    if (select) select.value = activeNote.value?.tag || ''
  })
}

// 排序笔记
const sortNotes = () => {
  // 由computed属性自动处理排序
}

// 格式化日期
const formatDate = (date: Date | string, full = false) => {
  const noteDate = new Date(date)
  const now = new Date()
  
  // 当天显示时间，否则显示日期
  if (full) {
    return noteDate.toLocaleString()
  }
  
  const isSameDay = noteDate.toDateString() === now.toDateString()
  const isYesterday = new Date(now.getTime() - 86400000).toDateString() === noteDate.toDateString()
  
  if (isSameDay) {
    return `今天 ${noteDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  } else if (isYesterday) {
    return `昨天 ${noteDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  } else {
    return noteDate.toLocaleDateString()
  }
}

// 格式化时间（用于最近保存提示）
const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

// 持久化方法
const loadNotes = () => {
  const saved = localStorage.getItem('study-notes')
  if (saved) {
    try {
      const parsed = JSON.parse(saved) as EnhancedNote[]
      // 转换日期字符串为Date对象
      notes.value = parsed.map(note => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt)
      }))
    } catch (e) {
      console.error('加载笔记失败', e)
      notes.value = []
    }
  }
}

const saveNotes = () => {
  localStorage.setItem('study-notes', JSON.stringify(notes.value))
}

// 监听visible变化，关闭时清理防抖
watch(
  () => props.visible,
  (newVal) => {
    if (!newVal) {
      debouncedSaveNote.cancel()
    }
  }
)

// 初始化
onMounted(() => {
  loadNotes()
  if (notes.value.length > 0) {
    selectNote(notes.value[0].id)
  }
  
  // 注册快捷键
  document.addEventListener('keydown', (e) => {
    if (!isEditing.value) return
    
    // Ctrl+B 加粗
    if (e.ctrlKey && e.key === 'b') {
      e.preventDefault()
      formatText('bold')
    }
    // Ctrl+I 斜体
    if (e.ctrlKey && e.key === 'i') {
      e.preventDefault()
      formatText('italic')
    }
    // Ctrl+U 下划线
    if (e.ctrlKey && e.key === 'u') {
      e.preventDefault()
      formatText('underline')
    }
  })
})

// 组件卸载时清理
onUnmounted(() => {
  debouncedSaveNote.cancel()
  document.removeEventListener('keydown', () => {})
})
</script>

<style scoped>
.dialog-header {
  user-select: none;
}

/* 富文本预览样式增强 */
.prose h3 {
  font-size: 1.2em;
  margin: 0.5em 0;
  color: #1a1a1a;
}

.prose ul {
  margin: 0.5em 0;
  padding-left: 1.5em;
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

/* 编辑区域聚焦样式 */
[contenteditable]:focus {
  outline: 1px solid #93c5fd;
  border-radius: 2px;
}

/* 滚动条美化 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>