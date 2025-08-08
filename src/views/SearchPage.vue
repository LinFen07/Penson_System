<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航栏 -->
    <header class="bg-white shadow-sm-sm sticky top-0 z-10">
      <div class="container mx-auto px-4 py-4">
        <!-- 返回按钮和搜索框容器 -->
        <div class="flex items-center">
          <!-- 返回图标 - 使用Element Plus按钮和图标 -->
          <el-button 
            icon="ArrowLeft" 
            circle 
            @click="handleBack"
            class="mr-4 md:mr-6 text-gray-600 hover:text-primary hover:bg-primary/5 border-none bg-transparent"
          />
          
          <!-- 搜索框 - 占据剩余空间 -->
          <div class="relative flex-grow max-w-3xl">
            <input 
              type="text" 
              v-model="searchQuery"
              placeholder="搜索题库、话题或视频..." 
              class="w-full py-2.5 pl-10 pr-10 rounded-full border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm"
              @keyup.enter="handleSearch"
            >
            <el-icon class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Search />
            </el-icon>
            <el-button 
              icon="Close" 
              circle 
              size="small"
              @click="clearSearch"
              v-if="searchQuery"
              class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 border-none bg-transparent"
            />
          </div>
        </div>
      </div>
    </header>

    <main class="container mx-auto px-4 py-6">
      <!-- 搜索结果统计 -->
      <div class="mb-6" v-if="searchQuery">
        <p class="text-gray-500">"{{ searchQuery }}" 的搜索结果（约 {{ totalResults }} 个）</p>
      </div>
      
      <!-- 分类标签 - 使用Element Plus按钮组 -->
      <div class="flex border-b border-gray-200 mb-8 overflow-x-auto pb-1">
        <el-button 
          :class="activeTab === 'all' ? 'tab-active' : 'border-transparent text-gray-500 hover:text-primary hover:border-primary/30'"
          @click="activeTab = 'all'"
          class="px-5 py-2 text-sm border-b-2 mr-2 whitespace-nowrap bg-transparent"
        >
          全部
        </el-button>
        <el-button 
          :class="activeTab === 'questions' ? 'tab-active' : 'border-transparent text-gray-500 hover:text-primary hover:border-primary/30'"
          @click="activeTab = 'questions'"
          class="px-5 py-2 text-sm border-b-2 border-transparent mr-2 whitespace-nowrap bg-transparent"
        >
          <el-icon class="mr-1.5"><HelpFilled /></el-icon>题库
        </el-button>
        <el-button 
          :class="activeTab === 'topics' ? 'tab-active' : 'border-transparent text-gray-500 hover:text-primary hover:border-primary/30'"
          @click="activeTab = 'topics'"
          class="px-5 py-2 text-sm border-b-2 border-transparent mr-2 whitespace-nowrap bg-transparent"
        >
          <el-icon class="mr-1.5"><ChatRound /></el-icon>话题
        </el-button>
        <el-button 
          :class="activeTab === 'videos' ? 'tab-active' : 'border-transparent text-gray-500 hover:text-primary hover:border-primary/30'"
          @click="activeTab = 'videos'"
          class="px-5 py-2 text-sm border-b-2 border-transparent whitespace-nowrap bg-transparent"
        >
          <el-icon class="mr-1.5"><VideoPlay /></el-icon>视频
        </el-button>
      </div>
      
      <!-- 内容区域 - 根据活跃标签显示对应内容 -->
      <div v-if="activeTab === 'all' || activeTab === 'questions'">
        <!-- 题库模块 -->
        <section class="mb-10">
          <h2 class="text-lg font-semibold mb-4 flex items-center">
            <el-icon class="text-primary mr-2"><HelpFilled /></el-icon>题库
          </h2>
          
          <div class="space-y-3">
            <div 
              class="bg-white rounded-lg p-4 shadow-sm card-hover cursor-pointer"
              v-for="(question, index) in questions" 
              :key="index"
            >
              <div class="flex items-start">
                <span 
                  class="text-xs px-2 py-1 rounded-full mt-0.5"
                  :class="question.type === 'single' ? 'bg-blue-50 text-primary' : 
                         question.type === 'multiple' ? 'bg-purple-50 text-accent' : 
                         'bg-green-50 text-green-600'"
                >
                  {{ question.type === 'single' ? '单选题' : 
                     question.type === 'multiple' ? '多选题' : '编程题' }}
                </span>
                <div class="ml-3 flex-grow">
                  <h3 class="font-medium">{{ question.title }}</h3>
                  <div class="text-sm text-gray-500 mt-2">
                    难度: {{ question.difficulty }} · {{ question.participants }}人做过 · 发布于 {{ question.date }}
                  </div>
                  <div class="flex flex-wrap gap-2 mt-2">
                    <span 
                      class="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                      v-for="(tag, tagIdx) in question.tags" 
                      :key="tagIdx"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>
                <el-button 
                  icon="Star" 
                  circle 
                  size="small"
                  class="text-gray-400 hover:text-primary hover:bg-primary/5 border-none bg-transparent"
                />
              </div>
            </div>
            
            <!-- 查看更多按钮 -->
            <div class="text-center pt-2">
              <el-button 
                type="text" 
                class="text-primary text-sm hover:underline"
              >
                查看更多题库 <el-icon class="ml-1"><ArrowRight /></el-icon>
              </el-button>
            </div>
          </div>
        </section>
      </div>
      
      <div v-if="activeTab === 'all' || activeTab === 'topics'">
        <!-- 话题模块 -->
        <section class="mb-10">
          <h2 class="text-lg font-semibold mb-4 flex items-center">
            <el-icon class="text-primary mr-2"><ChatRound /></el-icon>话题
          </h2>
          
          <div class="space-y-3">
            <div 
              class="bg-white rounded-lg p-4 shadow-sm card-hover cursor-pointer"
              v-for="(topic, index) in topics" 
              :key="index"
            >
              <h3 class="font-medium">{{ topic.title }}</h3>
              <p class="text-gray-600 text-sm mt-2 line-clamp-2">
                {{ topic.content }}
              </p>
              <div class="flex items-center justify-between mt-3">
                <div class="flex items-center text-sm text-gray-500">
                  <img 
                    :src="topic.authorAvatar" 
                    alt="用户头像" 
                    class="w-5 h-5 rounded-full mr-2"
                  >
                  <span>{{ topic.authorName }}</span>
                  <span class="mx-2">·</span>
                  <span>{{ topic.date }}</span>
                </div>
                <div class="flex items-center space-x-4 text-sm text-gray-500">
                  <!-- 修正：使用View图标替代Eye图标 -->
                  <span><el-icon class="mr-1"><View /></el-icon> {{ topic.views }}</span>
                  <span><el-icon class="mr-1"><Message /></el-icon> {{ topic.comments }}</span>
                </div>
              </div>
            </div>
            
            <!-- 查看更多按钮 -->
            <div class="text-center pt-2">
              <el-button 
                type="text" 
                class="text-primary text-sm hover:underline"
              >
                查看更多话题 <el-icon class="ml-1"><ArrowRight /></el-icon>
              </el-button>
            </div>
          </div>
        </section>
      </div>
      
      <div v-if="activeTab === 'all' || activeTab === 'videos'">
        <!-- 视频模块 -->
        <section>
          <h2 class="text-lg font-semibold mb-4 flex items-center">
            <el-icon class="text-primary mr-2"><VideoPlay /></el-icon>视频
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div 
              class="bg-white rounded-lg overflow-hidden shadow-sm card-hover cursor-pointer"
              v-for="(video, index) in videos" 
              :key="index"
            >
              <div class="relative">
                <img 
                  :src="video.thumbnail" 
                  alt="视频缩略图" 
                  class="w-full h-36 object-cover"
                >
                <span class="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                  {{ video.duration }}
                </span>
                <div 
                  class="absolute top-2 left-2 text-white text-xs px-1.5 py-0.5 rounded"
                  :class="video.level === 'beginner' ? 'bg-primary/90' : 'bg-accent/90'"
                >
                  {{ video.level === 'beginner' ? '基础' : '进阶' }}
                </div>
                <el-button 
                  icon="VideoPlay" 
                  circle 
                  class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/40 text-white hover:bg-primary border-none"
                  size="small"
                />
              </div>
              <div class="p-3">
                <h3 class="font-medium text-sm">{{ video.title }}</h3>
                <div class="flex items-center text-xs text-gray-500 mt-2">
                  <span>{{ video.source }}</span>
                  <span class="mx-1">·</span>
                  <span>{{ video.views }}次观看</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 查看更多按钮 -->
          <div class="text-center pt-4">
            <el-button 
              type="text" 
              class="text-primary text-sm hover:underline"
            >
              查看更多视频 <el-icon class="ml-1"><ArrowRight /></el-icon>
            </el-button>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script>
// 修正：导入正确的图标，使用View替代Eye
import { 
  ArrowLeft, 
  Search, 
  Close, 
  HelpFilled, 
  ChatRound, 
  VideoPlay, 
  Star, 
  ArrowRight, 
  View,  // 替换Eye为View
  Message
} from '@element-plus/icons-vue';
import { ElButton, ElIcon } from 'element-plus';

export default {
  name: 'SearchPage',
  components: {
    ElButton,
    ElIcon,
    ArrowLeft,
    Search,
    Close,
    HelpFilled,
    ChatRound,
    VideoPlay,
    Star,
    ArrowRight,
    View,  // 注册View图标
    Message,
    VideoPlay
  },
  data() {
    return {
      // 数据部分保持不变
      searchQuery: 'JavaScript 基础',
      totalResults: 1258,
      activeTab: 'all',
      
      // 题库数据
      questions: [
        {
          type: 'single',
          title: '以下哪个不是JavaScript的基本数据类型？',
          difficulty: '简单',
          participants: '3.2k',
          date: '2023-05-12',
          tags: ['JavaScript', '数据类型', '基础语法']
        },
        {
          type: 'multiple',
          title: '关于JavaScript中的事件冒泡，下列说法正确的有？',
          difficulty: '中等',
          participants: '1.8k',
          date: '2023-04-28',
          tags: ['JavaScript', '事件处理', 'DOM']
        },
        {
          type: 'coding',
          title: '实现一个函数，判断一个字符串是否为回文串',
          difficulty: '中等',
          participants: '2.5k',
          date: '2023-06-05',
          tags: ['JavaScript', '字符串', '算法']
        }
      ],
      
      // 话题数据
      topics: [
        {
          title: 'JavaScript中this关键字的指向问题总结',
          content: '本文详细总结了JavaScript中this关键字在不同场景下的指向规则...',
          authorAvatar: 'https://picsum.photos/id/1/32/32',
          authorName: '张教授',
          date: '2023-03-15',
          views: '5.2k',
          comments: '128'
        },
        {
          title: 'ES6新特性详解与实际应用场景',
          content: '随着ES6标准的推出，JavaScript引入了许多强大的新特性...',
          authorAvatar: 'https://picsum.photos/id/2/32/32',
          authorName: '李工程师',
          date: '2023-04-22',
          views: '8.7k',
          comments: '256'
        }
      ],
      
      // 视频数据
      videos: [
        {
          title: 'JavaScript变量声明与作用域详解',
          thumbnail: 'https://picsum.photos/id/160/400/225',
          duration: '15:30',
          level: 'beginner',
          source: '编程学院',
          views: '3.2万'
        },
        {
          title: '深入理解JavaScript闭包与高阶函数',
          thumbnail: 'https://picsum.photos/id/0/400/225',
          duration: '22:15',
          level: 'advanced',
          source: '前端进阶营',
          views: '5.8万'
        },
        {
          title: 'JavaScript异步编程全解析',
          thumbnail: 'https://picsum.photos/id/180/400/225',
          duration: '28:45',
          level: 'advanced',
          source: '技术讲堂',
          views: '4.5万'
        }
      ]
    };
  },
  methods: {
    // 方法部分保持不变
    handleSearch() {
      console.log('搜索内容:', this.searchQuery);
    },
    clearSearch() {
      this.searchQuery = '';
    },
    handleBack() {
      console.log('返回上一页');
    }
  }
};
</script>

<style scoped>
.card-hover {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
.tab-active {
  color: #165DFF;
  border-color: #165DFF;
  font-weight: 500;
}
</style>
    