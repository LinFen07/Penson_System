<template>
  <div class="bg-white rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md">
    <div class="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
      <h3 class="font-semibold text-gray-800 flex items-center">
        <el-icon class="text-primary mr-2"><HotWater/></el-icon>
        热门话题
      </h3>
      <el-button 
        type="text" 
        class="text-xs text-gray-500 hover:text-primary p-0 h-auto"
      >
        更多
      </el-button>
    </div>
    <div class="p-3">
      <div class="space-y-1">
        <div 
          class="px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer flex items-center"
          v-for="(topic, index) in hotTopics" 
          :key="index"
        >
          <span class="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center mr-3 font-medium">
            {{ index + 1 }}
          </span>
          <div class="flex-grow min-w-0">
            <p class="text-sm text-gray-800 truncate">{{ topic.title }}</p>
            <p class="text-xs text-gray-500 mt-0.5">{{ topic.discussions }} 讨论</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { HotWater } from '@element-plus/icons-vue';
import { ElButton, ElIcon } from 'element-plus';

const hotTopics = [
  { title: '2023年前端发展趋势预测', discussions: '328' },
  { title: 'TypeScript vs JavaScript 最佳实践', discussions: '256' },
  { title: 'React 18新特性实战体验', discussions: '189' },
  { title: 'Vue 3组合式API完全指南', discussions: '156' },
  { title: '前端性能优化的10个实用技巧', discussions: '124' }
];
</script>
