<template>
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
</template>

<script>
import { VideoPlay, ArrowRight } from '@element-plus/icons-vue';
import { ElButton, ElIcon } from 'element-plus';

export default {
  name: 'VideoList',
  components: {
    ElButton,
    ElIcon,
    VideoPlay,
    ArrowRight
  },
  props: {
    videos: {
      type: Array,
      default: () => []
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
</style>
