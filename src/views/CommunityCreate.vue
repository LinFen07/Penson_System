<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden flex-col">
    <!-- 顶部操作区 -->
    <header class="bg-white border-b p-4 flex justify-between items-center shadow-sm z-10">
      <!-- 省略重复代码 -->
    </header>

    <!-- 创作核心区 -->
    <main class="flex-1 overflow-auto p-4 md:p-6 bg-gray-50">
      <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-4 md:p-6">
        <!-- 标题输入（复用子组件） -->
        <ContentTitle 
          v-model:title="content.title" 
          @error="handleTitleError"
        />

        <!-- 富文本编辑（复用子组件） -->
        <div class="mb-4">
          <RichEditor 
            v-model:content="content.body" 
            v-model:is-preview="isPreview"
            @text-change="handleTextChange"
          />
          <div v-if="!isPreview" class="text-xs text-gray-500 mt-1">
            字数: {{ contentStats.length }} | 行数: {{ contentStats.lineCount }}
          </div>
        </div>

        <!-- 标签与分类 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <TagManager 
            v-model:tags="content.tags" 
            @error="tagError = $event"
          />
          <!-- 分类选择（可保留或拆分为单独组件） -->
          <div>
            <!-- 省略分类选择代码 -->
          </div>
        </div>

        <!-- 文件上传（复用子组件） -->
        <FileUploader 
          v-model:files="content.files" 
          @error="fileError = $event"
        />

        <!-- 发布设置 -->
        <div class="border-t pt-4">
          <!-- 省略发布设置代码 -->
        </div>
      </div>
    </main>

    <!-- 自动保存提示 -->
    <div v-if="saveStatus === 'saving'">
      <!-- 省略提示代码 -->
    </div>
  </div>
</template>

<script setup>
// 只保留核心状态管理和业务逻辑（保存、发布、返回等）
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ContentTitle from '@/components/community/ContentTitle.vue'
import RichEditor from '@/components/community/RichEditor.vue'
import TagManager from '@/components/community/TagManager.vue'
import FileUploader from '@/components/community/FileUploader.vue'

const content = ref({
  title: '',       // 标题初始化为空字符串
  body: '',        // 富文本内容初始化为空字符串
  tags: [],        // 标签初始化为空数组
  files: []        // 上传文件初始化为空数组
})

// 其他状态（根据实际逻辑补充）
const isPreview = ref(false)
const saveStatus = ref('idle') // 'idle' | 'saving' | 'saved'
const titleError = ref(false)
const tagError = ref(false)
const fileError = ref(false)

// 处理标题错误
const handleTitleError = (isError) => {
  titleError.value = isError
}

// 处理文本变化
const contentStats = ref({
  length: 0,
  lineCount: 0
});

const handleTextChange = (text, stats) => {
  contentStats.value = stats;
  // 可以添加自动保存等逻辑
}

</script>