<template>
  <div 
    class="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-all"
    @click="$emit('click', id)">
    <div class="flex justify-between items-start">
      <div>
        <div class="flex items-center gap-2 mb-2">
          <span 
            :class="{
              'bg-green-50 text-green-600': status === '已完成',
              'bg-yellow-50 text-yellow-600': status === '未完成',
              'bg-red-50 text-red-600': status === '错题'
            }"
            class="text-xs font-medium px-2 py-0.5 rounded-full">
            {{ status }}
          </span>
          <span class="text-sm text-gray-500">{{ type }} · {{ difficulty }}</span>
        </div>
        <h4 class="font-medium mb-2">{{ title }}</h4>
        <div class="flex items-center text-sm text-gray-500">
          <span class="flex items-center mr-4">
            <i 
              :class="{
                'fa-check text-green-600': isCorrect === true,
                'fa-times text-red-600': isCorrect === false,
                'fa-bookmark text-yellow-500': isBookmarked
              }"
              class="mr-1"></i>
            {{ statusText }}
          </span>
          <span>
            <i class="fa fa-clock-o mr-1"></i>{{ date }}
          </span>
        </div>
      </div>
      <button class="text-blue-600 hover:text-blue-700 transition-colors">
        <i class="fa fa-angle-right"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  id: number
  title: string
  type: string
  difficulty: string
  status: '已完成' | '未完成' | '错题'
  isCorrect: boolean | null
  isBookmarked: boolean
  date: string
}

const props = defineProps<Props>()

const statusText = computed(() => {
  if (props.isCorrect === true) return '正确'
  if (props.isCorrect === false) return '错误'
  return '已收藏'
})

defineEmits<{
  (e: 'click', id: number): void
}>()
</script>
