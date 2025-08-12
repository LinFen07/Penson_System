<template>
  <div class="bg-white rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md">
    <div class="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
      <h3 class="font-semibold text-gray-800 flex items-center">
        <el-icon class="text-primary mr-2"><UserFilled /></el-icon>
        活跃用户
      </h3>
      <el-button 
        type="text" 
        class="text-xs text-gray-500 hover:text-primary p-0 h-auto"
      >
        查看全部
      </el-button>
    </div>
    <div class="p-4">
      <div class="space-y-4">
        <div 
          class="flex items-center justify-between group cursor-pointer"
          v-for="(user, index) in activeUsers" 
          :key="index"
        >
          <div class="flex items-center">
            <div class="relative">
              <img 
                :src="user.avatar" 
                alt="用户头像" 
                class="w-10 h-10 rounded-full object-cover border-2 border-transparent group-hover:border-primary transition-colors"
              >
              <span 
                class="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white"
                :class="user.online ? 'bg-green-500' : 'bg-gray-300'"
              ></span>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-800">{{ user.name }}</p>
              <p class="text-xs text-gray-500">{{ user.role }}</p>
            </div>
          </div>
          <el-button 
            size="mini" 
            type="primary" 
            class="opacity-0 group-hover:opacity-100 transition-opacity bg-primary/10 text-primary hover:bg-primary/20 border-none"
          >
            关注
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { UserFilled } from '@element-plus/icons-vue';
import { ElButton, ElIcon } from 'element-plus';

const activeUsers = [
  { 
    name: '张前端', 
    role: '高级前端工程师', 
    avatar: 'https://picsum.photos/id/1005/100/100', 
    online: true 
  },
  { 
    name: '李算法', 
    role: '算法专家', 
    avatar: 'https://picsum.photos/id/1012/100/100', 
    online: true 
  },
  { 
    name: '王架构', 
    role: '系统架构师', 
    avatar: 'https://picsum.photos/id/1025/100/100', 
    online: false 
  },
  { 
    name: '赵设计', 
    role: 'UI/UX设计师', 
    avatar: 'https://picsum.photos/id/1027/100/100', 
    online: true 
  }
];
</script>
