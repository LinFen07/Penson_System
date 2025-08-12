<template>
  <section class="mb-10">
    <h2 class="text-lg font-semibold mb-4 flex items-center">
      <el-icon class="text-primary mr-2"><HelpFilled /></el-icon>题库
    </h2>
    
    <div class="space-y-3">
      <div 
        class="bg-white rounded-lg p-4 shadow-sm card-hover cursor-pointer"
        v-for="(question, index) in questions" 
        :key="index"
      >
        <div class="flex items-start">
          <span 
            class="text-xs px-2 py-1 rounded-full mt-0.5"
            :class="question.type === 'single' ? 'bg-blue-50 text-primary' : 
                   question.type === 'multiple' ? 'bg-purple-50 text-accent' : 
                   'bg-green-50 text-green-600'"
          >
            {{ question.type === 'single' ? '单选题' : 
               question.type === 'multiple' ? '多选题' : '编程题' }}
          </span>
          <div class="ml-3 flex-grow">
            <h3 class="font-medium">{{ question.title }}</h3>
            <div class="text-sm text-gray-500 mt-2">
              难度: {{ question.difficulty }} · {{ question.participants }}人做过 · 发布于 {{ question.date }}
            </div>
            <div class="flex flex-wrap gap-2 mt-2">
              <span 
                class="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                v-for="(tag, tagIdx) in question.tags" 
                :key="tagIdx"
              >
                {{ tag }}
              </span>
            </div>
          </div>
          <el-button 
            icon="Star" 
            circle 
            size="small"
            class="text-gray-400 hover:text-primary hover:bg-primary/5 border-none bg-transparent"
          />
        </div>
      </div>
      
      <!-- 查看更多按钮 -->
      <div class="text-center pt-2">
        <el-button 
          type="text" 
          class="text-primary text-sm hover:underline"
        >
          查看更多题库 <el-icon class="ml-1"><ArrowRight /></el-icon>
        </el-button>
      </div>
    </div>
  </section>
</template>

<script>
import { HelpFilled, Star, ArrowRight } from '@element-plus/icons-vue';
import { ElButton, ElIcon } from 'element-plus';

export default {
  name: 'QuestionList',
  components: {
    ElButton,
    ElIcon,
    HelpFilled,
    Star,
    ArrowRight
  },
  props: {
    questions: {
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
