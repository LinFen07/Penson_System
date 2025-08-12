<template>
  <div class="algorithm-sandbox-view">
    <splitpanes class="default-theme" :dbl-click-splitter="false">
      <!-- 左侧题目面板 -->
      <pane min-size="20" :size="30">
        <ProblemPanel :problem="currentProblem" />
      </pane>
      
      <!-- 右侧代码编辑和输出区域 -->
      <pane min-size="40" :size="70">
        <splitpanes horizontal class="default-theme">
          <!-- 代码编辑器 -->
          <pane min-size="40" :size="60">
            <CodeEditor 
              :language="selectedLanguage"
              :initial-code="initialCode"
              @code-change="handleCodeChange"
              @language-change="handleLanguageChange"
            />
          </pane>
          
          <!-- 输出面板 -->
          <pane min-size="30" :size="40">
            <OutputPanel 
              :output="output" 
              :test-results="testResults"
              @run-code="runCode"
              @run-tests="runTests"
            />
          </pane>
        </splitpanes>
      </pane>
    </splitpanes>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Splitpanes, Pane } from 'splitpanes'
import ProblemPanel from '@/components/algorithm/ProblemPanel.vue'
import CodeEditor from '@/components/algorithm/CodeEditor.vue'
import OutputPanel from '@/components/algorithm/OutputPanel.vue'
import { AlgorithmProblem, TestResult, SupportedLanguage } from '@/types/algorithm.types' 
import 'splitpanes/dist/splitpanes.css'

// 当前题目
const currentProblem = ref<AlgorithmProblem>({
  title: '两数之和',
  description: '给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出和为目标值 target 的那两个整数，并返回它们的数组下标。',
  difficulty: 'easy',
  functionSignature: {
    name: 'twoSum',
    parameters: 'nums, target'
  },
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

// 编辑器状态
const selectedLanguage = ref<SupportedLanguage>('javascript')
const currentCode = ref('')
const initialCode = ref(`// ${currentProblem.value.title}
function ${currentProblem.value.functionSignature.name}(${currentProblem.value.functionSignature.parameters}) {
  // 在这里编写你的代码
  return [];
}

// 示例调用
// console.log(${currentProblem.value.functionSignature.name}([2,7,11,15], 9));`)

// 输出和测试结果
const output = ref('')
const testResults = ref<TestResult[]>([])

// 处理代码变化
const handleCodeChange = (code: string) => {
  currentCode.value = code
}

// 处理语言变化
const handleLanguageChange = (lang: SupportedLanguage) => {
  selectedLanguage.value = lang
}

// 运行代码
const runCode = () => {
  try {
    const logs = []
    const originalConsoleLog = console.log
    console.log = (...args) => logs.push(args.join(' '))
    
    // 执行代码
    new Function(currentCode.value)()
    
    console.log = originalConsoleLog
    output.value = logs.length > 0 ? logs.join('\n') : '代码执行完成'
  } catch (error) {
    output.value = `执行错误: ${(error as Error).message}`
  }
}

// 运行测试用例
const runTests = () => {
  testResults.value = []
  try {
    // 创建一个沙箱环境执行用户代码
    const sandbox: Record<string, any> = { console: { log: () => {} } }
    new Function('console', currentCode.value)(sandbox.console)
    
    // 提取用户定义的函数
    const testFunction = sandbox[currentProblem.value.functionSignature.name]
    if (typeof testFunction !== 'function') {
      throw new Error(`未找到函数 ${currentProblem.value.functionSignature.name}`)
    }
    
    // 运行每个测试用例
    currentProblem.value.cases.forEach((testCase, index) => {
      try {
        // 解析输入
        const inputExpr = testCase.input.replace(/nums = /, 'const nums = ')
          .replace(/target = /, 'const target = ')
        const inputSandbox: Record<string, any> = {}
        new Function(inputExpr)(inputSandbox)
        
        // 执行函数
        const result = testFunction(inputSandbox.nums, inputSandbox.target)
        const actual = JSON.stringify(result)
        const expected = testCase.output
        
        // 记录结果
        testResults.value.push({
          caseIndex: index,
          passed: actual === expected,
          expected,
          actual
        })
      } catch (error) {
        testResults.value.push({
          caseIndex: index,
          passed: false,
          expected: testCase.output,
          error: (error as Error).message
        })
      }
    })
  } catch (error) {
    output.value = `测试错误: ${(error as Error).message}`
  }
}
</script>

<style scoped>
/* 样式保持不变 */
.algorithm-sandbox-view {
  height: 100vh;
  display: flex;
  flex-direction: column;
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
</style>