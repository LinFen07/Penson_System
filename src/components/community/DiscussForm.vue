<template>
  <div class="bg-white rounded-lg shadow p-6 mt-4">
    <h2 class="text-xl font-semibold mb-4">发表新讨论</h2>
    
    <form @submit.prevent="handleSubmit">
      <div class="mb-4">
        <label for="title" class="block text-sm font-medium text-gray-700 mb-1">标题</label>
        <input
          id="title"
          v-model="form.title"
          type="text"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="请输入讨论标题"
        >
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">内容</label>
        <RichEditor
          v-model:content="form.content"
          class="min-h-[200px]"
        />
      </div>

      <div class="flex justify-end space-x-3">
        <button
          type="button"
          @click="$emit('cancel')"
          class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          取消
        </button>
        <button
          type="submit"
          class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          发布
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import RichEditor from './RichEditor.vue'

const form = ref({
  title: '',
  content: ''
})

const emit = defineEmits(['submit', 'cancel'])

const handleSubmit = () => {
  if (!form.value.title.trim() || !form.value.content.trim()) {
    return
  }
  emit('submit', {
    title: form.value.title,
    content: form.value.content
  })
  form.value = { title: '', content: '' }
}
</script>
