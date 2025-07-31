<template>
  <div>
    <div class="flex justify-between items-center mb-2">
      <span class="text-sm font-medium">{{ name }}</span>
      <span class="text-sm text-gray-500">{{ progress }}%</span>
    </div>
    <div class="w-full bg-gray-200 rounded-full">
      <div 
        class="bg-blue-600 h-full rounded-full transition-all duration-700" 
        :style="{ width: `${progress}%` }"
        :title="`已完成 ${completed}/${total}`"></div>
    </div>
    <div class="flex justify-between text-xs text-gray-500 mt-1">
      <span>已完成 {{ completed }}/{{ total }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  name: string
  progress: number
  completed: number
  total: number
}

defineProps<Props>()
</script>
