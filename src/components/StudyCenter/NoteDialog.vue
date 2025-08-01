<template>
  <!-- 根据形态决定根元素样式 -->
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
      <!-- 笔记列表与搜索 -->
      <div class="w-1/3 border-r border-gray-200 flex flex-col" :style="mode === 'fullpage' ? { maxWidth: '300px' } : {}">
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
        <div class="flex-1 overflow-y-auto min-h-0">
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
              ></div>
              <div v-else class="flex items-center justify-center h-full text-gray-400">
                选择或创建笔记开始编辑
              </div>
            </div>
          </div>
          
          <!-- 只有全页面模式显示预览 -->
          <div 
            class="w-1/3 overflow-y-auto bg-gray-50 p-3 min-h-0"
            v-if="mode === 'fullpage'"
          >
            <h4 class="text-sm font-medium mb-2">预览</h4>
            <div v-if="activeNote" class="prose prose-sm max-w-none">
              <div v-html="formattedContent"></div>
            </div>
            <div v-else class="text-gray-500 text-sm">请选择或创建笔记</div>
          </div>
        </div>
      </div>
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
const props = defineProps<{ 
  visible: boolean,
  // 新增mode属性，控制是弹窗还是全页面模式
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
      width: 600,  // 缩小默认宽度
      height: 450  // 缩小默认高度
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
  width: 600,  // 缩小默认宽度
  height: 450  // 缩小默认高度
})
const dragStartPos = ref({ x: 0, y: 0 })
const resizeStartPos = ref({ x: 0, y: 0 })
const isDragging = ref(false)
const isResizing = ref(false)

// 计算属性：对话框样式（支持响应式）
const dialogStyle = computed(() => {
  if (mode.value === 'fullpage') {
    return {
      position: 'fixed', // 全屏模式也需要fixed定位
      left: '0px',
      top: '0px',
      width: '100vw',
      height: '100vh',
      minWidth: '100vw',
      minHeight: '100vh'
    }
  }
  
  return {
    position: 'fixed', // 弹窗模式必须设置fixed定位，否则left/top无效
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
  
  if (content.includes('<li>')) {
    content = content.replace(/(<li>.*<li>.*?<\/li>)+/gs, '<ul class="list-disc mb-2">$&</ul>')
  }
  
  return content
})

// 拖拽移动对话框 - 只有弹窗模式有效
const startDrag = (e: MouseEvent) => {
  if (mode.value === 'fullpage' || !dialogRef.value) return; // 增加dialogRef存在性判断
  
  e.preventDefault()
  e.stopPropagation() // 阻止事件冒泡，避免被父元素拦截
  isDragging.value = true
  
  // 计算鼠标相对于对话框的初始位置（关键：基于对话框的当前位置）
  const dialogRect = dialogRef.value.getBoundingClientRect()
  dragStartPos.value = {
    x: e.clientX - dialogRect.left, // 鼠标在对话框内的X偏移
    y: e.clientY - dialogRect.top   // 鼠标在对话框内的Y偏移
  }
  
  // 绑定全局事件（使用箭头函数确保this指向正确）
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag, { once: true }) // once: true自动移除事件
  
  // 视觉反馈
  dialogRef.value.classList.add('shadow-2xl')
  dialogRef.value.style.transition = 'none'
}

// 修复拖拽中逻辑（确保位置计算正确）
const onDrag = (e: MouseEvent) => {
  if (!isDragging.value || mode.value === 'fullpage' || !dialogRef.value) return;
  
  e.preventDefault()
  
  // 计算新位置（基于视口）
  const newX = e.clientX - dragStartPos.value.x
  const newY = e.clientY - dragStartPos.value.y
  
  // 限制在视口内（避免拖出屏幕）
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const dialogWidth = size.value.width
  const dialogHeight = size.value.height
  
  position.value = {
    x: Math.max(0, Math.min(newX, viewportWidth - dialogWidth)),
    y: Math.max(0, Math.min(newY, viewportHeight - dialogHeight))
  }
}

// 修复拖拽结束逻辑（确保事件正确移除）
const stopDrag = () => {
  if (!isDragging.value) return;
  
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  
  // 恢复样式
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
  // 添加全局事件监听
  document.addEventListener('mousemove', onResize)
  document.addEventListener('mouseup', stopResize)
  
  // 添加视觉反馈
  if (dialogRef.value) {
    dialogRef.value.style.transition = 'none' // 调整大小时禁用过渡动画
  }
}

const onResize = (e: MouseEvent) => {
  if (!isResizing.value || !dialogRef.value || mode.value === 'fullpage') return;
  
  // 计算尺寸变化
  const widthDelta = e.clientX - resizeStartPos.value.x
  const heightDelta = e.clientY - resizeStartPos.value.y
  
  // 应用新尺寸（受限于最小/最大尺寸）
  size.value = {
    width: Math.max(500, Math.min(95 * window.innerWidth / 100, size.value.width + widthDelta)),
    height: Math.max(350, Math.min(95 * window.innerHeight / 100, size.value.height + heightDelta))
  }
  
  // 更新起始位置用于下一次计算
  resizeStartPos.value = {
    x: e.clientX,
    y: e.clientY
  }
}

const stopResize = () => {
  isResizing.value = false
  // 移除全局事件监听
  document.removeEventListener('mousemove', onResize)
  document.removeEventListener('mouseup', stopResize)
  
  // 恢复过渡动画
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
  saveNotes()
  lastSavedTime.value = new Date()
  
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

const handleTitleChange = () => {
  saveNote()
}

const handleContentChange = (e: Event) => {
  if (activeNote.value) {
    const editableDiv = e.target as HTMLElement
    activeNote.value.content = editableDiv.innerText
    saveNote()
  }
}

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
  
  document.execCommand('insertText', false, formattedText)
  
  const editableDiv = dialogRef.value?.querySelector('[contenteditable]') as HTMLElement
  if (editableDiv) {
    activeNote.value.content = editableDiv.innerText
    saveNote()
  }
}

const clearFormatting = () => {
  if (!activeNote.value || !isEditing.value) return
  document.execCommand('removeFormat', false)
  
  const editableDiv = dialogRef.value?.querySelector('[contenteditable]') as HTMLElement
  if (editableDiv) {
    activeNote.value.content = editableDiv.innerText
    saveNote()
  }
}

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

const addNewTag = () => {
  if (newTagName.value && !allTags.value.includes(newTagName.value)) {
    if (activeNote.value) {
      activeNote.value.tag = newTagName.value.trim()
      saveNote()
    }
  }
  newTagName.value = ''
  showNewTagInput.value = false
  nextTick(() => {
    const select = dialogRef.value?.querySelector('select') as HTMLSelectElement
    if (select) select.value = activeNote.value?.tag || ''
  })
}

const sortNotes = () => {
  // 由computed属性自动处理
}

// 格式化日期
const formatDate = (date: Date | string, full = false) => {
  const noteDate = new Date(date)
  const now = new Date()
  
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

const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

// 持久化方法
const loadNotes = () => {
  const saved = localStorage.getItem('study-notes')
  if (saved) {
    try {
      const parsed = JSON.parse(saved) as EnhancedNote[]
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
  try {
    localStorage.setItem('study-notes', JSON.stringify(notes.value))
  } catch (e) {
    console.error('保存笔记失败', e)
    alert('保存笔记失败，请检查存储空间是否充足')
  }
}

// 监听窗口尺寸变化，自动调整对话框位置
const handleWindowResize = () => {
  if (!dialogRef.value) return
  
  // 全屏模式不需要调整位置
  if (mode.value === 'fullpage') return
  
  const maxX = window.innerWidth - size.value.width
  const maxY = window.innerHeight - size.value.height
  
  position.value = {
    x: Math.min(position.value.x, maxX),
    y: Math.min(position.value.y, maxY)
  }
}

// 保存和恢复滚动位置（提升模式切换体验）
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

// 监听模式切换，保存和恢复滚动位置
watch(
  () => mode.value,
  (newMode, oldMode) => {
    if (oldMode) {
      saveScrollPositions()
      // 延迟恢复，确保DOM已更新
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
      // 当全屏模式被激活时，强制占满屏幕
      size.value = { 
        width: window.innerWidth,
        height: window.innerHeight
      }
    }
  }
)

// 初始化
onMounted(() => {
  loadNotes()
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
    // Ctrl+S 保存
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault()
      saveNote()
    }
    // Ctrl+N 新建笔记
    if (e.ctrlKey && e.key === 'n') {
      e.preventDefault()
      addNewNote()
    }
  })
  
  // 监听窗口大小变化
  window.addEventListener('resize', handleWindowResize)
})

// 组件卸载时清理
onUnmounted(() => {
  debouncedSaveNote.cancel()
  document.removeEventListener('keydown', () => {})
  window.removeEventListener('resize', handleWindowResize)
})
</script>

<style scoped>
.dialog-header {
  user-select: none;
  z-index: 9999;
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

/* 编辑区域样式优化 - 解决宽度溢出问题 */
[contenteditable] {
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word; /* 强制长单词换行 */
}

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
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* flex布局优化 */
.flex-1 {
  flex: 1 1 0%;
}

/* 响应式调整 */
@media (max-width: 768px) {
  /* 小屏幕下弹窗模式自动调整大小 */
  :deep(.mode-dialog) {
    width: 95vw !important;
    height: 90vh !important;
  }
  
  /* 小屏幕下笔记列表宽度调整 */
  .w-1\/3 {
    width: 120px !important;
  }
  
  /* 全屏模式下隐藏预览，节省空间 */
  :deep(.mode-fullpage) .w-1\/3:last-child {
    display: none;
  }
}

/* 模式特定样式 */
:deep(.mode-fullpage) {
  .dialog-header {
    background-color: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
  }
  
  /* 全屏模式下编辑区更宽松的间距 */
  .flex-1.overflow-y-auto.p-3 {
    padding: 1rem;
  }
}

:deep(.mode-dialog) {
  /* 弹窗模式下更紧凑的布局 */
  .p-3 {
    padding: 0.75rem !important;
  }
}
</style>
