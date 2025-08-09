<template>
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
</template>

<script>
import { ChatRound, View, Message, ArrowRight } from '@element-plus/icons-vue';
import { ElButton, ElIcon } from 'element-plus';

export default {
  name: 'TopicList',
  components: {
    ElButton,
    ElIcon,
    ChatRound,
    View,
    Message,
    ArrowRight
  },
  props: {
    topics: {
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
