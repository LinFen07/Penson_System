<template>
  <div class="w-full px-4 py-8 min-w-[320px] h-screen overflow-hidden flex flex-col">
    <div class="flex flex-grow overflow-hidden">
      <!-- 左侧导航栏 -->
      <div class="w-48 flex-shrink-0 p-2 space-y-2 border-r border-gray-200 bg-white relative">
        <!-- 笔记按钮 -->
        <button 
          @click="showNoteDialog = true"
          class="absolute -right-3 top-2 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors z-10"
          aria-label="添加笔记"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </button>
        
        <button class="w-full flex items-center p-3 rounded-lg hover:bg-gray-100 text-left transition-colors">
          <svg class="w-5 h-5 mr-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path>
          </svg>
          我的收藏
        </button>
        
        <button class="w-full flex items-center p-3 rounded-lg hover:bg-gray-100 text-left transition-colors">
          <svg class="w-5 h-5 mr-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
            <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path>
          </svg>
          我的关注
        </button>
      </div>

      <!-- 中间视频区域 -->
      <div class="flex-grow p-6 min-w-0 overflow-y-auto">
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

    <!-- 笔记弹窗 -->
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

// 状态管理
const showNoteDialog = ref(false)
const router = useRouter()
const studyCenterStore = useStudyCenterStore()
const { playlists } = storeToRefs(studyCenterStore)
const { playVideo, getVideoList, refreshVideoData } = studyCenterStore

// 视频列表
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

// 组件挂载时加载数据
onMounted(() => {
  videos.value = getVideoList()
})
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
</style>
