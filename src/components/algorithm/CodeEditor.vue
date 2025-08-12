<template>
  <div class="code-editor">
    <div class="editor-controls">
      <el-select v-model="language" placeholder="选择语言" @change="handleLanguageChange">
        <el-option
          v-for="lang in languages"
          :key="lang.value"
          :label="lang.label"
          :value="lang.value"
        />
      </el-select>
      <el-button 
        type="info" 
        size="small" 
        @click="toggleDebugMode"
        :icon="debugMode ? 'Close' : 'Bug'"
      >
        {{ debugMode ? '关闭调试' : '开启调试' }}
      </el-button>
    </div>
    <div id="editor-container" class="editor-container"></div>
    
    <!-- 调试面板，仅在调试模式下显示 -->
    <div v-if="debugMode" class="debug-section">
      <DebugPanel 
        :editor="editorRef" 
        :code="currentCode"
        @debug-state-change="handleDebugStateChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, shallowRef, watch, onUnmounted, defineProps, defineEmits } from 'vue'
import * as monaco from 'monaco-editor'
import loader from '@monaco-editor/loader'
import DebugPanel from './DebugPanel.vue'
import { SupportedLanguage, LanguageOption, DebugState } from '@/types/algorithm.type'

// 定义props
const props = defineProps<{
  language: SupportedLanguage
  initialCode: string
}>()

// 定义emits
const emit = defineEmits<{
  (e: 'code-change', code: string): void
  (e: 'language-change', lang: SupportedLanguage): void
}>()

// 编辑器实例
const editorRef = shallowRef<monaco.editor.IStandaloneCodeEditor | null>(null)
const currentCode = ref(props.initialCode)
const language = ref<SupportedLanguage>(props.language)
const debugMode = ref(false)
const debugDecorations = ref<string[]>([])

// 只保留JS和TS语言
const languages = ref<LanguageOption[]>([
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' }
])

// 初始化编辑器
onMounted(async () => {
  try {
    // 加载Monaco编辑器
    await loader.init()
    
    // 创建编辑器实例
    editorRef.value = monaco.editor.create(document.getElementById('editor-container'), {
      value: props.initialCode,
      language: props.language,
      theme: 'vs',
      minimap: { enabled: false },
      fontSize: 14,
      scrollBeyondLastLine: false,
      automaticLayout: true,
      lineNumbers: 'on',
      roundedSelection: false,
      scrollbar: {
        vertical: 'visible',
        horizontal: 'visible'
      },
      // 启用行号区域点击事件（用于设置断点）
      glyphMargin: true,
      lineNumbersMinChars: 3
    })

    // 监听代码变化
    editorRef.value.onDidChangeModelContent(() => {
      const code = editorRef.value!.getValue()
      currentCode.value = code
      emit('code-change', code)
    })

    // 监听语言变化
    watch(language, (newLang) => {
      if (editorRef.value) {
        monaco.editor.setModelLanguage(editorRef.value.getModel()!, newLang)
      }
    })

  } catch (error) {
    console.error('Monaco Editor初始化失败:', error)
  }
})

// 切换调试模式
const toggleDebugMode = () => {
  debugMode.value = !debugMode.value
  
  // 清除所有调试相关装饰
  if (!debugMode.value && editorRef.value) {
    editorRef.value.deltaDecorations(debugDecorations.value, [])
    debugDecorations.value = []
  }
}

// 处理调试状态变化
const handleDebugStateChange = (state: DebugState) => {
  if (!editorRef.value) return
  
  // 清除现有装饰
  editorRef.value.deltaDecorations(debugDecorations.value, [])
  debugDecorations.value = []
  
  // 添加断点装饰
  const decorations = state.breakpoints
    .filter(bp => bp.enabled)
    .map(bp => ({
      range: new monaco.Range(
        bp.lineNumber, 1,
        bp.lineNumber, 1
      ),
      options: {
        isBreakpoint: true,
        glyphMarginClassName: 'debug-breakpoint'
      }
    }));
  
  // 添加当前行装饰
  if (state.currentLine) {
    decorations.push({
      range: new monaco.Range(
        state.currentLine, 1,
        state.currentLine, 1000
      ),
      options: {
        isWholeLine: true,
        className: 'debug-current-line'
      }
    });
  }
  
  // 应用装饰
  debugDecorations.value = editorRef.value.deltaDecorations([], decorations);
}

// 监听初始代码变化
watch(
  () => props.initialCode,
  (newCode) => {
    if (editorRef.value && currentCode.value !== newCode) {
      editorRef.value.setValue(newCode)
      currentCode.value = newCode
    }
  }
)

// 组件卸载时销毁编辑器
onUnmounted(() => {
  if (editorRef.value) {
    editorRef.value.dispose()
  }
})
</script>

<style scoped>
.code-editor {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.editor-controls {
  margin-bottom: 10px;
  height: 40px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.editor-controls .el-select {
  width: 150px;
}

.editor-container {
  flex: 1;
  border: 1px solid #dcdfe6;
  width: 100%;
  min-height: 0; /* 解决flex子元素高度问题 */
}

.debug-section {
  margin-top: 10px;
}

/* 调试相关样式 */
.debug-current-line {
  background-color: rgba(255, 215, 0, 0.2);
}

/* 断点样式 - 使用::v-deep穿透scoped */
::v-deep .debug-breakpoint {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Ccircle cx='6' cy='6' r='5' fill='%23ff4757' stroke='white' stroke-width='1'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center center;
}

::v-deep .monaco-editor .glyph-margin {
  cursor: pointer;
}

::v-deep .monaco-editor .glyph-margin:hover:not(.debug-breakpoint) {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
