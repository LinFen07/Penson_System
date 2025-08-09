<template>
  <div class="bg-white rounded-lg p-5 shadow-sm">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-semibold">搜索历史</h2>
      <el-button 
        type="text" 
        size="small" 
        class="text-gray-500 hover:text-gray-700"
        @click="$emit('clear')"
      >
        清除全部
      </el-button>
    </div>
    
    <div v-if="historyList.length > 0" class="flex flex-wrap gap-2">
      <el-tag 
        v-for="(item, index) in historyList" 
        :key="index"
        closable
        :disable-transitions="false"
        class="cursor-pointer"
        @click="$emit('search', item)"
        @close="handleClose(index)"
      >
        {{ item }}
      </el-tag>
    </div>
    
    <div v-else class="text-center py-6 text-gray-500">
      暂无搜索历史
    </div>
  </div>
</template>

<script>
import { ElButton, ElTag } from 'element-plus';

export default {
  name: 'SearchHistory',
  components: {
    ElButton,
    ElTag
  },
  props: {
    historyList: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    handleClose(index) {
      // 创建副本以触发响应式更新
      const newHistory = [...this.historyList];
      newHistory.splice(index, 1);
      // 更新本地存储
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
      // 通知父组件更新
      this.$emit('update:historyList', newHistory);
    }
  }
};
</script>
