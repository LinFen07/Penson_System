<template>
  <div class="bg-white rounded-lg shadow-sm p-4 sticky top-4">
    <div class="flex items-center justify-between mb-3">
      <h3 class="font-medium text-gray-800">社区公告</h3>
      <span class="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">新</span>
    </div>
    <div class="space-y-3">
      <div class="border-l-2 border-red-500 pl-3 py-1">
        <p class="text-sm text-gray-700 font-medium">社区规则更新通知</p>
        <p class="text-xs text-gray-500 mt-1">为维护良好讨论环境，新增内容审核机制...</p>
        <p class="text-xs text-gray-400 mt-2">2023-05-20</p>
      </div>
      <div class="border-l-2 border-gray-300 pl-3 py-1">
        <p class="text-sm text-gray-700 font-medium">「技术分享大赛」开始报名</p>
        <p class="text-xs text-gray-500 mt-1">分享你的技术经验，赢取开发书籍和周边...</p>
        <p class="text-xs text-gray-400 mt-2">2023-05-15</p>
      </div>
    </div>
    <button class="w-full mt-3 text-sm text-blue-600 hover:text-blue-800 transition-colors">
      查看全部公告 <i class="fa fa-angle-right ml-1"></i>
    </button>
  </div>
</template>

<script setup>
// 纯展示组件，无逻辑
</script>