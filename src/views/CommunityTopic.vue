<template>
  <!-- 加载状态 -->
  <div v-if="isLoading" class="flex justify-center items-center h-64">
    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
  
  <!-- 响应式布局：小屏单列，大屏三列 -->
  <div v-else class="container mx-auto px-4 py-6">
    <!-- 大屏三列布局 -->
    <div class="hidden lg:grid grid-cols-[12rem_1fr_20rem] gap-6">
      <!-- 分类栏组件 -->
      <CategorySidebar 
        :activeCategory="activeCategory"
        @change-category="handleCategoryChange"
      />

      <!-- 中间话题详情区（核心内容） -->
      <main>
        <!-- 话题卡片 -->
        <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
          <!-- 话题标题 -->
          <h1 class="text-2xl font-bold text-gray-900 mb-4">{{ topic.title }}</h1>

          <!-- 作者信息 -->
          <div class="flex items-center mb-6">
            <img v-if="topic.author" :src="topic.author.avatar" alt="头像" class="w-10 h-10 rounded-full mr-3">
            <div>
              <div class="flex items-center">
                <span class="font-medium">{{ topic.author.name }}</span>
                <span class="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">Lv.{{ topic.author.level }}</span>
              </div>
              <p class="text-sm text-gray-500 mt-1">{{ formatTime(topic.createdAt) }}</p>
            </div>
          </div>

          <!-- 话题内容 -->
          <div class="prose max-w-none mb-6">
            <p v-for="(para, idx) in topic.content.split('\n')" :key="idx" class="mb-3 line-height-1.8">{{ para }}</p>
            
            <!-- 内容图片 -->
            <div v-if="topic.images && topic.images.length" class="my-4 grid grid-cols-2 gap-3">
              <img v-for="(img, idx) in topic.images" :key="idx" :src="img" class="rounded-lg w-full h-auto" alt="话题图片">
            </div>

            <!-- 标签 -->
            <div class="flex flex-wrap gap-2 mt-4">
              <span v-for="tag in topic.tags" :key="tag" class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">{{ tag }}</span>
            </div>
          </div>

          <!-- 互动按钮 -->
          <div class="flex gap-4 text-gray-600">
            <button @click="handleLike" class="flex items-center gap-1 hover:text-blue-600 transition-colors">
              <span>{{ isLiked ? '已赞' : '点赞' }}</span>
              <span>({{ topic.likes }})</span>
            </button>
            <button class="flex items-center gap-1 hover:text-blue-600 transition-colors">
              <span>分享</span>
            </button>
          </div>
        </div>

        <!-- 回复区 -->
        <ReplyList 
          :replies="replies"
          @submit="handleReplySubmit"
          class="bg-white rounded-lg shadow-sm p-6"
        />
      </main>

      <!-- 右侧推荐区 -->
      <aside class="sticky top-6">
        <RelatedTopics 
          :topics="relatedTopics"
          @topic-click="handleTopicClick"
        />
      </aside>
    </div>

    <!-- 小屏单列布局 -->
    <div class="lg:hidden">
      <!-- 话题卡片（同大屏中间区） -->
      <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
        <h1 class="text-xl font-bold text-gray-900 mb-3">{{ topic.title }}</h1>
        
        <!-- 作者信息 -->
        <div class="flex items-center mb-4">
          <img v-if="topic.author" :src="topic.author.avatar" alt="头像" class="w-8 h-8 rounded-full mr-2">
          <div>
            <div class="flex items-center">
              <span class="font-medium">{{ topic.author.name }}</span>
              <span class="ml-2 px-1.5 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">Lv.{{ topic.author.level }}</span>
            </div>
            <p class="text-sm text-gray-500 mt-0.5">{{ formatTime(topic.createdAt) }}</p>
          </div>
        </div>

        <!-- 话题内容 -->
        <div class="mb-4">
          <p v-for="(para, idx) in topic.content.split('\n')" :key="idx" class="mb-2 line-height-1.6">{{ para }}</p>
          
          <div v-if="topic.images && topic.images.length" class="my-3 grid grid-cols-2 gap-2">
            <img v-for="(img, idx) in topic.images" :key="idx" :src="img" class="rounded-lg w-full h-auto" alt="话题图片">
          </div>

          <div class="flex flex-wrap gap-2 mt-3">
            <span v-for="tag in topic.tags" :key="tag" class="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">{{ tag }}</span>
          </div>
        </div>

        <!-- 互动按钮 -->
        <div class="flex gap-4 text-gray-600">
          <button @click="handleLike" class="flex items-center gap-1 hover:text-blue-600">
            <span>{{ isLiked ? '已赞' : '点赞' }}</span>
            <span>({{ topic.likes }})</span>
          </button>
          <button class="flex items-center gap-1 hover:text-blue-600">分享</button>
        </div>
      </div>

      <!-- 回复区 -->
      <ReplyList 
        :replies="replies"
        @submit="handleReplySubmit"
        class="bg-white rounded-lg shadow-sm p-4 mb-6"
      />

      <!-- 小屏相关话题 -->
      <div class="bg-white p-4 rounded-lg shadow-sm">
        <h3 class="font-semibold text-gray-900 mb-2">相关话题</h3>
        <ul class="space-y-2">
          <li v-for="item in relatedTopics" :key="item.id">
            <a href="#" class="text-gray-700 hover:text-blue-600 text-sm line-clamp-2">{{ item.title }}</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import RelatedTopics from '@/components/community/RelatedTopics.vue'
import CategorySidebar from '@/components/community/CategorySidebar.vue'

const activeCategory = ref('all')

const handleCategoryChange = (category) => {
  activeCategory.value = category
  // 这里可以添加分类切换逻辑
}
import ReplyList from '@/components/community/ReplyList.vue'

// 状态管理
const topic = ref({})
const replies = ref([])
const replyContent = ref('')
const currentPage = ref(1)
const isLiked = ref(false)

// 添加加载状态
const isLoading = ref(true)

// 模拟异步数据加载
onMounted(async () => {
  try {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // 话题详情
    topic.value = {
      id: 1,
      title: '如何优化前端项目的构建速度？',
      author: {
        name: '张三',
        avatar: 'https://picsum.photos/id/1/40/40',
        level: 3
      },
      content: '最近项目越来越大，每次构建都要等好几分钟，尝试过一些优化手段但效果不明显。大家有什么好的建议吗？主要技术栈是Vue3 + Vite。\n\n目前已尝试的方案：\n1. 开启gzip压缩\n2. 优化babel配置\n3. 使用CDN加载第三方库',
      tags: ['前端', '性能优化', 'Vite'],
      replies: 5,
      likes: 35,
      images: [
        'https://picsum.photos/id/20/800/400',
        'https://picsum.photos/id/21/800/400'
      ],
      createdAt: '2023-05-15T08:30:00'
    }

    // 回复数据
    replies.value = [
      {
        id: 1,
        author: { name: '李四', avatar: 'https://picsum.photos/id/10/40/40' },
        content: '可以试试Vite的esbuild预构建，对大型项目提升很明显',
        createdAt: '2023-05-15T10:20:00'
      },
      {
        id: 2,
        author: { name: '王五', avatar: 'https://picsum.photos/id/11/40/40' },
        content: '检查一下是否有不必要的依赖，tree-shaking没生效的话会增加构建时间',
        createdAt: '2023-05-15T11:15:00'
      },
      {
        id: 3,
        author: { name: '赵六', avatar: 'https://picsum.photos/id/12/40/40' },
        content: '试试分包策略，把不常变动的代码单独打包，减少重复构建',
        createdAt: '2023-05-15T14:30:00'
      }
    ]
  } catch (error) {
    console.error('加载数据失败:', error)
  } finally {
    isLoading.value = false
  }
})
// 计算属性
const totalPages = computed(() => Math.ceil(replies.value.length / 2) || 1) // 每页2条
const relatedTopics = computed(() => [
  { id: 2, title: 'TypeScript 类型体操有必要深入学习吗？' },
  { id: 3, title: 'Vue3中如何优雅地管理全局状态？' },
  { id: 4, title: '分享一个自己开发的React组件库' }
])

// 工具函数
const formatTime = (timeStr) => {
  const date = new Date(timeStr)
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

// 事件处理
const handleLike = () => {
  isLiked.value = !isLiked.value
  topic.value.likes += isLiked.value ? 1 : -1
}

const handleTopicClick = (topic) => {
  // 这里可以添加话题点击逻辑
  console.log('Topic clicked:', topic)
}

const handleReplySubmit = () => {
  if (!replyContent.value.trim()) return
  replies.value.unshift({
    id: Date.now(),
    author: { name: '当前用户', avatar: 'https://picsum.photos/id/99/40/40' },
    content: replyContent.value,
    createdAt: new Date().toISOString()
  })
  topic.value.replies += 1
  replyContent.value = '' // 清空输入框
}
</script>

<style scoped>
/* 基础样式补充 */
.container {
  max-width: 1200px;
}

.line-height-1\.6 {
  line-height: 1.6;
}

.line-height-1\.8 {
  line-height: 1.8;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>