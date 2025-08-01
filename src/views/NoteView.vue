<template>
  <div 
    v-if="visible"
    ref="dialogRef"
    :class="mode === 'dialog' 
      ? 'fixed z-50 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col transition-all duration-300' 
      : 'w-full h-screen flex flex-col'"
    :style="dialogStyle"
  >
    <!-- 标题栏 -->
    <div 
      class="dialog-header p-3 border-b border-gray-200 flex justify-between items-center cursor-move"
      @mousedown="startDrag"
      :style="mode === 'fullpage' ? { cursor: 'default' } : {}"
    >
      <h3 class="font-medium">学习笔记</h3>
      <div class="flex space-x-2">
        <!-- 模式切换按钮 -->
        <button 
          @click="toggleMode" 
          class="p-1 hover:bg-gray-100 rounded transition-colors" 
          :title="mode === 'dialog' ? '切换到全页面模式' : '切换到弹窗模式'"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
        </button>
        <button @click="addNewNote" class="p-1 hover:bg-gray-100 rounded transition-colors" title="新建笔记 (Ctrl+N)">
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
        <!-- 只有弹窗模式显示关闭按钮 -->
        <button 
          @click="close" 
          class="p-1 hover:bg-gray-100 rounded transition-colors" 
          title="关闭"
          v-if="mode === 'dialog'"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="flex flex-1 overflow-hidden">
      <!-- 笔记列表 -->
      <NoteList 
        :notes="sortedFilteredNotes"
        :active-note-id="activeNoteId"
        :search-query="searchQuery"
        :selected-tag="selectedTag"
        :all-tags="allTags"
        :sort-type="sortType"
        @select-note="selectNote"
        @search="searchQuery = $event"
        @change-tag="selectedTag = $event"
        @change-sort="sortType = $event"
      />
      
      <!-- 笔记编辑器 -->
      <NoteEditor 
        :active-note="activeNote"
        :all-tags="allTags"
        :show-preview="mode === 'fullpage'"
        @save-note="saveNote"
        @update-note="updateNote"
        @add-new-tag="addNewTag"
      />
    </div>

    <!-- 只有弹窗模式显示调整尺寸的拖拽手柄 -->
    <div 
      v-if="mode === 'dialog'"
      class="absolute right-0 bottom-0 w-5 h-5 cursor-se-resize bg-gray-100 border-t border-l border-gray-300 flex items-center justify-center hover:bg-gray-200 transition-colors"
      @mousedown="startResize"
    >
      <svg class="w-3 h-3 text-gray-500" viewBox="0 0 10 10">
        <path d="M8 0L10 2L2 10L0 8L8 0Z" fill="currentColor"/>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch, onUnmounted } from 'vue'
import { debounce } from 'lodash'
import NoteList from '@/components/note/NoteList.vue'
import NoteEditor from '@/components/note/NoteEditor.vue'
import type { EnhancedNote } from '@/types/note'
import { formatDate, formatTime, loadNotes, saveNotes } from '@/utils/note'

// 定义 props 和 emit
const props = defineProps<{ 
  visible: boolean,
  mode?: 'dialog' | 'fullpage'
}>()
const emit = defineEmits(['close', 'update:mode'])

// 当前模式，默认弹窗模式
const mode = ref<('dialog' | 'fullpage')>(props.mode || 'dialog')

// 切换模式
const toggleMode = () => {
  mode.value = mode.value === 'dialog' ? 'fullpage' : 'dialog'
  emit('update:mode', mode.value)
  
  // 如果切换到全屏模式，重置位置和大小
  if (mode.value === 'fullpage') {
    position.value = { x: 0, y: 0 }
    size.value = { 
      width: window.innerWidth,
      height: window.innerHeight
    }
  } else {
    // 切换回弹窗模式，设置一个更小的默认大小
    size.value = { 
      width: 600,
      height: 450
    }
    // 确保弹窗在可视区域内并居中
    position.value = { 
      x: Math.max(0, (window.innerWidth - size.value.width) / 2),
      y: Math.max(0, (window.innerHeight - size.value.height) / 2)
    }
  }
}

// 关闭方法
const close = () => {
  emit('close')
}

// 对话框相关 - 支持自定义宽高
const dialogRef = ref<HTMLElement | null>(null)
const position = ref({ x: 100, y: 100 })
const size = ref({ 
  width: 600,
  height: 450
})
const dragStartPos = ref({ x: 0, y: 0 })
const resizeStartPos = ref({ x: 0, y: 0 })
const isDragging = ref(false)
const isResizing = ref(false)

// 计算属性：对话框样式（支持响应式）
const dialogStyle = computed(() => {
  // 全屏模式下忽略位置和大小设置
  if (mode.value === 'fullpage') {
    return {
      left: '0px',
      top: '0px',
      width: '100vw',
      height: '100vh',
      minWidth: '100vw',
      minHeight: '100vh'
    }
  }
  
  return {
    left: `${position.x}px`,
    top: `${position.y}px`,
    width: `${size.width}px`,
    height: `${size.height}px`,
    minWidth: '500px',
    minHeight: '350px',
    maxWidth: '95vw',
    maxHeight: '95vh'
  }
})

// 笔记相关
const notes = ref<EnhancedNote[]>([])
const activeNoteId = ref<string | null>(null)
const searchQuery = ref('')
const selectedTag = ref('')
const sortType = ref('latest')
const lastSavedTime = ref<Date | null>(null)

// 防抖保存函数（300ms延迟）
const debouncedSaveNote = debounce(() => {
  if (activeNote.value) {
    activeNote.value.updatedAt = new Date()
    saveNotes(notes.value)
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
  const sorted = [...filteredNotes.value]
  
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

// 拖拽移动对话框 - 只有弹窗模式有效
const startDrag = (e: MouseEvent) => {
  if (mode.value === 'fullpage') return;
  
  e.preventDefault()
  isDragging.value = true
  dragStartPos.value = {
    x: e.clientX - position.value.x,
    y: e.clientY - position.value.y
  }
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
  
  if (dialogRef.value) {
    dialogRef.value.classList.add('shadow-2xl')
    dialogRef.value.style.transition = 'none'
  }
}

const onDrag = (e: MouseEvent) => {
  if (!isDragging.value || mode.value === 'fullpage') return;
  
  const maxX = window.innerWidth - size.value.width
  const maxY = window.innerHeight - size.value.height
  
  position.value = {
    x: Math.max(0, Math.min(e.clientX - dragStartPos.value.x, maxX)),
    y: Math.max(0, Math.min(e.clientY - dragStartPos.value.y, maxY))
  }
}

const stopDrag = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
  
  if (dialogRef.value) {
    dialogRef.value.classList.remove('shadow-2xl')
    dialogRef.value.style.transition = ''
  }
}

// 拖拽调整尺寸 - 只有弹窗模式有效
const startResize = (e: MouseEvent) => {
  if (mode.value === 'fullpage') return;
  
  e.preventDefault()
  isResizing.value = true
  resizeStartPos.value = {
    x: e.clientX,
    y: e.clientY
  }
  document.addEventListener('mousemove', onResize)
  document.addEventListener('mouseup', stopResize)
  
  if (dialogRef.value) {
    dialogRef.value.style.transition = 'none'
  }
}

const onResize = (e: MouseEvent) => {
  if (!isResizing.value || !dialogRef.value || mode.value === 'fullpage') return;
  
  const widthDelta = e.clientX - resizeStartPos.value.x
  const heightDelta = e.clientY - resizeStartPos.value.y
  
  size.value = {
    width: Math.max(500, Math.min(95 * window.innerWidth / 100, size.value.width + widthDelta)),
    height: Math.max(350, Math.min(95 * window.innerHeight / 100, size.value.height + heightDelta))
  }
  
  resizeStartPos.value = {
    x: e.clientX,
    y: e.clientY
  }
}

const stopResize = () => {
  isResizing.value = false
  document.removeEventListener('mousemove', onResize)
  document.removeEventListener('mouseup', stopResize)
  
  if (dialogRef.value) {
    dialogRef.value.style.transition = ''
  }
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
  saveNotes(notes.value)
  lastSavedTime.value = new Date()
}

const selectNote = (id: string) => {
  activeNoteId.value = id
}

const saveNote = () => {
  debouncedSaveNote()
}

const updateNote = (updatedNote: EnhancedNote) => {
  const index = notes.value.findIndex(note => note.id === updatedNote.id)
  if (index !== -1) {
    notes.value[index] = updatedNote
    debouncedSaveNote()
  }
}

const deleteNote = () => {
  if (!activeNoteId.value) return
  
  if (confirm('确定要删除这条笔记吗？此操作不可恢复。')) {
    const index = notes.value.findIndex(note => note.id === activeNoteId.value)
    if (index !== -1) {
      notes.value.splice(index, 1)
      activeNoteId.value = notes.value.length > 0 ? notes.value[0].id : null
      saveNotes(notes.value)
      lastSavedTime.value = new Date()
    }
  }
}

const exportNote = () => {
  if (!activeNote.value) return
  
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

const addNewTag = (tagName: string) => {
  if (tagName && !allTags.value.includes(tagName) && activeNote.value) {
    activeNote.value.tag = tagName.trim()
    saveNote()
  }
}

// 监听窗口尺寸变化，自动调整对话框位置
const handleWindowResize = () => {
  if (!dialogRef.value || mode.value === 'fullpage') return
  
  const maxX = window.innerWidth - size.value.width
  const maxY = window.innerHeight - size.value.height
  
  position.value = {
    x: Math.min(position.value.x, maxX),
    y: Math.min(position.value.y, maxY)
  }
}

// 保存和恢复滚动位置
const listScrollTop = ref(0)
const editorScrollTop = ref(0)

const saveScrollPositions = () => {
  const listContainer = dialogRef.value?.querySelector('.overflow-y-auto') as HTMLElement
  if (listContainer) listScrollTop.value = listContainer.scrollTop
  
  const editorContainer = dialogRef.value?.querySelector('.flex-1.overflow-y-auto.p-3') as HTMLElement
  if (editorContainer) editorScrollTop.value = editorContainer.scrollTop
}

const restoreScrollPositions = () => {
  const listContainer = dialogRef.value?.querySelector('.overflow-y-auto') as HTMLElement
  if (listContainer) listContainer.scrollTop = listScrollTop.value
  
  const editorContainer = dialogRef.value?.querySelector('.flex-1.overflow-y-auto.p-3') as HTMLElement
  if (editorContainer) editorContainer.scrollTop = editorScrollTop.value
}

// 监听模式切换
watch(
  () => mode.value,
  (newMode, oldMode) => {
    if (oldMode) {
      saveScrollPositions()
      nextTick(() => {
        restoreScrollPositions()
      })
    }
  }
)

// 监听visible变化
watch(
  () => props.visible,
  (newVal) => {
    if (!newVal) {
      debouncedSaveNote.cancel()
    } else if (newVal && mode.value === 'fullpage') {
      size.value = { 
        width: window.innerWidth,
        height: window.innerHeight
      }
    }
  }
)

// 初始化
onMounted(() => {
  notes.value = loadNotes()
  if (notes.value.length > 0) {
    selectNote(notes.value[0].id)
  }
  
  // 初始化位置（居中显示）
  if (mode.value === 'dialog') {
    position.value = { 
      x: Math.max(0, (window.innerWidth - size.value.width) / 2),
      y: Math.max(0, (window.innerHeight - size.value.height) / 2)
    }
  }
  
  // 注册快捷键
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'n') {
      e.preventDefault()
      addNewNote()
    }
  })
  
  window.addEventListener('resize', handleWindowResize)
})

// 组件卸载时清理
onUnmounted(() => {
  debouncedSaveNote.cancel()
  window.removeEventListener('resize', handleWindowResize)
})
</script>

<style scoped>
.dialog-header {
  user-select: none;
}

/* 滚动条美化 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 响应式调整 */
@media (max-width: 768px) {
  :deep(.mode-dialog) {
    width: 95vw !important;
    height: 90vh !important;
  }
}
</style>
