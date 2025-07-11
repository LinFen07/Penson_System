<template>
  <div class="algorithm-sandbox-view">
    <el-container>
      <splitpanes class="default-theme" :dbl-click-splitter="false">
        <pane min-size="20" :size="30">
          <div class="left-panel">
            <h3>控制面板</h3>
            <p>这里可以放置算法选择器和参数配置</p>
          </div>
        </pane>
        <pane min-size="40" :size="70">
          <splitpanes horizontal class="default-theme">
            <pane min-size="40" :size="60">
                <div class="editor-controls">
                  <el-select v-model="selectedLanguage" placeholder="选择语言" @change="changeLanguage">
                    <el-option
                      v-for="lang in languages"
                      :key="lang.value"
                      :label="lang.label"
                      :value="lang.value"
                    />
                  </el-select>
                  <el-button type="primary" @click="createEditor">新建编辑器</el-button>
                  <el-button type="danger" @click="removeEditor">删除编辑器</el-button>
                </div>
                <div class="editor-container">
                  <div id="editor-container" class="editor-container"></div>
                </div>
            </pane>
            <pane min-size="30" :size="40">
              <div class="output-container">
                <h3>运行结果</h3>
                <div class="output-content">
                  <pre>{{ output }}</pre>
                </div>
                <el-button type="primary" @click="runCode">运行代码</el-button>
              </div>
            </pane>
          </splitpanes>
        </pane>
      </splitpanes>
    </el-container>
  </div>
</template>

<script setup>
import { ref, onMounted, shallowRef } from 'vue'
import { Splitpanes, Pane } from 'splitpanes'
import * as monaco from 'monaco-editor'
import loader from '@monaco-editor/loader'
import 'splitpanes/dist/splitpanes.css'

const editorRef = shallowRef()

// 配置 Monaco Editor worker 加载路径
window.MonacoEnvironment = {
  getWorkerUrl: function (moduleId, label) {
    if (label === 'typescript' || label === 'javascript') {
      return './ts.worker.js'
    }
    return './editor.worker.js'
  }
}

// 初始化 Monaco Editor
onMounted(async () => {
  await loader.init()
  editorRef.value = monaco.editor.create(document.getElementById('editor-container'), {
    value: code.value,
    language: 'javascript',
    theme: 'vs-white',
    minimap: { enabled: false },
    fontSize: 14,
    scrollBeyondLastLine: false,
    automaticLayout: true
  })
  
  editorRef.value.onDidChangeModelContent(() => {
    code.value = editorRef.value.getValue()
  })
});

const languages = ref([
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' }
])
const selectedLanguage = ref('javascript')
const code = ref('// 在这里编写你的代码\nconsole.log("Hello, Algorithm Sandbox!")')
const output = ref('')
const editorInstances = ref([])
const currentEditorIndex = ref(0)

const changeLanguage = () => {
  if (editorRef.value) {
    monaco.editor.setModelLanguage(editorRef.value.getModel(), selectedLanguage.value)
  }
}

const createEditor = () => {
  const newEditor = monaco.editor.create(document.getElementById(`editor-container-${editorInstances.value.length}`), {
    value: '// 新编辑器\n',
    language: selectedLanguage.value,
    theme: 'vs-dark',
    minimap: { enabled: false },
    fontSize: 14,
    scrollBeyondLastLine: false,
    automaticLayout: true
  })
  editorInstances.value.push(newEditor)
  currentEditorIndex.value = editorInstances.value.length - 1
}

const removeEditor = () => {
  if (editorInstances.value.length > 1) {
    const editor = editorInstances.value.pop()
    editor.dispose()
    currentEditorIndex.value = editorInstances.value.length - 1
  }
}

const runCode = () => {
  try {
    const logs = []
    const originalConsoleLog = console.log
    console.log = (...args) => logs.push(args.join(' '))
    
    // 执行代码
    new Function(code.value)()
    
    console.log = originalConsoleLog
    output.value = logs.join('\n')
  } catch (error) {
    output.value = `Error: ${error.message}`
  }
}
</script>

<style scoped>
.algorithm-sandbox-view {
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top:20px;
}

.splitpanes.default-theme {
  flex: 1;
}

.splitpanes.default-theme .splitpanes__pane {
  background-color: #f5f7fa;
  padding: 20px;
}

.splitpanes.default-theme .splitpanes__splitter {
  background-color: #dcdfe6;
  width: 6px;
}

.left-panel {
  height: 100%;
  overflow: auto;
}

.editor-controls {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.editor-controls .el-select {
  width: 150px;
}

.editor-container {
  height: calc(100% - 50px);
  border: 1px solid #dcdfe6;
}

/* 确保编辑器填满容器 */
.editor-container .vue-monaco-container {
  height: 100%;
}

.output-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.output-content {
  flex: 1;
  background-color: white;
  border: 1px solid #dcdfe6;
  padding: 10px;
  margin-bottom: 10px;
  overflow: auto;
}

pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>