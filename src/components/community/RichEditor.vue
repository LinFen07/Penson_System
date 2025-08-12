<template>
  <div>
    <div class="flex border-b mb-4">
      <button @click="togglePreview(false)">编辑</button>
      <button @click="togglePreview(true)">预览</button>
    </div>
    <div v-if="!isPreview">
      <quill-editor 
        v-model="internalContent" 
        :options="quillOptions"
        ref="quillEditorRef"
      />
    </div>
    <div v-else>预览区</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import Quill from 'quill/dist/quill.js';
import 'quill/dist/quill.snow.css';

// 仅保留基础配置，暂时移除 better-table
const quillOptions = {
  modules: {
    toolbar: [['bold', 'italic']] // 极简工具栏
  },
  theme: 'snow'
};

const props = defineProps({
  content: { type: String, default: '' },
  isPreview: { type: Boolean, default: false }
});
const emit = defineEmits(['update:isPreview']);

const internalContent = ref(props.content);
const quillEditorRef = ref(null);

const togglePreview = (status: boolean) => {
  emit('update:isPreview', status);
};

onMounted(() => {
  console.log('Quill 实例:', Quill); // 验证 Quill 是否正确加载
});
</script>