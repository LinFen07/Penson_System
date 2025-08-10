<template>
  <div class="min-h-screen bg-gray-50 text-gray-900">
    <!-- 主内容区 -->
    <main class="w-full max-w-[1800px] mx-auto px-4 pt-4 md:pt-6 pb-10">
      <!-- 布局容器：根据屏幕宽度动态调整结构 -->
      <div class="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4 md:gap-6">
        <!-- 左侧视频内容区 -->
        <div class="video-content-area order-2 lg:order-1">
          <!-- 优化后的视频头部区域 -->
          <div class="video-header flex flex-wrap items-center justify-between mb-4 md:mb-6 gap-3">
            <!-- 左侧：返回按钮 + 分类路径 -->
            <div class="flex items-center">
              <button 
                @click="goBack" 
                class="back-btn flex items-center text-gray-700 hover:text-blue-600 transition-all duration-200 transform hover:scale-105"
                aria-label="返回上一页"
              >
                <svg class="w-5 h-5 md:w-6 md:h-6 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                <span class="text-sm md:text-base font-medium">返回</span>
              </button>
              
              <!-- 分类路径 - 中等屏幕以上显示 -->
              <div class="hidden md:flex items-center text-gray-500 text-sm ml-4">
                <a href="#" class="hover:text-gray-900 transition-colors">首页</a>
                <svg class="w-3 h-3 mx-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
                <a href="#" class="hover:text-gray-900 transition-colors">自然风景</a>
                <svg class="w-3 h-3 mx-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
                <span class="text-gray-400 truncate max-w-[180px]">自然风光展示</span>
              </div>
            </div>
            
            <!-- 右侧：轻量操作按钮 -->
            <div class="flex items-center gap-2 md:gap-3">
              <!-- 分享按钮 -->
              <button class="share-btn flex items-center text-gray-600 hover:text-blue-600 transition-colors px-2 py-1 rounded-md hover:bg-blue-50">
                <svg class="w-4 h-4 md:w-5 md:h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-6a2 2 0 00-2-2h-2m-4 0h-2a2 2 0 01-2-2v-2m6 10v-6m0 0v6m0-3h-2"/>
                </svg>
                <span class="text-xs md:text-sm hidden sm:inline">分享</span>
              </button>
              
              <!-- 举报按钮 -->
              <button class="report-btn flex items-center text-gray-600 hover:text-red-600 transition-colors px-2 py-1 rounded-md hover:bg-red-50">
                <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- 视频标题 - 响应式字体与行高 -->
          <h1 class="video-title mb-4 md:mb-6 text-[clamp(1.1rem,4vw,1.75rem)] font-bold leading-tight">
            {{ videoInfo.title }}
          </h1>

          <!-- 视频播放区 - 自适应容器与最小高度 -->
          <div class="video-container mb-4 md:mb-6 relative bg-black rounded-lg overflow-hidden shadow-md">
            <VideoPlayer 
              ref="videoPlayer"
              :video-url="videoInfo.url"
              :autoplay="false"
              :muted="false"
              :controls="true"
              :loop="false"
              :poster="videoInfo.poster"
              :playback-rates="[0.5, 1, 1.5, 2]"
              class="w-full h-full"
            />
          </div>

          <!-- 视频信息与互动区组合容器 -->
          <div class="space-y-4 md:space-y-6">
            <!-- 视频信息栏 - 流式布局适配不同屏幕 -->
            <div class="video-info bg-white p-3 md:p-4 rounded-lg shadow-sm">
              <div class="flex flex-wrap items-center gap-3">
                <!-- 上传者信息 -->
                <div class="flex items-center flex-shrink-0">
                  <img src="https://picsum.photos/id/64/48/48" alt="UP主头像" class="w-10 h-10 md:w-12 md:h-12 rounded-full mr-3 object-cover">
                  <div class="min-w-0">
                    <p class="font-medium truncate">测试UP主</p>
                    <p class="text-sm text-gray-500">1.2万 粉丝</p>
                  </div>
                  <button class="ml-3 md:ml-4 bg-red-600 text-white px-3 py-1 md:px-4 md:py-1.5 rounded-full text-sm hover:bg-red-700 transition-colors">
                    关注
                  </button>
                </div>

                <!-- 视频数据 - 移动端自动换行到下方 -->
                <div class="text-sm text-gray-500 mt-2 md:mt-0 md:ml-auto">
                  <span class="mr-3 md:mr-4">{{ formatNumber(videoInfo.views) }} 播放</span>
                  <span>{{ videoInfo.date }}</span>
                </div>
              </div>
            </div>

            <!-- 互动按钮区 - 动态调整列数与尺寸 -->
            <div class="interaction-buttons grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button class="interaction-btn flex flex-col items-center justify-center p-2 md:p-3 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-all">
                <div class="flex items-center text-red-600 mb-1">
                  <svg class="w-4 h-4 md:w-5 md:h-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                  <span class="text-sm md:text-base">点赞</span>
                </div>
                <span class="text-xs md:text-sm text-gray-500">{{ formatNumber(1254) }}</span>
              </button>
              
              <button class="interaction-btn flex flex-col items-center justify-center p-2 md:p-3 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-all">
                <div class="flex items-center text-blue-600 mb-1">
                  <svg class="w-4 h-4 md:w-5 md:h-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17 3h-10c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-14c0-1.1-.9-2-2-2zm0 16h-10v-14h10v14z"/>
                    <path d="M15 9h-6v2h6zm0 4h-6v2h6z"/>
                  </svg>
                  <span class="text-sm md:text-base">投币</span>
                </div>
                <span class="text-xs md:text-sm text-gray-500">{{ formatNumber(328) }}</span>
              </button>
              
              <button class="interaction-btn flex flex-col items-center justify-center p-2 md:p-3 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-all">
                <div class="flex items-center text-green-600 mb-1">
                  <svg class="w-4 h-4 md:w-5 md:h-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
                  </svg>
                  <span class="text-sm md:text-base">收藏</span>
                </div>
                <span class="text-xs md:text-sm text-gray-500">{{ formatNumber(892) }}</span>
              </button>
              
              <button class="interaction-btn flex flex-col items-center justify-center p-2 md:p-3 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-all">
                <div class="flex items-center text-gray-600 mb-1">
                  <svg class="w-4 h-4 md:w-5 md:h-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
                  </svg>
                  <span class="text-sm md:text-base">分享</span>
                </div>
              </button>
            </div>

            <!-- 视频描述 - 响应式内边距 -->
            <div class="video-description bg-white p-4 md:p-5 rounded-lg shadow-sm">
              <div class="flex items-center mb-3">
                <h2 class="font-bold text-lg">视频简介</h2>
                <button 
                  @click="toggleDescription"
                  class="ml-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {{ isDescriptionExpanded ? '收起' : '展开' }}
                </button>
              </div>
              <p class="text-gray-700 leading-relaxed whitespace-pre-line" 
                 :class="{ 'line-clamp-3': !isDescriptionExpanded }">
                {{ videoInfo.description }}
              </p>
            </div>

            <!-- 评论区 - 响应式布局 -->
            <div class="comment-section bg-white p-4 md:p-5 rounded-lg shadow-sm">
              <h2 class="font-bold text-xl mb-4">{{ formatNumber(342) }} 条评论</h2>
              
              <!-- 评论输入框 - 自适应宽度 -->
              <div class="comment-input flex gap-3 mb-6">
                <img src="https://picsum.photos/id/237/40/40" alt="你的头像" class="user-avatar w-10 h-10 rounded-full object-cover flex-shrink-0">
                <div class="comment-input-area flex-1">
                  <textarea 
                    class="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-shadow"
                    rows="2"
                    placeholder="写下你的评论..."
                  ></textarea>
                  <div class="flex justify-end mt-2">
                    <button class="comment-submit-btn bg-blue-600 text-white px-4 py-1.5 rounded text-sm hover:bg-blue-700 transition-colors">
                      发布评论
                    </button>
                  </div>
                </div>
              </div>

              <!-- 评论列表 -->
              <div class="comment-list space-y-6">
                <!-- 评论项 - 移动端紧凑布局 -->
                <div class="comment-item flex gap-3">
                  <img src="https://picsum.photos/id/1005/40/40" alt="用户头像" class="user-avatar w-10 h-10 rounded-full object-cover flex-shrink-0">
                  <div class="comment-content flex-1">
                    <div class="comment-meta flex items-center mb-1">
                      <span class="comment-author font-medium mr-2">测试用户1</span>
                      <span class="comment-time text-xs text-gray-500">2天前</span>
                    </div>
                    <p class="comment-text text-gray-800 mb-2">这个视频内容很精彩，学到了很多东西！</p>
                    <div class="comment-actions flex items-center text-sm text-gray-500">
                      <button class="hover:text-red-500 mr-4 transition-colors">点赞 (42)</button>
                      <button class="hover:text-gray-700 transition-colors">回复</button>
                    </div>
                  </div>
                </div>
                
                <!-- 第二条评论 -->
                <div class="comment-item flex gap-3">
                  <img src="https://picsum.photos/id/1012/40/40" alt="用户头像" class="user-avatar w-10 h-10 rounded-full object-cover flex-shrink-0">
                  <div class="comment-content flex-1">
                    <div class="comment-meta flex items-center mb-1">
                      <span class="comment-author font-medium mr-2">测试用户2</span>
                      <span class="comment-time text-xs text-gray-500">3天前</span>
                    </div>
                    <p class="comment-text text-gray-800 mb-2">拍摄手法很专业，画面质量很高，支持一下！</p>
                    <div class="comment-actions flex items-center text-sm text-gray-500">
                      <button class="hover:text-red-500 mr-4 transition-colors">点赞 (28)</button>
                      <button class="hover:text-gray-700 transition-colors">回复</button>
                    </div>
                  </div>
                </div>
                
                <!-- 第三条评论（带回复） -->
                <div class="comment-item flex gap-3">
                  <img src="https://picsum.photos/id/1025/40/40" alt="用户头像" class="user-avatar w-10 h-10 rounded-full object-cover flex-shrink-0">
                  <div class="comment-content flex-1">
                    <div class="comment-meta flex items-center mb-1">
                      <span class="comment-author font-medium mr-2">测试用户3</span>
                      <span class="comment-time text-xs text-gray-500">1周前</span>
                    </div>
                    <p class="comment-text text-gray-800 mb-2">有人知道这里的背景音乐是什么吗？很好听</p>
                    <div class="comment-actions flex items-center text-sm text-gray-500 mb-3">
                      <button class="hover:text-red-500 mr-4 transition-colors">点赞 (15)</button>
                      <button class="hover:text-gray-700 transition-colors">回复</button>
                    </div>
                    
                    <!-- 评论回复 -->
                    <div class="comment-reply bg-gray-50 p-3 rounded-lg mt-2">
                      <div class="flex gap-2 mb-2">
                        <img src="https://picsum.photos/id/64/32/32" alt="回复用户头像" class="w-8 h-8 rounded-full object-cover">
                        <div>
                          <div class="flex items-center">
                            <span class="font-medium text-sm">测试UP主</span>
                            <span class="ml-2 text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">作者</span>
                          </div>
                          <p class="text-sm text-gray-800">背景音乐是《自然之声》专辑里的曲目</p>
                        </div>
                      </div>
                      <div class="flex items-center text-xs text-gray-500 ml-10">
                        <button class="hover:text-red-500 mr-4 transition-colors">点赞 (8)</button>
                        <button class="hover:text-gray-700 transition-colors">回复</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 加载更多评论 -->
              <button class="w-full py-2 mt-6 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                加载更多评论
              </button>
            </div>
          </div>
        </div>

        <!-- 右侧推荐视频栏 - 大屏显示，小屏隐藏 -->
        <div class="recommendations-area hidden lg:block order-1 lg:order-2">
          <div class="sticky top-4 recommendations-list bg-white rounded-lg overflow-hidden shadow-sm">
            <h3 class="recommendations-title font-bold p-3 border-b border-gray-100">推荐视频</h3>
            <div class="recommendations-items divide-y divide-gray-100">
              <!-- 推荐视频项 -->
              <div class="recommendation-item p-3 hover:bg-gray-50 transition-colors cursor-pointer" v-for="i in 8" :key="i">
                <div class="recommendation-content flex gap-3">
                  <div class="recommendation-thumbnail relative w-1/3 flex-shrink-0">
                    <img 
                      :src="`https://picsum.photos/id/${30+i}/200/120`" 
                      alt="推荐视频封面" 
                      class="w-full h-full object-cover rounded"
                    >
                    <span class="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1">
                      {{ i % 2 === 0 ? '10:30' : '05:20' }}
                    </span>
                  </div>
                  <div class="recommendation-info w-2/3">
                    <h4 class="text-sm font-medium line-clamp-2 mb-1">
                      {{ i % 3 === 0 ? '高清自然风景摄影，4K画质展示' : 
                         i % 3 === 1 ? '这是一个推荐视频的标题，内容相关' : 
                         '旅行Vlog：探索未知的自然景观' }}
                    </h4>
                    <p class="text-xs text-gray-500 line-clamp-1">测试UP主</p>
                    <p class="text-xs text-gray-500">{{ formatNumber(1234+i*1000) }} 播放</p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 查看更多推荐 -->
            <button class="w-full py-2 text-center text-gray-600 hover:bg-gray-50 transition-colors">
              查看更多
            </button>
          </div>
        </div>
      </div>

      <!-- 移动端推荐视频区 - 仅小屏显示 -->
      <div class="recommendations-area mt-6 lg:hidden">
        <div class="recommendations-list bg-white rounded-lg overflow-hidden shadow-sm">
          <h3 class="recommendations-title font-bold p-3 border-b border-gray-100">推荐视频</h3>
          <div class="recommendations-items divide-y divide-gray-100">
            <!-- 移动端显示3个推荐视频 -->
            <div class="recommendation-item p-3 hover:bg-gray-50 transition-colors cursor-pointer" v-for="i in 3" :key="i">
              <div class="recommendation-content flex gap-3">
                <div class="recommendation-thumbnail relative w-1/3 flex-shrink-0">
                  <img 
                    :src="`https://picsum.photos/id/${40+i}/200/120`" 
                    alt="推荐视频封面" 
                    class="w-full h-full object-cover rounded"
                  >
                  <span class="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1">
                    {{ i % 2 === 0 ? '12:15' : '08:40' }}
                  </span>
                </div>
                <div class="recommendation-info w-2/3">
                  <h4 class="text-sm font-medium line-clamp-2 mb-1">
                    {{ i % 3 === 0 ? '户外探险：深入森林秘境' : 
                       i % 3 === 1 ? '延时摄影：城市与自然的融合' : 
                       '野生动物观察：自然生态记录' }}
                  </h4>
                  <p class="text-xs text-gray-500 line-clamp-1">测试UP主</p>
                  <p class="text-xs text-gray-500">{{ formatNumber(2345+i*800) }} 播放</p>
                </div>
              </div>
            </div>
          </div>
          
          <button class="w-full py-2 border-t border-gray-100 text-gray-600 hover:bg-gray-50 transition-colors">
            查看更多推荐
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import VideoPlayer from '@/components/UI/VideoPlayer.vue'
import defaultPoster from '@/assets/images/image.png'

// 视频信息类型定义
interface VideoInfo {
  id: number
  title: string
  url: string
  poster: string
  duration: string
  views: number
  date: string
  description: string
}

// 路由相关
const router = useRouter()
const route = useRoute()
const videoId = ref(Number(route.params.id) || 1)

// 视频信息响应式变量
const videoPlayer = ref<InstanceType<typeof VideoPlayer> | null>(null)
const isPlaying = ref(false)
const playbackRate = ref(1)
const isDescriptionExpanded = ref(false) // 控制视频简介展开/收起

// 格式化数字（如 1234 → 1.2万）
const formatNumber = (num: number) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + '千'
  }
  return num.toString()
}

// 切换播放状态
const togglePlay = () => {
  if (isPlaying.value) {
    videoPlayer.value?.pause()
  } else {
    videoPlayer.value?.play()
  }
  isPlaying.value = !isPlaying.value
}

// 切换全屏
const toggleFullscreen = () => {
  videoPlayer.value?.toggleFullscreen()
}

// 改变播放速度
const changeSpeed = () => {
  videoPlayer.value?.setPlaybackRate(playbackRate.value)
}

// 切换视频简介展开/收起状态
const toggleDescription = () => {
  isDescriptionExpanded.value = !isDescriptionExpanded.value
}

const videoInfo = ref<VideoInfo>({
  id: 0,
  title: '',
  url: '',
  poster: '',
  duration: '',
  views: 0,
  date: '',
  description: ''
})

// 模拟获取视频数据
const fetchVideoData = (id: number) => {
  const mp4Url = 'https://stream7.iqilu.com/10339/upload_transcode/202002/09/20200209104902N3v5Vpxuvb.mp4'
  
  return {
    id,
    title: '测试视频 - 自然风景展示与讲解，带你领略大自然的魅力',
    url: mp4Url,
    poster: defaultPoster,
    duration: '05:30',
    views: 125800,
    date: '2023-10-01',
    description: '这是一个测试用的自然风景视频，包含了山川、河流等自然景观。\n\n视频拍摄于2023年秋季，使用专业设备录制，画质清晰。\n\n喜欢本视频的话请点赞投币收藏三连支持一下UP主~\n\n相关视频可以查看我的频道专辑《自然之美》系列。\n\n更多精彩内容请关注我的频道，每周更新自然风景和户外探险视频，带你领略世界的美好风光。'
  }
}

// 组件挂载时加载视频数据
onMounted(() => {
  videoInfo.value = fetchVideoData(videoId.value)
})

// 返回上一页
const goBack = () => {
  router.back()
}
</script>

<style scoped>
/* 基础样式补充 */
button {
  cursor: pointer;
  border: none;
  background: none;
}

/* 滚动条样式优化 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(100, 100, 100, 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-track {
  background-color: transparent;
}

/* 视频容器保持16:9比例，确保在各种设备上正确显示 */
.video-container {
  aspect-ratio: 16 / 9;
  min-height: 200px; /* 确保小屏幕上有足够高度 */
}

/* 返回按钮优化样式 */
.back-btn {
  padding: 2px 4px;
  border-radius: 4px;
}

.back-btn:hover {
  background-color: rgba(59, 130, 246, 0.1);
}

.back-btn svg {
  stroke-width: 2.5; /* 让箭头更清晰 */
}

/* 视频头部区域样式 */
.video-header {
  padding: 4px 0;
}

/* 互动按钮在小屏幕上的优化 */
@media (max-width: 640px) {
  .interaction-btn {
    padding: 2px !important;
  }
  
  .interaction-btn svg {
    width: 16px !important;
    height: 16px !important;
  }
  
  .interaction-btn span {
    font-size: 12px !important;
  }
}

/* 确保在极小屏幕上的可用性 */
@media (max-width: 360px) {
  .video-info {
    padding: 2px !important;
  }
  
  .comment-author {
    font-size: 0.8rem;
  }
}
</style>
