<template>
  <div>
    <h2 class="text-xl font-semibold mb-4">回复 ({{ replies.length }})</h2>
    
    <!-- 回复表单 -->
    <div class="mb-6">
      <textarea 
        v-model="replyContent" 
        placeholder="写下你的回复..." 
        class="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows="3"
      ></textarea>
      <div class="flex justify-end mt-2">
        <button 
          @click="handleSubmit"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          发布回复
        </button>
      </div>
    </div>

    <!-- 回复列表 -->
    <div class="space-y-6">
      <div v-for="reply in replies" :key="reply.id" class="border-t border-gray-100 pt-4">
        <div class="flex items-start">
          <img v-if="reply.author" :src="reply.author.avatar" alt="用户头像" class="w-8 h-8 rounded-full mr-3">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <span class="font-medium">{{ reply.author.name }}</span>
              <span class="text-xs text-gray-500">{{ formatTime(reply.createdAt) }}</span>
            </div>
            <p class="text-gray-700">{{ reply.content }}</p>
            <button class="text-sm text-blue-600 mt-2 hover:underline">回复</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div class="flex justify-center mt-8">
      <button 
        @click="currentPage > 1 && (currentPage--)" 
        class="px-3 py-1 border rounded-l hover:bg-gray-50 disabled:opacity-50"
        :disabled="currentPage <= 1"
      >
        上一页
      </button>
      <span class="px-3 py-1 border-t border-b">第 {{ currentPage }} 页</span>
      <button 
        @click="currentPage < totalPages && (currentPage++)" 
        class="px-3 py-1 border rounded-r hover:bg-gray-50 disabled:opacity-50"
        :disabled="currentPage >= totalPages"
      >
        下一页
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  replies: {
    type: Array,
    required: true,
    default: () => []
  }
})

const emit = defineEmits(['submit'])

const replyContent = ref('')
const currentPage = ref(1)

const totalPages = computed(() => Math.ceil(props.replies.length / 2) || 1)

const formatTime = (timeStr) => {
  const date = new Date(timeStr)
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

const handleSubmit = () => {
  if (!replyContent.value.trim()) return
  emit('submit', replyContent.value)
  replyContent.value = ''
}
</script>
