<template>
  <div class="flex border-b border-gray-200 mb-8 overflow-x-auto pb-1">
    <el-button 
      :class="activeTab === 'all' ? 'tab-active' : 'border-transparent text-gray-500 hover:text-primary hover:border-primary/30'"
      @click="$emit('change', 'all')"
      class="px-5 py-2 text-sm border-b-2 mr-2 whitespace-nowrap bg-transparent"
    >
      全部
    </el-button>
    <el-button 
      :class="activeTab === 'questions' ? 'tab-active' : 'border-transparent text-gray-500 hover:text-primary hover:border-primary/30'"
      @click="$emit('change', 'questions')"
      class="px-5 py-2 text-sm border-b-2 border-transparent mr-2 whitespace-nowrap bg-transparent"
    >
      <el-icon class="mr-1.5"><HelpFilled /></el-icon>题库
    </el-button>
    <el-button 
      :class="activeTab === 'topics' ? 'tab-active' : 'border-transparent text-gray-500 hover:text-primary hover:border-primary/30'"
      @click="$emit('change', 'topics')"
      class="px-5 py-2 text-sm border-b-2 border-transparent mr-2 whitespace-nowrap bg-transparent"
    >
      <el-icon class="mr-1.5"><ChatRound /></el-icon>话题
    </el-button>
    <el-button 
      :class="activeTab === 'videos' ? 'tab-active' : 'border-transparent text-gray-500 hover:text-primary hover:border-primary/30'"
      @click="$emit('change', 'videos')"
      class="px-5 py-2 text-sm border-b-2 border-transparent whitespace-nowrap bg-transparent"
    >
      <el-icon class="mr-1.5"><VideoPlay /></el-icon>视频
    </el-button>
  </div>
</template>

<script>
import { HelpFilled, ChatRound, VideoPlay } from '@element-plus/icons-vue';
import { ElButton, ElIcon } from 'element-plus';

export default {
  name: 'SearchTabs',
  components: {
    ElButton,
    ElIcon,
    HelpFilled,
    ChatRound,
    VideoPlay
  },
  props: {
    activeTab: {
      type: String,
      default: 'all'
    }
  }
};
</script>

<style scoped>
.tab-active {
  color: #165DFF;
  border-color: #165DFF;
  font-weight: 500;
}
</style>
