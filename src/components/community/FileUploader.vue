<!-- FileUploader.vue -->
<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-2">上传示例代码/图片</label>
    <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer"
         @click="$refs.fileInput.click()">
      <input
        type="file"
        ref="fileInput"
        class="hidden"
        multiple
        accept=".png,.jpg,.jpeg,.js,.py,.java,.cpp"
        @change="handleFileUpload"
      >
      <!-- 上传图标 -->
      <svg class="w-10 h-10 mx-auto mb-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
      </svg>
      <p>点击或拖拽文件到此处上传</p>
      <p class="text-xs text-gray-500 mt-1">支持PNG、JPG、JS、PY、Java、CPP格式，单文件不超过10MB</p>
    </div>
    <!-- 文件列表 -->
    <div class="mt-4 flex flex-wrap gap-2">
      <div 
        v-for="(file, index) in files" 
        :key="index"
        class="flex items-center px-3 py-1 bg-gray-100 rounded"
      >
        <svg class="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6a2 2 0 002 2h5m2 4h-10a2 2 0 01-2-2v-6a2 2 0 012-2H9m2 4v-6M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span class="text-sm truncate max-w-[150px]">{{ file.name }}</span>
        <span class="text-xs text-gray-500 ml-1">{{ formatFileSize(file.size) }}</span>
        <button @click.stop="removeFile(index)" class="ml-2 text-gray-500 hover:text-red-500">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>
    <p v-if="fileError" class="text-red-500 text-sm mt-2">{{ fileError }}</p>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  files: { type: Array, default: () => [] }
})
const emit = defineEmits(['update:files', 'error'])

const fileInput = ref(null)
const fileError = ref('')
const internalFiles = ref([...props.files])

// 同步父组件传入的files变化
watch(() => props.files, (val) => {
  internalFiles.value = [...val]
})

const handleFileUpload = (e) => {
  fileError.value = ''
  const files = Array.from(e.target.files)
  
  // 验证文件大小
  const oversizeFile = files.find(f => f.size > 10 * 1024 * 1024)
  if (oversizeFile) {
    fileError.value = `文件 ${oversizeFile.name} 超过10MB限制`
    emit('error', fileError.value)
    return
  }
  
  internalFiles.value = [...internalFiles.value, ...files]
  emit('update:files', [...internalFiles.value])
  e.target.value = '' // 允许重复上传同一文件
}

const removeFile = (index) => {
  internalFiles.value.splice(index, 1)
  emit('update:files', [...internalFiles.value])
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>