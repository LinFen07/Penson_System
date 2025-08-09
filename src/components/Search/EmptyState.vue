<template>
  <div class="bg-white rounded-lg p-8 text-center shadow-sm">
    <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <el-icon class="text-gray-400 text-3xl"><Search /></el-icon>
    </div>
    <h3 class="text-lg font-medium mb-2">未找到相关结果</h3>
    <p class="text-gray-500 mb-6">
      没有找到与 "{{ query }}" 相关的内容，请尝试其他关键词
    </p>
    <el-button 
      type="primary" 
      @click="$emit('clear')"
    >
      清除搜索内容
    </el-button>
  </div>
</template>

<script>
import { Search } from '@element-plus/icons-vue';
import { ElButton, ElIcon } from 'element-plus';

export default {
  name: 'EmptyState',
  components: {
    ElButton,
    ElIcon,
    Search
  },
  props: {
    query: {
      type: String,
      default: ''
    }
  }
};
</script>
