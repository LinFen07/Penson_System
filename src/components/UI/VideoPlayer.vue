<template>
  <div class="video-player-container">
    <!-- 加载中状态 -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
    </div>
    <!-- 错误状态 + 重试按钮 -->
    <div v-if="error" class="error-message">
      <p>视频加载失败，请点击重试</p>
      <button @click="retryLoad" class="retry-btn">重试</button>
    </div>
    <!-- 视频播放器容器 -->
    <video 
      ref="videoElement" 
      class="video-js vjs-big-play-centered"
      :poster="poster"
    ></video>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

// 播放器接收的参数
interface Props {
  videoUrl: string  // MP4视频地址
  autoplay?: boolean // 是否自动播放
  controls?: boolean // 是否显示控制栏
  loop?: boolean     // 是否循环播放
  muted?: boolean    // 是否静音（自动播放需配合静音）
  poster?: string    // 封面图地址
}

// 参数默认值
const props = withDefaults(defineProps<Props>(), {
  autoplay: false,
  controls: true,
  loop: false,
  muted: false,
  poster: ''
})

// 响应式状态
const loading = ref(true)       // 加载中
const error = ref(false)        // 错误状态
const videoElement = ref<HTMLVideoElement | null>(null)  // 视频DOM元素
let player: videojs.Player | null = null  // 播放器实例

// 初始化播放器
const initPlayer = () => {
  // 校验视频地址和DOM元素
  if (!props.videoUrl || !videoElement.value) return

  // 销毁旧实例（避免重复创建）
  if (player) {
    player.dispose()
    player = null
  }

  // 重置状态
  loading.value = true
  error.value = false

  // 初始化Video.js播放器（仅针对MP4优化）
  player = videojs(videoElement.value, {
    autoplay: props.autoplay,
    controls: props.controls,
    loop: props.loop,
    muted: props.muted,  // 自动播放必须静音（浏览器政策）
    poster: props.poster,
    fluid: true,  // 自适应容器大小
    techOrder: ['html5'],  // 仅使用HTML5播放器（MP4原生支持）
    sources: [{
      src: props.videoUrl,
      type: 'video/mp4'  // 固定MP4类型
    }]
  })

  // 监听视频加载成功
  player.on('loadedmetadata', () => {
    loading.value = false
  })

  // 监听视频错误
  player.on('error', () => {
    loading.value = false
    error.value = true
    console.error('视频错误详情:', player?.error())
  })
}

// 重试加载视频
const retryLoad = () => {
  initPlayer()
}

// 监听视频地址变化（如果后续需要切换视频）
watch(
  () => props.videoUrl,
  (newUrl) => {
    if (newUrl) initPlayer()
  }
)

// 组件挂载时初始化播放器
onMounted(() => {
  initPlayer()
})

// 组件卸载时销毁播放器（避免内存泄漏）
onBeforeUnmount(() => {
  if (player) {
    player.dispose()
    player = null
  }
})

// 暴露播放器实例（可选，用于父组件控制）
defineExpose({
  getPlayer: () => player
})
</script>

<style scoped>
.video-player-container {
  width: 100%;
  min-height: 500px;  /* 确保播放器高度足够 */
  position: relative;
}

/* 强制播放器占满容器 */
::v-deep .video-js {
  width: 100% !important;
  height: 100% !important;
}

/* 加载中覆盖层 */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

/* 加载动画 */
.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #42b983;  /* Vue绿色调 */
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* 错误状态样式 */
.error-message {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  z-index: 10;
  font-size: 16px;
}

/* 重试按钮 */
.retry-btn {
  padding: 8px 16px;
  background: #42b983;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  transition: background 0.3s;
}

.retry-btn:hover {
  background: #359e75;
}

/* 加载动画关键帧 */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>