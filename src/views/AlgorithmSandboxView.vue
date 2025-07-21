<template>
  <div class="algorithm-sandbox-view">
    <el-container>
      <splitpanes class="default-theme" :dbl-click-splitter="false">
        <pane min-size="20" :size="30">
  <div class="left-panel">
    <el-card shadow="hover">
      <template #header>
        <div class="problem-header">
          <h3>{{ currentProblem.title }}</h3>
          <el-tag :type="currentProblem.difficulty === 'easy' ? 'success' : 
                         currentProblem.difficulty === 'medium' ? 'warning' : 'danger'">
            {{ currentProblem.difficulty }}
          </el-tag>
        </div>
      </template>
      <div class="problem-description">
        {{ currentProblem.description }}
      </div>
    </el-card>

    <el-card shadow="hover" class="case-container">
      <template #header>
        <h3>示例</h3>
      </template>
      <div v-for="(problemCase, index) in currentProblem.cases" :key="index" class="case-item">
        <h4>示例 {{ index + 1 }}</h4>
        <div class="case-input">
          <span class="case-label">输入：</span>
          <pre>{{ problemCase.input }}</pre>
        </div>
        <div class="case-output">
          <span class="case-label">输出：</span>
          <pre>{{ problemCase.output }}</pre>
        </div>
        <div v-if="problemCase.explanation" class="case-explanation">
          <span class="case-label">解释：</span>
          <p>{{ problemCase.explanation }}</p>
        </div>
      </div>
    </el-card>
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

<script setup lang="ts">
import { ref, onMounted, shallowRef } from 'vue'
import { Splitpanes, Pane } from 'splitpanes'
import * as monaco from 'monaco-editor'
import loader from '@monaco-editor/loader'
import 'splitpanes/dist/splitpanes.css'

interface ProblemCase {
  input: string
  output: string
  explanation?: string
}

interface AlgorithmProblem {
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  cases: ProblemCase[]
}

const editorRef = shallowRef()
const currentProblem = ref<AlgorithmProblem>({
  title: '两数之和',
  description: '给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出和为目标值 target 的那两个整数，并返回它们的数组下标。',
  difficulty: 'easy',
  cases: [
    {
      input: 'nums = [2,7,11,15], target = 9',
      output: '[0,1]',
      explanation: '因为 nums[0] + nums[1] == 9 ，返回 [0, 1] 。'
    },
    {
      input: 'nums = [3,2,4], target = 6',
      output: '[1,2]'
    }
  ]
})

// 初始化 Monaco Editor
onMounted(async () => {
  try {
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
  } catch (error) {
    console.error('Monaco Editor初始化失败:', error)
    output.value = '编辑器初始化失败，请刷新页面重试'
  }
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
  /* overflow: auto; */
}

.splitpanes.default-theme .splitpanes__splitter {
  background-color: #dcdfe6;
  width: 6px;
}

.left-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  padding-right: 5px;
}

.problem-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.problem-description {
  line-height: 1.4;
  white-space: pre-wrap;
  font-size: 14px;
}

.case-container {
  flex: 1;
}

.case-item {
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px dashed #ebeef5;
  font-size: 13px;
}

.case-item:last-child {
  border-bottom: none;
}

.case-label {
  font-weight: bold;
  color: #409eff;
}

.case-input,
.case-output,
.case-explanation {
  margin-top: 4px;
  line-height: 1.3;
}

.case-input pre,
.case-output pre {
  display: inline;
  background-color: #f5f7fa;
  padding: 2px 5px;
  border-radius: 3px;
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
  /* overflow: auto; */
}

pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>