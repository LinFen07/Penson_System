<template>
  <!-- 最外层改成 grid，三列 -->
  <div class="grid h-screen"
       style="grid-template-columns: 16rem 1fr 18rem; grid-template-rows: 1fr;">
    <!-- 左侧固定侧边栏 -->
    <aside class="sticky top-0 h-full bg-white border-r overflow-y-auto">
      <CategorySidebar
        :active-category="activeCategory"
        @change-category="handleCategoryChange"
      />
    </aside>

    <!-- 中间内容区，可滚动 -->
    <main class="overflow-y-auto bg-gray-50">
      <div class="max-w-4xl mx-auto px-4 py-6">
        <MobileCategoryFilter
          :active-category="activeCategory"
          @change-category="handleCategoryChange"
        />
        <DiscussList
          :discussions="filteredDiscussions"
          @reply="handleReply"
          @like="handleLike"
          @pin="handlePin"
        />
        <EmptyState
          v-if="filteredDiscussions.length === 0"
          text="暂无相关话题"
          subtext="尝试更换分类或搜索关键词，或者发布第一个话题吧"
          @action-click="handlePublishClick"
          action-text="发布新话题"
        />
        <Pagination
          v-if="filteredDiscussions.length > 0"
          :current-page="currentPage"
          :total-pages="totalPages"
          @change-page="handlePageChange"
        />
        <DiscussForm
          v-if="showForm"
          @submit="handleSubmit"
          @cancel="showForm = false"
          :reply-to="replyTo"
          class="mt-6"
        />
      </div>
    </main>

    <!-- 右侧固定侧边栏 -->
    <aside class="sticky top-0 h-full bg-white border-l overflow-y-auto">
      <!-- <RightSidebar /> -->
    </aside>
  </div>
</template>


<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
// 导入拆分后的组件
import CommunityHeader from '@/components/community/CommunityHeader.vue'
import CategorySidebar from '@/components/community/CategorySidebar.vue'
import MobileCategoryFilter from '@/components/community/MobileCategoryFilter.vue'
import DiscussList from '@/components/community/DiscussList.vue'
import EmptyState from '@/components/community/EmptyState.vue'
import Pagination from '@/components/community/Pagination.vue'
import DiscussForm from '@/components/community/DiscussForm.vue'
import RightSidebar from '@/components/community/RightSidebar.vue'
import { formatRelativeTime } from '@/utils/date-utils'

// 讨论数据
const discussions = ref([
  {
    id: 1,
    title: '如何优化前端项目的构建速度？',
    author: {
      name: '张三',
      avatar: 'https://picsum.photos/id/1/40/40',
      level: 3
    },
    content: '最近项目越来越大，每次构建都要等好几分钟，尝试过一些优化手段但效果不明显。大家有什么好的建议吗？主要技术栈是Vue3 + Vite。',
    category: 'tech',
    tags: ['前端', '性能优化', 'Vite'],
    replies: 12,
    likes: 35,
    isPinned: true,
    isHot: false,
    createdAt: '2023-05-15T08:30:00',
    lastReply: {
      author: '李四',
      time: '2023-05-16T14:20:00'
    }
  },
  {
    id: 2,
    title: 'TypeScript 类型体操有必要深入学习吗？',
    author: {
      name: '王五',
      avatar: 'https://picsum.photos/id/2/40/40',
      level: 5
    },
    content: '最近看到很多TypeScript类型体操的文章，感觉非常复杂，实际工作中好像很少用到这些高级技巧。想问问大家，花大量时间学习这些东西值得吗？',
    category: 'tech',
    tags: ['TypeScript', '前端'],
    replies: 28,
    likes: 47,
    isPinned: false,
    isHot: true,
    createdAt: '2023-05-14T16:45:00',
    lastReply: {
      author: '赵六',
      time: '2023-05-15T10:15:00'
    }
  },
  {
    id: 3,
    title: '求助：Vue3中如何优雅地管理全局状态？',
    author: {
      name: '小明',
      avatar: 'https://picsum.photos/id/3/40/40',
      level: 2
    },
    content: '刚从Vue2转到Vue3，对于Pinia和Vuex有点困惑，项目不大但需要一些全局状态。大家在实际项目中是如何选择和使用的？有没有最佳实践可以分享？',
    category: 'question',
    tags: ['Vue3', '状态管理', 'Pinia'],
    replies: 8,
    likes: 15,
    isPinned: false,
    isHot: false,
    createdAt: '2023-05-16T09:10:00',
    lastReply: {
      author: '小红',
      time: '2023-05-16T11:30:00'
    }
  },
  {
    id: 4,
    title: '分享一个自己开发的React组件库',
    author: {
      name: '小刚',
      avatar: 'https://picsum.photos/id/4/40/40',
      level: 4
    },
    content: '历时三个月，终于完成了这个组件库的1.0版本，包含了常用的UI组件和一些业务组件。支持主题定制和按需加载，已经开源到GitHub，欢迎大家试用并提出宝贵意见！',
    category: 'share',
    tags: ['React', '组件库', '开源'],
    replies: 23,
    likes: 89,
    isPinned: false,
    isHot: true,
    createdAt: '2023-05-13T14:20:00',
    lastReply: {
      author: '小丽',
      time: '2023-05-16T08:45:00'
    }
  },
  {
    id: 5,
    title: '大家平时都是怎么保持学习动力的？',
    author: {
      name: '小芳',
      avatar: 'https://picsum.photos/id/5/40/40',
      level: 2
    },
    content: '感觉技术更新太快了，经常学了这个忘了那个，有时候会很焦虑。想问问大家都是如何规划学习计划，保持学习动力的？',
    category: 'offtopic',
    tags: ['学习方法', '职业发展'],
    replies: 35,
    likes: 62,
    isPinned: false,
    isHot: true,
    createdAt: '2023-05-12T19:05:00',
    lastReply: {
      author: '大强',
      time: '2023-05-16T15:20:00'
    }
  }
])

// 状态管理
const showForm = ref(false)
const replyTo = ref(null)
const searchQuery = ref('')
const activeCategory = ref('all')
const currentPage = ref(1)
const itemsPerPage = 10

// 路由
const router = useRouter()

// 过滤逻辑（核心逻辑保留在主组件）
const filteredDiscussions = computed(() => {
  if (!Array.isArray(discussions.value)) return []
  
  let result = discussions.value.filter(discussion => 
    activeCategory.value === 'all' || discussion?.category === activeCategory.value
  )
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(discussion => 
      discussion?.title?.toLowerCase().includes(query) || 
      discussion?.content?.toLowerCase().includes(query) ||
      (discussion?.tags || []).some(tag => tag.toLowerCase().includes(query))
    )
  }
  
  result.sort((a, b) => {
    if (a?.isPinned && !b?.isPinned) return -1
    if (!a?.isPinned && b?.isPinned) return 1
    if (a?.isHot && !b?.isHot) return -1
    if (!a?.isHot && b?.isHot) return 1
    return new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0)
  })
  
  const startIndex = (currentPage.value - 1) * itemsPerPage
  return result.slice(startIndex, startIndex + itemsPerPage)
})

const totalPages = computed(() => {
  if (!Array.isArray(discussions.value)) return 1
  const filtered = discussions.value.filter(discussion => 
    activeCategory.value === 'all' || discussion?.category === activeCategory.value
  )
  return Math.ceil(filtered.length / itemsPerPage) || 1
})

// 事件处理（与子组件通信）
const handleCategoryChange = (category) => {
  activeCategory.value = category
  currentPage.value = 1 // 切换分类重置页码
}

const handlePageChange = (page) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handlePublishClick = () => {
  router.push('/create')
}

const handleReply = (discussion) => {
  if (!discussion) return
  showForm.value = true
  replyTo.value = { id: discussion.id, title: discussion.title }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleLike = (id) => {
  if (!id) return
  const discussion = discussions.value.find(d => d?.id === id)
  if (discussion) discussion.likes = (discussion.likes || 0) + 1
}

const handlePin = (id) => {
  if (!id) return
  const discussion = discussions.value.find(d => d?.id === id)
  if (discussion) discussion.isPinned = !discussion.isPinned
}

const handleSubmit = (newDiscussion) => {
  if (!newDiscussion) return
  
  if (replyTo.value?.id) {
    const target = discussions.value.find(d => d?.id === replyTo.value.id)
    if (target) {
      target.replies = (target.replies || 0) + 1
      target.lastReply = {
        author: newDiscussion.author?.name,
        time: new Date().toISOString()
      }
    }
  } else {
    discussions.value.unshift({
      ...newDiscussion,
      id: Date.now(),
      replies: 0,
      likes: 0,
      isPinned: false,
      isHot: false,
      createdAt: new Date().toISOString(),
      lastReply: null
    })
  }
  
  showForm.value = false
  replyTo.value = null
  currentPage.value = 1
}
</script>

<style scoped>
/* 只需要把 body/html 的滚动锁死，由 main 区域滚动即可 */
html, body {
  height: 100%;
  overflow: hidden;
}

/* 主页面仅保留布局相关样式 */
.flex-1 {
  min-width: 0; /* 防止内容溢出 */
}

@media (min-width: 1024px) {
  .flex-1 {
    max-width: calc(100% - 48px - 18rem);
    margin: 0 auto;
  }
}
</style>