<template>
  <div class="video-page">
    <div class="container">
      <!-- 返回按钮 -->
      <button @click="goBack" class="back-btn">
        <svg class="back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        返回
      </button>

      <!-- 视频标题 -->
      <h1 class="video-title">{{ videoInfo.title }}</h1>

      <!-- 视频播放器（引入子组件） -->
      <VideoPlayer 
        :video-url="videoInfo.url"
        :autoplay="true"   
        :muted="true"       
        :controls="true"   
        :loop="false"
        :poster="videoInfo.poster"
      />

      <!-- 视频信息 -->
      <div class="video-info">
        <div class="info-row">
          <span>播放量: {{ videoInfo.views }}</span>
          <span>时长: {{ videoInfo.duration }}</span>
          <span>上传时间: {{ videoInfo.date }}</span>
        </div>
        <div class="description">
          <h3>视频简介</h3>
          <p>{{ videoInfo.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'  // 必须导入ref
import { useRouter, useRoute } from 'vue-router'
import VideoPlayer from '@/components/UI/VideoPlayer.vue'  // 导入播放器组件
// 导入封面图（确保assets目录下有此图片，或替换为你的图片）
import defaultPoster from '@/assets/images/image.png'

// 视频信息类型定义
interface VideoInfo {
  id: number
  title: string
  url: string  // MP4视频地址
  poster: string  // 封面图地址
  duration: string  // 时长
  views: number  // 播放量
  date: string  // 上传日期
  description: string  // 简介
}

// 路由相关
const router = useRouter()
const route = useRoute()
const videoId = ref(Number(route.params.id) || 1)  // 从路由获取视频ID（默认1）

// 视频信息响应式变量
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

// 模拟获取视频数据（实际项目中替换为API请求）
const fetchVideoData = (id: number) => {
  // 这里替换为你的MP4视频地址
  const mp4Url = 'https://stream7.iqilu.com/10339/upload_transcode/202002/09/20200209104902N3v5Vpxuvb.mp4'
  
  return {
    id,
    title: `测试视频 ${id} - 自然风景展示`,
    url: mp4Url,  // 固定MP4地址
    poster: defaultPoster,  // 封面图
    duration: '05:30',  // 视频时长
    views: 12580,  // 播放量
    date: '2023-10-01',  // 上传日期
    description: '这是一个测试用的MP4视频，展示了自然风景内容，用于演示视频播放功能。'
  }
}

// 组件挂载时加载视频数据
onMounted(() => {
  videoInfo.value = fetchVideoData(videoId.value)
})

// 返回上一页
const goBack = () => {
  router.back()  // 或 router.push('/') 跳转到首页
}
</script>

<style scoped>
.video-page {
  padding: 20px;
  background: #f5f5f5;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: white;
  border: 1px solid #eee;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 20px;
}

.back-icon {
  width: 20px;
  height: 20px;
}

.video-title {
  font-size: 24px;
  margin-bottom: 16px;
  color: #333;
}

.video-info {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.info-row {
  display: flex;
  gap: 24px;
  color: #666;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.description {
  margin-top: 16px;
}

.description h3 {
  font-size: 18px;
  margin-bottom: 8px;
}

.description p {
  color: #555;
  line-height: 1.6;
}
</style>