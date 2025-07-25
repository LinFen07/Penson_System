<template>
  <div class="w-full px-4 py-8 min-w-[320px] h-screen overflow-hidden flex flex-col">
    <div class="flex flex-grow overflow-hidden">
      <!-- 左侧导航栏 - 固定不动 -->
      <div class="w-48 flex-shrink-0 p-2 space-y-2 border-r border-gray-200 bg-white">
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

      <!-- 右侧视频区域 - 可滚动 -->
      <div class="flex-grow p-4 min-w-0 overflow-y-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-8">
          <div 
            v-for="video in videos" 
            :key="video.id"
            @click="playVideo(video)"
            class="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 active:scale-95 active:bg-gray-50 cursor-pointer"
          >
            <div class="bg-gray-100 aspect-video relative">
              <img :src="video.poster" class="w-full h-full object-cover" :alt="video.title">
              <div class="absolute inset-0 flex items-center justify-center">
                <svg class="w-12 h-12 text-white opacity-80" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <div class="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                {{ video.duration }}
              </div>
            </div>
            <div class="p-3">
              <h3 class="font-medium line-clamp-2">{{ video.title }}</h3>
              <div class="flex justify-between text-xs text-gray-500 mt-1">
                <span>播放量: {{ video.views }}</span>
                <span>{{ video.date }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 刷新按钮 - 固定在右下角 -->
    <button class="fixed bottom-8 right-8 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors z-10">
      <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

interface VideoItem {
  id: number
  title: string
  url: string
  poster: string
  duration: string
  views: number
  date: string
}

const router = useRouter()

const videos = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: `视频标题 ${i + 1} - 这是一个较长的视频标题，用于测试多行显示效果`,
  url: `https://example.com/videos/${i + 1}.mp4`,
  poster: '@/assets/images/image.png',
  duration: `${Math.floor(Math.random() * 60)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
  views: (i + 1) * 1000,
  date: `2023-10-${10 + i + 1}`
}))

const playVideo = (video: VideoItem) => {
  router.push(`/video/${video.id}`)
}
</script>

<style scoped>
/* 确保滚动条样式美观 */
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