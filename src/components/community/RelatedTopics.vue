<template>
  <div class="topic-group-card bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6 transition-all duration-300 hover:shadow-md">
    <!-- 标题区：支持自定义图标+更多操作 -->
    <div class="topic-group-header flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <slot name="prefix">
          <!-- 默认图标（可通过slot覆盖） -->
          <span class="text-blue-500 dark:text-blue-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </span>
        </slot>
        <h3 class="font-semibold text-gray-900 dark:text-gray-100 text-base md:text-lg">
          {{ title }}
        </h3>
      </div>
      <!-- 右上角操作区（如"换一批"） -->
      <slot name="actions">
        <button 
          v-if="allowRefresh"
          @click="$emit('refresh')"
          class="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors"
          aria-label="刷新话题列表"
        >
          换一批
        </button>
      </slot>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state py-8 flex flex-col items-center gap-2">
      <div class="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      <p class="text-gray-500 dark:text-gray-400 text-sm">加载中...</p>
    </div>

    <!-- 话题列表：带元数据展示 -->
    <ul 
      v-else 
      class="topic-list space-y-3"
      role="list"
      aria-label="{{ title }}列表"
    >
      <template v-if="topics.length > 0">
        <li 
          v-for="topic in slicedTopics" 
          :key="topic.id" 
          class="topic-item group"
          role="listitem"
        >
          <a 
            href="#" 
            @click.prevent="handleTopicClick(topic)"
            class="topic-link block w-full text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            :title="topic.title"
            aria-label="查看话题：{{ topic.title }}（{{ topic.replies }}条回复）"
          >
            <!-- 话题标题 + 标签 -->
            <div class="flex flex-wrap gap-2">
              <span class="line-clamp-2 flex-1 min-w-0">{{ topic.title }}</span>
              <span 
                v-if="topic.isHot" 
                class="text-xs px-1.5 py-0.25 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded"
              >
                热门
              </span>
            </div>
            <!-- 元数据：回复数/时间 -->
            <div class="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
              <span>{{ topic.replies }} 回复</span>
              <span class="mx-1">·</span>
              <span>{{ formatRelativeTime(topic.createdAt) }}</span>
            </div>
          </a>
        </li>
      </template>
      <!-- 空状态优化 -->
      <li v-else class="empty-state py-6 text-center">
        <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-400 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-gray-500 dark:text-gray-400 text-sm">{{ emptyText }}</p>
        <button 
          v-if="emptyActionText"
          @click="$emit('empty-action')"
          class="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          {{ emptyActionText }}
        </button>
      </li>
    </ul>

    <!-- 查看更多：带计数提示 -->
    <button 
      v-if="showMore && topics.length > 0 && topics.length > maxVisible"
      @click="$emit('load-more')"
      class="more-btn mt-4 w-full py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors flex items-center justify-center gap-1"
      aria-label="查看更多{{ title }}"
    >
      查看更多（还剩{{ topics.length - maxVisible }}个）
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue'

// 话题项类型定义（更贴近业务的完整结构）
interface TopicItem {
  id: string | number
  title: string
  replies: number // 回复数
  createdAt: string // 发布时间（ISO格式）
  isHot?: boolean // 是否热门
  [key: string]: any // 扩展字段
}

// Props定义（增强灵活性和场景适配）
const props = defineProps({
  /** 话题列表数据 */
  topics: {
    type: Array as () => TopicItem[],
    required: true,
    default: () => [],
    validator: (value: TopicItem[]) => 
      value.every(item => 'id' in item && 'title' in item && 'replies' in item && 'createdAt' in item)
  },
  /** 组件标题 */
  title: {
    type: String,
    default: '相关话题'
  },
  /** 是否显示"查看更多" */
  showMore: {
    type: Boolean,
    default: false
  },
  /** 初始可见话题数量 */
  maxVisible: {
    type: Number,
    default: 5,
    validator: (v: number) => v > 0
  },
  /** 是否允许刷新（显示"换一批"按钮） */
  allowRefresh: {
    type: Boolean,
    default: false
  },
  /** 加载状态 */
  loading: {
    type: Boolean,
    default: false
  },
  /** 空状态文本 */
  emptyText: {
    type: String,
    default: '暂无相关话题'
  },
  /** 空状态操作按钮文本 */
  emptyActionText: {
    type: String,
    default: ''
  }
})

// 计算属性：控制初始显示的话题数量
const slicedTopics = computed(() => 
  props.topics.slice(0, props.showMore ? props.maxVisible : props.topics.length)
)

// 事件定义（覆盖更多交互场景）
const emit = defineEmits<{
  /** 话题点击事件 */
  (e: 'topic-click', topic: TopicItem): void
  /** 加载更多事件 */
  (e: 'load-more'): void
  /** 刷新话题事件 */
  (e: 'refresh'): void
  /** 空状态操作事件 */
  (e: 'empty-action'): void
}>()

/** 处理话题点击 */
const handleTopicClick = (topic: TopicItem) => {
  emit('topic-click', topic)
}

/** 格式化相对时间（如"3小时前"） */
const formatRelativeTime = (timeStr: string) => {
  const now = new Date().getTime()
  const target = new Date(timeStr).getTime()
  const diff = Math.floor((now - target) / 1000) // 秒差

  const units = [
    { value: 60 * 60 * 24 * 30, label: '个月前' },
    { value: 60 * 60 * 24, label: '天前' },
    { value: 60 * 60, label: '小时前' },
    { value: 60, label: '分钟前' },
    { value: 1, label: '秒前' }
  ]

  for (const { value, label } of units) {
    const count = Math.floor(diff / value)
    if (count >= 1) return `${count}${label}`
  }
  return '刚刚'
}
</script>

<style scoped>
/* 基础样式 */
.topic-group-card {
  --tw-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.topic-link {
  padding: 0.375rem 0.25rem;
  border-radius: 0.25rem;
}

/* 交互反馈强化 */
.topic-item.group .topic-link:hover {
  background-color: rgba(59, 130, 246, 0.05);
  transform: translateX(2px);
}

/* 加载状态动画 */
@keyframes spin {
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* 响应式调整 */
@media (max-width: 640px) {
  .topic-group-card {
    padding: 0.75rem;
  }
  
  .topic-list {
    gap: 0.75rem;
  }
  
  .more-btn {
    padding: 0.625rem 0;
    font-size: 0.875rem;
  }
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .topic-group-card {
    --tw-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.2);
  }
}
</style>