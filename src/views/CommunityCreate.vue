<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden flex-col">
    <!-- 顶部操作区（优化布局） -->
    <header class="bg-white border-b p-4 flex justify-between items-center shadow-sm z-10">
      <div class="flex items-center space-x-2">
        <button @click="goBack" class="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
        </button>
        <h1 class="text-lg font-medium">创作内容</h1>
      </div>
      
      <div class="flex items-center space-x-3">
        <span v-if="saveStatus === 'saved'" class="text-sm text-green-600 flex items-center">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          已保存
        </span>
        <button @click="saveDraft" class="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">
          保存草稿
        </button>
        <button 
          @click="publishContent" 
          :disabled="isPublishing"
          class="px-4 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-70"
        >
          <svg v-if="isPublishing" class="w-4 h-4 mr-1 inline animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          {{ isPublishing ? '发布中...' : '发布' }}
        </button>
      </div>
    </header>

    <!-- 创作核心区 -->
    <main class="flex-1 overflow-auto p-4 md:p-6 bg-gray-50">
      <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-4 md:p-6">
        <!-- 标题输入 -->
        <input
          v-model="content.title"
          type="text"
          placeholder="输入标题（如：快速排序的3种优化思路）"
          class="w-full text-2xl font-bold border-b pb-3 mb-6 focus:outline-none focus:border-blue-500 transition-colors"
          :class="titleError ? 'border-red-500' : ''"
        >
        <p v-if="titleError" class="text-red-500 text-sm mb-6 -mt-4">请输入标题（至少5个字符）</p>

        <!-- 内容编辑器 + 预览切换 -->
        <div class="mb-6">
          <div class="flex border-b mb-4">
            <button 
              @click="isPreview = false" 
              :class="!isPreview ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'"
              class="px-4 py-2 font-medium transition-colors"
            >
              编辑
            </button>
            <button 
              @click="isPreview = true" 
              :class="isPreview ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'"
              class="px-4 py-2 font-medium transition-colors"
            >
              预览
            </button>
          </div>

          <!-- 富文本编辑器 -->
          <div v-if="!isPreview" class="min-h-[400px]">
            <quill-editor 
              v-model="content.body" 
              :options="quillOptions"
              class="h-full"
              @text-change="handleTextChange"
            />
          </div>

          <!-- 实时预览 -->
          <div v-else class="min-h-[400px] prose max-w-none p-4 border rounded-lg bg-gray-50">
            <div v-html="renderMarkdown(content.body)"></div>
          </div>
        </div>

        <!-- 标签与分类 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <!-- 标签选择 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              标签（最多5个，按回车添加）
              <span class="text-gray-500 ml-1">({{ content.tags.length }}/5)</span>
            </label>
            <div class="flex flex-wrap gap-2 mb-2">
              <span 
                v-for="(tag, index) in content.tags" 
                :key="index"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {{ tag }}
                <button @click="removeTag(index)" class="ml-1 text-blue-600 hover:text-blue-800">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </span>
            </div>
            <input
              v-model="newTag"
              @keydown.enter.prevent="addTag"
              type="text"
              placeholder="输入标签（如：算法、JavaScript）"
              class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              :disabled="content.tags.length >= 5"
            >
            <p v-if="tagError" class="text-red-500 text-sm mt-1">{{ tagError }}</p>
          </div>

          <!-- 分类选择 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">分类</label>
            <select 
              v-model="content.category" 
              class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="categoryError ? 'border-red-500' : ''"
            >
              <option value="">选择分类</option>
              <option value="algorithm">算法讲解</option>
              <option value="problem-solving">解题思路</option>
              <option value="learning-note">学习笔记</option>
              <option value="experience">经验分享</option>
            </select>
            <p v-if="categoryError" class="text-red-500 text-sm mt-1">请选择内容分类</p>
          </div>
        </div>

        <!-- 附件上传 -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">上传示例代码/图片</label>
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer"
               @click="$refs.fileInput.click()">
            <input
              type="file"
              ref="fileInput"
              class="hidden"
              multiple
              accept=".png,.jpg,.jpeg,.js,.py,.java,.cpp"
              @change="handleFileUpload"
            >
            <svg class="w-10 h-10 mx-auto mb-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            <p>点击或拖拽文件到此处上传</p>
            <p class="text-xs text-gray-500 mt-1">支持PNG、JPG、JS、PY、Java、CPP格式，单文件不超过10MB</p>
          </div>
          <div class="mt-4 flex flex-wrap gap-2">
            <div 
              v-for="(file, index) in content.files" 
              :key="index"
              class="flex items-center px-3 py-1 bg-gray-100 rounded"
            >
              <svg class="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6a2 2 0 002 2h5m2 4h-10a2 2 0 01-2-2v-6a2 2 0 012-2H9m2 4v-6M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span class="text-sm truncate max-w-[150px]">{{ file.name }}</span>
              <span class="text-xs text-gray-500 ml-1">{{ formatFileSize(file.size) }}</span>
              <button @click.stop="removeFile(index)" class="ml-2 text-gray-500 hover:text-red-500">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
          <p v-if="fileError" class="text-red-500 text-sm mt-2">{{ fileError }}</p>
        </div>

        <!-- 发布设置 -->
        <div class="border-t pt-4">
          <label class="flex items-center">
            <input 
              type="checkbox" 
              v-model="content.isPublic" 
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            >
            <span class="ml-2 text-sm text-gray-700">发布到公共社区（取消则仅自己可见）</span>
          </label>
        </div>
      </div>
    </main>

    <!-- 自动保存提示 -->
    <div 
      v-if="saveStatus === 'saving'"
      class="bg-yellow-100 text-yellow-800 px-4 py-2 text-sm flex items-center justify-center animate-fadeIn"
    >
      <svg class="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
      </svg>
      <span>正在自动保存...</span>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { marked } from 'marked'
import DOMPurify from 'dompurify' // 引入HTML净化库


// 状态管理
const isPreview = ref(false)
const newTag = ref('')
const saveStatus = ref('')
const isPublishing = ref(false)
const router = useRouter()

// 错误状态
const titleError = ref('')
const tagError = ref('')
const categoryError = ref('')
const fileError = ref('')

// 内容数据结构
const content = ref({
  title: '',
  body: '',
  tags: [],
  category: '',
  files: [],
  isPublic: true,
  draftId: null // 草稿ID（用于更新）
})

// Quill编辑器配置（支持代码块、表格、图片）
const quillOptions = {
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['code-block', 'table'],
      ['clean']
    ]
  },
  placeholder: '请输入内容（支持Markdown语法，可插入代码块、图片等）...',
  theme: 'snow'
}

// 加载本地草稿
onMounted(() => {
  const draft = localStorage.getItem('communityDraft')
  if (draft) {
    content.value = JSON.parse(draft)
  }
})

// 自动保存（输入防抖）
watch(content, debounce((newVal) => {
  saveStatus.value = 'saving'
  // 过滤文件对象（localStorage无法存储File对象）
  const saveData = {
    ...newVal,
    files: newVal.files.map(f => ({
      name: f.name,
      size: f.size,
      type: f.type
    }))
  }
  localStorage.setItem('communityDraft', JSON.stringify(saveData))
  setTimeout(() => {
    saveStatus.value = 'saved'
  }, 800)
}, 1000), { deep: true })

// 标签管理
const addTag = () => {
  tagError.value = ''
  if (!newTag.value.trim()) {
    tagError.value = '标签不能为空'
    return
  }
  if (content.tags.includes(newTag.value.trim())) {
    tagError.value = '标签已存在'
    return
  }
  if (content.tags.length >= 5) {
    tagError.value = '最多只能添加5个标签'
    return
  }
  
  content.tags.push(newTag.value.trim())
  newTag.value = ''
}
const removeTag = (index) => {
  content.tags.splice(index, 1)
}

// 文件上传处理
const handleFileUpload = (e) => {
  fileError.value = ''
  const files = Array.from(e.target.files)
  
  // 验证文件大小
  const oversizeFile = files.find(f => f.size > 10 * 1024 * 1024)
  if (oversizeFile) {
    fileError.value = `文件 ${oversizeFile.name} 超过10MB限制`
    return
  }
  
  content.value.files = [...content.value.files, ...files]
  e.target.value = '' // 允许重复上传同一文件
}
const removeFile = (index) => {
  content.value.files.splice(index, 1)
}

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 预览Markdown渲染（增加安全过滤）
const renderMarkdown = (text) => {
  return DOMPurify.sanitize(marked.parse(text))
}

// 文本变化处理
const handleTextChange = () => {
  // 可以在这里添加内容长度检测等逻辑
}

// 手动保存草稿
const saveDraft = () => {
  saveStatus.value = 'saving'
  const saveData = {
    ...content.value,
    files: content.value.files.map(f => ({
      name: f.name,
      size: f.size,
      type: f.type
    }))
  }
  localStorage.setItem('communityDraft', JSON.stringify(saveData))
  setTimeout(() => {
    saveStatus.value = 'saved'
    setTimeout(() => saveStatus.value = '', 2000)
  }, 500)
}

// 验证内容
const validateContent = () => {
  let isValid = true
  
  // 标题验证
  if (!content.value.title.trim() || content.value.title.length < 5) {
    titleError.value = '请输入至少5个字符的标题'
    isValid = false
  } else {
    titleError.value = ''
  }
  
  // 分类验证
  if (!content.value.category) {
    categoryError.value = '请选择内容分类'
    isValid = false
  } else {
    categoryError.value = ''
  }
  
  // 内容验证
  if (!content.value.body.trim()) {
    // 可以在这里添加富文本内容为空的提示
    isValid = false
  }
  
  return isValid
}

// 发布内容
const publishContent = async () => {
  if (!validateContent()) {
    // 滚动到第一个错误位置
    const firstError = document.querySelector('.border-red-500')
    firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    return
  }

  isPublishing.value = true
  try {
    // 模拟API调用
    const mockPublish = () => new Promise(resolve => {
      setTimeout(() => resolve({ success: true, id: Date.now() }), 1500)
    })

    const res = await mockPublish()
    if (res.success) {
      localStorage.removeItem('communityDraft') // 发布后清除草稿
      router.push(`/community/detail/${res.id}`)
    }
  } catch (error) {
    alert('发布失败，请稍后重试')
  } finally {
    isPublishing.value = false
  }
}

// 返回社区首页
const goBack = () => {
  // 询问是否保存草稿
  if (content.value.title || content.value.body) {
    if (confirm('当前内容未发布，是否保存到草稿箱？')) {
      saveDraft()
    }
  }
  router.push('/community')
}

// 防抖函数
function debounce(fn, delay) {
  let timer = null
  return function(...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}
</script>

<style scoped>
/* 编辑器高度自适应 */
::v-deep .ql-container {
  min-height: 400px !important;
}

/* 预览区样式优化 */
.prose pre {
  background-color: #f7fafc !important;
  padding: 1rem !important;
  border-radius: 0.5rem !important;
  overflow-x: auto !important;
}

.prose code {
  padding: 0.2rem 0.4rem !important;
  border-radius: 0.25rem !important;
}

/* 动画效果 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}

/* 响应式调整 */
@media (max-width: 640px) {
  .prose {
    font-size: 0.9rem !important;
  }
  
  header {
    padding: 3px 12px !important;
  }
  
  button {
    padding: 2px 8px !important;
    font-size: 0.85rem !important;
  }
}
</style>