<!-- TagManager.vue -->
<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-2">
      标签（最多5个，按回车添加）
      <span class="text-gray-500 ml-1">({{ tags.length }}/5)</span>
    </label>
    <div class="flex flex-wrap gap-2 mb-2">
      <span 
        v-for="(tag, index) in tags" 
        :key="index"
        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
      >
        {{ tag }}
        <button @click="removeTag(index)" class="ml-1 text-blue-600 hover:text-blue-800">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </span>
    </div>
    <input
      v-model="newTag"
      @keydown.enter.prevent="addTag"
      type="text"
      placeholder="输入标签（如：算法、JavaScript）"
      class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      :disabled="tags.length >= 5"
    >
    <p v-if="tagError" class="text-red-500 text-sm mt-1">{{ tagError }}</p>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  tags: { type: Array, default: () => [] }
})
const emit = defineEmits(['update:tags', 'error'])

const newTag = ref('')
const tagError = ref('')
const internalTags = ref([...props.tags])

// 同步父组件传入的tags变化
watch(() => props.tags, (val) => {
  internalTags.value = [...val]
})

const addTag = () => {
  tagError.value = ''
  const tag = newTag.value.trim()
  if (!tag) {
    tagError.value = '标签不能为空'
    emit('error', tagError.value)
    return
  }
  if (internalTags.value.includes(tag)) {
    tagError.value = '标签已存在'
    emit('error', tagError.value)
    return
  }
  if (internalTags.value.length >= 5) {
    tagError.value = '最多只能添加5个标签'
    emit('error', tagError.value)
    return
  }
  
  internalTags.value.push(tag)
  newTag.value = ''
  emit('update:tags', [...internalTags.value])
  emit('error', '')
}

const removeTag = (index) => {
  internalTags.value.splice(index, 1)
  emit('update:tags', [...internalTags.value])
}
</script>