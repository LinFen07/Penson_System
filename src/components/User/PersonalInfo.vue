<template>
  <div class="personal-info github-style">
    <!-- 头像区域 -->
    <div class="info-header mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div class="relative">
        <el-avatar 
          :size="100" 
          :src="userInfo.avatar" 
          class="border-4 border-white shadow-sm"
        />
        <button 
          @click="$emit('change-avatar')"
          class="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
          title="更换头像"
        >
          <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
          </svg>
        </button>
      </div>

      <div class="flex-1">
        <!-- 用户名和ID -->
        <div class="mb-2">
          <h1 class="text-2xl font-bold text-gray-900 mb-1">
            {{ userInfo.nickname || '未设置姓名' }}
          </h1>
          <div class="text-gray-500">@{{ userInfo.username || 'username' }}</div>
        </div>

        <!-- 个人简介 -->
        <div class="bg-gray-50 p-3 rounded-md text-gray-700 mb-3">
          {{ userInfo.bio || '暂无个人简介' }}
        </div>

        <!-- 辅助信息 -->
        <div class="flex flex-wrap gap-y-2 gap-x-6 text-sm text-gray-600">
          <div class="flex items-center">
            <svg class="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            {{ userInfo.location || '未设置位置' }}
          </div>
          
          <div class="flex items-center">
            <svg class="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            <a href="#" class="text-blue-600 hover:underline">{{ userInfo.website || '未设置网站' }}</a>
          </div>
          
          <div class="flex items-center">
            <svg class="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            注册于 {{ formatDate(userInfo.registerTime) }}
          </div>
        </div>
      </div>
    </div>

    <!-- 详细信息列表 - GitHub风格表格 -->
    <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <tbody class="divide-y divide-gray-200">
          <tr>
            <th scope="row" class="px-6 py-4 bg-gray-50 w-1/4 text-left text-sm font-medium text-gray-500">
              昵称
            </th>
            <td class="px-6 py-4 text-sm text-gray-900">
              {{ userInfo.nickname || '未设置' }}
            </td>
          </tr>
          <tr>
            <th scope="row" class="px-6 py-4 bg-gray-50 text-left text-sm font-medium text-gray-500">
              性别
            </th>
            <td class="px-6 py-4 text-sm text-gray-900">
              {{ userInfo.gender === 'male' ? '男' : userInfo.gender === 'female' ? '女' : '未设置' }}
            </td>
          </tr>
          <tr>
            <th scope="row" class="px-6 py-4 bg-gray-50 text-left text-sm font-medium text-gray-500">
              生日
            </th>
            <td class="px-6 py-4 text-sm text-gray-900">
              {{ userInfo.birthday || '未设置' }}
            </td>
          </tr>
          <tr>
            <th scope="row" class="px-6 py-4 bg-gray-50 text-left text-sm font-medium text-gray-500">
              粉丝
            </th>
            <td class="px-6 py-4 text-sm text-gray-900">
              {{ stats.fans }}
            </td>
          </tr>
          <tr>
            <th scope="row" class="px-6 py-4 bg-gray-50 text-left text-sm font-medium text-gray-500">
              关注
            </th>
            <td class="px-6 py-4 text-sm text-gray-900">
              {{ stats.following }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 编辑按钮 - GitHub蓝色按钮风格 -->
    <div class="info-actions mt-6 text-right">
      <button 
        @click="$emit('edit-info')"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
        </svg>
        编辑个人信息
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PersonalInfo',
  props: {
    userInfo: {
      type: Object,
      default: () => ({
        avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
        nickname: '用户名',
        username: 'user123',
        bio: '个人简介示例',
        gender: '',
        birthday: '',
        location: '',
        website: '',
        registerTime: new Date().toISOString()
      })
    },
    stats: {
      type: Object,
      default: () => ({
        fans: 100,
        following: 50
      })
    }
  },
  methods: {
    formatDate(dateStr) {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  }
};
</script>

<style scoped>
.github-style {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #1f2328;
}

/* 表格样式 */
.github-style table {
  border-collapse: collapse;
  width: 100%;
}

.github-style th,
.github-style td {
  padding: 0.75rem 1rem;
}

/* 按钮和交互元素 */
.github-style button {
  cursor: pointer;
  font-family: inherit;
}

/* 链接样式 */
.github-style a {
  text-decoration: none;
  transition: color 0.15s ease-in-out;
}

/* 响应式调整 */
@media (max-width: 640px) {
  .info-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .info-header .flex-1 {
    width: 100%;
  }
  
  table th,
  table td {
    display: block;
    width: 100%;
  }
  
  table th {
    background-color: transparent !important;
    padding-bottom: 0.25rem;
  }
  
  table td {
    padding-top: 0.25rem;
    padding-bottom: 1rem;
  }
}
</style>