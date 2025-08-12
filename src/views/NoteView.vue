<template>
  <div 
    v-if="visible"
    ref="dialogRef"
    :class="['flex flex-col transition-all duration-300 fixed', 
      mode === 'dialog' 
        ? 'z-50 bg-white rounded-lg shadow-xl border border-gray-200' 
        : 'inset-0 bg-white']"
    :style="dialogStyle"
  >
    <!-- 标题栏 -->
    <div 
      class="dialog-header p-3 border-b border-gray-200 flex justify-between items-center"
      :class="{ 'cursor-move': mode === 'dialog' }"
      @mousedown="handleHeaderMouseDown"
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
    <!-- 笔记列表 - 可拖动调整宽度 -->
    <div class="relative h-full"> <!-- 关键：添加h-full确保高度继承 -->
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
        @create-new-note="addNewNote"
        :style="{ width: `${sidebarWidth}px`, minWidth: '240px', height: '100%' }"
      />
      <!-- 列表宽度调整手柄 -->
      <div 
        v-if="mode === 'dialog'"
        class="absolute top-0 right-0 w-2 h-full cursor-col-resize bg-gray-200 hover:bg-gray-300"
        @mousedown="startResizeSidebar"
      />
    </div>
      
      <!-- 笔记编辑器 -->
      <div class="flex-1 flex flex-col overflow-hidden border-l border-gray-200">
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
        <div class="flex-1 overflow-y-auto p-3">
          <textarea
            v-if="activeNote"
            v-model="activeNote.content"
            placeholder="开始输入笔记内容..."
            class="w-full h-full border-none outline-none resize-none"
            @input="handleContentChange"
          ></textarea>
          <div v-else class="h-full flex items-center justify-center text-gray-400">
            请选择或创建一个笔记
          </div>
        </div>
      </div>
    </div>

    <!-- 弹窗尺寸调整手柄 -->
    <div 
      v-if="mode === 'dialog'"
      class="absolute right-0 bottom-0 w-5 h-5 cursor-se-resize bg-gray-100 border-t border-l border-gray-300 flex items-center justify-center hover:bg-gray-200 transition-colors"
      @mousedown="startResizeDialog"
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
import type { EnhancedNote } from '@/types/note'
import { formatDate, formatTime, loadNotes, saveNotes } from '@/utils/note'

// Props & Emits
const props = defineProps<{ 
  visible: boolean,
  mode?: 'dialog' | 'fullpage'
}>()
const emit = defineEmits(['close', 'update:mode'])

// 状态管理
const mode = ref<('dialog' | 'fullpage')>(props.mode || 'dialog')
const dialogRef = ref<HTMLElement | null>(null)
const sidebarWidth = ref(280) // 侧边栏初始宽度

// 弹窗位置与尺寸
const position = ref({ x: 100, y: 100 })
const size = ref({ width: 900, height: 600 }) // 增大默认尺寸提升体验

// 拖拽状态
const dragState = ref({
  isDragging: false,
  isResizingDialog: false,
  isResizingSidebar: false,
  startPos: { x: 0, y: 0 },
  startSize: { width: 0, height: 0 },
  startSidebarWidth: 0
})

// 笔记核心状态
const notes = ref<EnhancedNote[]>([])
const activeNoteId = ref<string | null>(null)
const searchQuery = ref('')
const selectedTag = ref('')
const sortType = ref('latest')
const lastSavedTime = ref<Date | null>(null)

// 标签管理
const showNewTagInput = ref(false)
const newTagName = ref('')

// 防抖保存（优化为500ms更合理）
const debouncedSaveNote = debounce(() => {
  if (activeNote.value) {
    activeNote.value.updatedAt = new Date()
    saveNotes(notes.value)
    lastSavedTime.value = new Date()
  }
}, 500)

// 计算属性
const activeNote = computed<EnhancedNote | undefined>(() => 
  notes.value.find(note => note.id === activeNoteId.value)
)

const filteredNotes = computed<EnhancedNote[]>(() => notes.value.filter(note => {
  const matchesSearch = !searchQuery.value || 
    note.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.value.toLowerCase())
  
  const matchesTag = !selectedTag.value || note.tag === selectedTag.value
  return matchesSearch && matchesTag
}))

const sortedFilteredNotes = computed<EnhancedNote[]>(() => {
  const sorted = [...filteredNotes.value]
  switch (sortType.value) {
    case 'latest': return sorted.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    case 'oldest': return sorted.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime())
    case 'title': return sorted.sort((a, b) => a.title.localeCompare(b.title))
    default: return sorted
  }
})

const allTags = computed<string[]>(() => {
  const tags = new Set(notes.value.map(note => note.tag).filter(Boolean))
  return Array.from(tags).sort()
})

const dialogStyle = computed(() => {
  if (mode.value === 'fullpage') {
    return {
      left: '0px',
      top: '0px'
    }
  }
  
  return {
    left: `${position.value.x}px`,
    top: `${position.value.y}px`,
    width: `${size.value.width}px`,
    height: `${size.value.height}px`,
    minWidth: '700px', // 增大最小宽度，避免布局错乱
    minHeight: '400px',
    maxWidth: '95vw',
    maxHeight: '95vh'
  }
})

// 处理标题栏鼠标按下事件，正确触发拖拽
const handleHeaderMouseDown = (e: MouseEvent) => {
  if (mode.value === 'dialog') {
    startDrag(e);
  }
}

// 弹窗拖拽
const startDrag = (e: MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  
  if (!dialogRef.value) return;
  
  // 获取对话框当前位置信息
  const rect = dialogRef.value.getBoundingClientRect();
  
  dragState.value = {
    ...dragState.value,
    isDragging: true,
    startPos: { x: e.clientX - rect.left, y: e.clientY - rect.top }
  };
  
  dialogRef.value.classList.add('shadow-2xl');
  dialogRef.value.style.setProperty('transition', 'none');
  
  document.body.addEventListener('mousemove', handleDrag);
  document.body.addEventListener('mouseup', stopDrag);
};

const handleDrag = (e: MouseEvent) => {
  if (!dragState.value.isDragging || !dialogRef.value) return;
  
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const dialogWidth = size.value.width;
  const dialogHeight = size.value.height;
  
  // 计算新位置，确保对话框不会超出视口
  let newX = e.clientX - dragState.value.startPos.x;
  let newY = e.clientY - dragState.value.startPos.y;
  
  // 限制在视口内，增加10px的边距
  newX = Math.max(10, Math.min(newX, windowWidth - dialogWidth - 10));
  newY = Math.max(10, Math.min(newY, windowHeight - dialogHeight - 10));
  
  position.value = { x: newX, y: newY };
};

const stopDrag = () => {
  dragState.value.isDragging = false;
  if (dialogRef.value) {
    dialogRef.value.classList.remove('shadow-2xl');
    dialogRef.value.style.removeProperty('transition');
  }
  document.body.removeEventListener('mousemove', handleDrag);
  document.body.removeEventListener('mouseup', stopDrag);
};

// 弹窗尺寸调整
const startResizeDialog = (e: MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  
  dragState.value = {
    ...dragState.value,
    isResizingDialog: true,
    startPos: { x: e.clientX, y: e.clientY },
    startSize: { ...size.value }
  };
  
  if (dialogRef.value) {
    dialogRef.value.style.setProperty('transition', 'none');
    dialogRef.value.classList.add('border-blue-500');
  }
  
  document.body.addEventListener('mousemove', handleResizeDialog);
  document.body.addEventListener('mouseup', stopResizeDialog);
  document.body.style.cursor = 'se-resize';
};

const handleResizeDialog = (e: MouseEvent) => {
  if (!dragState.value.isResizingDialog) return;
  
  const minWidth = 700;
  const minHeight = 400;
  const maxWidth = window.innerWidth * 0.95;
  const maxHeight = window.innerHeight * 0.95;
  
  // 计算新尺寸
  let newWidth = dragState.value.startSize.width + (e.clientX - dragState.value.startPos.x);
  let newHeight = dragState.value.startSize.height + (e.clientY - dragState.value.startPos.y);
  
  // 限制尺寸范围
  newWidth = Math.max(minWidth, Math.min(newWidth, maxWidth));
  newHeight = Math.max(minHeight, Math.min(newHeight, maxHeight));
  
  size.value = { width: newWidth, height: newHeight };
  
  // 调整位置，确保对话框不会超出视口
  handleWindowResize();
};

const stopResizeDialog = () => {
  dragState.value.isResizingDialog = false;
  if (dialogRef.value) {
    dialogRef.value.style.removeProperty('transition');
    dialogRef.value.classList.remove('border-blue-500');
  }
  document.body.removeEventListener('mousemove', handleResizeDialog);
  document.body.removeEventListener('mouseup', stopResizeDialog);
  document.body.style.cursor = '';
};

// 侧边bar宽度调整
const startResizeSidebar = (e: MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  
  dragState.value = {
    ...dragState.value,
    isResizingSidebar: true,
    startPos: { x: e.clientX },
    startSidebarWidth: sidebarWidth.value
  };
  
  document.body.style.cursor = 'col-resize';
  document.body.classList.add('select-none');
  document.body.addEventListener('mousemove', handleResizeSidebar);
  document.body.addEventListener('mouseup', stopResizeSidebar);
};

const handleResizeSidebar = (e: MouseEvent) => {
  if (!dragState.value.isResizingSidebar) return;
  
  // 计算新宽度
  let newWidth = dragState.value.startSidebarWidth + (e.clientX - dragState.value.startPos.x);
  
  // 限制宽度范围
  const maxWidth = Math.floor(window.innerWidth / 2);
  newWidth = Math.max(240, Math.min(maxWidth, newWidth));
  
  sidebarWidth.value = newWidth;
};

const stopResizeSidebar = () => {
  dragState.value.isResizingSidebar = false;
  document.body.style.cursor = '';
  document.body.classList.remove('select-none');
  document.body.removeEventListener('mousemove', handleResizeSidebar);
  document.body.removeEventListener('mouseup', stopResizeSidebar);
};

// 模式切换
const toggleMode = () => {
  mode.value = mode.value === 'dialog' ? 'fullpage' : 'dialog'
  emit('update:mode', mode.value)
  
  if (mode.value === 'fullpage') {
    // 全屏模式记录当前尺寸，便于切换回弹窗时恢复
    dragState.value.startSize = { ...size.value }
    position.value = { x: 0, y: 0 } // 全屏模式下位置重置为视口左上角
  } else {
    // 恢复弹窗尺寸（使用之前记录的尺寸或默认值）
    size.value = dragState.value.startSize || { width: 900, height: 600 }
    position.value = {
      x: Math.max(0, (window.innerWidth - size.value.width) / 2),
      y: Math.max(0, (window.innerHeight - size.value.height) / 2)
    }
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
  // 自动聚焦到编辑器
  nextTick(() => {
    document.querySelector('textarea')?.focus()
  })
}

const deleteNote = () => {
  if (!activeNoteId.value) return
  
  if (confirm('确定要删除这条笔记吗？此操作不可恢复。')) {
    const index = notes.value.findIndex(note => note.id === activeNoteId.value)
    if (index !== -1) {
      notes.value.splice(index, 1)
      activeNoteId.value = notes.value.length ? notes.value[0].id : null
      saveNotes(notes.value)
      lastSavedTime.value = new Date()
    }
  }
}

const exportNote = () => {
  if (!activeNote.value) return
  
  // 修复模板字符串语法错误
  const content = `# ${activeNote.value.title || '无标题'}\n\n` +
    `> 最后更新: ${formatDate(activeNote.value.updatedAt, true)}\n\n` +
    activeNote.value.content
      .replace(/\*\*(.*?)\*\*/g, '**$1**')
      .replace(/\*(.*?)\*/g, '*$1*')
      .replace(/__(.*?)__/g, '__$1__')
  
  const blob = new Blob([content], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${activeNote.value.title || '笔记'}.md`
  a.click()
  URL.revokeObjectURL(url)
}

// 编辑器事件
const handleTitleChange = () => activeNote.value && updateNote(activeNote.value)
const handleContentChange = () => activeNote.value && updateNote(activeNote.value)

const updateNote = (note: EnhancedNote) => {
  const index = notes.value.findIndex(n => n.id === note.id)
  if (index !== -1) {
    notes.value[index] = note
    debouncedSaveNote()
  }
}

// 标签管理
const handleTagChange = () => {
  if (!activeNote.value) return
  
  if (activeNote.value.tag === 'new') {
    showNewTagInput.value = true
    nextTick(() => {
      document.querySelector('input[placeholder="输入新分类..."]')?.focus()
    })
    activeNote.value.tag = ''
  } else {
    showNewTagInput.value = false
    updateNote(activeNote.value)
  }
}

const handleNewTagBlur = () => {
  if (newTagName.value.trim() && activeNote.value) {
    activeNote.value.tag = newTagName.value.trim()
    updateNote(activeNote.value)
  }
  newTagName.value = ''
  showNewTagInput.value = false
}

const handleNewTagEnter = () => handleNewTagBlur()

// 文本格式化
const formatText = (type: string) => {
  if (!activeNote.value) return
  
  const textarea = document.querySelector('textarea') as HTMLTextAreaElement
  if (!textarea) return
  
  const { selectionStart: start, selectionEnd: end } = textarea
  const selectedText = activeNote.value.content.substring(start, end)
  let formattedText = ''
  
  switch (type) {
    case 'bold': formattedText = `**${selectedText}**`; break
    case 'italic': formattedText = `*${selectedText}*`; break
    case 'underline': formattedText = `__${selectedText}__`; break
    case 'heading': formattedText = `# ${selectedText}`; break
    case 'list': formattedText = `- ${selectedText}`; break
    case 'link': formattedText = `[${selectedText || '链接文本'}](https://example.com)`; break
  }
  
  // 替换选中内容并更新光标位置
  activeNote.value.content = 
    activeNote.value.content.substring(0, start) +
    formattedText +
    activeNote.value.content.substring(end)
  
  nextTick(() => {
    textarea.focus()
    textarea.selectionStart = textarea.selectionEnd = start + formattedText.length
  })
  
  updateNote(activeNote.value)
}

const clearFormatting = () => {
  if (!activeNote.value) return
  
  activeNote.value.content = activeNote.value.content
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/^# (.*?)$/gm, '$1')
    .replace(/^- (.*?)$/gm, '$1')
  
  updateNote(activeNote.value)
}

// 窗口 resize 处理
const handleWindowResize = () => {
  if (mode.value === 'fullpage') {
    return // 全屏模式下由 `inset-0` 自动适配，无需额外调整
  }
  
  // 弹窗模式下确保位置不超出视口
  const maxX = window.innerWidth - size.value.width
  const maxY = window.innerHeight - size.value.height
  position.value = {
    x: Math.min(position.value.x, maxX),
    y: Math.min(position.value.y, maxY)
  }
}

// 快捷键
const setupShortcuts = () => {
  const handleKeydown = (e: KeyboardEvent) => {
    if (e.ctrlKey) {
      switch (e.key) {
        case 'n': 
          e.preventDefault()
          addNewNote()
          break
        case 'b': 
          e.preventDefault()
          formatText('bold')
          break
        case 'i': 
          e.preventDefault()
          formatText('italic')
          break
      }
    }
  }
  
  document.addEventListener('keydown', handleKeydown)
  return () => document.removeEventListener('keydown', handleKeydown)
}

// 初始化与清理
onMounted(() => {
  // 加载笔记数据
  notes.value = loadNotes()
  if (notes.value.length) selectNote(notes.value[0].id)
  
  // 初始化位置
  if (mode.value === 'dialog') {
    // 弹窗模式居中
    position.value = {
      x: Math.max(0, (window.innerWidth - size.value.width) / 2),
      y: Math.max(0, (window.innerHeight - size.value.height) / 2)
    }
  } else {
    // 全屏模式位置为视口左上角
    position.value = { x: 0, y: 0 }
  }
  
  // 注册事件
  window.addEventListener('resize', handleWindowResize)
  const cleanupShortcuts = setupShortcuts()
  
  // 组件卸载时清理
  onUnmounted(() => {
    cleanupShortcuts()
    window.removeEventListener('resize', handleWindowResize)
    debouncedSaveNote.cancel()
  })
})

// 监听 visible 变化
watch(() => props.visible, (visible) => {
  if (!visible) debouncedSaveNote.cancel()
})

// 关闭弹窗
const close = () => emit('close')
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

/* 拖拽相关样式 */
:deep(.shadow-2xl) {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
}

.border-blue-500 {
  border-color: #3b82f6 !important;
}

.select-none {
  user-select: none;
  -webkit-user-select: none;
}

/* 拖拽时的视觉反馈 */
:deep(.cursor-move:hover) {
  background-color: #f9fafb;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .dialog-header {
    padding: 2px; 
  }
  
  /* 保留移动端全屏逻辑，但确保NoteList高度正确 */
  :deep(.mode-dialog) {
    width: 100vw !important;
    height: 100vh !important;
    left: 0 !important;
    top: 0 !important;
    border-radius: 0 !important;
  }
  
  /* 移动端强制NoteList高度适应 */
  :deep(.scrollbar-visible) {
    height: calc(100vh - 120px) !important; /* 根据实际头部高度调整 */
  }
}
</style>
