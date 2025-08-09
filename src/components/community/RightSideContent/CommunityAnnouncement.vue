<template>
  <div class="bg-white rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md">
    <div class="px-5 py-4 border-b border-gray-100">
      <h3 class="font-semibold text-gray-800 flex items-center">
        <el-icon class="text-primary mr-2"><Bell /></el-icon>
        社区公告
      </h3>
    </div>
    <div class="p-5 space-y-4">
      <div class="space-y-2">
        <div class="flex items-start">
          <span class="inline-block w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></span>
          <div>
            <h4 class="text-sm font-medium text-gray-800">2023年编程大赛开始报名</h4>
            <p class="text-xs text-gray-500 mt-1">即日起至6月30日，点击查看详情</p>
          </div>
        </div>
        <div class="w-full h-px bg-gray-100 my-2"></div>
        <div class="flex items-start">
          <span class="inline-block w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></span>
          <div>
            <h4 class="text-sm font-medium text-gray-800">社区新功能上线：内容收藏</h4>
            <p class="text-xs text-gray-500 mt-1">现在可以收藏喜欢的问答和文章了</p>
          </div>
        </div>
      </div>
      <el-button 
        type="text" 
        class="text-primary text-sm w-full justify-center hover:text-primary/80"
      >
        查看全部公告
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { Bell } from '@element-plus/icons-vue';
import { ElButton, ElIcon } from 'element-plus';
</script>
