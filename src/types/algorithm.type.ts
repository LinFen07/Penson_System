/**
 * 算法题目的测试用例类型
 */
export interface ProblemCase {
  /** 输入数据 */
  input: string
  /** 预期输出 */
  output: string
  /** 解释说明（可选） */
  explanation?: string
}

/**
 * 函数签名类型，定义题目要求实现的函数信息
 */
export interface FunctionSignature {
  /** 函数名称 */
  name: string
  /** 函数参数列表（字符串形式，如 "nums, target"） */
  parameters: string
}

/**
 * 算法题目类型
 */
export interface AlgorithmProblem {
  /** 题目标题 */
  title: string
  /** 题目描述 */
  description: string
  /** 难度级别 */
  difficulty: 'easy' | 'medium' | 'hard'
  /** 要求实现的函数签名 */
  functionSignature: FunctionSignature
  /** 测试用例列表 */
  cases: ProblemCase[]
}

/**
 * 测试结果类型
 */
export interface TestResult {
  /** 测试用例索引 */
  caseIndex: number
  /** 是否通过测试 */
  passed: boolean
  /** 预期输出 */
  expected: string
  /** 实际输出（可选） */
  actual?: string
  /** 错误信息（可选，测试失败时提供） */
  error?: string
}

/**
 * 支持的编程语言类型
 */
export type SupportedLanguage = 'javascript' | 'typescript'

/**
 * 语言选项类型
 */
export interface LanguageOption {
  value: SupportedLanguage
  label: string
}

// 调试相关类型
export interface Breakpoint {
  lineNumber: number
  enabled: boolean
  condition?: string
}

export interface DebugVariable {
  name: string
  value: string
  type: string
  variablesReference: number // 用于获取子变量
}

export interface CallStackFrame {
  id: number
  name: string
  source: {
    name: string
    path: string
  }
  line: number
  column: number
}

export interface DebugState {
  isDebugging: boolean
  isPaused: boolean
  currentLine: number | null
  variables: DebugVariable[]
  callStack: CallStackFrame[]
  breakpoints: Breakpoint[]
}
