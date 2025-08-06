<template>
  <div>
    <input
      v-model="internalTitle"
      type="text"
      placeholder="输入标题（如：快速排序的3种优化思路）"
      class="w-full text-2xl font-bold border-b pb-3 mb-6 focus:outline-none focus:border-blue-500 transition-colors"
      :class="hasError ? 'border-red-500' : ''"
    >
    <p v-if="hasError" class="text-red-500 text-sm mb-6 -mt-4">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

// 接收父组件传递的 title（只读）
const props = defineProps({
  title: { type: String, default: '' }
})

// 声明更新事件（用于通知父组件修改 title）
const emit = defineEmits(['update:title', 'error'])

// 子组件内部维护的本地状态（可修改）
const internalTitle = ref(props.title)

// 1. 监听本地状态变化：同步给父组件 + 验证标题合法性
watch(internalTitle, (val) => {
  // 同步给父组件（实现双向绑定）
  emit('update:title', val)
  
  // 验证逻辑
  if (!val.trim() || val.length < 5) {
    hasError.value = true
    errorMessage.value = '请输入至少5个字符的标题'
    emit('error', true)
  } else {
    hasError.value = false
    emit('error', false)
  }
})

// 2. 监听父组件传递的 title 变化：同步到本地状态
watch(() => props.title, (newVal) => {
  internalTitle.value = newVal
})
</script>