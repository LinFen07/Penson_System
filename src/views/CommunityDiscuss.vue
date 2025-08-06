<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden flex-col">
    <!-- 顶部导航 -->
    <header class="bg-white border-b p-4 flex justify-between items-center shadow-sm z-10">
      <div class="flex items-center">
        <h1 class="text-xl font-semibold text-gray-800">社区讨论</h1>
        <span class="ml-3 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
          {{ discussions?.length || 0 }} 个话题
        </span>
      </div>
      
      <div class="flex space-x-3 items-center">
        <!-- 搜索框 -->
        <div class="relative hidden md:block max-w-[200px] lg:max-w-[300px]">
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="搜索话题..." 
            class="w-full pl-9 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
          <i class="fa fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        </div>
        
        <!-- 发布按钮 -->
        <button 
          @click="$router.push('/community/create')"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center"
        >
          <i class="fa fa-plus-circle mr-2"></i>
          <span class="hidden sm:inline">发布新话题</span>
          <span class="sm:hidden">发布</span>
        </button>
      </div>
    </header>

    <!-- 主内容区（含侧边栏） -->
    <main class="flex-1 overflow-auto bg-gray-50">
      <!-- 外层容器：控制整体最大宽度和居中 -->
      <div class="max-w-7xl mx-auto w-full px-4 py-6">
        <!-- 三栏布局容器 -->
        <div class="flex flex-col lg:flex-row gap-6">
          <!-- 左侧边栏：精简分类（仅大屏幕显示） -->
          <aside class="hidden lg:block w-48 shrink-0">
            <div class="bg-white rounded-lg shadow-sm p-4 sticky top-4">
              <h3 class="font-medium text-gray-800 mb-3">话题分类</h3>
              <ul class="space-y-1">
                <li>
                  <button 
                    @click="activeCategory = 'all'"
                    :class="activeCategory === 'all' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'"
                    class="w-full text-left px-3 py-2 rounded-md text-sm transition-colors"
                  >
                    <i class="fa fa-th-large mr-2"></i>全部话题
                  </button>
                </li>
                <li>
                  <button 
                    @click="activeCategory = 'tech'"
                    :class="activeCategory === 'tech' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'"
                    class="w-full text-left px-3 py-2 rounded-md text-sm transition-colors"
                  >
                    <i class="fa fa-code mr-2"></i>技术讨论
                  </button>
                </li>
                <li>
                  <button 
                    @click="activeCategory = 'question'"
                    :class="activeCategory === 'question' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'"
                    class="w-full text-left px-3 py-2 rounded-md text-sm transition-colors"
                  >
                    <i class="fa fa-question-circle mr-2"></i>问题求助
                  </button>
                </li>
                <li>
                  <button 
                    @click="activeCategory = 'share'"
                    :class="activeCategory === 'share' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'"
                    class="w-full text-left px-3 py-2 rounded-md text-sm transition-colors"
                  >
                    <i class="fa fa-lightbulb-o mr-2"></i>经验分享
                  </button>
                </li>
                <li>
                  <button 
                    @click="activeCategory = 'offtopic'"
                    :class="activeCategory === 'offtopic' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'"
                    class="w-full text-left px-3 py-2 rounded-md text-sm transition-colors"
                  >
                    <i class="fa fa-coffee mr-2"></i>闲聊灌水
                  </button>
                </li>
              </ul>
            </div>
          </aside>

          <!-- 中间主内容：讨论列表 -->
          <div class="flex-1 min-w-0">
            <!-- 移动端分类筛选（小屏幕显示） -->
            <div class="lg:hidden bg-white rounded-lg shadow-sm p-3 mb-6 overflow-x-auto">
              <div class="flex space-x-2 min-w-max pb-1">
                <button 
                  @click="activeCategory = 'all'"
                  :class="activeCategory === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                  class="px-4 py-2 rounded-full text-sm transition-colors whitespace-nowrap"
                >
                  全部
                </button>
                <button 
                  @click="activeCategory = 'tech'"
                  :class="activeCategory === 'tech' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                  class="px-4 py-2 rounded-full text-sm transition-colors whitespace-nowrap"
                >
                  技术
                </button>
                <button 
                  @click="activeCategory = 'question'"
                  :class="activeCategory === 'question' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                  class="px-4 py-2 rounded-full text-sm transition-colors whitespace-nowrap"
                >
                  求助
                </button>
                <button 
                  @click="activeCategory = 'share'"
                  :class="activeCategory === 'share' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                  class="px-4 py-2 rounded-full text-sm transition-colors whitespace-nowrap"
                >
                  分享
                </button>
                <button 
                  @click="activeCategory = 'offtopic'"
                  :class="activeCategory === 'offtopic' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                  class="px-4 py-2 rounded-full text-sm transition-colors whitespace-nowrap"
                >
                  闲聊
                </button>
              </div>
            </div>
            
            <!-- 讨论列表 -->
            <div class="space-y-4">
              <DiscussList 
                :discussions="filteredDiscussions" 
                @reply="handleReply" 
                @like="handleLike"
                @pin="handlePin"
              />
            </div>
            
            <!-- 空状态 -->
            <div v-if="filteredDiscussions.length === 0" class="bg-white rounded-lg shadow-sm p-8 text-center mt-6">
              <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fa fa-comments text-2xl text-gray-400"></i>
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">暂无相关话题</h3>
              <p class="text-gray-500 mb-4">尝试更换分类或搜索关键词，或者发布第一个话题吧</p>
              <button 
                @click="$router.push('/community/create')"
                class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                发布新话题
              </button>
            </div>
            
            <!-- 分页 -->
            <div v-if="filteredDiscussions.length > 0" class="mt-8 flex justify-center">
              <nav class="flex items-center space-x-1">
                <button 
                  @click="currentPage = Math.max(1, currentPage - 1)"
                  :disabled="currentPage === 1"
                  class="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i class="fa fa-chevron-left text-xs"></i>
                </button>
                <template v-for="page in totalPages" :key="page">
                  <button 
                    @click="currentPage = page"
                    :class="currentPage === page ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'"
                    class="px-3 py-1 rounded border"
                  >
                    {{ page }}
                  </button>
                </template>
                <button 
                  @click="currentPage = Math.min(totalPages, currentPage + 1)"
                  :disabled="currentPage === totalPages"
                  class="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i class="fa fa-chevron-right text-xs"></i>
                </button>
              </nav>
            </div>
            
            <!-- 发布讨论表单 -->
            <DiscussForm 
              v-if="showForm"
              @submit="handleSubmit"
              @cancel="showForm = false"
              :replyTo="replyTo"
              class="mt-6"
            />
          </div>

          <!-- 右侧边栏：社区信息（中等屏幕以上可见） -->
          <aside class="hidden md:block w-72 shrink-0">
            <!-- 侧边栏容器：统一阴影和间距 -->
            <div class="space-y-6">
              <!-- 社区公告 -->
              <div class="bg-white rounded-lg shadow-sm p-4 sticky top-4">
                <div class="flex items-center justify-between mb-3">
                  <h3 class="font-medium text-gray-800">社区公告</h3>
                  <span class="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">新</span>
                </div>
                <div class="space-y-3">
                  <div class="border-l-2 border-red-500 pl-3 py-1">
                    <p class="text-sm text-gray-700 font-medium">社区规则更新通知</p>
                    <p class="text-xs text-gray-500 mt-1">为维护良好讨论环境，新增内容审核机制...</p>
                    <p class="text-xs text-gray-400 mt-2">2023-05-20</p>
                  </div>
                  <div class="border-l-2 border-gray-300 pl-3 py-1">
                    <p class="text-sm text-gray-700 font-medium">「技术分享大赛」开始报名</p>
                    <p class="text-xs text-gray-500 mt-1">分享你的技术经验，赢取开发书籍和周边...</p>
                    <p class="text-xs text-gray-400 mt-2">2023-05-15</p>
                  </div>
                </div>
                <button class="w-full mt-3 text-sm text-blue-600 hover:text-blue-800 transition-colors">
                  查看全部公告 <i class="fa fa-angle-right ml-1"></i>
                </button>
              </div>

              <!-- 热门话题 -->
              <div class="bg-white rounded-lg shadow-sm p-4">
                <h3 class="font-medium text-gray-800 mb-3">热门话题</h3>
                <ul class="space-y-3">
                  <li class="flex items-start">
                    <span class="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">1</span>
                    <a href="#" class="ml-2 text-sm text-gray-700 hover:text-blue-600 line-clamp-2">
                      2023年前端框架趋势分析：React、Vue、Svelte谁更值得学？
                    </a>
                  </li>
                  <li class="flex items-start">
                    <span class="flex-shrink-0 w-5 h-5 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">2</span>
                    <a href="#" class="ml-2 text-sm text-gray-700 hover:text-blue-600 line-clamp-2">
                      从0到1搭建企业级前端工程化体系（附实战代码）
                    </a>
                  </li>
                  <li class="flex items-start">
                    <span class="flex-shrink-0 w-5 h-5 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">3</span>
                    <a href="#" class="ml-2 text-sm text-gray-700 hover:text-blue-600 line-clamp-2">
                      面试必备：100道JavaScript高频考点（含详细解析）
                    </a>
                  </li>
                  <li class="flex items-start">
                    <span class="flex-shrink-0 w-5 h-5 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">4</span>
                    <a href="#" class="ml-2 text-sm text-gray-700 hover:text-blue-600 line-clamp-2">
                      如何优雅地处理前端错误？从捕获到监控全流程
                    </a>
                  </li>
                  <li class="flex items-start">
                    <span class="flex-shrink-0 w-5 h-5 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">5</span>
                    <a href="#" class="ml-2 text-sm text-gray-700 hover:text-blue-600 line-clamp-2">
                      CSS新特性：grid布局实战指南（多案例）
                    </a>
                  </li>
                </ul>
              </div>

              <!-- 活跃用户 -->
              <div class="bg-white rounded-lg shadow-sm p-4">
                <h3 class="font-medium text-gray-800 mb-3">活跃用户</h3>
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <img src="https://picsum.photos/id/1/48/48" alt="用户头像" class="w-10 h-10 rounded-full object-cover">
                      <div class="ml-3">
                        <p class="text-sm font-medium text-gray-800">张三</p>
                        <p class="text-xs text-gray-500">发布了32篇内容</p>
                      </div>
                    </div>
                    <button class="text-xs text-blue-600 border border-blue-200 px-2 py-1 rounded hover:bg-blue-50 transition-colors">
                      关注
                    </button>
                  </div>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <img src="https://picsum.photos/id/2/48/48" alt="用户头像" class="w-10 h-10 rounded-full object-cover">
                      <div class="ml-3">
                        <p class="text-sm font-medium text-gray-800">李四</p>
                        <p class="text-xs text-gray-500">发布了28篇内容</p>
                      </div>
                    </div>
                    <button class="text-xs text-gray-500 border border-gray-200 px-2 py-1 rounded hover:bg-gray-50 transition-colors">
                      已关注
                    </button>
                  </div>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <img src="https://picsum.photos/id/3/48/48" alt="用户头像" class="w-10 h-10 rounded-full object-cover">
                      <div class="ml-3">
                        <p class="text-sm font-medium text-gray-800">王五</p>
                        <p class="text-xs text-gray-500">发布了21篇内容</p>
                      </div>
                    </div>
                    <button class="text-xs text-blue-600 border border-blue-200 px-2 py-1 rounded hover:bg-blue-50 transition-colors">
                      关注
                    </button>
                  </div>
                </div>
                <button class="w-full mt-3 text-sm text-blue-600 hover:text-blue-800 transition-colors">
                  查看更多用户 <i class="fa fa-angle-right ml-1"></i>
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import DiscussList from '@/components/community/DiscussList.vue'
import DiscussForm from '@/components/community/DiscussForm.vue'
import { formatRelativeTime } from '@/utils/date-utils'

// 初始化讨论数据（确保为数组类型，避免undefined）
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
const itemsPerPage = 10 // 每页显示数量

// 路由
const router = useRouter()

// 过滤讨论列表（增加空值判断）
const filteredDiscussions = computed(() => {
  // 确保 discussions.value 是数组
  if (!Array.isArray(discussions.value)) return []
  
  // 按分类过滤
  let result = discussions.value.filter(discussion => {
    return activeCategory.value === 'all' || discussion?.category === activeCategory.value
  })
  
  // 按搜索关键词过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(discussion => {
      return discussion?.title?.toLowerCase().includes(query) || 
             discussion?.content?.toLowerCase().includes(query) ||
             (discussion?.tags || []).some(tag => tag.toLowerCase().includes(query))
    })
  }
  
  // 排序
  result.sort((a, b) => {
    if (a?.isPinned && !b?.isPinned) return -1
    if (!a?.isPinned && b?.isPinned) return 1
    
    if (a?.isHot && !b?.isHot) return -1
    if (!a?.isHot && b?.isHot) return 1
    
    return new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0)
  })
  
  // 分页处理
  const startIndex = (currentPage.value - 1) * itemsPerPage
  return result.slice(startIndex, startIndex + itemsPerPage)
})

// 总页数计算（增加空值判断）
const totalPages = computed(() => {
  if (!Array.isArray(discussions.value)) return 1
  
  const filtered = discussions.value.filter(discussion => {
    return activeCategory.value === 'all' || discussion?.category === activeCategory.value
  })
  return Math.ceil(filtered.length / itemsPerPage) || 1
})

// 处理回复（增加参数校验）
const handleReply = (discussion) => {
  if (!discussion) return
  showForm.value = true
  replyTo.value = {
    id: discussion.id,
    title: discussion.title
  }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 处理点赞（增加存在性判断）
const handleLike = (id) => {
  if (!id) return
  const discussion = discussions.value.find(d => d?.id === id)
  if (discussion) {
    discussion.likes = (discussion.likes || 0) + 1
  }
}

// 处理置顶（增加存在性判断）
const handlePin = (id) => {
  if (!id) return
  const discussion = discussions.value.find(d => d?.id === id)
  if (discussion) {
    discussion.isPinned = !discussion.isPinned
  }
}

// 处理提交（增加参数校验）
const handleSubmit = (newDiscussion) => {
  if (!newDiscussion) return
  
  if (replyTo.value && replyTo.value.id) {
    // 处理回复
    const target = discussions.value.find(d => d?.id === replyTo.value.id)
    if (target) {
      target.replies = (target.replies || 0) + 1
      target.lastReply = {
        author: newDiscussion.author?.name,
        time: new Date().toISOString()
      }
    }
  } else {
    // 处理新发布讨论
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
/* 合并样式标签，解决样式冲突 */
::v-deep .discussion-item {
  box-sizing: border-box;
  width: 100%;
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  transition: box-shadow 0.2s;
}

::v-deep .discussion-item:hover {
  box-shadow: 0 4px 6px rgba(0,0,0,0.08);
}

/* 修复小屏幕下按钮文本溢出 */
@media (max-width: 640px) {
  .lg\\:hidden .flex {
    padding-bottom: 0.5rem;
  }
}

/* 优化中间内容区在大屏幕的显示 */
@media (min-width: 1024px) {
  .flex-1 {
    max-width: calc(100% - 48px - 18rem);
    margin: 0 auto;
  }
}
</style>