<template>
  <!-- 外层弹窗容器 - 可拖动调整宽度 -->
  <div 
    class="relative mx-auto bg-white rounded-lg shadow-lg border border-gray-200 transition-all duration-300"
    :style="{ width: dialogWidth, minWidth: '300px', maxWidth: '90vw' }"
  >
    <!-- 宽度调整手柄 -->
    <div 
      class="absolute top-0 bottom-0 right-0 w-3 cursor-ew-resize bg-gray-100 hover:bg-gray-200 transition-colors"
      @mousedown="startResizingDialog"
    ></div>
    
    <!-- 标题和标签区域 -->
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

    <!-- 编辑器主体 -->
    <div class="flex-1 overflow-hidden flex flex-col min-h-0">
      <!-- 工具栏 -->
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

      <!-- 编辑区域 -->
      <div class="flex-1 overflow-y-auto p-3 relative">
        <div 
          v-if="activeNote"
          class="outline-none min-h-[300px] line-clamp-none break-words prose prose-sm max-w-none"
          contenteditable
          @input="handleContentChange"
          @focus="isEditing = true"
          @blur="isEditing = false"
          ref="editorRef"
          :style="{ minHeight: editorHeight }"
        ></div>
        <div v-else class="flex items-center justify-center h-full text-gray-400">
          选择或创建笔记开始编辑
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted, watch } from 'vue'
import type { EnhancedNote } from '@/types/note'
import { formatTime } from '@/utils/note'

const props = defineProps<{
  activeNote: EnhancedNote | undefined
  allTags: string[]
}>()

const emit = defineEmits(['save-note', 'update-note', 'add-new-tag'])

// 编辑器状态
const showNewTagInput = ref(false)
const newTagName = ref('')
const isEditing = ref(false)
const lastSavedTime = ref<Date | null>(null)
const editorRef = ref<HTMLElement | null>(null)
const editorHeight = ref('300px')
const rawContent = ref('') // 存储原始Markdown内容
const dialogWidth = ref('600px') // 弹窗初始宽度
let isResizing = ref(false) // 是否正在调整弹窗大小

// 调整弹窗大小相关变量
let startX = 0
let startWidth = 0
let resizeTimeout: number | null = null

// 节流函数 - 解决调整宽度延迟问题
const throttle = (func: (...args: any[]) => void, delay: number) => {
  return (...args: any[]) => {
    if (!resizeTimeout) {
      resizeTimeout = window.setTimeout(() => {
        func.apply(this, args)
        resizeTimeout = null
      }, delay)
    }
  }
}

// Markdown渲染处理 - 优化内容间距
const renderMarkdown = (content: string): string => {
  // 先处理空行，转换为段落分隔
  let rendered = content
    .replace(/\n\n+/g, '</p><p>') // 连续换行转换为段落
    .replace(/^\n/, '<p>') // 开头换行
    .replace(/\n$/, '</p>') // 结尾换行
    .replace(/([^<>\n])(\n)([^<>\n])/g, '$1<br>$3') // 单换行转换为<br>
    
  // 如果没有段落标签，添加包裹
  if (!rendered.startsWith('<p>')) {
    rendered = `<p>${rendered}</p>`
  }
  
  // 处理标题（放在段落处理之后，避免冲突）
  rendered = rendered
    .replace(/<p># (.*?)<\/p>/g, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>')
  
  // 处理其他格式
  rendered = rendered
    // 加粗
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // 斜体
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // 下划线
    .replace(/__(.*?)__/g, '<u>$1</u>')
    // 链接
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="text-blue-500 underline">$1</a>')
  
  // 处理列表（先处理列表项，再包裹列表标签）
  rendered = rendered
    .replace(/<p>- (.*?)<\/p>/g, '<li class="ml-4">$1</li>')
  
  // 用无序列表标签包裹连续的列表项
  if (rendered.includes('<li>')) {
    rendered = rendered.replace(/(<li>.*?<\/li>)+/gs, '<ul class="list-disc mb-3 mt-2">$&</ul>')
  }
  
  // 清除空的段落标签
  rendered = rendered.replace(/<p>\s*<\/p>/g, '')
  
  return rendered
}

// 处理标题变化
const handleTitleChange = () => {
  if (props.activeNote) {
    emit('update-note', { ...props.activeNote })
    emit('save-note')
    lastSavedTime.value = new Date()
  }
}

// 处理内容变化 - 从HTML提取Markdown
const handleContentChange = (e: Event) => {
  if (props.activeNote && editorRef.value) {
    // 保存原始HTML
    const htmlContent = editorRef.value.innerHTML
    
    // HTML转Markdown
    let markdownContent = htmlContent
      .replace(/<\/p><p>/g, '\n\n') // 段落转换为两个换行
      .replace(/<br\s*\/?>/gi, '\n') // 换行转换为单个换行
      .replace(/<h3.*?>(.*?)<\/h3>/gi, '\n# $1\n') // 标题
      .replace(/<strong>(.*?)<\/strong>/gi, '**$1**') // 加粗
      .replace(/<em>(.*?)<\/em>/gi, '*$1*') // 斜体
      .replace(/<u>(.*?)<\/u>/gi, '__$1__') // 下划线
      .replace(/<a.*?href="(.*?)".*?>(.*?)<\/a>/gi, '[$2]($1)') // 链接
      .replace(/<li>(.*?)<\/li>/gi, '- $1') // 列表项
      .replace(/<ul.*?>(.*?)<\/ul>/gis, '$1\n') // 无序列表
      .replace(/<p>(.*?)<\/p>/g, '$1') // 移除段落标签
      .replace(/<[^>]*>/g, '') // 清除剩余HTML标签
      .trim() // 去除首尾空白
    
    // 更新笔记内容
    props.activeNote.content = markdownContent
    rawContent.value = markdownContent
    emit('update-note', { ...props.activeNote })
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

// 文本格式化
const formatText = (type: string) => {
  if (!props.activeNote || !isEditing.value || !editorRef.value) return
  
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) return

  // 保存当前选择和光标位置
  const range = selection.getRangeAt(0)
  const selectedText = selection.toString()
  const isCollapsed = range.collapsed

  // 定义格式化规则
  const formatRules: Record<string, { prefix: string; suffix: string; placeholder: string }> = {
    bold: { prefix: '**', suffix: '**', placeholder: '加粗文本' },
    italic: { prefix: '*', suffix: '*', placeholder: '斜体文本' },
    underline: { prefix: '__', suffix: '__', placeholder: '下划线文本' },
    heading: { prefix: '# ', suffix: '', placeholder: '标题文本' },
    list: { prefix: '- ', suffix: '', placeholder: '列表项' },
    link: { prefix: '[', suffix: '](https://example.com)', placeholder: '链接文本' }
  }

  const { prefix, suffix, placeholder } = formatRules[type]
  const textToInsert = prefix + (selectedText || placeholder) + suffix

  // 执行格式化
  range.deleteContents()
  const textNode = document.createTextNode(textToInsert)
  range.insertNode(textNode)

  // 计算新光标位置
  let cursorOffset = textToInsert.length
  if (selectedText) {
    // 如果有选中内容，光标放在后缀后面
    cursorOffset = prefix.length + selectedText.length + suffix.length
  } else if (isCollapsed) {
    // 如果没有选中内容，光标放在前缀和占位符之间
    cursorOffset = prefix.length + placeholder.length
  }

  // 移动光标到正确位置
  range.setStart(textNode, cursorOffset)
  range.setEnd(textNode, cursorOffset)
  selection.removeAllRanges()
  selection.addRange(range)

  // 更新内容并重新渲染
  rawContent.value = editorRef.value.textContent || ''
  updateRendering()
  handleContentChange({} as Event)
}

// 更新渲染内容
const updateRendering = () => {
  if (props.activeNote && editorRef.value) {
    // 保存光标位置
    const selection = window.getSelection()
    let cursorPos = 0
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      const preRange = document.createRange()
      preRange.selectNodeContents(editorRef.value)
      preRange.setEnd(range.startContainer, range.startOffset)
      cursorPos = preRange.toString().length
    }

    // 重新渲染
    editorRef.value.innerHTML = renderMarkdown(rawContent.value)

    // 恢复光标位置
    nextTick(() => {
      if (editorRef.value && selection) {
        const textContent = editorRef.value.textContent || ''
        if (cursorPos > textContent.length) cursorPos = textContent.length
        
        const newRange = document.createRange()
        newRange.setStart(editorRef.value, 0)
        newRange.collapse(true)
        
        let currentPos = 0
        let found = false
        
        const walk = document.createTreeWalker(
          editorRef.value,
          NodeFilter.SHOW_TEXT,
          null,
          false
        )
        
        while (currentPos < cursorPos && walk.nextNode()) {
          const node = walk.currentNode as Text
          const nodeLength = node.length
          
          if (currentPos + nodeLength >= cursorPos) {
            newRange.setStart(node, cursorPos - currentPos)
            newRange.setEnd(node, cursorPos - currentPos)
            found = true
            break
          }
          currentPos += nodeLength
        }
        
        if (!found && editorRef.value.lastChild) {
          newRange.setStartAfter(editorRef.value.lastChild)
        }
        
        selection.removeAllRanges()
        selection.addRange(newRange)
      }
    })
  }
}

// 清除格式
const clearFormatting = () => {
  if (!props.activeNote || !isEditing.value || !editorRef.value) return
  
  // 保存光标位置
  const selection = window.getSelection()
  let cursorPos = 0
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0)
    const preRange = document.createRange()
    preRange.selectNodeContents(editorRef.value)
    preRange.setEnd(range.startContainer, range.startOffset)
    cursorPos = preRange.toString().length
  }
  
  // 清除格式
  const textContent = editorRef.value.textContent || ''
  rawContent.value = textContent
  props.activeNote.content = textContent
  
  // 重新渲染
  editorRef.value.innerHTML = textContent
  
  // 恢复光标位置
  nextTick(() => {
    if (editorRef.value && selection) {
      const newRange = document.createRange()
      newRange.setStart(editorRef.value, 0)
      newRange.collapse(true)
      selection.removeAllRanges()
      selection.addRange(newRange)
    }
  })
  
  emit('update-note', { ...props.activeNote })
  emit('save-note')
}

// 弹窗宽度调整 - 使用节流优化性能
const handleResizingDialog = throttle((e: MouseEvent) => {
  if (!isResizing.value) return
  
  const width = startWidth + (e.clientX - startX)
  // 限制最小宽度
  if (width >= 300 && width <= window.innerWidth * 0.9) {
    dialogWidth.value = `${width}px`
  }
}, 10) // 每10ms最多执行一次

const startResizingDialog = (e: MouseEvent) => {
  e.preventDefault()
  isResizing.value = true
  startX = e.clientX
  startWidth = parseInt(dialogWidth.value, 10)
  
  document.addEventListener('mousemove', handleResizingDialog)
  document.addEventListener('mouseup', stopResizingDialog)
  
  // 添加样式指示正在调整大小
  document.body.style.cursor = 'ew-resize'
  document.body.style.userSelect = 'none' // 防止拖动时选中文本
}

const stopResizingDialog = () => {
  isResizing.value = false
  document.removeEventListener('mousemove', handleResizingDialog)
  document.removeEventListener('mouseup', stopResizingDialog)
  
  // 恢复样式
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
  resizeTimeout && clearTimeout(resizeTimeout)
}

// 快捷键处理
const handleKeydown = (e: KeyboardEvent) => {
  if (!isEditing.value) return
  
  // 阻止默认行为
  if (e.ctrlKey && ['b', 'i', 'u', 's'].includes(e.key)) {
    e.preventDefault()
  }
  
  // 格式化快捷键
  if (e.ctrlKey && e.key === 'b') formatText('bold')
  if (e.ctrlKey && e.key === 'i') formatText('italic')
  if (e.ctrlKey && e.key === 'u') formatText('underline')
  if (e.ctrlKey && e.key === 's') {
    emit('save-note')
    lastSavedTime.value = new Date()
  }
}

// 初始化编辑器内容
const initEditorContent = () => {
  nextTick(() => {
    if (props.activeNote && editorRef.value) {
      rawContent.value = props.activeNote.content || ''
      editorRef.value.innerHTML = renderMarkdown(rawContent.value)
      
      // 设置光标到内容末尾
      const selection = window.getSelection()
      if (selection) {
        const range = document.createRange()
        range.selectNodeContents(editorRef.value)
        range.collapse(false)
        selection.removeAllRanges()
        selection.addRange(range)
      }
    }
  })
}

// 监听activeNote变化
watch(() => props.activeNote, () => {
  initEditorContent()
})

// 生命周期
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  initEditorContent()
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('mousemove', handleResizingDialog)
  document.removeEventListener('mouseup', stopResizingDialog)
  resizeTimeout && clearTimeout(resizeTimeout)
})
</script>

<style scoped>
/* 编辑区域样式 */
[contenteditable] {
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
  overflow-wrap: break-word;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  transition: all 0.2s ease;
  width: 100%;
  box-sizing: border-box;
}

[contenteditable]:focus {
  outline: none;
  border-color: #93c5fd;
  box-shadow: 0 0 0 2px rgba(147, 197, 253, 0.2);
}

/* Markdown渲染样式 - 增加间距 */
.prose p {
  margin: 0 0 1.2em 0;
  line-height: 1.8;
}

.prose h3 {
  font-size: 1.3em;
  margin: 1.5em 0 0.8em 0;
  color: #1a1a1a;
  line-height: 1.4;
}

.prose ul {
  margin: 1em 0 1.5em 0;
  padding-left: 1.8em;
  list-style-type: disc;
}

.prose li {
  margin: 0.5em 0;
  line-height: 1.6;
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

/* 调整大小手柄样式 */
.cursor-ew-resize {
  user-select: none;
  z-index: 10;
}

/* 确保弹窗内元素自适应宽度 */
.w-full {
  width: 100% !important;
  box-sizing: border-box;
}
</style>
