<template>
  <div class="w-full px-4 py-8 min-w-[320px] h-screen overflow-hidden flex flex-col">
    <div class="flex flex-grow overflow-hidden">
      <!-- 左侧导航栏（优化后，通过事件与父组件通信） -->
      <div class="w-56 flex-shrink-0 p-2 space-y-4 border-r border-gray-200 bg-white relative overflow-y-auto h-full">
        <!-- 学习导航区 -->
        <div class="space-y-1">
          <h3 class="text-xs font-semibold text-gray-500 px-3 mb-2 mt-1">学习内容</h3>
          
          <!-- 全部视频 -->
          <button class="w-full flex items-center p-3 rounded-lg bg-blue-50 text-blue-600 text-left transition-colors">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            全部视频
          </button>
          
          <!-- 课程分类（折叠面板） -->
          <div>
            <button 
              class="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 text-left transition-colors"
              @click="isCategoryOpen = !isCategoryOpen"
            >
              <div class="flex items-center">
                <svg class="w-5 h-5 mr-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                </svg>
                课程分类
              </div>
              <svg class="w-4 h-4 text-gray-500 transition-transform" :class="{ 'rotate-180': isCategoryOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            
            <!-- 分类列表（折叠内容） -->
            <div v-if="isCategoryOpen" class="pl-10 pr-3 pb-2 space-y-1">
              <button class="w-full text-left text-sm p-2 rounded hover:bg-gray-100 transition-colors">前端开发</button>
              <button class="w-full text-left text-sm p-2 rounded hover:bg-gray-100 transition-colors">后端架构</button>
              <button class="w-full text-left text-sm p-2 rounded hover:bg-gray-100 transition-colors">移动开发</button>
              <button class="w-full text-left text-sm p-2 rounded hover:bg-gray-100 transition-colors">设计工具</button>
              <button class="w-full text-left text-sm p-2 rounded hover:bg-gray-100 transition-colors">职场技能</button>
            </div>
          </div>
          
          <!-- 继续观看 -->
          <button class="w-full flex items-center p-3 rounded-lg hover:bg-gray-100 text-left transition-colors group">
            <svg class="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">Vue组件化开发实战</div>
              <div class="w-full h-1 bg-gray-200 rounded-full mt-1 overflow-hidden">
                <div class="h-full bg-green-500 rounded-full" style="width: 35%"></div>
              </div>
              <div class="text-xs text-gray-500 mt-1">35% 剩余28分钟</div>
            </div>
          </button>
        </div>
        
        <!-- 分隔线 -->
        <div class="h-px bg-gray-200 my-1"></div>
        
        <!-- 个人中心区 -->
        <div class="space-y-1">
          <h3 class="text-xs font-semibold text-gray-500 px-3 mb-2">我的学习</h3>
          
          <!-- 我的收藏 -->
          <button class="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 text-left transition-colors">
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path>
              </svg>
              我的收藏
            </div>
            <span class="text-xs bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded-full">12</span>
          </button>
          
          <!-- 我的关注 -->
          <button class="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 text-left transition-colors">
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path>
              </svg>
              我的关注
            </div>
            <span class="text-xs bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded-full">8</span>
          </button>
          
          <!-- 笔记中心 -->
          <button class="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 text-left transition-colors">
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              笔记中心
            </div>
            <span class="text-xs bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded-full">5</span>
          </button>
          
          <!-- 学习统计 -->
          <button class="w-full flex items-center p-3 rounded-lg hover:bg-gray-100 text-left transition-colors">
            <svg class="w-5 h-5 mr-3 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
            学习统计
          </button>
        </div>
        
        <!-- 分隔线 -->
        <div class="h-px bg-gray-200 my-1"></div>
        
        <!-- 系统区 -->
        <div class="space-y-1">
          <h3 class="text-xs font-semibold text-gray-500 px-3 mb-2">系统设置</h3>
          
          <!-- 设置 -->
          <button class="w-full flex items-center p-3 rounded-lg hover:bg-gray-100 text-left transition-colors">
            <svg class="w-5 h-5 mr-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
            设置
          </button>
          
          <!-- 帮助中心 -->
          <button class="w-full flex items-center p-3 rounded-lg hover:bg-gray-100 text-left transition-colors">
            <svg class="w-5 h-5 mr-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            帮助中心
          </button>
        </div>
        
        <!-- 添加笔记按钮（修复：通过事件通知父组件显示弹窗） -->
        <button 
          @click="handleOpenNoteDialog"  
          class="absolute -right-3 top-2 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors z-10"
          aria-label="添加笔记"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </button>
      </div>

      <!-- 中间视频区域（修复：确保视频列表正确渲染） -->
      <div class="flex-grow p-6 min-w-0 overflow-y-auto">
        <!-- 视频列表（保留原始渲染逻辑） -->
        <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-8">
          <div 
            v-for="video in videos" 
            :key="video.id"
            @click="handlePlayVideo(video)"
            class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 active:scale-98 active:bg-gray-50 cursor-pointer"
          >
            <!-- 视频封面 -->
            <div class="bg-gray-100 aspect-[16/10] relative">
              <img :src="video.poster" class="w-full h-full object-cover" :alt="video.title">
              <div class="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <svg class="w-14 h-14 text-white drop-shadow-md" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <!-- 时长标签 -->
              <div class="absolute bottom-3 right-3 bg-black/80 text-white text-sm px-2 py-1 rounded-md">
                {{ video.duration }}
              </div>
            </div>
            
            <!-- 视频信息 -->
            <div class="p-4">
              <h3 class="text-base font-semibold line-clamp-2 mb-2">{{ video.title }}</h3>
              <div class="flex justify-between text-sm text-gray-500">
                <span>播放量: {{ video.views.toLocaleString() }}</span>
                <span>{{ video.date }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 笔记弹窗（修复：由父组件状态控制显示） -->
    <NoteView
      v-if="showNoteDialog"
      :visible="showNoteDialog"
      @close="showNoteDialog = false"
    />

    <!-- 刷新按钮 -->
    <button 
      class="fixed bottom-8 right-8 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors z-10"
      @click="refreshVideoList"
      aria-label="刷新视频列表"
    >
      <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import NoteView from './NoteView.vue'
import { ref, onMounted } from 'vue'
import { useStudyCenterStore } from '@/stores/study-center'
import { storeToRefs } from 'pinia'
import type { VideoItem } from '@/types/study-center'

// 修复1：笔记弹窗状态由父组件管理（确保侧边栏能触发）
const showNoteDialog = ref(false)
// 侧边栏触发弹窗的事件
const handleOpenNoteDialog = () => {
  showNoteDialog.value = true
}

// 修复2：视频列表逻辑保留，确保数据正确加载
const router = useRouter()
const studyCenterStore = useStudyCenterStore()
const { playlists } = storeToRefs(studyCenterStore)
const { playVideo, getVideoList, refreshVideoData } = studyCenterStore

const videos = ref<VideoItem[]>([])

// 播放视频
const handlePlayVideo = (video: VideoItem) => {
  playVideo(video)
  router.push(`/video/${video.id}`)
}

// 刷新视频列表
const refreshVideoList = () => {
  videos.value = refreshVideoData()
}

// 组件挂载时加载视频数据
onMounted(() => {
  videos.value = getVideoList()
})

// 侧边栏折叠状态
const isCategoryOpen = ref(false)
</script>

<style scoped>
/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 侧边栏滚动条优化 */
div[class*="overflow-y-auto"]::-webkit-scrollbar {
  width: 4px;
}

div[class*="overflow-y-auto"]::-webkit-scrollbar-thumb {
  background: #e2e2e2;
}

/* 分类折叠动画 */
div[v-if="isCategoryOpen"] {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 响应式适配 */
@media (max-width: 1024px) {
  .w-56 {
    width: 52px;
  }
  
  /* 隐藏文字，仅保留图标 */
  button span:not(.text-xs.bg-gray-100),
  h3.text-xs {
    display: none;
  }
  
  /* 调整图标位置 */
  button svg {
    margin-right: 0;
  }
  
  /* 折叠面板箭头位置 */
  button.flex.justify-between svg:last-child {
    display: none;
  }
}
</style>