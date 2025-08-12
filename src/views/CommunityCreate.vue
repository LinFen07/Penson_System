<!-- CreatePost.vue -->
<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden flex-col">
    <!-- 顶部操作区 -->
    <header class="bg-white border-b px-4 py-3 flex items-center justify-between shadow-sm z-10">
      <!-- 左侧：返回 + 标题 -->
      <div class="flex items-center space-x-3">
        <button
          @click="goBack"
          class="flex items-center text-sm text-gray-600 hover:text-blue-600 transition"
        >
          <svg
            class="w-5 h-5 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          返回
        </button>

        <span class="text-sm text-gray-400">/</span>
        <span class="text-sm font-medium text-gray-700">
          {{ content.title || '新话题' }}
        </span>
      </div>

      <!-- 右侧：保存状态 + 手动保存 + 发布 -->
      <div class="flex items-center space-x-3">
        <!-- 自动保存提示 -->
        <span class="text-xs text-gray-500 hidden sm:block">
          {{ saveTip }}
        </span>

        <button
          @click="manualSave"
          :disabled="saveStatus === 'saving'"
          class="text-sm px-3 py-1.5 border rounded-md
                 disabled:opacity-50 disabled:cursor-not-allowed
                 hover:bg-gray-100 transition"
        >
          {{ saveStatus === 'saving' ? '保存中...' : '保存草稿' }}
        </button>

        <button
          @click="publish"
          class="text-sm px-4 py-1.5 bg-blue-600 text-white rounded-md
                 hover:bg-blue-700 transition"
        >
          发布
        </button>
      </div>
    </header>

    <!-- 创作核心区 -->
    <main class="flex-1 overflow-auto p-4 md:p-6 bg-gray-50">
      <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-4 md:p-6">
        <!-- 标题输入 -->
        <ContentTitle v-model:title="content.title" @error="titleError = $event" />

        <!-- 富文本编辑 -->
        <div class="mb-4">
          <RichEditor
            v-model:content="content.body"
            v-model:is-preview="isPreview"
            @text-change="handleTextChange"
          />
          <div v-if="!isPreview" class="text-xs text-gray-500 mt-1">
            字数: {{ contentStats.length }} | 行数: {{ contentStats.lineCount }}
          </div>
        </div>

        <!-- 标签与分类 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <TagManager v-model:tags="content.tags" @error="tagError = $event" />
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">分类</label>
            <select
              v-model="content.category"
              class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="">请选择</option>
              <option v-for="c in categories" :key="c" :value="c">
                {{ c }}
              </option>
            </select>
          </div>
        </div>

        <!-- 文件上传 -->
        <FileUploader v-model:files="content.files" @error="fileError = $event" />

        <!-- 发布设置 -->
        <div class="border-t pt-4">
          <label class="flex items-center space-x-2 text-sm text-gray-700">
            <input v-model="content.isPublic" type="checkbox" class="rounded" />
            <span>公开发布</span>
          </label>
        </div>
      </div>
    </main>

    <!-- 离开确认弹窗 -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showLeaveConfirm"
          class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        >
          <div class="bg-white rounded-lg p-6 max-w-sm mx-4">
            <p class="text-gray-700 mb-4">内容尚未保存，确定要离开吗？</p>
            <div class="flex justify-end space-x-3">
              <button
                @click="showLeaveConfirm = false"
                class="px-4 py-1.5 text-sm border rounded-md hover:bg-gray-100"
              >
                取消
              </button>
              <button
                @click="confirmLeave"
                class="px-4 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                离开
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import ContentTitle from '@/components/community/ContentTitle.vue'
import RichEditor   from '@/components/community/RichEditor.vue'
import TagManager   from '@/components/community/TagManager.vue'
import FileUploader from '@/components/community/FileUploader.vue'

// --------------- 路由 ---------------
const router = useRouter()

// --------------- 数据 ---------------
interface Post {
  title: string
  body: string
  tags: string[]
  files: File[]
  category: string
  isPublic: boolean
}
const content = ref<Post>({
  title: '',
  body: '',
  tags: [],
  files: [],
  category: '',
  isPublic: true
})

const categories = ['技术', '生活', '分享', '问答']

// --------------- 统计 ---------------
const contentStats = ref({ length: 0, lineCount: 0 })
function handleTextChange(text: string, stats: any) {
  contentStats.value = stats
}

// --------------- 保存 ---------------
type SaveStatus = 'idle' | 'saving' | 'saved'
const saveStatus = ref<SaveStatus>('idle')
const saveTip = computed(() => {
  switch (saveStatus.value) {
    case 'saving': return '正在自动保存...'
    case 'saved':  return '已自动保存'
    default:       return ''
  }
})

// 防抖
function debounce<T extends (...args: any[]) => any>(fn: T, delay = 800) {
  let timer: ReturnType<typeof setTimeout> | null = null
  const debounced = (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
  debounced.flush = () => {
    if (timer) clearTimeout(timer), (fn as any)(), (timer = null)
  }
  debounced.cancel = () => timer && clearTimeout(timer)
  return debounced
}

const autoSave = debounce(async () => {
  if (!content.value.title && !content.value.body) return
  saveStatus.value = 'saving'
  // TODO: 调接口
  await new Promise(r => setTimeout(r, 600))
  saveStatus.value = 'saved'
}, 800)

async function manualSave() {
  saveStatus.value = 'saving'
  await autoSave.flush()
}

async function publish() {
  await manualSave()
  // TODO: 真正发布
  router.replace('/community')
}

// --------------- 返回 & 拦截 ---------------
let savedSnapshot = ''
onMounted(() => (savedSnapshot = JSON.stringify(content.value)))

const showLeaveConfirm = ref(false)
let nextRoute: any = null

function goBack() {
  if (hasUnsaved()) {
    showLeaveConfirm.value = true
    nextRoute = -1
  } else {
    router.back()
  }
}
onBeforeRouteLeave((to, from, next) => {
  if (hasUnsaved()) {
    showLeaveConfirm.value = true
    nextRoute = next
  } else {
    next()
  }
})
function hasUnsaved() {
  return JSON.stringify(content.value) !== savedSnapshot
}
function confirmLeave() {
  showLeaveConfirm.value = false
  if (nextRoute === -1) router.back()
  else if (nextRoute) nextRoute()
}

// 监听内容变化
watch(content, autoSave, { deep: true })
onBeforeUnmount(() => autoSave.cancel())

// --------------- 错误 ---------------
const titleError = ref(false)
const tagError   = ref(false)
const fileError  = ref(false)
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>