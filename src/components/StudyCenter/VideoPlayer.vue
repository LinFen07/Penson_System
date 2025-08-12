<template>
  <div class="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
    <!-- 视频元素 -->
    <video
      ref="videoRef"
      class="w-full h-full object-contain"
      :src="src"
      @timeupdate="handleTimeUpdate"
      @ended="handleVideoEnded"
    ></video>

    <!-- 视频控制栏 -->
    <div 
      class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 transition-opacity duration-300"
      :class="{'opacity-0': !showControls}"
      @mouseenter="showControls = true"
      @mouseleave="showControls = false"
    >
      <!-- 进度条 -->
      <div class="flex items-center mb-2">
        <span class="text-xs text-white mr-2">{{ currentTimeText }}</span>
        <input
          type="range"
          class="flex-grow h-1 bg-gray-600 rounded-full appearance-none cursor-pointer"
          min="0"
          :max="duration"
          :value="currentTime"
          @input="handleSeek"
        >
        <span class="text-xs text-white ml-2">{{ durationText }}</span>
      </div>

      <!-- 控制按钮 -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <!-- 播放/暂停按钮 -->
          <button @click="togglePlay">
            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path v-if="!isPlaying" fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path>
              <path v-else fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
            </svg>
          </button>

          <!-- 音量控制 -->
          <div class="flex items-center">
            <button @click="toggleMute">
              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path v-if="isMuted" fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 4.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clip-rule="evenodd"></path>
                <path v-else fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L14.586 11H7a1 1 0 110-2h7.586l-1.293-1.293a1 1 0 010-1.414z" clip-rule="evenodd"></path>
              </svg>
            </button>
            <input
              v-show="!isMuted"
              type="range"
              class="w-20 h-1 bg-gray-600 rounded-full appearance-none cursor-pointer ml-2"
              min="0"
              max="1"
              step="0.01"
              :value="volume"
              @input="handleVolumeChange"
            >
          </div>
        </div>

        <div class="flex items-center space-x-3">
          <!-- 播放速度 -->
          <select
            v-model="playbackRate"
            class="bg-gray-700 text-white text-xs rounded px-2 py-1 focus:outline-none"
            @change="handlePlaybackRateChange"
          >
            <option value="0.5">0.5x</option>
            <option value="1" selected>1x</option>
            <option value="1.5">1.5x</option>
            <option value="2">2x</option>
          </select>

          <!-- 全屏按钮 -->
          <button @click="toggleFullscreen">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clip-rule="evenodd"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Props {
  src: string
  autoplay?: boolean
  loop?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  autoplay: false,
  loop: false
})

const emit = defineEmits<{
  (e: 'play'): void
  (e: 'pause'): void
  (e: 'ended'): void
  (e: 'timeupdate', time: number): void
}>()

const videoRef = ref<HTMLVideoElement | null>(null)
const isPlaying = ref(false)
const isMuted = ref(false)
const showControls = ref(true)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(0.7)
const playbackRate = ref(1)
const isFullscreen = ref(false)

const currentTimeText = computed(() => {
  const minutes = Math.floor(currentTime.value / 60)
  const seconds = Math.floor(currentTime.value % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
})

const durationText = computed(() => {
  const minutes = Math.floor(duration.value / 60)
  const seconds = Math.floor(duration.value % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
})

const togglePlay = () => {
  if (!videoRef.value) return

  if (isPlaying.value) {
    videoRef.value.pause()
    emit('pause')
  } else {
    videoRef.value.play()
    emit('play')
  }
  isPlaying.value = !isPlaying.value
}

const toggleMute = () => {
  if (!videoRef.value) return
  isMuted.value = !isMuted.value
  videoRef.value.muted = isMuted.value
}

const toggleFullscreen = () => {
  if (!videoRef.value) return

  if (!isFullscreen.value) {
    if (videoRef.value.requestFullscreen) {
      videoRef.value.requestFullscreen()
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    }
  }
  isFullscreen.value = !isFullscreen.value
}

const handleTimeUpdate = () => {
  if (!videoRef.value) return
  currentTime.value = videoRef.value.currentTime
  duration.value = videoRef.value.duration
  emit('timeupdate', currentTime.value)
}

const handleSeek = (e: Event) => {
  if (!videoRef.value) return
  const target = e.target as HTMLInputElement
  videoRef.value.currentTime = Number(target.value)
}

const handleVolumeChange = (e: Event) => {
  if (!videoRef.value) return
  const target = e.target as HTMLInputElement
  volume.value = Number(target.value)
  videoRef.value.volume = volume.value
  isMuted.value = volume.value === 0
}

const handlePlaybackRateChange = () => {
  if (!videoRef.value) return
  videoRef.value.playbackRate = Number(playbackRate.value)
}

const handleVideoEnded = () => {
  isPlaying.value = false
  emit('ended')
}

const handleFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement
}

onMounted(() => {
  if (!videoRef.value) return

  if (props.autoplay) {
    videoRef.value.play()
    isPlaying.value = true
  }

  videoRef.value.volume = volume.value
  videoRef.value.loop = props.loop

  document.addEventListener('fullscreenchange', handleFullscreenChange)
})

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
})
</script>

<style scoped>
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
}

input[type="range"]::-moz-range-thumb {
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
}
</style>
