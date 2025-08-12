<template>
  <div class="w-full relative">
    <!-- 加载中状态 -->
    <div v-if="loading" class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
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
  videoUrl: string  // 视频地址
  autoplay?: boolean // 是否自动播放
  controls?: boolean // 是否显示控制栏
  loop?: boolean     // 是否循环播放
  muted?: boolean    // 是否静音（自动播放需配合静音）
  poster?: string    // 封面图地址
  playbackRates?: number[] // 播放速度选项
  defaultPlaybackRate?: number // 默认播放速度
  fluid?: boolean   // 是否自适应容器
  aspectRatio?: string // 视频宽高比
  sources?: Array<{  // 多源支持
    src: string
    type: string
  }>
}

// 参数默认值
const props = withDefaults(defineProps<Props>(), {
  autoplay: false,
  controls: true,
  loop: false,
  muted: false,
  poster: '',
  playbackRates: () => [0.5, 1, 1.5, 2],
  defaultPlaybackRate: 1,
  fluid: true,
  aspectRatio: '16:9',
  sources: undefined
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

  // 初始化Video.js播放器
  player = videojs(videoElement.value, {
    autoplay: props.autoplay,
    controls: props.controls,
    loop: props.loop,
    muted: props.muted,
    poster: props.poster,
    fluid: props.fluid,
    aspectRatio: props.aspectRatio,
    playbackRates: props.playbackRates,
    techOrder: ['html5'],
    // 自定义控制组件布局
    controlBar: {
      children: [
        'playToggle',
        'volumePanel',
        'currentTimeDisplay',
        'timeDivider',
        'durationDisplay',
        'progressControl',
        'playbackRateMenuButton',
        'fullscreenToggle'
      ],
      // 音量控制优化
      volumePanel: {
        inline: false, // 点击音量图标显示滑块
        vertical: false // 水平滑块布局
      }
    },
    sources: props.sources || [{
      src: props.videoUrl,
      type: props.videoUrl.includes('.m3u8') ? 'application/x-mpegURL' : 
            props.videoUrl.includes('.mpd') ? 'application/dash+xml' : 
            'video/mp4'
    }]
  })

  // 设置默认播放速度
  if (props.defaultPlaybackRate) {
    player.playbackRate(props.defaultPlaybackRate)
  }

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

  // 添加音量变化动画效果
  const volumeControl = player.controlBar.volumePanel?.volumeControl
  if (volumeControl) {
    volumeControl.on('volumechange', () => {
      const volumeIcon = player?.el().querySelector('.vjs-volume-panel .vjs-icon-placeholder')
      if (volumeIcon) {
        volumeIcon.classList.add('vjs-volume-animate')
        setTimeout(() => {
          volumeIcon.classList.remove('vjs-volume-animate')
        }, 300)
      }
    })
  }
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

// 暴露播放器控制方法
defineExpose({
  getPlayer: () => player,
  play: () => player?.play(),
  pause: () => player?.pause(),
  toggleFullscreen: () => {
    if (player) {
      if (player.isFullscreen()) {
        player.exitFullscreen()
      } else {
        player.requestFullscreen()
      }
    }
  },
  setPlaybackRate: (rate: number) => {
    if (player) player.playbackRate(rate)
  },
  setVolume: (volume: number) => {
    if (player) player.volume(volume)
  },
  toggleMute: () => {
    if (player) player.muted(!player.muted())
  }
})
</script>

<style scoped>
/* 强制播放器占满容器 */
::v-deep .video-js {
  width: 100% !important;
  height: 100% !important;
  --vjs-control-color: #fff;
  --vjs-control-hover-color: #42b983; /* Vue绿色作为强调色 */
  --vjs-play-control-color: #fff;
  --vjs-play-control-hover-color: #42b983;
  --vjs-volume-level-color: #42b983;
  --vjs-slider-thumb-color: #42b983;
  --vjs-slider-rail-color: rgba(255, 255, 255, 0.3);
  --vjs-slider-track-color: rgba(66, 185, 131, 0.7);
  --vjs-control-bar-background: rgba(0, 0, 0, 0.7);
}

/* 播放按钮优化 */
::v-deep .vjs-play-control {
  width: 50px !important;
  height: 50px !important;
  border-radius: 50% !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  margin: 0 8px !important;
  transition: all 0.3s ease !important;
  background-color: rgba(0, 0, 0, 0.4) !important;
}

::v-deep .vjs-play-control:hover {
  background-color: #42b983 !important;
  transform: scale(1.05) !important;
}

::v-deep .vjs-play-control .vjs-icon-placeholder:before {
  font-size: 24px !important;
  line-height: 1 !important;
}

/* 音量控制优化 */
::v-deep .vjs-volume-panel {
  margin: 0 10px !important;
  transition: all 0.3s ease !important;
}

::v-deep .vjs-volume-panel:hover {
  transform: scale(1.05) !important;
}

::v-deep .vjs-volume-control {
  width: 80px !important;
  transition: width 0.3s ease !important;
}

::v-deep .vjs-volume-panel:hover .vjs-volume-control {
  width: 100px !important;
}

::v-deep .vjs-volume-level {
  background-color: var(--vjs-volume-level-color) !important;
  transition: width 0.2s ease !important;
}

/* 音量变化动画 */
::v-deep .vjs-volume-animate {
  animation: volumePulse 0.3s ease !important;
}

@keyframes volumePulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

/* 进度条优化 */
::v-deep .vjs-progress-control {
  height: 8px !important;
  margin: 0 10px !important;
}

::v-deep .vjs-progress-holder {
  height: 4px !important;
  border-radius: 2px !important;
  transition: height 0.2s ease !important;
}

::v-deep .vjs-progress-control:hover .vjs-progress-holder {
  height: 6px !important;
}

::v-deep .vjs-play-progress {
  background-color: var(--vjs-slider-track-color) !important;
}

/* 全屏按钮优化 */
::v-deep .vjs-fullscreen-control {
  transition: all 0.3s ease !important;
}

::v-deep .vjs-fullscreen-control:hover {
  transform: scale(1.1) !important;
}

/* 播放速度按钮优化 */
::v-deep .vjs-playback-rate-menu-button {
  margin: 0 10px !important;
  transition: all 0.3s ease !important;
}

::v-deep .vjs-playback-rate-menu-button:hover {
  transform: scale(1.05) !important;
}

/* 控制栏整体优化 */
::v-deep .vjs-control-bar {
  padding: 8px 10px !important;
  height: 50px !important;
  transition: all 0.3s ease !important;
  background-color: var(--vjs-control-bar-background) !important;
  transform: translateY(10px) !important;
  opacity: 0.9 !important;
}

::v-deep .video-js:hover .vjs-control-bar {
  transform: translateY(0) !important;
  opacity: 1 !important;
}

/* 加载中覆盖层 */
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
  transition: background 0.3s, transform 0.2s;
}

.retry-btn:hover {
  background: #359e75;
  transform: translateY(-2px);
}

.retry-btn:active {
  transform: translateY(0);
}

/* 加载动画关键帧 */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
