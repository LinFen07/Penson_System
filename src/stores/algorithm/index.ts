import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  AlgorithmProblem,
  TestResult,
  DebugState,
  SupportedLanguage
} from '../../types/algorithm.type'

export const useAlgorithmStore = defineStore('algorithm', () => {
  // 当前题目
  const currentProblem = ref<AlgorithmProblem | null>(null)
  
  // 用户代码
  const userCode = ref('')
  
  // 代码历史记录
  const codeHistory = ref<string[]>([])
  
  // 当前选择的编程语言
  const currentLanguage = ref<SupportedLanguage>('typescript')
  
  // 测试结果
  const testResults = ref<TestResult[]>([])
  
  // 调试状态
  const debugState = ref<DebugState>({
    isDebugging: false,
    isPaused: false,
    currentLine: null,
    variables: [],
    callStack: [],
    breakpoints: []
  })

  // 是否正在运行测试
  const isTesting = ref(false)
  
  // 是否正在调试
  const isDebugging = computed(() => debugState.value.isDebugging)

  // 收藏的题目ID列表
  const favoriteProblemIds = ref<string[]>([])

  // 加载题目
  const loadProblem = (problem: AlgorithmProblem) => {
    currentProblem.value = problem
    userCode.value = generateInitialCode(problem)
    testResults.value = []
    codeHistory.value = []
  }

  // 生成初始代码
  const generateInitialCode = (problem: AlgorithmProblem) => {
    return `function ${problem.functionSignature.name}(${problem.functionSignature.parameters}) {
  // 在这里编写你的代码
}`
  }

  // 更新用户代码
  const updateUserCode = (code: string) => {
    userCode.value = code
    codeHistory.value.push(code)
  }

  // 运行测试
  const runTests = async () => {
    isTesting.value = true
    // TODO: 实现测试运行逻辑
    isTesting.value = false
  }

  // 开始调试
  const startDebugging = () => {
    debugState.value.isDebugging = true
    // TODO: 实现调试逻辑
  }

  // 停止调试
  const stopDebugging = () => {
    debugState.value.isDebugging = false
    // TODO: 清理调试状态
  }

  // 切换断点
  const toggleBreakpoint = (lineNumber: number) => {
    const index = debugState.value.breakpoints.findIndex(
      bp => bp.lineNumber === lineNumber
    )
    if (index >= 0) {
      debugState.value.breakpoints.splice(index, 1)
    } else {
      debugState.value.breakpoints.push({
        lineNumber,
        enabled: true
      })
    }
  }

  // 收藏/取消收藏题目
  const toggleFavorite = (problemId: string) => {
    const index = favoriteProblemIds.value.indexOf(problemId)
    if (index >= 0) {
      favoriteProblemIds.value.splice(index, 1)
    } else {
      favoriteProblemIds.value.push(problemId)
    }
  }

  // 是否已收藏
  const isFavorite = (problemId: string) => {
    return favoriteProblemIds.value.includes(problemId)
  }

  return {
    // 状态
    currentProblem,
    userCode,
    codeHistory,
    currentLanguage,
    testResults,
    debugState,
    isTesting,
    isDebugging,
    favoriteProblemIds,
    
    // 方法
    loadProblem,
    updateUserCode,
    runTests,
    startDebugging,
    stopDebugging,
    toggleBreakpoint,
    toggleFavorite,
    isFavorite
  }
})
